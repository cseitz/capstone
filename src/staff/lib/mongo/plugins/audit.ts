import { HydratedDocument, Model, model, models, Schema, isValidObjectId, connection } from "mongoose";
import { isEqual, isPlainObject, reduce, get } from "lodash";
import { inspect } from 'util';
import { relative } from 'path';

const DEBUG = true;

// Applied to data this plugin is used on
export interface AuditData<Data = {}> {
    logs?: AuditLogData<Data>[] | string[];
}

// Applied to schema this plugin is used on
export interface AuditSchema<Data = {}> {
    commit(action: string, reason?: string, details?: Partial<AuditDetails<Data>>): void;
    commit(action: string, details?: Partial<AuditDetails<Data>>): void;
    commit(details?: Partial<AuditDetails<Data>>): void;
    audit(details: Partial<AuditDetails<Data>>): void;
}

// Audit Details passed to the logging system
type AuditDetails<Data = {}> = Partial<AuditLogData<Data>>;

// Plugin to run logic
interface AuditOptions<Data = any> {
    schema?: Schema<Data>;
    [key: string]: any;
}
export function AuditPlugin<Data = {}>(schema: Schema, options?: AuditOptions<Data>) {
    const TIMESTAMP_FIELDS = Object.values(TimestampOptions.timestamps);
    schema.add({
        logs: [{
            type: Schema.Types.ObjectId,
            ref: 'AuditLog'
        }]
    })

    const {
        // @ts-ignore
        schema: extendedSchema = new Schema({}),
        ...rest
    } = options || {};

    // Create the discriminated audit log model
    let AuditLog: any;
    const initalize = function () {
        let model: Model<typeof schema>;
        for (const key in models) {
            if (models[key].schema === schema) {
                model = models[key]; break;
            }
        }
        if (!model) return setTimeout(initalize, 100);
        AuditLog = AuditLogModel.discriminator<AuditLogData<Data>>(model.modelName + 'AuditLog', extendedSchema);
    }
    if (connection.readyState === 1) initalize();
    connection.on('connected', initalize);

    type Details = Partial<AuditLogData>;
    interface AuditInfo {
        logs: any[];
        log: any;
        cache: any;
        details: Details;
        ready?: Promise<any>;
    }

    schema.method('$initAudit', function () {
        if ('_audit' in this) return;
        const info: AuditInfo = {
            logs: [],
            log: AuditLog,
            cache: this.toObject(),
            details: {
                method: this.isNew ? 'create' : undefined,
            }
        };
        this._audit = info;
    })

    schema.method('$commit', function (details: Partial<AuditLogData>) {
        const info: AuditInfo = this._audit;
        details = { ...info.details, ...(details || {}), changes: {} };
        const previous = info.cache;
        const current = this.toObject();
        const diff = differingPaths(current, previous)
            .filter(o => o != 'logs' && !TIMESTAMP_FIELDS.includes(o));
        if (diff.length > 0 || details?.method == 'create' || details?.method == 'delete') {
            if (!('document' in details)) {
                details.document = this._id.toString();
            }
            for (const path of diff) {
                const from = get(previous, path);
                const to = get(current, path);
                details.changes[path] = [from, to];
            }
            let payload = this.getChanges();
            for (const operand in payload) {
                const pld = payload[operand];
                for (const key in pld) {
                    if (!diff.find(o => o.includes(key))) {
                        delete pld[key];
                    }
                }
                if (Object.keys(pld).length == 0) {
                    delete payload[operand];
                }
            }
            details.payload = payload;
            try {
                const sourcePath = ('/' + (new Error().stack.split('\n')).slice(1)
                    .find(o => !o.includes(__filename) && !o.includes('node_modules') && o.includes('at /'))
                    .split('at /').pop());
                const source = relative(process.cwd(), sourcePath);
                details.source = source;
            } catch (e) { }
            details.method = details.method || 'update';
            if (DEBUG) console.log('details', inspect(details, { colors: true, depth: 10 }));
            const log = new info.log(details);
            info.logs.push(log);
            info.cache = current;
            return log;
        }


    })

    schema.method('audit', function (details: Details) {
        this.$initAudit();
        const prom = new Promise(async (resolve) => {
            if (this.isNew && details) details.method = 'create';
            this._audit.details = await ComputeAudit(details);
            resolve(this);
            // console.log('deets', this._audit.details);
        });
        this._audit.ready = prom;
        return prom;
    })

    schema.method('commit', function (...args: any[]) {
        this.$initAudit();
        const details = args.find(o => typeof o == 'object') || {};
        args.forEach((o, i) => {
            if (typeof o == 'string') {
                if (i == 0) details.action = o;
                if (i == 1) details.reason = o;
            }
        })
        this.$commit(details);
    })


    schema.pre('validate', async function (next) {
        if (this._audit.ready) await this._audit.ready;
        if (!('_audit' in this)) {
            throw new Error('Missing Audit Documentation');
        }
        next();
    })

    schema.pre('remove', async function () {
        if (this._audit.ready) await this._audit.ready;
        await this.$commit({
            method: 'delete',
            document: this.toObject(),
        }).save();
    })

    schema.pre('save', async function () {
        this.$initAudit();
        if (this._audit.ready) await this._audit.ready;
        await this.$commit();
        // @ts-ignore
        const info: AuditInfo = this._audit;
        const logs = await Promise.all(info.logs.map(o => o.save()));
        for (const log of logs) {
            // @ts-ignore
            this.logs.push(log);
        }
    })


}

