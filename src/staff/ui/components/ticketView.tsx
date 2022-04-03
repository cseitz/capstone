import React, { useRef, useEffect, useState } from 'react'
import { Button, CircularProgress, Card, CardActions, CardContent, CardHeader, CardProps, Checkbox, Grid, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import { useAlert } from 'ui/components/alert';
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import type { TicketListResponse } from "pages/api/tickets";
import type { TicketResponse } from "pages/api/tickets/[id]";


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
    isLoading ? 
   <Box sx={{ margin: 'auto', width: 'min(400px, 80vw)', text_align: 'center', marginTop: 50}}>
        <CircularProgress />
    </Box>
    :
    (tickets.length == 0) ?
    <Box>
       <Card sx={{ margin: 'auto', width: 'min(400px, 80vw)', text_align: 'center'}}>
        No Tickets To Display
        </Card>
    </Box>
    :
    <Box>
    <Grid container spacing={2}>
       <Card sx={{ margin: 'auto', width: 'min(400px, 80vw)', text_align: 'center'}}>
        Ticket Info Here
        </Card>
    </Grid>
    </Box>)
    
}
export function TicketList(props: (Parameters<typeof TicketListComponent>)[0]) {
    return <QueryClientProvider client={queryClient}>
        <TicketListComponent {...props} />
    </QueryClientProvider>
}