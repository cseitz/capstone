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

export interface AuthenticationStatusResponse {

}

export default Route(async (req, res) => {
    const cookies = parse(req.headers['cookie'] || '');
    if ('auth' in cookies) {
        const token = await verifyToken(cookies.auth);
        return res.json({ token })
    }
    throw new StatusError(401, 'Unauthorized');
});



export interface AuthenticationToken {
    uuid: string;
    issued: string;
    user: string;
    id: string;
}

export function verifyToken(token: string): Promise<AuthenticationToken> {
    if (token.includes(' ')) return verifyToken(token.trim().split(' ').pop());
    return new Promise(function (resolve, reject) {
        jwt.verify(token, JWT_PUBLIC_KEY, (err, decoded) => {
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


