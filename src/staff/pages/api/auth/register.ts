import { serialize } from "cookie";
import { UserModel } from "lib/mongo/schema/user";
import { Route, RouteResponse, StatusError } from "lib/route";
import { NextApiRequest, NextApiResponse } from "next";
import { createToken } from "lib/auth";

export interface AuthenticationRegisterResponse extends RouteResponse {
    token: string;
}

export default Route<AuthenticationRegisterResponse>(async (req, res) => {
    const { method } = req;
    if (method != 'POST')
        throw new StatusError(405, 'Method Not Allowed');
    const { firstName, lastName, email, password } = req.body;
    if (await UserModel.findOne({ email }))
        throw new StatusError(500, 'Account already exists');
    const user = new UserModel({
        email: email.toLowerCase().trim(),
        password: password.trim(),
        info: {
            firstName: firstName.trim(),
            lastName: lastName.trim()
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
