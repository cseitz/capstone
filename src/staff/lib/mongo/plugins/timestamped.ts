import { Schema } from "mongoose";

export interface TimestampData {
    created: any
    updated: any
}

export const TimestampOptions = {
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated',
    }
}

export function TimestampPlugin(schema: Schema, options) {
    const created = {
        type: Date,
        default: Date.now,
    }
    schema.add({
        created,
        updated: created
    })
}