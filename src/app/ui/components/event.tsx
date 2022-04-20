import { Button, Card, CardActions, CardContent, CardHeader, CircularProgress, List, ListItem, Typography, Box } from "@mui/material";
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from "react-query";
import { useAlert } from "./alert";
import { useCallback, useEffect, useRef, useState } from "react";
import AssignmentIcon from "@mui/icons-material/AssignmentOutlined";
import type { EventResponse } from "api/events/[id]";
import type { EventListResponse } from "api/events";
import { isAuthenticated } from 'lib/auth/client';
import { useRouter } from "next/router";

const queryClient = new QueryClient();


// Event List Item
// Shows a single event
export function EventListItem(props: { event: string }) {
    const alert = useAlert();
    const router = useRouter();
    const queryClient = useQueryClient();

    // pulling data from api
    const { isLoading, error, data } = useQuery<EventResponse>(
        ["event", props.event],
        () =>
            fetch("/api/events/" + props.event).then((res) =>
                res.json()
            )
    );

    // loading conditional
    const { event } = data || {};
    const [signedUp, setSignedUp] = useState(false);

    // Assign state when data finishes loading
    useEffect(() => {
        if (!isLoading) setSignedUp(event?.rsvp);
    }, [isLoading, data]);

    // Register for event
    const signUp = useCallback(() => {
        if (!isAuthenticated()) router.push('/register');
        fetch('/api/events/' + event?.id + '/rsvp', {
            method: 'POST'
        }).then(async (res) => {
            if (!res.ok) throw (await res.json())?.error;
            // Show success message
            alert.success('Signed Up for ' + event?.title, { unique: 'event-register' });
            // Trigger refetch for event listings
            queryClient.invalidateQueries(['event', props.event]);
            queryClient.invalidateQueries('events');

            setSignedUp(true);
        }).catch(err => {
            // Show error
            alert.error('Unable to register for event');
            console.error('event.signup', err);
        })
    }, [event])

    // Cancel event registration
    const signOff = useCallback(() => {
        fetch('/api/events/' + event?.id + '/rsvp', {
            method: 'DELETE'
        }).then(async (res) => {
            if (!res.ok) throw (await res.json())?.error;
            // Show success message

            alert.success('Cancelled registration for ' + event?.title, { unique: 'event-register' });

            // Trigger refetch for event listings
            queryClient.invalidateQueries(['event', props.event]);
            queryClient.invalidateQueries('events');

            setSignedUp(false);
        }).catch(err => {
            // Show error
            alert.error('Unable to cancel registration for event');
            console.error('event.signoff', err);
        })
    }, [event]);

    // Return empty item if loading or event is nonexistant.
    if (isLoading || !event) return <ListItem dense />;


    const { title, description, startsAt, endsAt, type } = event || {};

    return (
        <ListItem disablePadding sx={{ mb: 2 }}>
            <Card sx={{ width: '100%' }}>
                <CardHeader
                    title={title + (type ? " - " + type : '')}
                    subheader={
                        new Date(startsAt).toLocaleString("en-us", {
                            dateStyle: "short",
                            timeStyle: "short",
                        }) +
                        " - " +
                        new Date(endsAt).toLocaleString("en-us", {
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

// Event List
function EventListComponent(props: {}) {
    const alert = useAlert();

    // pulling data from api
    const { isLoading, error, data, dataUpdatedAt } = useQuery<EventListResponse>(
        ["events"],
        () => fetch("/api/events").then((res) => res.json())
    );

    const { events } = data || { events: [] };

    // show success when events finish loading
    useEffect(() => {
        if (isLoading) return;
        alert.success({
            message: "Loaded " + events.length + " Events",
            unique: 'events-loaded',
            duration: 2000,
        });
    }, [isLoading]);

    // return loading spinner while loading
    if (isLoading) return <Box sx={{ margin: 'auto', width: 'min(400px, 80vw)', textAlign: 'center' }}>
        <CircularProgress style={{ textAlign: 'center', marginTop: 25, fontSize: 40 }} />
    </Box>;

    return <List>
        {events.map(({ id }) => (
            <EventListItem key={id} event={id} />
        ))}
    </List>
}

// Events List Wrapper to provide the query client
export function EventList(props: Parameters<typeof EventListComponent>[0]) {
    return (
        <QueryClientProvider client={queryClient}>
            <EventListComponent {...props} />
        </QueryClientProvider>
    );
}
