import { HydratedDocument, Model, model, models, Schema, Query } from "mongoose";
import { TimestampData, TimestampOptions, TimestampPlugin } from "../plugins/timestamped";
import { AuditData, AuditPlugin, AuditSchema } from "../plugins/audit";
import 'lib/mongo';
import { IntegrationInstructionsRounded } from "@mui/icons-material";
import { integerPropType } from "@mui/utils";

export interface EventData
extends TimestampData, AuditData {
    id: string;
    // username: string;
    eventname: string;
    description: string;
    signups: userid[];
}

const schema = new Schema<EventData>({
    eventname: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    signups: {
        
    }
}, {
    ...TimestampOptions
})

schema.set('toJSON', {
    virtuals: true
})

//** Apply Plugins */
interface EventSchema
extends EventData, AuditSchema {}

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
