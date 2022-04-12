import { Box, Button, ButtonGroup, CircularProgress, ToggleButton, ToggleButtonGroup, Typography, useMediaQuery } from "@mui/material";
import type { TicketData } from "lib/mongo/schema/ticket";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { TicketList } from "ui/components/ticket";


type StatusKind = TicketData['status'] | 'all';
export default function TicketsPage() {
    const [status, setStatus] = useState<StatusKind>(null);

    const router = useRouter();
    useEffect(() => {
        if (status) return;
        if (!router.isReady) return;
        setStatus(router.query?.status as any || 'all');
    }, [router.isReady])
    useEffect(() => {
        if (!status) return;
        if (status == 'all' && router.pathname != '/tickets') {
            console.log('swap to /tickets')
            router.push({ pathname: '/tickets' })
        } else if (status != 'all' && router.query?.status != status) {
            console.log('swap to /tickets/' + status)
            router.push({ pathname: '/tickets/' + status })
        }
    }, [status])

    const isMobile = useMediaQuery('(max-width:600px)');
    const sx = useMemo(() => (!isMobile ? {
        container: {
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center'
        },
        title: { justifySelf: 'flex-start' },
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
    const [count, setCount] = useState(-1);
    return <Box sx={{ p: 2, maxWidth: 1400, mx: 'auto', pb: isMobile ? 20 : 0 }}>
        <Box sx={{ ...sx.container }}>
            <Typography variant="h4" sx={{ ...sx.title }}>Tickets</Typography>
            <ToggleButtonGroup sx={{ ...sx.button, '.MuiToggleButton-root': { px: 2, py: 1 } }} exclusive value={status} onChange={(_, v) => setStatus(v)}>
                <ToggleButton value="all">All</ToggleButton>
                <ToggleButton value="open">Open</ToggleButton>
                <ToggleButton value="assigned">Assigned</ToggleButton>
                <ToggleButton value="closed">Closed</ToggleButton>
            </ToggleButtonGroup>
            <Typography sx={{ ...sx.counter, opacity: count >= 0 ? 1 : 0 }}>Showing {count} tickets</Typography>
        </Box>
        <br />
        {router.isReady && <TicketList filter={filter} setCount={setCount} />}
    </Box>
}