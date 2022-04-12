import { ExpandMore } from "@mui/icons-material";
import { Button, Card, CardActions, CardContent, CardHeader, Collapse, List, ListItem, ListItemButton, ListItemText, Typography } from "@mui/material";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { useAlert } from "./alert";
import { useEffect,  useRef } from "react";
import AssignmentIcon from '@mui/icons-material/AssignmentOutlined';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import type{ EventResponse } from 'api/events/[id]';
import type{ EventListResponse } from 'api/events'

const queryClient = new QueryClient();

export function EventListItem(props: { event: string }) {
    const { isLoading, error, data } = useQuery<EventResponse>(['event', props.event], () => (
        fetch('http://localhost:5000/api/events/' + props.event).then(res => res.json())
    ));
    const { event } = data || {};
    if (isLoading) return <ListItem disablePadding />;
    const { title, description, startsAt, endsAt, type } = event;
    const hasType = Boolean(event.type);
    return <ListItem disablePadding>
        <Card>
            <CardHeader title={title + " - " + type} subheader={new Date(event.startsAt).toLocaleString('en-us', {
                                            dateStyle: 'short',
                                            timeStyle: 'short'
                                        }) + " - " + new Date(event.endsAt).toLocaleString('en-us', {
                                            dateStyle: 'short',
                                            timeStyle: 'short'
                                        })
                                    } action={
                <Button size="large" startIcon={<AssignmentIcon />}>
                    Sign Up
                </Button>
                } />
                <CardContent>
                    <Typography variant="body1">{description}</Typography>
                </CardContent>
        </Card>
    </ListItem>
}

function EventListComponent(props: { }) {
    const { isLoading, error, data, dataUpdatedAt } = useQuery<EventListResponse>(['events'], () => (
        fetch('http://localhost:5000/api/events').then(res => res.json())
    ));
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
    }, [dataUpdatedAt]);
    return <>
        <List>
            {events.map(({ id }) => <EventListItem key={id} event={id}/>)}
        </List>
    </>
}

export function EventList(props: (Parameters<typeof EventListComponent>)[0]) {
    return <QueryClientProvider client={queryClient}>
        <EventListComponent {...props} />
    </QueryClientProvider>
}
