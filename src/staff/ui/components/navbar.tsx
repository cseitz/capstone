import { useEffect, useRef, useState } from 'react';
import { AppBar, Button, IconButton, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Slide, useScrollTrigger, useMediaQuery } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Box from '@mui/material/Box';
import Link from 'next/link'
import HomeIcon from '@mui/icons-material/Home';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import LoginIcon from '@mui/icons-material/Login';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useRouter } from 'next/router';
import { EventNote } from '@mui/icons-material';

const title = 'Staff Portal';
const items: {
    name: string;
    url: string;
    icon: any;
    showIcon?: 'left' | 'right';
    placement?: 'left' | 'right';
    visible?: (section?: 'navbar' | 'drawer') => boolean;
}[] = [
        {
            name: "Home",
            url: "/",
            icon: <HomeIcon />
        },
        {

            name: "Events",
            url: "/events",
            icon: <EventNote />,
        },
        {
            name: "Tickets",
            url: "/tickets",
            icon:<ContactSupportIcon />
        }, 
        {
       
            name: "Exports",
            url: "/api/exports/users",
            icon: <HomeIcon />
        },
        {
            name: "Logout",
            url: "/logout",
            placement: 'right',
            icon: <ExitToAppIcon />,
            showIcon: 'right',
        },
        {
            name: "Audit Log Exports",
            url: "/api/exports/logs",
            icon: <HomeIcon />
        },
    ];


function HideOnScroll(props: {
    window?: () => Window;
    children: React.ReactElement;
}) {
    const { children, window } = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({
        target: window ? window() : undefined,
    });

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

export function NavBar() {
    const [open, setOpen] = useState(false);
    const [visible, setVisible] = useState(true);
    const [anchor, setAnchor] = useState('left');
    const router = useRouter();
    const lastRoute = useRef("");
    useEffect(() => {
        setVisible(router.route != '/login');
        if (lastRoute.current != router.route) {
            lastRoute.current = router.route;
            if (open) {
                setOpen(false);
            }
        }
    }, [router.route, open, setOpen]);
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

    const navbarLinksLeft = items.filter(o => !o?.visible || o?.visible('navbar')).filter(o => o?.placement != 'right').map((x) =>
        <Link href={x.url} key={x.url}>
            <Button color='inherit' startIcon={x.showIcon == 'left' && x.icon} endIcon={x.showIcon == 'right' && x.icon}>
                {x.name}
            </Button>
        </Link>
    );

    const navbarLinksRight = items.filter(o => !o?.visible || o?.visible('navbar')).filter(o => o?.placement == 'right').map((x) =>
        <Link href={x.url} key={x.url}>
            <Button color='inherit' startIcon={x.showIcon == 'left' && x.icon} endIcon={x.showIcon == 'right' && x.icon}>
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

    const isMobile = useMediaQuery('(max-width:600px)');
    return visible && <>
        <HideOnScroll>
            <AppBar position="sticky" style={{ boxShadow: "0px 0px 0px 0px" }}>
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
                    <Box style={{ flexGrow: 2 }}>
                        {title && <Typography variant="h6" component="span" sx={{ verticalAlign: 'middle', mr: 2 }}>{title}</Typography>}
                        {!isMobile && navbarLinksLeft}
                    </Box>

                    {navbarLinksRight}

                </Toolbar>
            </AppBar>
        </HideOnScroll>

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



    </>;
}