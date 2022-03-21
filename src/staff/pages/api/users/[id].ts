import { isAuthenticated } from "lib/auth";
import { UserData, UserDocument, UserModel } from "lib/mongo/schema/user";
import { Route, StatusError } from "lib/route";
import { NextApiRequest, NextApiResponse } from "next";

export interface UserResponse {
    user?: UserData
}

const isStaff = isAuthenticated({
    role: ['pending', 'user', 'staff', 'admin']
})

export default Route<UserResponse>(async (req, res) => {
    if (!isStaff(req)) throw new StatusError(403, 'Unauthorized');
    const user = await UserModel.findById(req.query.id);
    res.json({
        user
    })
});