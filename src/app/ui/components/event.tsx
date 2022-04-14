import { ExpandMore } from "@mui/icons-material";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Collapse,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography,
} from "@mui/material";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { useAlert } from "./alert";
import { useEffect, useRef } from "react";
import AssignmentIcon from "@mui/icons-material/AssignmentOutlined";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import type { EventResponse } from "api/events/[id]";
import type { EventListResponse } from "api/events";

const queryClient = new QueryClient();


// Event list item that is utilized in the eventlist component
export function EventListItem(props: { event: string }) {
    // pulling data from api
    const { isLoading, error, data } = useQuery<EventResponse>(
        ["event", props.event],
        () =>
            fetch("http://localhost:5000/api/events/" + props.event).then((res) =>
                res.json()
            )
    );
    // initializing data
    const { event } = data || {};
    if (isLoading) return <ListItem disablePadding />;
    // destructering the event object
    const { title, description, startsAt, endsAt, type } = event;
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
                        <Button size="large" startIcon={<AssignmentIcon />}>
                            Sign Up
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
        () => fetch("http://localhost:5000/api/events").then((res) => res.json())
    );
    const { events } = data || { events: [] };
    // using the alert from the alert componenent
    const alert = useAlert();
    // alert for alerting the users how many events are loaded
    useEffect(() => {
        if (isLoading) return;
        alert.success({
            message: "Loaded " + events.length + " Events",
        });
    }, [isLoading]);
    const firstLoad = useRef(true);
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
