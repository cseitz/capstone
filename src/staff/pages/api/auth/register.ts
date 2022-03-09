import { NextApiRequest, NextApiResponse } from "next";

export interface AuthenticationRegisterResponse {

}

export default async function handler(req: NextApiRequest, res: NextApiResponse<AuthenticationRegisterResponse>) {
    const { method } = req;
    if (method != 'POST') 
        return res.status(405).send('Method Not Allowed');
    return res.status(500).send('Not Yet Implemented');
    //throw new Error('Register - Not Yet Implemented');
}