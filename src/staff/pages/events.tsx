import { Button, Icon, IconButton, Typography, useMediaQuery } from "@mui/material";
import { Box } from "@mui/system";
import { QueryClient, QueryClientProvider } from "react-query";
import { EventCard, EventList, EventListItem } from "ui/components/event";
import CreateIcon from '@mui/icons-material/Create';
import { useMemo, useState } from "react";

//const queryClient = new QueryClient();

export default function EventPage() {
    const [showCreate, setShowCreate] = useState(false);
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

    return <Box sx={{ p: 2 }}>
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