import { isAuthenticated } from "lib/auth";
import { AuthenticationGuard } from "lib/auth/middleware";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";


// export default AuthenticationGuard({
//     redirect: '/login',
//     filter(req, ev) {
//         const { pathname } = req.nextUrl;
//         if (!pathname.includes('/api') && !pathname.includes('/login')) {
//             console.log('guard', pathname);
//             return true;
//         }
//         return false;
//     },
// });

const isLoggedIn = isAuthenticated({
    not: {
        role: ['banned']
    }
})

const isStaff = isAuthenticated({
    role: ['pending', 'user', 'staff', 'admin']
})

export default function handler(req: NextRequest, ev: NextFetchEvent) {
    const { nextUrl: { pathname }, cookies: { auth } } = req;
    if (pathname.includes('/api'))
        return NextResponse.next();
    if (pathname == '/login') {
        if (isStaff(auth))
            return NextResponse.redirect('/', 307);
        else if (isLoggedIn(auth))
            return NextResponse.next();
    };
    if (isStaff(auth))
        return NextResponse.next();
    if (pathname != '/login')
        return NextResponse.redirect('/login', 307);
}