import React, { useRef, useEffect, useState } from 'react'
import { Modal, Button, CircularProgress, List, ListItem, MenuItem, ListItemButton, Select, ListItemText, Card, CardActions, CardContent, CardHeader, CardProps, Checkbox, Grid, IconButton, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { useAlert } from 'ui/components/alert';
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import type { TicketListResponse } from "pages/api/tickets";
import type { TicketResponse } from "pages/api/tickets/[id]";

function TicketCard(props: {
    ticket: string;
} & CardProps) {
    const { ticket: id, ...cardProps } = props;
    const [mode, setMode] = useState<'view' | 'edit'>('view');
    const { isLoading, error, data } = useQuery<TicketResponse>(['ticket', id], () => (
        fetch('/api/tickets/' + id).then(res => res.json())
    ));
    const { ticket } = data || {};
    if (isLoading) return <Card {...cardProps} />;
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
            <Typography>Subject: {hasSubject ? ticket.subject : 'No Subject'}</Typography>
            <Typography>Message: {hasMessage ? ticket.message : 'No Message'}</Typography>
            <List subheader={"Details"} dense>
                <ListItem>
                    <ListItemText primary="Created" secondary={new Date(ticket.created).toLocaleString('en-us', {
                        dateStyle: 'short',
                        timeStyle: 'short'
                    })} />
                </ListItem>
                <ListItem>

                    <ListItemText primary="Updated" secondary={new Date(ticket.updated).toLocaleString('en-us', {
                        dateStyle: 'short',
                        timeStyle: 'short'
                    })} />
                </ListItem>
            </List>
            <Select value={ticket.status} onChange={({ target }) => { ticket.status = target.value as any; }}>
                <MenuItem value={'closed'}>Closed</MenuItem>
                <MenuItem value={'open'}>Open</MenuItem>
                <MenuItem value={'assigned'}>Assigned</MenuItem>
            </Select>
        </CardContent>

    </Card>
}
function TicketListItem(props: { ticket: string, onClick?: (ticket: string) => void }) {
    const { onClick = (ticket: string) => { }, } = props;
    const { isLoading, error, data } = useQuery<TicketResponse>(['ticket', props.ticket], () => (
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
    return <Card sx={{ margin: 'auto', width: 'min(300px, 80vw)', marginBottom: '15px' }} onClick={() => onClick(ticket?.id)}>
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
const queryClient = new QueryClient();
function TicketListComponent(props: {}) {
    const [errors, setErrors] = useState<{ [key: string]: string }>(null);
    const [status, setStatus] = useState<string>(null);
    const [submitting, setSubmitting] = useState(false);
    const [doneSubmitting, setDoneSubmitting] = useState(false);
    const { isLoading, error, data, dataUpdatedAt } = useQuery<TicketListResponse>(['users'], () => (
        fetch('/api/tickets').then(res => res.json())
    ));
    const [open, setOpen] = useState<string>(null)
    const { tickets } = data || { tickets: [] };
    const alert = useAlert();
    useEffect(() => {
        if (isLoading) return;
        alert.success({
            message: 'Loaded ' + tickets.length + ' Tickets',
        })
    }, [isLoading]);
    const firstLoad = useRef(true);
    useEffect(() => {
        if (isLoading) return;
        if (!firstLoad.current)
            alert.info({
                message: 'Refreshed at ' + new Date(dataUpdatedAt).toLocaleTimeString('en-us', { timeStyle: 'medium' }),
                duration: 1500,
                unique: 'userListRefreshedAt'
            });
        firstLoad.current = false;
    }, [dataUpdatedAt])
    return (
        isLoading ? (
            <Box sx={{ margin: 'auto', width: 'min(400px, 80vw)', text_align: 'center', marginTop: 50 }}>
                <CircularProgress />
            </Box>
        ) : (tickets.length == 0 ? (
            <Box>
                <Card sx={{ margin: 'auto', width: 'min(400px, 80vw)', text_align: 'center' }}>
                    No Tickets To Display
                </Card>
            </Box>
        ) : (
            < Box >
                <Modal open={Boolean(open)} onClose={() => setOpen(null)}>
                    <Box sx={{ width: '100vw', maxWidth: 600, mx: 'auto', mt: '10vh' }}>
                        {open && <TicketCard ticket={open} />}
                    </Box>
                </Modal>
                <Grid container spacing={2}>
                    {tickets.map(({ id }) => <TicketListItem key={id} ticket={id} onClick={setOpen} />)}
                </Grid>
            </Box >
        ))
    )
}
export function TicketList(props: (Parameters<typeof TicketListComponent>)[0]) {
    return <QueryClientProvider client={queryClient}>
        <TicketListComponent {...props} />
    </QueryClientProvider>
}