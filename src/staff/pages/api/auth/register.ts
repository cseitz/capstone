import { NextApiRequest, NextApiResponse } from "next";

export interface AuthenticationRegisterResponse {

}

// export default async function handler(req: NextApiRequest, res: NextApiResponse<AuthenticationRegisterResponse>) {
//     const { method } = req;
//     if (method != 'POST') 
//         return res.status(405).send('Method Not Allowed');
//     return res.status(500).send('Not Yet Implemented');
//     //throw new Error('Register - Not Yet Implemented');
// }

export default Route(async (req, res) => {
    const { method } = req;
    if (method != 'POST') throw new StatusError(405, 'Method Not Allowed');
    throw new StatusError(500, 'Not Yet Implemented');
})

class StatusError extends Error {
    statusCode: number;
    constructor(statusCode: number, msg: string) {
        super(msg);
        this.statusCode = statusCode;
    }
}

function Route<T>(handler: (req: NextApiRequest, res: NextApiResponse<T>) => any) {
    return function(req, res) {
        try {
            Promise.resolve(handler(req, res)).catch(err => {
                if (err instanceof StatusError) {
                    res.status(err.statusCode).send(err.message);
                } else {
                    throw err;
                }
            })
        } catch(err) {
            if (err instanceof StatusError) {
                res.status(err.statusCode).send(err.message);
            } else {
                throw err;
            }
        }
    }
}