import { HydratedDocument, Model, model, models, Schema, Query } from "mongoose";
import { TimestampData, TimestampOptions, TimestampPlugin } from "../plugins/timestamped";
import { AuditData, AuditPlugin, AuditSchema } from "../plugins/audit";
import 'lib/mongo';
import {UserData} from "./user"

export interface TicketData
extends TimestampData, AuditData {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: 'closed' | 'open' | 'assigned' ;
    assignee: UserData | string;
    conclusion: string;
}

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
extends TicketData, AuditSchema {}

schema.plugin(TimestampPlugin);
schema.plugin(AuditPlugin);


//** Model */
interface QueryHelpers {
    byName(name: string): Query<any, TicketDocument> & QueryHelpers;
}

schema.query.byName = function(name: string) {
    return this.findOne({ name: name })
}

type TicketModelType = Model<TicketSchema, QueryHelpers>;
export type TicketDocument = HydratedDocument<TicketSchema>;
export const TicketModel = (models?.['Ticket'] || model<TicketSchema, TicketModelType>('Ticket', schema)) as TicketModelType;

console.log('running server ticket');
