import { CloseRounded, ExitToApp } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import Head from "next/head";
import Link from "next/link";


// This page is shown to users if they are not allowed to access the staff portal.
export default function DeniedPage() {
    return <Box sx={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        alignItems: 'center',
        justifyContent: 'center'
    }}>
        <Head>
            <title>Access Denied</title>
        </Head>
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
                    <Button sx={{ mt: 10, fontSize: 15, px: 3, py: 1, backgroundColor: 'gray' }}
                        endIcon={<ExitToApp />} variant="contained">Logout</Button>
                </Link>

            </Box>
        </Box>
    </Box>
}
