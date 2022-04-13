import { isAuthenticated } from "lib/auth";
import { AuditLogModel } from "lib/mongo/plugins/audit";
import { UserData, UserDocument, UserModel } from "lib/mongo/schema/user";
import { Route, StatusError } from "lib/route";
import { NextApiRequest, NextApiResponse } from "next";


//This function allows Staff roles to be authenticated
const isStaff = isAuthenticated({
    role: ['pending', 'user', 'staff', 'admin']
})
//
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
    const AuditLogs = await AuditLogModel.find().populate('user', 'email')
    const lines = [];
    // Creates the headers for CSV
    // Below pushes each auditlog data point in each column then a new line is created to start another row
    // Uses data from the Mongo Database in each row.
    lines.push("Method,Kind,User,Process,Action,Reason,Changes,Source,Payload,Document")
    for (const AuditLog of AuditLogs){
        lines.push([
            AuditLog.method,
            AuditLog.get('kind')?.replace("AuditLog", ""),
            AuditLog?.user?.email,
            AuditLog.process,
            AuditLog.action,
            AuditLog.reason,
            AuditLog.changes && `"${stringifyChanges(AuditLog.changes)?.replace(/\"/g, "\"\"")}"`,
            AuditLog.source,
            AuditLog?.payload && `"${JSON.stringify(AuditLog?.payload)?.replace(/\"/g, "\"\"")}"`,
            AuditLog.document
        ].join(","))
    }
    res.setHeader("Content-Disposition", "attachment; filename=\"logs.csv\"")
    res.send(lines.join("\r\n"))
});

