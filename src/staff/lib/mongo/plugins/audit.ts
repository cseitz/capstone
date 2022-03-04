import { HydratedDocument, Model, model, models, Schema } from "mongoose";

export interface AuditData {
    logs?: AuditLogData[] | string[];
}

export function AuditLogPlugin(schema: Schema, options) {
    schema.add({
        logs: [{
            type: Schema.Types.ObjectId,
            ref: 'AuditLog'
        }]
    })
}




import { UserData, UserModel } from '../schema/user';
import { TimestampData, TimestampOptions, TimestampPlugin } from "./timestamped";
interface AuditLogData
extends TimestampData {
    user: UserData | string;
}

const schema = new Schema<AuditLogData>({
    user: {
        type: Schema.Types.ObjectId,
        ref: UserModel.modelName,
    },
}, {
    ...TimestampOptions
})

interface AuditLogSchema
extends AuditLogData {}

schema.plugin(TimestampPlugin);

interface QueryHelpers {

}


export type AuditLogDocument = HydratedDocument<AuditLogSchema>;
export const AuditLogModel = models?.['AuditLog'] || model<AuditLogSchema, Model<AuditLogSchema, QueryHelpers>>('AuditLog', schema);

