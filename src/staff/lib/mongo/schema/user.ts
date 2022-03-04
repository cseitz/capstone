import { HydratedDocument, Model, model, models, Schema } from "mongoose";
import { TimestampData, TimestampOptions, TimestampPlugin } from "../plugins/timestamped";
import 'lib/mongo';

export interface UserData
extends TimestampData {

}


const schema = new Schema<UserData>({
    
}, {
    ...TimestampOptions
})

//** Apply Plugins */
interface UserSchema
extends UserData {}

schema.plugin(TimestampPlugin);


//** Model */
interface QueryHelpers {

}


export type UserDocument = HydratedDocument<UserSchema>;
export const UserModel = models?.['User'] || model<UserSchema, Model<UserSchema, QueryHelpers>>('User', schema);

console.log('running server user');
