import React, { useRef, useEffect, useState } from 'react'
import { Modal, Button, CircularProgress, List, ListItem, MenuItem, ListItemButton, Select, ListItemText, Card, CardActions, CardContent, CardHeader, CardProps, Checkbox, Grid, IconButton, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { useAlert } from 'ui/components/alert';
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import type { TicketListResponse } from "pages/api/tickets";
import type { TicketResponse } from "pages/api/tickets/[id]";
import { TicketData } from 'lib/mongo/schema/ticket';

const queryClient = new QueryClient();

function TicketCard(props: {
    ticket: string;
} & CardProps) {
    const { ticket: id, ...cardProps } = props;
    const [mode, setMode] = useState<'view' | 'edit'>('view');
    const { isLoading, error, data } = useQuery<TicketResponse>(['ticket', id], () => (
        fetch('/api/tickets/' + id).then(res => res.json())
    ));
    const { ticket } = data || {};
    const alert = useAlert();
    useEffect(() => {
        alert.success({
            message: 'Loaded Ticket ' + ticket?.email || "[Missing name]",
            duration: 2000,
        })
    }, []);
    const hasName = Boolean(ticket?.name?.trim());
    const hasEmail = Boolean(ticket?.email.trim());
    const hasSubject = Boolean(ticket?.subject.trim());
    const hasMessage = Boolean(ticket?.message.trim());

    const [status, setStatus] = useState<TicketData['status']>(null);
    useEffect(() => {
        if (isLoading) return;
        setStatus(ticket.status);
    }, [isLoading]);

    useEffect(() => {
        if (isLoading) return;
        if (!status) return;
        if (ticket.status == status) return;
        console.log('gotta update ticket');
        const originalStatus = ticket.status;
        fetch('/api/tickets/' + id, {
            method: 'PATCH',
            headers: {
                'x-audit-action': 'Updated Status to ' + status[0].toUpperCase() + status.substr(1),
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                status,
            })
        }).then(async (res) => {
            if (!res.ok) throw (await res.json())?.error;
            alert.success({
                message: 'Updated Ticket',
                duration: 2000,
            })
            setTimeout(() => {
                queryClient.refetchQueries({ queryKey: 'tickets' })
            }, 2000)
        }).catch(err => {
            alert.error({
                message: 'Failed to update Ticket',
            })
        })
    }, [status])

    return <Card {...cardProps}>
        <CardHeader {...{
            title: <Box component="span" sx={{ color: !hasName && 'error.main' }}>
                {hasName ? [ticket.name].map(o => o.trim()).join(' ') : 'Missing Name'}
            </Box>,
            subheader: <Box component="span" sx={{ color: !hasEmail && 'error.main' }}>
                {hasEmail ? ticket.email : 'No Email'}

            </Box>
        }} action={<IconButton>
            <MoreVertIcon />
        </IconButton>} />
        <CardContent>
            <Typography variant="h6">Details</Typography>
            <Typography>Subject: {hasSubject ? ticket?.subject : 'No Subject'}</Typography>
            <Typography>Message: {hasMessage ? ticket?.message : 'No Message'}</Typography>
            <List subheader={"Details"} dense>
                <ListItem>
                    <ListItemText primary="Created" secondary={new Date(ticket?.created).toLocaleString('en-us', {
                        dateStyle: 'short',
                        timeStyle: 'short'
                    })} />
                </ListItem>
                <ListItem>

                    <ListItemText primary="Updated" secondary={new Date(ticket?.updated).toLocaleString('en-us', {
                        dateStyle: 'short',
                        timeStyle: 'short'
                    })} />
                </ListItem>
            </List>
            <Select value={status} onChange={({ target }) => { setStatus(target.value as any) }}>
                <MenuItem value={'closed'}>Closed</MenuItem>
                <MenuItem value={'open'}>Open</MenuItem>
                <MenuItem value={'assigned'}>Assigned</MenuItem>
            </Select>
        </CardContent>

    </Card>
}
function TicketListItem(props: { ticket: string, onClick?: (ticket: string) => void }) {
    const { onClick = (ticket: string) => { }, } = props;
    const { isLoading, error, data } = useQuery<TicketResponse>(['tickets', props.ticket], () => (
        fetch('/api/tickets/' + props.ticket).then(res => res.json())
    ));
    const { ticket } = data || {};
    if (isLoading) return <ListItem disablePadding />;
    const hasName = Boolean(ticket?.name?.trim());
    const hasEmail = Boolean(ticket?.email.trim());
    const hasSubject = Boolean(ticket?.subject.trim());
    const name = !hasName ? 'Missing Name' : ticket.name;
    const email = !hasEmail ? 'No Email' : ticket.email;
    const subject = !hasSubject ? 'No Subject' : ticket.subject;
    return <Card sx={{ margin: 'auto', width: 'min(300px, 80vw)' }} onClick={() => onClick(ticket?.id)}>
        <ListItemButton dense>
            <ListItemText {...{
                primary: <>
                    {name}
                    <Typography component="span" sx={{ color: 'text.disabled', m: 1 }}>-</Typography>
                    <Typography component="span" sx={{ color: hasEmail ? 'text.secondary' : 'error.main' }}>{email}</Typography>
                    <Typography sx={{ color: hasSubject ? 'text.secondary' : 'error.main' }}>{subject}</Typography>
                </>,
                primaryTypographyProps: { color: !hasName && 'error.main', fontSize: 15 },
                secondary: <>
                    <Typography component="span">Created on {new Date(ticket.created).toLocaleString('en-us', {
                        dateStyle: 'short',
                        timeStyle: 'short'
                    })}</Typography>
                </>,
            }} />
        </ListItemButton>
    </Card>
}

