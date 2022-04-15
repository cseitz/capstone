import { isAuthenticated } from "lib/auth";
import { isAdmin, isStaff } from "lib/auth/guards";
import { UserData, UserDocument, UserModel } from "lib/mongo/schema/user";
import { UpdateDocument } from "lib/mongo/utils";
import { Route, StatusError } from "lib/route";
import { NextApiRequest, NextApiResponse } from "next";

export interface UserResponse {
    user?: UserData
}

export default Route<UserResponse>(async (req, res) => {
    const { method, headers, query } = req;
    const client = isStaff(req);
    if (!client) throw new StatusError(403, 'Unauthorized');
    const user = await UserModel.findById(req.query.id);
    if (method == 'GET') {
        return res.json({
            user
        })
    } else if (method == 'PATCH') {
        await user.audit({
            user: client.id,
        })
        UpdateDocument(user, req.body);
        await user.commitWith(req, {
            action: 'Updated User',
        });
        await user.save();
        return res.json({
            user
        })
    } else if (method == 'DELETE') {
        if (!isAdmin(req)) throw new StatusError(403, 'Unauthorized');
        await user.audit({
            user: client.id,
        })
        await user.remove();
        return res.json({
            user,
        })
    }
}, {
    methods: ['GET', 'PATCH', 'DELETE']
});