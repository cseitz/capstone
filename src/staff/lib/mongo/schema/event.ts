import { HydratedDocument, Model, model, models, Schema, Query } from "mongoose";
import { TimestampData, TimestampOptions, TimestampPlugin } from "../plugins/timestamped";
import { AuditData, AuditPlugin, AuditSchema } from "../plugins/audit";
import 'lib/mongo';
import { IntegrationInstructionsRounded } from "@mui/icons-material";
import { integerPropType } from "@mui/utils";
import { UserData } from "./user"

export interface EventData
    extends TimestampData, AuditData {
    id: string;
    // username: string;
    title: string;
    description: string;
    startsAt: any;
    endsAt: any;
    type: string,
    signups: (UserData | string)[];
    rsvp?: boolean;
}

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
interface QueryHelpers {
    // byName(name: string): Query<any, EventDocument> & QueryHelpers;
}

// schema.query.byName = function(name: string) {
//     return this.findOne({ name: name })
// }

type EventModelType = Model<EventSchema, QueryHelpers>;
export type EventDocument = HydratedDocument<EventSchema>;
export const EventModel = (models?.['Event'] || model<EventSchema, EventModelType>('Event', schema)) as EventModelType;

// console.log('running server user');
