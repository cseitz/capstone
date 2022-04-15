import { isAuthenticated } from ".";


export const isLoggedIn = isAuthenticated({});

export const isStaff = isAuthenticated({
    role: ['staff', 'admin']
})

export const isAdmin = isAuthenticated({
    role: ['admin']
})

export const isPending = isAuthenticated({
    role: ['pending']
})