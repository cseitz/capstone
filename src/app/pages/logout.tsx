import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useAlert } from "ui/components/alert";

// Logout page
// Utilizes the /api/auth/logout endpoint and instantly redirects on success.
export default function Logout() {
    const alert = useAlert();
    const router = useRouter();
    useMemo(() => {
        if (typeof window == 'undefined') return;
        // logout
        fetch('/api/auth/logout').then(() => {
            // show message
            alert.success({ message: 'Logged Out' });
            // redirect
            router.push('/login');
        })
    }, []);
    return <Box />
}