// Compute dynamic fields
async function ComputeAudit(details: AuditDetails): Promise<Partial<AuditLogData>> {
    let { user, ...rest } = details;
    console.log('bruh', { user }, typeof user)
    // @ts-ignore
    if (typeof user == 'object') user = user?._id.toString();
    if (typeof user == 'string' && user != 'system') {
        if (!isValidObjectId(user)) {
            user = (await UserModel.find().byName(user as string))?._id?.toString() || user;
        }
    }
    if (typeof user == 'string' && !isValidObjectId(user)) {
        rest.process = user;
        user = undefined;
    }

    return {
        user,
        ...rest
    }
}


// Find different values
function differingPaths(A: any = {}, B: any = {}, depth: string[] = []) {
    let paths: string[] = [];
    reduce(A, function (result, value, key) {
        const path = [...depth, key];
        if (isPlainObject(value)) {
            differingPaths(value, B[key], path)
        } else if (!isEqual(value, B[key])) {
            paths.push(path.join('.'))
        }
        return result;
    }, {});
    return paths;
}


// Schema for Audit Logs
import { UserData, UserDocument, UserModel } from '../schema/user';
import { TimestampData, TimestampOptions, TimestampPlugin } from "./timestamped";

type AuditMethod = keyof typeof AuditMethodTypes;
enum AuditMethodTypes {
    create,
    update,
    delete,
}

type AuditLogData<Data = {}> = TimestampData & {
    [P in keyof Data]?: Data[P];
} & {
    user: UserData | string;
    process?: string;
    source?: string;
    method: AuditMethod;
    action?: string;
    reason?: string;
    changes: {
        [key: string]: [any, any]
    }
    payload?: any;
    document?: any;
}

const schema = new Schema<AuditLogData>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    process: String,
    method: String,
    source: String,
    action: String,
    reason: String,
    payload: Schema.Types.Mixed,
    changes: Schema.Types.Mixed,
    document: Schema.Types.Mixed,
}, {
    discriminatorKey: 'kind',
    ...TimestampOptions
})

interface AuditLogSchema
    extends AuditLogData { }

schema.plugin(TimestampPlugin);

interface QueryHelpers {

}


export type AuditLogDocument = HydratedDocument<AuditLogSchema>;
export const AuditLogModel = models?.['AuditLog'] || model<AuditLogSchema, Model<AuditLogSchema, QueryHelpers>>('AuditLog', schema);

