import { isAuthenticated } from "lib/auth";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";


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
    if (pathname == '/logout2')
        return NextResponse.rewrite('/api/auth/logout');
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