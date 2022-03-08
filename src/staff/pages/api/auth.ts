import { NextApiRequest, NextApiResponse } from "next";
import { UserModel } from "lib/mongo/schema/user";
import { compare } from 'bcrypt';



export type AuthenticationResponse = 
    AuthenticationStatusResponse 
    | AuthenticationLoginResponse 
    | AuthenticationLogoutResponse;

export interface AuthenticationStatusResponse {

}

export interface AuthenticationLoginResponse {
    
}

export interface AuthenticationLogoutResponse {
    
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<AuthenticationResponse>) {
    const { method, headers: { authorization } } = req;
    if (method == 'GET') { // return auth status
        
    } else if (method == 'POST') { // login
        const { body: { email, username, password } } = req;
        const user = await UserModel.findOne(email ? { email } : { username });
        if (user) {
            if (await compare(password, user.password)) {

            }
        }
    } else if (method == 'DELETE') { // logout
        
    }
}