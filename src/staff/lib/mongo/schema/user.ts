import { HydratedDocument, Model, model, models, Query, Schema } from "mongoose";
import { TimestampData, TimestampOptions, TimestampPlugin } from "../plugins/timestamped";
import { AuditData, AuditPlugin, AuditSchema } from "../plugins/audit";
import { UserRole, UserRoles } from "lib/auth/constants";
import { hashSync } from "bcrypt";
import 'lib/mongo';

// Define User Data and plugin data
export interface UserData
    extends TimestampData, AuditData {
    id: string;
    
    email: string;
    password: string;

    role: UserRole;
    info: UserInfo;
}

export interface UserInfo {
    firstName: string;
    lastName: string;
}

// Define what is required for account registration
export type RegistrationData = UserInfo & {
    email: string;
    password: string;
    confirmPassword: string;
}

// Define user schema
const schema = new Schema<UserData>({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
        // Hash password on set
        set: p => !p.startsWith('$2b$') ? hashSync(p, 10) : p,
    },
    role: {
        type: String,
        enum: UserRoles,
        default: 'pending',
    },
    info: {
        firstName: String,
        lastName: String,
    }
}, {
    ...TimestampOptions
})

schema.set('toJSON', {
    virtuals: true
})

//** Apply Plugins */
interface UserSchema
    extends UserData, AuditSchema { }

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

