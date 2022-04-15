import type { Document, UpdateQuery } from "mongoose";
import { UserModel } from "./schema/user";

const dollarsign = /^\$/;
const allowedOperands = [
    'set',
    'push',
    'pull',
    'pop',
    'addToSet',
    'pullAll',
    'in'
].map(o => '$' + o);

export function MongoSanitize(payload: any) {
    if (payload instanceof Object) {
        for (const key in payload) {
            if (dollarsign.test(key) && !allowedOperands.includes(key)) {
                delete payload[key];
            } else {
                MongoSanitize(payload[key]);
            }
        }
    }
    return payload;
}

export function UpdateDocument<T = Document>(doc: T & Document, payload: Partial<T> & UpdateQuery<T> & {
    [key: string]: any;
}) {
    payload = MongoSanitize(payload);
    for (const key in payload) {
        if (key[0] != '$') {
            doc.set(key, payload[key])
        } else {
            // console.log('update', key, payload[key])
            doc.update({ [key]: payload[key] })
        }
    }
    return doc;
}

// (async function () {
//     (await UserModel.findById('hi')).update()
//     UpdateDocument(await UserModel.findById('hi'), {
        
//     })
// })();