function TicketListComponent(props: { filter?: any, setCount?: any }) {
    const query = new URLSearchParams(props.filter || {}).toString();
    const { isLoading, error, data, dataUpdatedAt } = useQuery<TicketListResponse>(['tickets', query], () => (
        fetch('/api/tickets?' + query).then(res => res.json())
    ));
    const [open, setOpen] = useState<string>(null)
    const { tickets } = data || { tickets: [] };
    if (props.setCount) props.setCount(tickets.length);
    const alert = useAlert();
    useEffect(() => {
        if (isLoading) return;
        alert.success({
            message: 'Loaded ' + tickets.length + ' Tickets',
            duration: 2000,
            unique: 'ticketsLoaded'
        })
    }, [isLoading]);
    const firstLoad = useRef(true);
    useEffect(() => {
        if (isLoading) return;
        if (!firstLoad.current)
            alert.info({
                message: 'Refreshed at ' + new Date(dataUpdatedAt).toLocaleTimeString('en-us', { timeStyle: 'medium' }),
                duration: 1500,
                unique: 'ticketListRefreshedAt'
            });
        firstLoad.current = false;
    }, [dataUpdatedAt])
    if (isLoading) return <>
        <Box sx={{ margin: 'auto', width: 'min(400px, 80vw)', textAlign: 'center', mt: '30vh' }}>
            <CircularProgress size={50} />
        </Box>
    </>;
    if (tickets.length == 0) return <>
        <Typography variant="h5" sx={{ textAlign: 'center', mt: 10 }}>No Tickets</Typography>
    </>;

    return <>
        <Box>
            <Modal open={Boolean(open)} onClose={() => setOpen(null)}>
                <Box sx={{ width: '100vw', maxWidth: 600, mx: 'auto', mt: '10vh' }}>
                    {open && <TicketCard ticket={open} />}
                </Box>
            </Modal>
            <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
                {tickets.map(({ id }) => <Grid item key={id}>
                    <TicketListItem ticket={id} onClick={setOpen} />
                </Grid>)}
            </Grid>
        </Box>
    </>
}
export function TicketList(props: (Parameters<typeof TicketListComponent>)[0]) {
    return <QueryClientProvider client={queryClient}>
        <TicketListComponent {...props} />
    </QueryClientProvider>
}