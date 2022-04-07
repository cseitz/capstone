import { HydratedDocument, Model, model, models, Schema, Query, connection, SchemaDefinition, SchemaDefinitionType } from "mongoose";
import { TimestampData, TimestampOptions, TimestampPlugin } from "../plugins/timestamped";
import { AuditData, AuditPlugin, AuditSchema } from "../plugins/audit";
import 'lib/mongo';

export interface DetailsBaseData
extends TimestampData, AuditData {
    id: string;
    name: string;
}


const schema = new Schema<DetailsBaseData>({
    name: {
        type: String,
        // unique: true,
        required: true,
    },
}, {
    ...TimestampOptions,
    discriminatorKey: 'kind',
})

schema.set('toJSON', {
    virtuals: true
})

//** Apply Plugins */
interface DetailsBaseSchema
extends DetailsBaseData, AuditSchema {}

schema.plugin(TimestampPlugin);
// schema.plugin(AuditPlugin);


//** Model */
interface QueryHelpers {
    byName(name: string): Query<any, DetailsBaseDocument> & QueryHelpers;
}

schema.query.byName = function(name: string) {
    return this.findOne({ name: name })
}

type DetailsBaseModelType = Model<DetailsBaseSchema, QueryHelpers>;
export type DetailsBaseDocument = HydratedDocument<DetailsBaseSchema>;
export const DetailsBaseModel = (models?.['Details'] || model<DetailsBaseSchema, DetailsBaseModelType>('Details', schema)) as DetailsBaseModelType;

export async function Details<Fields = { name: string }>(name: string, fields: SchemaDefinition<SchemaDefinitionType<Fields>>) { // Schema<Fields>
    let doInitialized;
    const initialized = new Promise((resolve) => { doInitialized = resolve });
    const initalize = function () {
        doInitialized();
    }
    if (connection.readyState === 1) initalize();
    connection.on('connected', initalize);
    await initialized;
    type SpecificData = Fields & TimestampData & AuditData;
    type SpecificSchema = SpecificData & AuditSchema;
    const schema = new Schema<SpecificData>(fields as any, {
        ...TimestampOptions,
        discriminatorKey: 'kind',
    })
    // schema.plugin(TimestampPlugin);
    // schema.plugin(AuditPlugin);
    const specificDetails = DetailsBaseModel.discriminators?.[name] || DetailsBaseModel.discriminator<SpecificSchema>(name, schema);
    type SpecificDetailsDocument = HydratedDocument<SpecificSchema>;
    let details = await specificDetails.findOne({ name });
    if (!details) {
        details = new specificDetails({
            name,
        })
        // await details.audit({
        //     process: 'system'
        // });
        await details.save();
    }
    console.log({ details })
    return details;
}

// new Schema<{
//     what: string;
//     stuff: [];
// }>()




