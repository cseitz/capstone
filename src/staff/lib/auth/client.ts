import type { UserData } from "lib/mongo/schema/user";
import type { UserResponse } from "pages/api/users/[id]";
import { QueryClient, useQuery } from "react-query";
import type { AuthenticationToken } from ".";

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