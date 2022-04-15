import { Route, StatusError } from "lib/route";
import { createToken, isAuthenticated, verifyToken } from "lib/auth";
import { UserModel } from "lib/mongo/schema/user";
import { serialize } from "cookie";
import { isLoggedIn } from "lib/auth/guards";

export interface AuthenticationStatusResponse {

}

export default Route(async (req, res) => {
    let token = await verifyToken(req);
    if (token) {
        const client = isLoggedIn(req);
        if (client) {
            const user = await UserModel.findById(client.id);
            const { role } = user;
            if (role != client.role) {
                const refreshedToken = createToken(user, token);
                res.setHeader('Set-Cookie', serialize('auth', refreshedToken, { path: '/' })).json({
                    token,
                });
                token = await verifyToken(refreshedToken);
            }
        }
        return res.json({ token });
    }
    throw new StatusError(401, 'Unauthorized');
});
