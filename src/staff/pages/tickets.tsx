import { Box, Button, ButtonGroup, ToggleButton, ToggleButtonGroup, Typography, useMediaQuery } from "@mui/material";
import type { TicketData } from "lib/mongo/schema/ticket";
import { useMemo, useState } from "react";
import { TicketList } from "ui/components/ticket";


type StatusKind = TicketData['status'] | 'all';
export default function TicketsPage() {
    const [status, setStatus] = useState<StatusKind>('all');
    const isMobile = useMediaQuery('(max-width:600px)');
    const sx = useMemo(() => (!isMobile ? {
        container: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        title: {},
        button: {},
        counter: {},
    } : {
        container: { textAlign: 'center' },
        title: { textAlign: 'center' },
        counter: { mt: 2 },
        button: {
            mx: 'auto',
            my: 1,
        },
    }), [isMobile]);
    const filter = {
        status,
    }
    if (status == 'all') delete filter.status;
    const [count, setCount] = useState(0);
    return <Box sx={{ p: 2 }}>
        <Box sx={{ ...sx.container }}>
            <Typography variant="h4" sx={{ ...sx.title }}>Tickets</Typography>
            <ToggleButtonGroup sx={{ ...sx.button, '.MuiToggleButton-root': { px: 2, py: 1 } }} exclusive value={status} onChange={(_, v) => setStatus(v)}>
                <ToggleButton value="all">All</ToggleButton>
                <ToggleButton value="open">Open</ToggleButton>
                <ToggleButton value="assigned">Assigned</ToggleButton>
                <ToggleButton value="closed">Closed</ToggleButton>
            </ToggleButtonGroup>
            <Typography sx={{ ...sx.counter }}>Showing {count} tickets</Typography>
        </Box>
        <br />
        <TicketList filter={filter} setCount={setCount} />
    </Box>
}