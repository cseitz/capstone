import { Route, StatusError } from "lib/route";
import { verifyToken } from "lib/auth";

export interface AuthenticationStatusResponse {

}

export default Route(async (req, res) => {
    const token = await verifyToken(req);
    if (token)
        return res.json({ token });
    throw new StatusError(401, 'Unauthorized');
});
