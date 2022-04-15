import { isAuthenticated } from "lib/auth";
import { isStaff } from "lib/auth/guards";
import { AuditLogModel } from "lib/mongo/plugins/audit";
import { UserData, UserDocument, UserModel } from "lib/mongo/schema/user";
import { Route, StatusError } from "lib/route";
import { NextApiRequest, NextApiResponse } from "next";


function stringifyChanges(changes) {
    const results = [];
    for (const key in changes) {
        results.push(key + '=' + String(changes[key][1]));
    }
    return results.join(', ');
}

//Routes to mongo db and creates csv file of Audit log 
export default Route(async (req, res) => {
    if (!isStaff(req)) throw new StatusError(403, 'Unauthorized');
    const AuditLogs = await AuditLogModel.find().sort({ created: -1 }).populate('user', 'email')
    const lines = [];
    // Creates the headers for CSV
    // Below pushes each auditlog data point in each column then a new line is created to start another row
    lines.push("Method,Kind,User,Process,Action,Reason,Changes,Source,Payload,Document")
    for (const AuditLog of AuditLogs){
        const method = AuditLog.method;
        const kind = AuditLog.get('kind')?.replace("AuditLog", "");
        let doc = AuditLog.document;
        if (kind == 'User' && method != 'delete') {
            doc = (await UserModel.findById(doc).select({ email: 1 }))?.email || doc;
        }
        lines.push([
            method,
            kind,
            AuditLog?.user?.email,
            AuditLog.process,
            AuditLog.action,
            AuditLog.reason,
            AuditLog.changes && `"${stringifyChanges(AuditLog.changes)?.replace(/\"/g, "\"\"")}"`,
            AuditLog.source,
            AuditLog?.payload && `"${JSON.stringify(AuditLog?.payload)?.replace(/\"/g, "\"\"")}"`,
            doc
        ].join(","))
    }
    res.setHeader("Content-Disposition", "attachment; filename=\"logs.csv\"")
    res.send(lines.join("\r\n"))
});

