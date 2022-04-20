import { HydratedDocument, Model, model, models, Schema } from "mongoose";
import { TimestampData, TimestampOptions, TimestampPlugin } from "../plugins/timestamped";
import { AuditData, AuditPlugin, AuditSchema } from "../plugins/audit";
import { UserData } from "./user"
import 'lib/mongo';


// Define Ticket Data and plugin data
export interface TicketData
    extends TimestampData, AuditData {
    id: string;

    name: string;
    email: string;

    subject: string;
    message: string;
    conclusion: string;

    status: 'closed' | 'open' | 'assigned';
    assignee: UserData | string;
}


// Define ticket schema
const schema = new Schema<TicketData>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['closed', 'open', 'assigned'],
        default: 'open',
    },
    assignee: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    conclusion: {
        type: String,
    },
}, {
    ...TimestampOptions
})

schema.set('toJSON', {
    virtuals: true
})

//** Apply Plugins */
interface TicketSchema
    extends TicketData, AuditSchema { }

schema.plugin(TimestampPlugin);
schema.plugin(AuditPlugin);


//** Model */
interface QueryHelpers { }

type TicketModelType = Model<TicketSchema, QueryHelpers>;
export type TicketDocument = HydratedDocument<TicketSchema>;
export const TicketModel = (models?.['Ticket'] || model<TicketSchema, TicketModelType>('Ticket', schema)) as TicketModelType;
