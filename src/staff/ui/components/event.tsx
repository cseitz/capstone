import { Box, Card, CardHeader, CardActions, CardProps, Checkbox, IconButton, List, ListItem, ListItemButton, ListItemText, Modal, Typography, CardContent, Button, ListItemIcon, TextField, Grid, Tooltip, Divider } from "@mui/material";
import { EventListResponse } from "pages/api/events";
import { EventResponse } from "pages/api/events/[id]";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from "react-query";
import { useAlert } from "./alert";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TodayIcon from '@mui/icons-material/Today';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PeopleIcon from '@mui/icons-material/People';
import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import type { EventData } from "lib/mongo/schema/event";

export function EventCard(props: {
    event: string;
    exit?: () => void;
} & CardProps) {
    const { event: id, exit = () => { }, ...cardProps } = props;
    const isCreate = id == 'create';
    const [mode, setMode] = useState<'view' | 'edit'>(isCreate ? 'edit' : 'view');
    const isEditing = mode == 'edit';
    const isViewing = mode == 'view';
    const { isLoading, error, data } = useQuery<EventResponse>(['event', id], () => {
        if (isCreate) return {};
        return fetch('/api/events/' + id).then(res => res.json())
    });
    const creating: Partial<EventData> = useMemo(() => {
        return {

        }
    }, [])
    const { event } = !isCreate ? (data || {}) : { event: creating };
    const hasType = Boolean(event?.type);
    const alert = useAlert();

    const [paused, setPaused] = useState(false);

    const [title, setTitle] = useState<string>(null);
    const [type, setType] = useState<string>(null);
    const [description, setDescription] = useState<string>(null);
    const [startsAt, setStartsAt] = useState<Date | null>(null);
    const [endsAt, setEndsAt] = useState<Date | null>(null);
    const deps = [title, type, description, startsAt, endsAt];
    const discardChanges = useCallback(function () {
        setTitle(event.title);
        setType(event.type);
        setDescription(event.description);
        setStartsAt(event?.startsAt ? new Date(event?.startsAt) : null);
        setEndsAt(event?.endsAt ? new Date(event?.endsAt) : null);
        setMode('view');
    }, [event]);

    useEffect(() => {
        if (isLoading || isCreate) { return; }
        alert.success({
            message: 'Loaded ' + (event?.title || "[Missing title]"),
            duration: 2000,
        })
        setTitle(event?.title || '');
        setType(event?.type || '');
        setDescription(event?.description || '');
        setStartsAt(event?.startsAt ? new Date(event?.startsAt) : null);
        setEndsAt(event?.endsAt ? new Date(event?.endsAt) : null)
    }, [isLoading]);

    const queryClient = useQueryClient();
    const submitChanges = useCallback(() => {
        setPaused(true);
        fetch('/api/events/' + (isCreate ? 'create' : id), {
            method: isCreate ? 'POST' : 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title || undefined,
                type: type || undefined,
                description: description || undefined,
                startsAt,
                endsAt
            })
        }).then(async (res) => {
            if (!res.ok) throw (await res.json())?.error;
            alert.success(isCreate ? 'Created an event!' : 'Event Updated.');
        }).catch(err => {
            alert.error('Unable to ' + (isCreate ? 'create an event' : 'update this event') + '.');
            console.error('event.submitChanges', err);
        }).finally(() => {
            setPaused(false);
            if (isCreate) {
                exit();
            } else {
                queryClient.invalidateQueries(['event', id]);
                setMode('view');
            }
            queryClient.invalidateQueries('events');
        })
    }, [...deps]);

    const topActions = <>
        {!isCreate && <Tooltip title="Delete" placement="left" disableInteractive>
            <IconButton onClick={() => alert.error('Not Yet Implemented (Delete)', { duration: 1000 })}>
                <DeleteIcon />
            </IconButton>
        </Tooltip>}
        <Tooltip title="Close" placement="left" disableInteractive>
            <IconButton onClick={exit}>
                <CloseIcon />
            </IconButton>
        </Tooltip>
    </>

    // if (isLoading) return <Card {...cardProps} />;
    return <>
        <Card {...cardProps}>

            <CardHeader {...{
                title: !isCreate ? (<Box component="span" sx={{}}>
                    {event?.title} {event?.type && <>
                        - <Typography component="span" sx={{}}>
                            {event?.type}
                        </Typography>
                    </>}
                </Box>) : 'Create Event',
                subheader: !isCreate && <Box component="span" sx={{}}>
                    {new Date(event?.startsAt).toLocaleString('en-us', {
                        dateStyle: 'short',
                        timeStyle: 'short'
                    }) + " - " + new Date(event?.endsAt).toLocaleString('en-us', {
                        dateStyle: 'short',
                        timeStyle: 'short'
                    })}</Box>
            }} action={topActions} />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <CardContent>
                    <Grid container spacing={2}>
                        {isEditing && <>
                            <Grid item xs={8}>
                                <TextField disabled={paused} label="Title" placeholder="Title" fullWidth value={title} onChange={({ target: { value } }) => setTitle(value)} />
                            </Grid>

                            <Grid item xs={4}>
                                <TextField disabled={paused} label="Type" placeholder="Type" fullWidth value={type} onChange={({ target: { value } }) => setType(value)} />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField disabled={paused} label="Description" placeholder="Description" fullWidth multiline minRows={2} value={description} onChange={({ target: { value } }) => setDescription(value)} />
                            </Grid>

                            <Grid item xs={6}>
                                <DateTimePicker disabled={paused} label="Starts" renderInput={(props) => <TextField fullWidth {...props} />} value={startsAt} onChange={val => setStartsAt(val)} />
                            </Grid>

                            <Grid item xs={6}>
                                <DateTimePicker disabled={paused} label="Ends" renderInput={(props) => <TextField fullWidth {...props} />} value={endsAt} onChange={val => setEndsAt(val)} />
                            </Grid>
                        </>}

                        {isViewing && <>
                            <Grid item xs={12}>
                                <Typography variant="body1">
                                    {description || "No Description"}
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>

                            </Grid>

                            <Grid item xs={1}>
                                <Tooltip title="Created" disableInteractive>
                                    <TodayIcon />
                                </Tooltip>
                            </Grid>



                            <Grid item xs={5}>
                                <Tooltip title="Created" disableInteractive>
                                    <Typography component="span">
                                        {new Date(event?.created).toLocaleString('en-us', {
                                            dateStyle: 'short',
                                            timeStyle: 'short'
                                        })}
                                    </Typography>
                                </Tooltip>
                            </Grid>

                            <Grid item xs={1}>
                                <Tooltip title="Updated" disableInteractive>
                                    <ScheduleIcon />
                                </Tooltip>
                            </Grid>
                            <Grid item xs={5}>
                                <Tooltip title="Updated" disableInteractive>
                                    <Typography component="span">
                                        {new Date(event?.updated).toLocaleString('en-us', {
                                            dateStyle: 'short',
                                            timeStyle: 'short'
                                        })}
                                    </Typography>
                                </Tooltip>
                            </Grid>
                        </>}

                    </Grid>

                </CardContent>

            </LocalizationProvider>

            <CardActions sx={{ justifyContent: 'space-between' }}>
                {isViewing && <Button disabled={paused} onClick={() => setMode('edit')}>Edit</Button>}
                {isEditing && !isCreate && <>
                    <Button disabled={paused} onClick={() => submitChanges()}>Save Changes</Button>
                    <Button disabled={paused} onClick={discardChanges}>Discard Changes</Button>
                </>}
                {isEditing && isCreate && <>
                    <Button disabled={paused} onClick={() => submitChanges()}>Create Event</Button>
                    <Button disabled={paused} onClick={exit}>Cancel</Button>
                </>}
            </CardActions>

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
    const hasType = Boolean(event.type);
    return <ListItem disablePadding onClick={() => onClick(event?.id)} sx={{ width: '100%' }}>
        <ListItemButton dense>
            <ListItemText {...{
                primary: <>
                    {title}
                    {event?.type && <Typography component="span" sx={{ color: 'text.disabled', m: 1 }}>-</Typography>}
                    {event?.type && <Typography component="span" sx={{}}>{event.type} </Typography>}
                </>,
                primaryTypographyProps: { fontSize: 15 },
                secondary: <>
                    <Typography component="span" sx={{}}>{new Date(startsAt).toLocaleString('en-us', {
                        dateStyle: 'short',
                        timeStyle: 'short'
                    })} - {new Date(endsAt).toLocaleString('en-us', {
                        dateStyle: 'short',
                        timeStyle: 'short'
                    })} </Typography>
                </>
            }} />
        </ListItemButton>
    </ListItem>
}

