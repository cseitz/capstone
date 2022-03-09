import { NextApiRequest, NextApiResponse } from "next";


export interface RouteResponse {
    error?: string;
}

export class StatusError extends Error {
    statusCode: number;
    data: { [key: string]: any };
    constructor(statusCode: number, msg: string, data?: { [key: string]: any }) {
        super(msg);
        this.statusCode = statusCode;
        if (data) Object.assign(this.data, data);
    }
}

export function Route<T>(handler: (req: NextApiRequest, res: NextApiResponse<T | RouteResponse>) => any) {
    return function (req, res) {
        try {
            Promise.resolve(handler(req, res)).catch(err => {
                if (err instanceof StatusError) {
                    res.status(err.statusCode).json({ error: err.message, ...err?.data });
                } else {
                    throw err;
                }
            })
        } catch (err) {
            if (err instanceof StatusError) {
                res.status(err.statusCode).json({ error: err.message, ...err?.data });
            } else {
                throw err;
            }
        }
    }
}