import { Box, Card, CardHeader, CardProps, Checkbox, IconButton, List, ListItem, ListItemButton, ListItemText, Modal, Typography } from "@mui/material";
import { EventListResponse } from "pages/api/events";
import { EventResponse } from "pages/api/events/[id]";
import { useEffect, useRef, useState } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { useAlert } from "./alert";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TodayIcon from '@mui/icons-material/Today';
import ScheduleIcon from '@mui/icons-material/Schedule';

export function EventCard(props: {
    event: string;
} & CardProps) {
    const { event: id, ...cardProps } = props;
    const [mode, setMode] = useState<'view' | 'edit'>('view');
    const { isLoading, error, data } = useQuery<EventResponse>(['event', id], () => (
        fetch('/api/events/' + id).then(res => res.json())
    ));
    const { event } = data || {};
    const alert = useAlert();
    useEffect(() => {
        if(!isLoading){return;}
        alert.success({
            message: 'Loaded Event ' + event?.title || "[Missing title]",
            duration: 2000,
        })
    }, [isLoading]);
    if (isLoading) return <Card {...cardProps} />;
    return <>
        <Card { ...cardProps }>
            <CardHeader {...{
                title: event.title
            }} action={<IconButton>
                <MoreVertIcon />
            </IconButton>} />
            

        </Card>
    </>
}

export function EventListItem(props: { event: string, onClick?: (event: string) => void }) {
    const { onClick = (event: string) => { }, } = props;
    const { isLoading, error, data } = useQuery<EventResponse>(['event', props.event], () => (
        fetch('/api/events/' + props.event).then(res => res.json())
    ));
    const { event } = data || {};
    if (isLoading) return <ListItem disablePadding />;
    const { title, description, startsAt, endsAt, type } = event;
    return <ListItem secondaryAction={<Checkbox edge="start" />} disablePadding onClick={() => onClick(event?.id)}>
        <ListItemButton dense>
            
        </ListItemButton>
    </ListItem>
}

const queryClient = new QueryClient();
function EventListComponent(props: {}) {
    const { isLoading, error, data, dataUpdatedAt } = useQuery<EventListResponse>(['events'], () => (
        fetch('/api/events').then(res => res.json())
    ));
    const [open, setOpen] = useState<string>(null)
    const { events } = data || { events: [] };
    const alert = useAlert();
    useEffect(() => {
        if (isLoading) return;
        alert.success({
            message: 'Loaded ' + events.length + ' Events',
        })
    }, [isLoading]);
    const firstLoad = useRef(true);
    useEffect(() => {
        if (isLoading) return;
        if (!firstLoad.current)
            alert.info({
                message: 'Refreshed at ' + new Date(dataUpdatedAt).toLocaleTimeString('en-us', { timeStyle: 'medium' }),
                duration: 1500,
                unique: 'eventListRefreshedAt'
            });
        firstLoad.current = false;
    }, [dataUpdatedAt])
    return <>
        <Modal open={Boolean(open)} onClose={() => setOpen(null)}>
            <Box sx={{ width: '100vw', maxWidth: 600, mx: 'auto', mt: '10vh' }}>
                {open && <EventCard event={open} />}
            </Box>
        </Modal>
        <List>
            {events.map(({ id }) => <EventListItem key={id} event={id} onClick={setOpen} />)}
        </List>
    </>
}

export function EventList(props: (Parameters<typeof EventListComponent>)[0]) {
    return <QueryClientProvider client={queryClient}>
        <EventListComponent {...props} />
    </QueryClientProvider>
}