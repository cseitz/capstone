import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useAlert } from "ui/components/alert";


export default function Logout() {
    const alert = useAlert();
    const router = useRouter();
    useMemo(() => {
        if (typeof window == 'undefined') return;
        fetch('/api/auth/logout').then(() => {
            alert.success({ message: 'Logged Out' });
            router.push('/login');
        })
    }, []);
    return <Box />
}