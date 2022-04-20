import { Button, Typography, useMediaQuery } from "@mui/material";
import { Box } from "@mui/system";
import { EventList, } from "ui/components/event";
import CreateIcon from '@mui/icons-material/Create';
import { useMemo, useState } from "react";
import { title } from "ui/components/navbar";
import Head from "next/head";

// The Events page shows the list of events and allows creating and editing events
export default function EventPage() {

    const isMobile = useMediaQuery('(max-width:600px)');

    const sx = useMemo(() => (!isMobile ? {
        container: {
            display: 'flex',
            justifyContent: 'space-between'
        },
        title: {},
        button: {}
    } : {
        container: { textAlign: 'center' },
        title: { textAlign: 'center' },
        button: {
            mx: 'auto',
            my: 1
        }
    }), [isMobile]);

    const [showCreate, setShowCreate] = useState(false);

    // event page 
    return <Box sx={{ p: 2 }}>

        <Head>
            <title>{title} - Events</title>
        </Head>

        <Box sx={{ ...sx.container }}>

            <Typography variant="h4" sx={{ ...sx.title }}>
                Events
            </Typography>

            <Button variant="contained" sx={{ ...sx.button }} startIcon={<CreateIcon />} onClick={() => setShowCreate(true)}>
                Create Event
            </Button>
        </Box>

        <EventList showCreate={showCreate} onClose={() => setShowCreate(false)} />

    </Box>
}