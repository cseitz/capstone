import { isAuthenticated } from "lib/auth";
import { isLoggedIn, isStaff } from "lib/auth/guards";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";


export default function handler(req: NextRequest, ev: NextFetchEvent) {
    const { nextUrl: { pathname }, cookies: { auth } } = req;
    // console.log('visit', pathname, isLoggedIn(auth));
    if (pathname.startsWith('assets') || pathname.startsWith('/api') || pathname.startsWith('/logout'))
        return NextResponse.next();
    if (pathname == '/login')
        if (isStaff(auth))
            return NextResponse.redirect('/', 307);
        else if (isLoggedIn(auth))
            return NextResponse.rewrite('/denied');
        else
            return NextResponse.next();
    if (isStaff(auth))
        return NextResponse.next();
    if (isLoggedIn(auth))
        return NextResponse.rewrite('/denied');
    return NextResponse.redirect('/login', 307);
}