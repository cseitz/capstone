import { HydratedDocument, Model, model, models, Schema, Query } from "mongoose";
import { TimestampData, TimestampOptions, TimestampPlugin } from "../plugins/timestamped";
import { AuditData, AuditPlugin, AuditSchema } from "../plugins/audit";
import 'lib/mongo';
import { hashSync } from "bcrypt";

export interface UserData
extends TimestampData, AuditData {
    username: string;
    email: string;
    password: string;
    role: 'pending' | 'user' | 'banned' | 'staff' | 'admin';
}


const schema = new Schema<UserData>({
    username: String,
    email: String,
    password: {
        type: String,
        // Hash password on set
        set: p => !p.startsWith('$2b$') ? hashSync(p, 10) : p,
    },
    role: {
        type: String,
        enum: ['pending', 'user', 'banned', 'staff', 'admin'],
        default: 'pending',
    }
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
