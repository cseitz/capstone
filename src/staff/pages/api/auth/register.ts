import { UserModel } from "lib/mongo/schema/user";
import { Route, RouteResponse, StatusError } from "lib/route";
import { NextApiRequest, NextApiResponse } from "next";

export interface AuthenticationRegisterResponse extends RouteResponse {
    
}

// export default async function handler(req: NextApiRequest, res: NextApiResponse<AuthenticationRegisterResponse>) {
//     const { method } = req;
//     if (method != 'POST') 
//         return res.status(405).send('Method Not Allowed');
//     return res.status(500).send('Not Yet Implemented');
//     //throw new Error('Register - Not Yet Implemented');
// }

export default Route<AuthenticationRegisterResponse>(async (req, res) => {
    const { method } = req;
    if (method != 'POST')
        throw new StatusError(405, 'Method Not Allowed');
    const { firstName, lastName, email, password } = req.body;
    const user = new UserModel({
        email,
        password,
        info: {
            firstName,
            lastName
        }
    });

    throw new StatusError(500, 'Not Yet Implemented: ' + JSON.stringify(req.body));
})
