import { Box, Typography } from "@mui/material";
import Head from "next/head";
import { title } from "ui/components/navbar";
import { UserList } from "ui/components/user";


export default function Homepage() {
    return <Box sx={{ p: 2, maxWidth: '1000px', mx: 'auto' }}>
        <Head>
            <title>{title}</title>
        </Head>

        <Typography variant="h4">Users</Typography>

        <UserList showCount />
    </Box>
}