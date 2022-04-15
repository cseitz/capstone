import { ExpandMore } from "@mui/icons-material";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CircularProgress,
    Collapse,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography,
    Box,
} from "@mui/material";
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from "react-query";
import { useAlert } from "./alert";
import { useCallback, useEffect, useRef, useState } from "react";
import AssignmentIcon from "@mui/icons-material/AssignmentOutlined";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import type { EventResponse } from "api/events/[id]";
import type { EventListResponse } from "api/events";
import { isAuthenticated } from 'lib/auth/client';
import { useRouter } from "next/router";

const queryClient = new QueryClient();


// Event list item that is utilized in the eventlist component
export function EventListItem(props: { event: string }) {
    // pulling data from api
    const { isLoading, error, data } = useQuery<EventResponse>(
        ["event", props.event],
        () =>
            fetch("/api/events/" + props.event).then((res) =>
                res.json()
            )
    );

    // initializing data
    const { event } = data || {};

    const [signedUp, setSignedUp] = useState(false);

    const alert = useAlert();
    const router = useRouter();
    const queryClient = useQueryClient();
    const signUp = useCallback(() => {
        if (!isAuthenticated()) router.push('/register');
        fetch('/api/events/' + event?.id + '/rsvp', {
            method: 'POST'
        }).then(async (res) => {
            if (!res.ok) throw (await res.json())?.error;
            alert.success('Signed Up for ' + event?.title, { unique: 'event-register' });
            queryClient.invalidateQueries(['event', props.event]);
            queryClient.invalidateQueries('events');
            setSignedUp(true);
        }).catch(err => {
            alert.error('Unable to register for event');
            console.error('event.signup', err);
        })
    }, [event])

    const signOff = useCallback(() => {
        fetch('/api/events/' + event?.id + '/rsvp', {
            method: 'DELETE'
        }).then(async (res) => {
            if (!res.ok) throw (await res.json())?.error;
            alert.success('Cancelled registration for ' + event?.title, { unique: 'event-register' });
            queryClient.invalidateQueries(['event', props.event]);
            queryClient.invalidateQueries('events');
            setSignedUp(false);
        }).catch(err => {
            alert.error('Unable to cancel registration for event');
            console.error('event.signoff', err);
        })
    }, [event]);

    useEffect(() => {
        if (!isLoading) setSignedUp(event?.rsvp);
    }, [isLoading, data]);

    if (isLoading || !event) return <ListItem dense />;
    // destructering the event object
    const { title, description, startsAt, endsAt, type } = event || {};
    const hasType = Boolean(event.type);
    return (
        <ListItem disablePadding sx={{ mb: 2 }}>
            <Card sx={{ width: '100%' }}>
                <CardHeader
                    title={title + (type ? " - " + type : '')}
                    subheader={
                        new Date(event.startsAt).toLocaleString("en-us", {
                            dateStyle: "short",
                            timeStyle: "short",
                        }) +
                        " - " +
                        new Date(event.endsAt).toLocaleString("en-us", {
                            dateStyle: "short",
                            timeStyle: "short",
                        })
                    }
                    action={
                        !signedUp ? <Button size="large" startIcon={<AssignmentIcon />} onClick={() => signUp()}>
                            Sign Up
                        </Button> : <Button size="large" startIcon={<AssignmentIcon />} onClick={() => signOff()} variant="outlined">
                            Cancel Registration
                        </Button>
                    }
                />
                <CardContent>
                    <Typography variant="body1">{description}</Typography>
                </CardContent>
            </Card>
        </ListItem>
    );
}

// this utilizes the eventlist item and is then used in the eventlist component
function EventListComponent(props: {}) {
    // pulling data from api
    const { isLoading, error, data, dataUpdatedAt } = useQuery<EventListResponse>(
        ["events"],
        () => fetch("/api/events").then((res) => res.json())
    );
    const { events } = data || { events: [] };
    // using the alert from the alert componenent
    const alert = useAlert();
    // alert for alerting the users how many events are loaded
    useEffect(() => {
        if (isLoading) return;
        alert.success({
            message: "Loaded " + events.length + " Events",
            unique: 'events-loaded',
            duration: 2000,
        });
    }, [isLoading]);
    const firstLoad = useRef(true);
    if (isLoading) return <Box sx={{ margin: 'auto', width: 'min(400px, 80vw)', textAlign: 'center' }}>
        <CircularProgress style={{ textAlign: 'center', marginTop: 25, fontSize: 40 }} />
    </Box>;
    // List of events
    return (
        <>
            <List>
                {events.map(({ id }) => (
                    <EventListItem key={id} event={id} />
                ))}
            </List>
        </>
    );
}
// The event list to export utilizing all of the componenets above to show all of the events in the database
export function EventList(props: Parameters<typeof EventListComponent>[0]) {
    return (
        <QueryClientProvider client={queryClient}>
            <EventListComponent {...props} />
        </QueryClientProvider>
    );
}
