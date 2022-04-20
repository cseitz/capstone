import { HydratedDocument, Model, model, models, Schema } from "mongoose";
import { TimestampData, TimestampOptions, TimestampPlugin } from "../plugins/timestamped";
import { AuditData, AuditPlugin, AuditSchema } from "../plugins/audit";
import { UserData } from "./user"
import 'lib/mongo';


// Define Event Data and plugin data
export interface EventData
    extends TimestampData, AuditData {
    id: string;
    
    title: string;
    type: string;
    description: string;

    startsAt: any;
    endsAt: any;

    signups: (UserData | string)[];
    rsvp?: boolean;
}


// Define event schema
const schema = new Schema<EventData>({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    startsAt: {
        type: Date,
        required: true,
    },
    endsAt: {
        type: Date,
        required: true,
    },
    type: {
        type: String,
    },
    signups: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        }
    ]
}, {
    ...TimestampOptions
})

schema.set('toJSON', {
    virtuals: true
})

//** Apply Plugins */
interface EventSchema
    extends EventData, AuditSchema { }

schema.plugin(TimestampPlugin);
schema.plugin(AuditPlugin);


//** Model */
interface QueryHelpers { }

type EventModelType = Model<EventSchema, QueryHelpers>;
export type EventDocument = HydratedDocument<EventSchema>;
export const EventModel = (models?.['Event'] || model<EventSchema, EventModelType>('Event', schema)) as EventModelType;

