import type { UserData } from "lib/mongo/schema/user";
import type { UserResponse } from "pages/api/users/[id]";
import { createElement, useCallback, useEffect, useState } from "react";
import { QueryClient, useQuery } from "react-query";
import type { AuthenticationToken } from ".";
import { UserRoles } from "./constants";

export { }

function getCookie(name) {
    if (typeof window == 'undefined') return undefined;
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    }
    else {
        begin += 2;
        var end = document.cookie.indexOf(";", begin);
        if (end == -1) {
            end = dc.length;
        }
    }
    // because unescape has been deprecated, replaced with decodeURI
    //return unescape(dc.substring(begin + prefix.length, end));
    return decodeURI(dc.substring(begin + prefix.length, end));
}

export function isAuthenticated() {
    return Boolean(getCookie('auth'))
}

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

export function getToken(): AuthenticationToken {
    if (isAuthenticated()) return parseJwt(getCookie('auth'));
}

export function useUser(): UserData & { ready: boolean } {
    const token = getToken() as any;
    const { isLoading, error, data } = useQuery<UserResponse>('loggedInUser', () => 
        fetch('/api/users/me').then(res => res.json())
    );
    if (!isAuthenticated() || error) return;
    token.ready = false;
    if (isLoading) return token as any;
    (data.user as any).ready = true;
    return data.user as any;
}

// Automatically refreshes session, especially the user's role.
export function UserSessionUpdater() {
    const [user, setUser] = useState<UserData>(null);
    const refetch = useCallback(() => {
        fetch('/api/users/me')
        .then(res => res.json())
        .then(({ user }) => setUser(user))
    }, []);
    const [previousRole, setPreviousRole] = useState('');
    useEffect(() => {
        if (!user) return;
        const isStaff = UserRoles.indexOf(user?.role) >= UserRoles.indexOf('staff');
        const wasStaff = UserRoles.indexOf(previousRole) >= UserRoles.indexOf('staff');
        if (isStaff != wasStaff && previousRole) {
            location.reload();
        }
        if (user?.role) setPreviousRole(user?.role)
    }, [user?.role])
    useEffect(() => {
        refetch();
        const intv = setInterval(refetch, 2000);
        window?.addEventListener('focus', refetch);
        return () => {
            clearInterval(intv);
            window?.removeEventListener('focus', refetch);
        }
    }, [])
    return createElement('span', {});
}