import { Schema } from "mongoose";

export interface AuditLogData {
    created: any
    updated: any
}

export function AuditLogPlugin(schema: Schema, options) {
    
}