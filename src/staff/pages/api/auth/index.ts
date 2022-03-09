import { NextApiRequest, NextApiResponse } from "next";
import jwt from 'jsonwebtoken';
const JWT_SECRET = 'test';


export interface AuthenticationStatusResponse {

}

export default async function handler(req: NextApiRequest, res: NextApiResponse<AuthenticationStatusResponse>) {

}



export interface AuthenticationToken {
    token: string;
    expires: string;
}

export function verify(token: string): Promise<AuthenticationToken> {
    if (token.includes(' ')) return verify(token.trim().split(' ').pop());
    return new Promise(function(resolve, reject) {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) return reject(err);
            resolve(decoded as any);
        })
    })
}




