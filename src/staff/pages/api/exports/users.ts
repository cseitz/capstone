import { isAuthenticated } from "lib/auth";
import { isStaff } from "lib/auth/guards";
import { UserData, UserDocument, UserModel } from "lib/mongo/schema/user";
import { Route, StatusError } from "lib/route";
import { NextApiRequest, NextApiResponse } from "next";

//Routes to mongo db and creates csv file of Audit log 
export default Route(async (req, res) => {
    if (!isStaff(req)) throw new StatusError(403, 'Unauthorized');
    const users = await UserModel.find()
    const lines = []
    //Creates the headers for each column in the CSV file
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

