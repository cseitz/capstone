import { NextApiRequest, NextApiResponse } from "next";
import jwt from 'jsonwebtoken';
import getConfig from "next/config";
import { dirname, resolve } from "path";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { createPublicKey, generateKeyPairSync, randomUUID } from "crypto";
import { UserDocument } from "lib/mongo/schema/user";
import { parse } from "cookie";
import { Route, StatusError } from "lib/route";


const JWT_PATH = resolve(getConfig().serverRuntimeConfig.paths.data, 'rsa_jwt');
if (!existsSync(JWT_PATH + '.pem')) {
    mkdirSync(dirname(JWT_PATH), { recursive: true });
    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        }
    });
    writeFileSync(JWT_PATH + '.pub', publicKey);
    writeFileSync(JWT_PATH + '.pem', privateKey);
}
const JWT_PUBLIC_KEY = readFileSync(JWT_PATH + '.pub');
const JWT_PRIVATE_KEY = readFileSync(JWT_PATH + '.pem');
getConfig().serverRuntimeConfig.jwt = {
    publicKey: JWT_PUBLIC_KEY,
    privateKey: JWT_PRIVATE_KEY,
}

export interface AuthenticationStatusResponse {

}

export default Route(async (req, res) => {
    const token = await verifyToken(req);
    if (token)
        return res.json({ token });
    throw new StatusError(401, 'Unauthorized');
});



export interface AuthenticationToken {
    uuid: string;
    issued: string;
    user: string;
    id: string;
}

export function verifyToken(token: string | NextApiRequest): Promise<AuthenticationToken> {
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
        jwt.verify(token as string, JWT_PUBLIC_KEY, (err, decoded) => {
            if (err) return reject(err);
            resolve(decoded as any);
        })
    })
}



export function createToken(user: UserDocument) {
    const data: AuthenticationToken = {
        uuid: randomUUID(),
        issued: new Date().toString(),
        user: user?.['name'] || user?.['email'],
        id: user._id.toString(),
    }
    return jwt.sign(data, JWT_PRIVATE_KEY, { algorithm: 'RS256'});
}


