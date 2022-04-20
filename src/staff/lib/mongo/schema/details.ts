import { HydratedDocument, Model, model, models, Schema, Query, connection, SchemaDefinition, SchemaDefinitionType } from "mongoose";
import { TimestampData, TimestampOptions, TimestampPlugin } from "../plugins/timestamped";
import { AuditData, AuditPlugin, AuditSchema } from "../plugins/audit";
import 'lib/mongo';

// Define details baseline
export interface DetailsBaseData
extends TimestampData, AuditData {
    id: string;
    name: string;
}


// Define details base schema
const schema = new Schema<DetailsBaseData>({
    name: {
        type: String,
        // unique: true,
        required: true,
    },
}, {
    ...TimestampOptions,
    discriminatorKey: 'kind',
})

schema.set('toJSON', {
    virtuals: true
})

//** Apply Plugins */
interface DetailsBaseSchema
extends DetailsBaseData, AuditSchema {}

schema.plugin(TimestampPlugin);


//** Model */
interface QueryHelpers {
    byName(name: string): Query<any, DetailsBaseDocument> & QueryHelpers;
}

schema.query.byName = function(name: string) {
    return this.findOne({ name: name })
}

type DetailsBaseModelType = Model<DetailsBaseSchema, QueryHelpers>;
export type DetailsBaseDocument = HydratedDocument<DetailsBaseSchema>;
export const DetailsBaseModel = (models?.['Details'] || model<DetailsBaseSchema, DetailsBaseModelType>('Details', schema)) as DetailsBaseModelType;

export async function Details<Fields = { name: string }>(name: string, fields?: SchemaDefinition<SchemaDefinitionType<Fields>>) {
    let doInitialized;
    const initialized = new Promise((resolve) => { doInitialized = resolve });
    const initalize = function () {
        doInitialized();
    }
    if (connection.readyState === 1) initalize();
    connection.on('connected', initalize);
    await initialized;
    type SpecificData = Fields & TimestampData & AuditData;
    type SpecificSchema = SpecificData & AuditSchema;
    const schema = new Schema<SpecificData>(fields as any, {
        ...TimestampOptions,
        discriminatorKey: 'kind',
    })
    const specificDetails = DetailsBaseModel.discriminators?.[name] || DetailsBaseModel.discriminator<SpecificSchema>(name, schema);
    let details = await specificDetails.findOne({ name });
    if (!details) {
        details = new specificDetails({
            name,
        })
        await details.save();
    }
    const func = async function(): Promise<HydratedDocument<SpecificSchema>> {
        return await specificDetails.findOne({ name });
    };
    func.__proto__ = details as SpecificData;
    return func;
}





