import { Box, Typography } from "@mui/material";
import { TicketList } from "ui/components/ticket";


export default function Homepage() {
    return <Box sx={{ p: 2 }}>
        <Typography variant="h4">Tickets</Typography>
        <TicketList />
    </Box>
}