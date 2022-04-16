import { Cancel, CancelOutlined, CancelRounded, CancelSharp, CloseRounded, ErrorOutline, ExitToApp } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { useUser } from "lib/auth/client";
import { UserRoles } from "lib/auth/constants";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function DeniedPage() {
    // const user = useUser();
    // const [previousRole, setPreviousRole] = useState('');
    // useEffect(() => {
    //     const isStaff = UserRoles.indexOf(user?.role) >= UserRoles.indexOf('staff');
    //     if (isStaff && previousRole && user?.role != previousRole) {
    //         location.reload();
    //     }
    //     if (user?.role) setPreviousRole(user?.role)
    // }, [user?.role])
    return <Box sx={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        alignItems: 'center',
        justifyContent: 'center'
    }}>
        <Box sx={{
            textAlign: 'center',
            mb: 10
        }}>
            <Box sx={{ px: 2 }}>
                <Typography variant="h2">
                    <CloseRounded color="error" sx={{ fontSize: '1.25em' }} />
                </Typography>

                <Typography variant="h3" sx={{ mb: 2 }}>Access Denied</Typography>
                <Typography variant="h5">You do not have the correct permissions to access this system.</Typography>
                <Typography variant="h6" sx={{ mt: 10 }}>Only Staff are allowed to access this portal.</Typography>
                <Typography color="text.secondary" sx={{}}>If this is a mistake, contact an Administrator.</Typography>

                <Link href="/logout">
                    <Button sx={{ mt: 10, fontSize: 15, px: 3, py: 1, backgroundColor: 'gray' }} endIcon={<ExitToApp />} variant="contained">Logout</Button>
                </Link>

            </Box>
        </Box>
    </Box>
}

export function OldDeniedPage() {
    return <Box sx={{

    }}>
        <Box sx={{
            position: 'absolute',
            top: '45%',
            transform: 'translateY(-50%)',
            textAlign: 'center',
        }}>
            <Box sx={{ px: 2 }}>
                <Typography variant="h2">
                    <CloseRounded color="error" sx={{ fontSize: '1.25em' }} />
                </Typography>

                <Typography variant="h3" sx={{ mb: 2 }}>Access Denied</Typography>
                <Typography variant="h5">You do not have the correct permissions to access this system.</Typography>
                <Typography variant="h6" sx={{ mt: 10 }}>Only Staff are allowed to access this portal.</Typography>
                <Typography color="text.secondary" sx={{}}>If this is a mistake, contact an Administrator.</Typography>

                <Link href="/logout">
                    <Button sx={{ mt: 10, fontSize: 15, px: 3, py: 1 }} endIcon={<ExitToApp />} variant="contained">Logout</Button>
                </Link>

            </Box>
        </Box>
    </Box>
}