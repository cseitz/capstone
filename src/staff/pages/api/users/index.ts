import { isAuthenticated } from "lib/auth";
import { UserDocument, UserModel } from "lib/mongo/schema/user";
import { Route, StatusError } from "lib/route";
import { NextApiRequest, NextApiResponse } from "next";

export interface UserListResponse {
    users: UserDocument[]
}

const isStaff = isAuthenticated({
    role: ['pending', 'user', 'staff', 'admin']
})

export default Route<UserListResponse>(async (req, res) => {
    if (!isStaff(req)) throw new StatusError(403, 'Unauthorized');
    const users = await UserModel.find();
    res.json({
        users
    })
});