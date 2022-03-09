import { NextApiRequest, NextApiResponse } from "next";
import { UserModel } from "lib/mongo/schema/user";
import { compare } from 'bcrypt';

export interface AuthenticationLoginResponse {

}

export default async function handler(req: NextApiRequest, res: NextApiResponse<AuthenticationLoginResponse>) {
    const { method } = req;
    if (method != 'POST')
        return res.status(405).send('Method Not Allowed');
    try {
        const { body: { email, username, password } } = req;
        const user = await UserModel.findOne(email ? { email } : { username });
        if (user) {
            if (await compare(password, user.password)) {
                const token = jwt.sign
                return res.json({
                    token,
                })
            }
        }
        throw new Error('User does not exist');
    } catch (e) {
        return res.status(401).json({
            error: e.toString(),
        })
    }
}