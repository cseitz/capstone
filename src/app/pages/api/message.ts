import { MessageAPIResponse } from "api/message";
import { NextApiRequest, NextApiResponse } from "next";


export default function handler(req: NextApiRequest, res: NextApiResponse<MessageAPIResponse>) {
    res.json({
        message: 'sample message',
        time: new Date(),
    })
}