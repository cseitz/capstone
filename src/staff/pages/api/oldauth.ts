import { NextApiRequest, NextApiResponse } from "next";
import { UserDocument, UserModel } from "lib/mongo/schema/user";
import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'test';

export type AuthenticationResponse = 
    AuthenticationStatusResponse 
    | AuthenticationLoginResponse 
    | AuthenticationLogoutResponse;

export type AuthenticationStatusResponse = AuthenticationToken & {
    error?: string;
}

export interface AuthenticationLoginResponse {
    error?: string;
    token?: string;
}

export interface AuthenticationLogoutResponse {
    error?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<AuthenticationResponse>) {
    const { method, headers: { authorization } } = req;
    if (method == 'GET') { // return auth status
        try {
            if (authorization) {
                const token = await verify(authorization);
                return res.status(200).json({
                    ...token,
                })
            }
        } catch(e) {
            return res.status(401).json({
                error: 'Unauthorized'
            })
        }
    } else if (method == 'POST') { // login
        try {
            const { body: { email, username, password } } = req;
            const user = await UserModel.findOne(email ? { email } : { username });
            if (user) {
                if (await compare(password, user.password)) {
                    const token = await login(user);
                    return res.json({
                        token,
                    })
                }
            }
            throw new Error('User does not exist');
        } catch(e) {
            return res.status(401).json({
                error: e.toString(),
            })
        }
    } else if (method == 'DELETE') { // logout
        try {
            if (authorization) {
                const token = await verify(authorization);
                await logout(token);
            }
            throw new Error('Unauthorized');
        } catch(e) {
            return res.status(401).json({
                error: e,
            })
        }
    }
}


export interface AuthenticationToken {
    token: string;
    expires: string;
}

function verify(token: string): Promise<AuthenticationToken> {
    if (token.includes(' ')) return verify(token.trim().split(' ').pop());
    return new Promise(function(resolve, reject) {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) return reject(err);
            resolve(decoded as any);
        })
    })
}

async function login(user: UserDocument): Promise<string> {
    throw new Error('Login - Not Yet Implemented');
}

async function logout(token: AuthenticationToken) {
    throw new Error('Logout - Not Yet Implemented');
}