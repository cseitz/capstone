import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest, ev) {
    const { pathname } = req.nextUrl;
    // const token = await isAuthenticated(req as any);
    // console.log({ token })
    // // if (pathname.startsWith('/login')) {
    // //     return NextResponse.rewrite('/api' + pathname);
    // // }
    return NextResponse.next();
}