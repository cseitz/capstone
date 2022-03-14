import { Button, Card, CardActions, CardContent, CardHeader, CardProps, Checkbox, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
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
            lastName: 'Seitz'
        },
        created: new Date('2022-03-10T19:17:40.571+00:00'),
        updated: new Date('2022-03-10T19:17:40.571+00:00'),

    };
    return <Card {...cardProps}>
        <CardHeader title={"Chris Seitz"} subheader={"cseitz5@kent.edu"} action={<IconButton>
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