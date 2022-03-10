import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env?.JWT_SECRET || 'jwt_secret_test1';

import type { UserDocument } from 'lib/mongo/schema/user';
import { parse } from 'cookie';
import { StatusError } from 'lib/route';
import { randomUUID } from 'crypto';
export interface AuthenticationToken {
    uuid: string;
    issued: string;
    user: string;
    id: string;
    role: UserDocument['role'];
}



export function createToken(user: UserDocument) {
    const data: AuthenticationToken = {
        uuid: randomUUID(),
        issued: new Date().toString(),
        user: user?.['name'] || user?.['email'],
        id: user._id.toString(),
        role: user.role,
    }
    return jwt.sign(data, JWT_SECRET);
}


export function verifyToken(token: string | any): Promise<AuthenticationToken> {
    if (typeof token != 'string' && 'headers' in token) {
        const cookies = parse(token.headers['cookie'] || '');
        if ('auth' in cookies) {
            return verifyToken(cookies.auth);
        }
        throw new StatusError(401, 'Not Authenticated');
    }
    token = String(token);
    if (token.includes(' ')) return verifyToken(token.trim().split(' ').pop());
    if (token.length <= 1) throw new StatusError(401, 'Not Authenticated');
    return new Promise(function (resolve, reject) {
        jwt.verify(token as string, JWT_SECRET, (err, decoded) => {
            if (err) return reject(err);
            resolve(decoded as any);
        })
    })
}
