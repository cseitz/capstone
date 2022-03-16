import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useFeedback } from "ui/components/feedback";


export default function Logout() {
    const feedback = useFeedback();
    const router = useRouter();
    useMemo(() => {
        if (typeof window == 'undefined') return;
        fetch('/api/auth/logout').then(() => {
            feedback.success({ message: 'Logged Out' });
            router.push('/login');
        })
    }, []);
    return <Box />
}