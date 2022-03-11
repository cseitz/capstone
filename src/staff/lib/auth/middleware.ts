import type { UserDocument } from 'lib/mongo/schema/user';
import type { NextRequest, NextFetchEvent } from 'next/server';
import { NextResponse } from 'next/server';
import { verifyToken } from '.';




export function AuthenticationGuard(opts: {
    not?: boolean;
    role?: UserDocument['role'][];
    redirect?: string | ((req: NextRequest, ev: NextFetchEvent) => any);
    filter?: ((req: NextRequest, ev: NextFetchEvent) => Boolean);
}) {
    return async function (req: NextRequest, ev: NextFetchEvent) {
        if (opts?.filter && await opts?.filter(req, ev) === false)
            return NextResponse.next();
        let ok = false;
        const authCookie = req?.cookies?.['auth'];
        if (authCookie) {
            try {
                const token = await verifyToken(authCookie);
                ok = true;
                if (opts?.role && !opts.role.includes(token.role)) ok = false;
            } catch (e) {

            }
        }
        if (ok == Boolean(opts.not)) {
            // guard route
            if (opts?.redirect) {
                if (typeof opts.redirect == 'string')
                    return NextResponse.redirect(opts.redirect, 307);
                return await opts.redirect(req, ev);
            }
        }
        // continue
        return NextResponse.next();
    }
}