const queryClient = new QueryClient();
function EventListComponent(props: { showCreate?: boolean, onClose?: () => void }) {
    const {
        showCreate = false,
        onClose: onCloseListener = () => { }
    } = props;
    const { isLoading, error, data, dataUpdatedAt } = useQuery<EventListResponse>(['events'], () => (
        fetch('/api/events').then(res => res.json())
    ));
    const [open, setOpen] = useState<string>(null);
    useEffect(() => {
        if (showCreate && open != 'create') setOpen('create');
        if (!showCreate && open == 'create') setOpen(null);
    }, [showCreate])
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
    const exit = () => { setOpen(null); onCloseListener() };
    return <>
        <Modal open={Boolean(open)} onClose={exit}>
            <Box sx={{ width: '100vw', maxWidth: 600, mx: 'auto', mt: '10vh' }}>
                {open && <EventCard event={open} exit={exit} />}
            </Box>
        </Modal>
        <List sx={{ width: '100%' }}>
            {events.map(({ id }) => <EventListItem key={id} event={id} onClick={setOpen} />)}
        </List>
    </>
}

export function EventList(props: (Parameters<typeof EventListComponent>)[0]) {
    return <QueryClientProvider client={queryClient}>
        <EventListComponent {...props} />
    </QueryClientProvider>
}