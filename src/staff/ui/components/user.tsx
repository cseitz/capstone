import { Button, Card, CardActions, CardContent, CardHeader, CardProps, Checkbox, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Box, Select, MenuItem, Grid, Modal, Tooltip, TextField, InputLabel } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TodayIcon from '@mui/icons-material/Today';
import ScheduleIcon from '@mui/icons-material/Schedule';
import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from "react-query";
import type { UserListResponse } from "pages/api/users";
import type { UserResponse } from "pages/api/users/[id]";
import { useAlert } from "./alert";
import { UserRoles } from "lib/auth/constants";
import { useUser } from "lib/auth/client";
import { usePrompt } from "./prompt";


function UserCard(props: {
    user: string;
    exit?: () => void;
} & CardProps) {
    const client = useUser();
    const { user: id, exit = () => { }, ...cardProps } = props;
    const [paused, setPaused] = useState(false);
    const [mode, setMode] = useState<'view' | 'edit'>('view');
    const isEditing = mode == 'edit';
    const isViewing = mode == 'view';
    const { isLoading, error, data } = useQuery<UserResponse>(['user', id], () => (
        fetch('/api/users/' + id).then(res => res.json())
    ));
    const { user } = data || {};
    if (isLoading) return <Card {...cardProps} />;
    const alert = useAlert();
    useEffect(() => {
        if (!error) {
            alert.success({
                message: 'Loaded User ' + user?.email || "[Missing name]",
                duration: 2000,
            });
        }
        if (error) alert.error('An error occured loading this user.');
    }, [error]);

    const [email, setEmail] = useState<string>(null);
    const [firstName, setFirstName] = useState<string>(null);
    const [lastName, setLastName] = useState<string>(null);
    const [role, setRole] = useState<UserResponse['user']['role']>(null);
    const deps = [email, role, firstName, lastName];
    const initialize = () => {
        setEmail(user?.email);
        setFirstName(user?.info?.firstName);
        setLastName(user?.info?.lastName);
        setRole(user?.role);
    }
    const discardChanges = useCallback(function () {
        initialize();
        setMode('view');
    }, [user]);

    useEffect(() => {
        if (isLoading) return;
        initialize();
    }, [isLoading]);

    const clientRoleIndex = client?.ready ? UserRoles.indexOf(client?.role) : 0;
    const userRoleIndex = role ? UserRoles.indexOf(role) : 0;
    const isAdmin = (clientRoleIndex == UserRoles.length - 1);
    const canEdit = (isAdmin || clientRoleIndex >= userRoleIndex);

    const queryClient = useQueryClient();

    const hasName = Boolean(user?.info?.firstName?.trim() && user?.info?.lastName?.trim());
    const hasEmail = Boolean(user?.email.trim());
    const fullName = hasName ? [user.info.firstName, user.info.lastName].map(o => o.trim()).join(' ') : 'Missing Name';


    const remove = useCallback(() => {
        fetch('/api/users/' + id, {
            method: 'DELETE'
        }).then(async (res) => {
            if (!res.ok) throw (await res.json())?.error;
            alert.success('User Deleted');
        }).catch(err => {
            alert.error('Unable to delete user');
            console.error('user.remove', err);
        }).finally(() => {
            exit();
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey.includes('users'),
            });
        })
    }, [user]);

    const deletePrompt = usePrompt({
        title: `Are you sure you want to delete this user?`,
        content: <Typography>
            This action cannot be undone.
        </Typography>,
        actions: () => <>
            <Button onClick={() => { deletePrompt(false) }}>Cancel</Button>
            <Button onClick={() => { deletePrompt(false); exit(); remove(); }}>Confirm</Button>
        </>
    })
    const DeletePrompt = deletePrompt.Provider;
    const promptRemove = () => deletePrompt(true);

    const submitChanges = useCallback((singleField?: string) => {
        if (!singleField) setPaused(true);
        fetch('/api/users/' + id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email != user?.email && email ? email : undefined,
                role: role != user?.role && role ? role : undefined,
                'info.firstName': firstName != user?.info?.firstName && firstName ? firstName : undefined,
                'info.lastName': lastName != user?.info?.lastName && lastName ? lastName : undefined,
            })
        }).then(async (res) => {
            if (!res.ok) throw (await res.json())?.error;
            alert.success('User Updated', {
                unique: 'update.user',
                duration: 2000
            })
        }).catch(err => {
            alert.error('Unable to update user');
            console.error('user.submitChanges', err);
        }).finally(() => {
            if (singleField) return;
            setPaused(false);
            queryClient.invalidateQueries('users');
            queryClient.invalidateQueries(['user', id]);
            setMode('view');

        })
    }, [...deps]);

    useEffect(() => {
        if (isEditing) return;
        if (!role) return;
        if (role != user?.role) submitChanges('role');
    }, [role]);

    const topActions = <>
        {clientRoleIndex > userRoleIndex && <Tooltip title="Delete" placement="left" disableInteractive>
            <IconButton onClick={() => promptRemove()}>
                <DeleteIcon />
            </IconButton>
        </Tooltip>}
        <Tooltip title="Close" placement="left" disableInteractive>
            <IconButton onClick={exit}>
                <CloseIcon />
            </IconButton>
        </Tooltip>
    </>


    return <>
        <DeletePrompt />
        <Card {...cardProps}>
            <CardHeader {...{
                title: <Box component="span" sx={{ color: !hasName && 'error.main' }}>
                    {fullName}
                </Box>,
                subheader: <Box component="span" sx={{ color: !hasEmail && 'error.main' }}>
                    {hasEmail ? user.email : 'No Email'}
                </Box>
            }} action={topActions} />
            <CardContent>
                <Grid container spacing={2}>
                    {isEditing && <>
                        <Grid item xs={12}>
                            <TextField disabled={paused} label="Email" placeholder="Email" fullWidth value={email} onChange={({ target: { value } }) => setEmail(value)} />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField disabled={paused} label="First Name" placeholder="First Name" fullWidth value={firstName} onChange={({ target: { value } }) => setFirstName(value)} />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField disabled={paused} label="Last Name" placeholder="Last Name" fullWidth value={lastName} onChange={({ target: { value } }) => setLastName(value)} />
                        </Grid>
                    </>}

                    {isViewing && <>

                        <Grid item xs={1}>
                            <Tooltip title="Created" disableInteractive>
                                <TodayIcon />
                            </Tooltip>
                        </Grid>



                        <Grid item xs={5}>
                            <Tooltip title="Created" disableInteractive>
                                <Typography component="span">
                                    {new Date(user?.created).toLocaleString('en-us', {
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
                                    {new Date(user?.updated).toLocaleString('en-us', {
                                        dateStyle: 'short',
                                        timeStyle: 'short'
                                    })}
                                </Typography>
                            </Tooltip>
                        </Grid>
                    </>}

                    <Grid item xs={6}>
                        <InputLabel sx={{ mb: 1 }}>Role</InputLabel>
                        <Select disabled={paused || (!isAdmin && clientRoleIndex <= userRoleIndex) || client.id == user.id} fullWidth value={role} onChange={({ target }) => { setRole(target.value as any); }}>
                            {UserRoles.filter((val, key) => isAdmin || key < clientRoleIndex || key == userRoleIndex).map((val, key) => (
                                <MenuItem value={val} key={val}>{val[0].toUpperCase() + val.slice(1)}</MenuItem>
                            ))}
                        </Select>
                    </Grid>

                </Grid>

            </CardContent>
            <CardActions sx={{ justifyContent: 'space-between' }}>
                {isViewing && canEdit && <Button disabled={paused} onClick={() => setMode('edit')}>Edit</Button>}
                {isEditing && <>
                    <Button disabled={paused} onClick={() => submitChanges()}>Save Changes</Button>
                    <Button disabled={paused} onClick={() => discardChanges()}>Discard Changes</Button>
                </>}
            </CardActions>
        </Card>
    </>
}


export function UserListItem(props: { user: string, onClick?: (user: string) => void, action?: any }) {
    const { onClick = (user: string) => { }, action = '' } = props;
    const { isLoading, error, data } = useQuery<UserResponse>(['user', props.user], () => (
        fetch('/api/users/' + props.user).then(res => res.json())
    ));
    const { user } = data || {};
    if (isLoading) return <ListItem disablePadding />;
    const hasName = Boolean(user?.info?.firstName?.trim() && user?.info?.lastName?.trim());
    const hasEmail = Boolean(user?.email.trim());
    const name = !hasName ? 'Missing Name' : user.info.firstName + ' ' + user.info.lastName;
    const email = !hasEmail ? 'No Email' : user.email;
    return <ListItem secondaryAction={action} disablePadding onClick={() => onClick(user?.id)}>
        <ListItemButton dense>
            <ListItemText {...{
                primary: <>
                    {name}
                    <Typography component="span" sx={{ color: 'text.disabled', m: 1 }}>-</Typography>
                    <Typography component="span" sx={{ color: hasEmail ? 'text.secondary' : 'error.main' }}>{email}</Typography>
                </>,
                primaryTypographyProps: { color: !hasName && 'error.main', fontSize: 15 },
                secondary: <>
                    <Typography component="span">Registered on {new Date(user?.created).toLocaleString('en-us', {
                        dateStyle: 'short',
                        timeStyle: 'short'
                    })}</Typography>
                </>,
            }} />
        </ListItemButton>
    </ListItem>
}

const queryClient = new QueryClient();
function UserListComponent(props: { showCount?: boolean }) {
    const {
        showCount = false,
    } = props;
    const { isLoading, error, data, dataUpdatedAt } = useQuery<UserListResponse>(['users'], () => (
        fetch('/api/users').then(res => res.json())
    ));
    const [open, setOpen] = useState<string>(null)
    const { users } = data || { users: [] };
    const alert = useAlert();
    useEffect(() => {
        if (isLoading) return;
        alert.success({
            message: 'Loaded ' + users.length + ' Users',
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
    }, [dataUpdatedAt]);
    const exit = () => { setOpen(null); };
    return <>
        <Modal open={Boolean(open)} onClose={() => setOpen(null)}>
            <Box sx={{ width: '100vw', maxWidth: 600, mx: 'auto', mt: '10vh' }}>
                {open && <UserCard user={open} exit={exit} />}
            </Box>
        </Modal>
        {showCount && !isLoading && <Typography color="text.secondary">
            Showing {users.length} users.
        </Typography>}
        <List>
            {users.map(({ id }) => <UserListItem key={id} user={id} onClick={setOpen} />)}
        </List>
    </>
}

export function UserList(props: (Parameters<typeof UserListComponent>)[0]) {
    return <QueryClientProvider client={queryClient}>
        <UserListComponent {...props} />
    </QueryClientProvider>
}