import { isAuthenticated } from "lib/auth";
import { AuditLogModel } from "lib/mongo/plugins/audit";
import { UserData, UserDocument, UserModel } from "lib/mongo/schema/user";
import { Route, StatusError } from "lib/route";
import { NextApiRequest, NextApiResponse } from "next";



const isStaff = isAuthenticated({
    role: ['pending', 'user', 'staff', 'admin']
})

export default Route(async (req, res) => {
    if (!isStaff(req)) throw new StatusError(403, 'Unauthorized');
    const Auditlogs = await AuditLogModel.find()
    const lines = []
    lines.push("Method,Kind,User,Process,Action,Reason,Source,Payload,Changes,Document")
    for (const Auditlog of Auditlogs){
        lines.push([
            Auditlog.method,
            Auditlog.kind,
            Auditlog.user,
            Auditlog.process,
            Auditlog.action,
            Auditlog.reason,
            Auditlog.source,
            Auditlog.payload,
            Auditlog.changes,
            Auditlog.document
        ].join(","))
    }
    res.setHeader("Content-Disposition", "attachment; filename=\"logs.csv\"")
    res.send(lines.join("\r\n"))
});

