import { NextApiRequest, NextApiResponse } from "next";
import { UserModel } from "lib/mongo/schema/user";

export interface AuthenticationResponse {

}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    if (method == 'GET') { // return auth status
        
    } else if (method == 'POST') { // login

    } else if (method == 'DELETE') { // logout
        
    }
}