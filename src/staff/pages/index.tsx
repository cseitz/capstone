import { Box, Typography } from "@mui/material";
import { getToken, useUser } from "lib/auth/client";
import { UserList } from "ui/components/user";


export default function Homepage() {
    return <Box sx={{ p: 2 }}>
        <Typography variant="h4">Users</Typography>
        <UserList />
    </Box>
}