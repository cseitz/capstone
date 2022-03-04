import { HydratedDocument, Model, model, models, Schema, Query } from "mongoose";
import { TimestampData, TimestampOptions, TimestampPlugin } from "../plugins/timestamped";
import { AuditData, AuditPlugin, AuditSchema } from "../plugins/audit";
import 'lib/mongo';

export interface UserData
extends TimestampData, AuditData {
    name: string;

}


const schema = new Schema<UserData>({
    name: String,
}, {
    ...TimestampOptions
})

//** Apply Plugins */
interface UserSchema
extends UserData, AuditSchema {}

schema.plugin(TimestampPlugin);
schema.plugin(AuditPlugin);


//** Model */
interface QueryHelpers {
    byName(name: string): Query<any, UserDocument> & QueryHelpers;
}

schema.query.byName = function(name: string) {
    return this.findOne({ name: name })
}

type UserModelType = Model<UserSchema, QueryHelpers>;
export type UserDocument = HydratedDocument<UserSchema>;
export const UserModel = (models?.['User'] || model<UserSchema, UserModelType>('User', schema)) as UserModelType;

console.log('running server user');
