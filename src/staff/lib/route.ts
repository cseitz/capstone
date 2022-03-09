import { NextApiRequest, NextApiResponse } from "next";


export interface RouteResponse {
    error?: string;
}

export class StatusError extends Error {
    statusCode: number;
    constructor(statusCode: number, msg: string) {
        super(msg);
        this.statusCode = statusCode;
    }
}

export function Route<T>(handler: (req: NextApiRequest, res: NextApiResponse<T | RouteResponse>) => any) {
    return function (req, res) {
        try {
            Promise.resolve(handler(req, res)).catch(err => {
                if (err instanceof StatusError) {
                    res.status(err.statusCode).json({ error: err.message });
                } else {
                    throw err;
                }
            })
        } catch (err) {
            if (err instanceof StatusError) {
                res.status(err.statusCode).json({ error: err.message });
            } else {
                throw err;
            }
        }
    }
}