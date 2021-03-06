import { serialize } from "cookie";
import { Route, RouteResponse, StatusError } from "lib/route";
import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "lib/auth";

export interface AuthenticationLogoutResponse extends RouteResponse {

}

export default Route<AuthenticationLogoutResponse>(async (req, res) => {
    const token = await verifyToken(req);
    if (token)
        return res.setHeader('Set-Cookie', serialize('auth', '', { path: '/', maxAge: -1, })).redirect('/login');
    throw new StatusError(401, 'Not Authenticated');
});