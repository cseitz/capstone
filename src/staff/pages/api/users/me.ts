import { isAuthenticated } from "lib/auth";
import { isLoggedIn } from "lib/auth/guards";
import { UserData, UserDocument, UserModel } from "lib/mongo/schema/user";
import { UpdateDocument } from "lib/mongo/utils";
import { Route, StatusError } from "lib/route";
import { NextApiRequest, NextApiResponse } from "next";
import { refreshTokenRole } from "../auth";

export interface UserResponse {
    user?: UserData
}

export default Route<UserResponse>(async (req, res) => {
    const { method, headers, query } = req;
    const client = isLoggedIn(req);
    if (!client) throw new StatusError(403, 'Unauthorized');
    const user = await UserModel.findOne({ email: client.user });
    if (method == 'GET') {
        await refreshTokenRole(req, res, client);
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
    }
}, {
    methods: ['GET', 'PATCH']
});