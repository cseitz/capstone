import { isAuthenticated } from "lib/auth";
import { isLoggedIn, isStaff } from "lib/auth/guards";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";


// Authentication & Authorization guard.
// Protects and redirects most routes on the staff portal.

export default function handler(req: NextRequest, ev: NextFetchEvent) {
    const { nextUrl: { pathname }, cookies: { auth } } = req;
    // console.log('visit', pathname, isLoggedIn(auth));

    // allow access, regardless of authentication
    if (pathname.startsWith('assets') || pathname.startsWith('/api') || pathname.startsWith('/logout'))
        return NextResponse.next();

    // login route logic
    if (pathname == '/login')
        if (isStaff(auth)) // can they access staff portal?
            return NextResponse.redirect('/', 307); // redirect to staff portal
        else if (isLoggedIn(auth)) // not authorized to access it? (aka, a normal user)
            return NextResponse.rewrite('/denied'); // show denied page instead of the actual page
        else // user is allowed to access this page. continue.
            return NextResponse.next();

    if (isStaff(auth)) // if they can access staff portal, allow any pages to be accessed.
        return NextResponse.next();

    // if not a staff member but they're logged in, show them the denied page.
    if (isLoggedIn(auth))
        return NextResponse.rewrite('/denied');

    // redirect people who aren't logged in to the login page.
    return NextResponse.redirect('/login', 307);
}