import { serialize } from "cookie";
import { UserModel } from "lib/mongo/schema/user";
import { Route, RouteResponse, StatusError } from "lib/route";
import { NextApiRequest, NextApiResponse } from "next";
import { createToken } from ".";

export interface AuthenticationRegisterResponse extends RouteResponse {
    token: string;
}

export default Route<AuthenticationRegisterResponse>(async (req, res) => {
    const { method } = req;
    if (method != 'POST')
        throw new StatusError(405, 'Method Not Allowed');
    const { firstName, lastName, email, password } = req.body;
    const user = new UserModel({
        email,
        password,
        info: {
            firstName,
            lastName
        }
    });
    await user.audit({
        process: 'system'
    })
    await user.save();
    const token = createToken(user);
    return res.setHeader('Set-Cookie', serialize('auth', token, { path: '/' })).json({
        token,
    })
})
