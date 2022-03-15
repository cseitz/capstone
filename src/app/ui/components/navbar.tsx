import { useEffect, useRef, useState } from 'react';
import { AppBar, Button, IconButton, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Box from '@mui/material/Box';
import Link from 'next/link'
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useRouter } from 'next/router';
import { isAuthenticated } from 'lib/auth/client';

const items: {
    name: string;
    url: string;
    icon: any;
    placement?: 'left' | 'right';
    visible?: (section?: 'navbar' | 'drawer') => boolean;
}[] = [
    {
        name: "Home",
        url: "/",
        icon: <HomeIcon />
    },
    {
        name: "FAQ",
        url: "/#faq",
        icon: <LiveHelpIcon />
    },
    {
        name: "Login",
        url: "/login",
        placement: 'right',
        icon: <LoginIcon />,
        visible() {
            return !Boolean(isAuthenticated())
        }
    },
    {
        name: "Register",
        url: "/Register",
        placement: 'right',
        icon: <HowToRegIcon />,
        visible() {
            return false
        }
    },
    {
        name: "Logout",
        url: "/logout",
        placement: 'right',
        icon: <ExitToAppIcon />,
        visible() {
            return Boolean(isAuthenticated());
        }
    },
]

export function NavBar() {
    const [open, setOpen] = useState(false)
    const [anchor, setAnchor] = useState('left');
    const router = useRouter();
    const lastRoute = useRef("");
    useEffect(() => {
        if (lastRoute.current != router.route) {
            lastRoute.current = router.route;
            if (open) {
                setOpen(false);
            }
        }
    }, [router.route, open, setOpen]);

    const handleDrawer = () => {
        setOpen(true)
    }

    const navbarLinks = items.filter(o => !o?.visible || o?.visible('navbar')).map((x) =>
        <Link href={x.url} key={x.url}>
            <Button color='inherit'>
                {x.name}
            </Button>
        </Link>
    );


    const drawerLinks = items.filter(o => !o?.visible || o?.visible('drawer')).map((x) =>
        <Link href={x.url} key={x.url}>
            <ListItem button>
                <ListItemIcon>
                    {x.icon}
                </ListItemIcon>
                <ListItemText primary={x.name} />
            </ListItem>
        </Link>
    );

    return (
        <div>
            <AppBar position="sticky" style={{ backgroundColor: "black", color: "white", boxShadow: "0px 0px 0px 0px" }}>
                <Toolbar>
                    <IconButton
                        onClick={handleDrawer}
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />

                    </IconButton>
                    <Typography variant="h6" style={{ flexGrow: 2 }}>
                        Hello There Welcome
                    </Typography>

                    {navbarLinks}

                </Toolbar>
            </AppBar>

            <Drawer
                anchor='left'
                open={open}
                onClose={() => setOpen(false)}
            >
                <Box
                    sx={{ p: 5 }}>

                    <h3> Welcome</h3>
                    <List>
                        {drawerLinks}
                    </List>
                </Box>

            </Drawer>


        </div>
    );
}