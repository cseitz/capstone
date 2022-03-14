import { Button, Card, CardActions, CardContent, CardHeader, CardProps, Checkbox, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Box } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from "react";
import type { UserData } from "lib/mongo/schema/user";


function UserCard(props: {
    id: string;
} & CardProps) {
    const { id, ...cardProps } = props;
    const [mode, setMode] = useState<'view' | 'edit'>('view');
    const user: UserData = {
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

    };
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
            hi there
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