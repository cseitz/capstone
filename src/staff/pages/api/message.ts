import { NextApiRequest, NextApiResponse } from "next";

export interface MessageAPIResponse {
    message: string;
    time: Date
}

console.log('running some server code2');

export default function handler(req: NextApiRequest, res: NextApiResponse<MessageAPIResponse>) {
    res.json({
        message: 'hi there!',
        time: new Date(),
    })
}