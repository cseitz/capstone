import { isAuthenticated } from "lib/auth";
import { UserData, UserDocument, UserModel } from "lib/mongo/schema/user";
import { Route, StatusError } from "lib/route";
import { NextApiRequest, NextApiResponse } from "next";


const isStaff = isAuthenticated({
    role: ['pending', 'user', 'staff', 'admin']
})

export default Route(async (req, res) => {
    if (!isStaff(req)) throw new StatusError(403, 'Unauthorized');
    const users = await UserModel.find()
    const lines = []
    lines.push("Email,Role,FirstName,LastName,Created")
    for (const user of users){
        lines.push([
            user.email,
            user.role,
            user.info.firstName,
            user.info.lastName,
            user.created
        ].join(","))
    }
    res.setHeader("Content-Disposition", "attachment; filename=\"users.csv\"")
    res.send(lines.join("\r\n"))
});

