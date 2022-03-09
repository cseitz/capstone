import { NextApiRequest, NextApiResponse } from "next";
import { UserModel } from "lib/mongo/schema/user";
import { compare } from 'bcrypt';
import { createToken } from ".";
import { serialize } from "cookie";
import { Route, RouteResponse, StatusError } from "lib/route";

export interface AuthenticationLoginResponse extends RouteResponse {
    token: string;
}

export default Route<AuthenticationLoginResponse>(async(req, res) => {
    const { method } = req;
    if (method != 'POST')
        throw new StatusError(405, 'Method Not Allowed');
    try {
        const { body: { email, username, password } } = req;
        const user = await UserModel.findOne(email ? { email } : { username });
        if (user) {
            if (await compare(password, user.password)) {
                const token = createToken(user);
                return res.setHeader('Set-Cookie', serialize('auth', token, { path: '/' })).json({
                    token,
                })
            }
        }
        throw new StatusError(500, 'User does not exist');
    } catch (e) {
        throw new StatusError(401, e.toString())
    }
});