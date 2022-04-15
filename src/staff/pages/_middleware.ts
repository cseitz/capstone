import { isAuthenticated } from "lib/auth";
import { isLoggedIn, isStaff } from "lib/auth/guards";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";


export default function handler(req: NextRequest, ev: NextFetchEvent) {
    const { nextUrl: { pathname }, cookies: { auth } } = req;
    if (pathname.startsWith('/assets'))
        return NextResponse.next();
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