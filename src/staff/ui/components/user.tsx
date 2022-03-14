import { Button, Card, CardActions, CardContent, CardHeader, CardProps, Checkbox, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Box, Select, MenuItem, Grid } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TodayIcon from '@mui/icons-material/Today';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { useState, useMemo } from "react";
import type { UserData } from "lib/mongo/schema/user";


function UserCard(props: {
    id: string;
} & CardProps) {
    const { id, ...cardProps } = props;
    const [mode, setMode] = useState<'view' | 'edit'>('view');
    const user: UserData = useMemo(() => ({
        email: "cseitz5@kent.edu",
        role: 'pending',
        password: '',
        username: 'cseitz',
        info: {
            firstName: 'Chris',
            lastName: ' Seitz'
        },
        created: new Date('2022-03-10T19:17:40.571+00:00'),
        updated: new Date('2022-03-10T19:17:40.571+00:00'),

    }), []);
    const hasName = Boolean(user?.info?.firstName?.trim() && user?.info?.lastName?.trim());
    const hasEmail = Boolean(user?.email.trim());
    return <Card {...cardProps}>
        <CardHeader {...{
            title: <Box component="span" sx={{ color: !hasName && 'error.main' }}>
                {hasName ? [user.info.firstName, user.info.lastName].map(o => o.trim()).join(' ') : 'Missing Name'}
            </Box>,
            subheader: <Box component="span" sx={{ color: !hasEmail && 'error.main' }}>
                {hasEmail ? user.email : 'No Email'}
            </Box>
        }} action={<IconButton>
            <MoreVertIcon />
        </IconButton>} />
        <CardContent>
            <Typography variant="h6">Details</Typography>
            <Grid container columns={12} spacing={2}>
                <Grid item xs={6}>
                    <Typography>what</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography>test</Typography>
                </Grid>
            </Grid>
            <List subheader={"Details"} dense>
                <ListItem>
                    <ListItemIcon>
                        <TodayIcon />
                    </ListItemIcon>
                    <ListItemText primary="Registered" secondary={(user.created as Date).toLocaleString('en-us', {
                        dateStyle: 'short',
                        timeStyle: 'short'
                    })} />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <ScheduleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Updated" secondary={(user.updated as Date).toLocaleString('en-us', {
                        dateStyle: 'short',
                        timeStyle: 'short'
                    })} />
                </ListItem>
            </List>
            <Select value={user.role} onChange={({ target }) => { user.role = target.value as any; }}>
                <MenuItem value={'pending'}>Pending</MenuItem>
                <MenuItem value={'banned'}>Banned</MenuItem>
                <MenuItem value={'user'}>User</MenuItem>
                <MenuItem value={'staff'}>Staff</MenuItem>
                <MenuItem value={'admin'}>Admin</MenuItem>
            </Select>
        </CardContent>
        <CardActions>
            <Button>what</Button>
        </CardActions>
    </Card>
}


function UserListItem() {

    return <ListItem secondaryAction={<Checkbox edge="start" />} disablePadding>
        <ListItemButton dense>
            <ListItemText {...{
                primary: 'Chris Seitz',
                secondary: <>
                    <Typography>woah there</Typography>
                    yeah
                </>
            }} />
        </ListItemButton>
    </ListItem>
}

export function UserList() {
    return <>
        <UserCard id={'622a4ed4b1840f349170d578'} />
        <List>
            <UserListItem />
        </List>
    </>
}