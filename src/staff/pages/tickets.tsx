import { Box, Typography } from "@mui/material";
import type { TicketData } from "lib/mongo/schema/ticket";
import { useState } from "react";
import { TicketList } from "ui/components/ticket";


export default function TicketsPage() {
    const [filter, setFilter] = useState<TicketData['status'] | 'all'>('all');
    return <Box sx={{ p: 2 }}>
        <Typography variant="h4">Tickets</Typography>
        <br />
        <TicketList />
    </Box>
}