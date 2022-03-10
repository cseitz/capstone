/*import type { NextRequest, NextFetchEvent } from 'next/server';
import { NextResponse } from 'next/server';
// import { JWT_SECRET } from './constants';
import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env?.JWT_SECRET || 'jwt_secret_test1';

// type NextRequest = any;
// type NextFetchEvent = any;
// type NextResponse = any;

export function createToken(user: UserDocument) {
    const data: AuthenticationToken = {
        uuid: randomUUID(),
        issued: new Date().toString(),
        user: user?.['name'] || user?.['email'],
        id: user._id.toString(),
        role: user.role,
    }
    return jwt.sign(data, JWT_SECRET, { algorithm: 'RS256' });
}

export function verifyToken(token: string | NextApiRequest | NextRequest): Promise<AuthenticationToken> {
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

import type { UserDocument } from 'lib/mongo/schema/user';
import { NextApiRequest } from 'next';
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

export function AuthenticationGuard(opts: {
    not?: boolean;
    role?: UserDocument['role'][];
    redirect?: string | ((req: NextRequest, ev: NextFetchEvent) => any);
    filter?: ((req: NextRequest, ev: NextFetchEvent) => Boolean);
}) {
    return async function (req: NextRequest, ev: NextFetchEvent) {
        if (opts?.filter && await opts?.filter(req, ev) === false)
            return NextResponse.next();
        let ok = false;
        const authCookie = req?.cookies?.['auth'];
        if (authCookie) {
            try {
                const token = await verifyToken(authCookie);
                ok = true;
                if (opts?.role && !opts.role.includes(token.role)) ok = false;
            } catch (e) {

            }
        }
        if (ok == Boolean(opts.not)) {
            // guard route
            if (opts?.redirect) {
                if (typeof opts.redirect == 'string')
                    return NextResponse.redirect(opts.redirect, 307);
                return await opts.redirect(req, ev);
            }
        }
        // continue
        return NextResponse.next();
    }
}
*/