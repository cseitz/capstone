import { AuthenticationGuard } from "lib/auth/middleware";


export default AuthenticationGuard({
    redirect: '/login',
    filter(req, ev) {
        const { pathname } = req.nextUrl;
        if (!pathname.includes('/api') && !pathname.includes('/login')) {
            console.log('guard', pathname);
            return true;
        }
        return false;
    },
});