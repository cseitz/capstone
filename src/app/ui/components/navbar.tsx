import { useEffect, useRef, useState } from 'react';
import { AppBar, Button, IconButton, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Slide, useScrollTrigger, useMediaQuery, Divider } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Box from '@mui/material/Box';
import Link from 'next/link'
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useRouter } from 'next/router';
import { isAuthenticated } from 'lib/auth/client';
import { EventNote } from '@mui/icons-material';

const title = 'Website Title';
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
            name: "FAQ",
            url: "/#faq",
            icon: <LiveHelpIcon />
        },
        {
            name: "Events",
            url: "/events",
            icon: <EventNote />,
        },
        {
            name: "Contact",
            url: "/contact",
            icon: <ContactSupportIcon />
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
            showIcon: 'right',
            icon: <ExitToAppIcon />,
            visible() {
                return Boolean(isAuthenticated());
            }
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

    const styles = {
        button: {
            px: 2,
            mx: 0.5
        },
        drawer: {
            width: '100%',
            pl: 8
        }
    }

    const navbarLinksLeft = items.filter(o => !o?.visible || o?.visible('navbar')).filter(o => o?.placement != 'right').map((x) =>
        <Link href={x.url} key={x.url}>
            <Button color='inherit' startIcon={x.showIcon == 'left' && x.icon} endIcon={x.showIcon == 'right' && x.icon} sx={{ ...styles.button }}>
                {x.name}
            </Button>
        </Link>
    );

    const navbarLinksRight = items.filter(o => !o?.visible || o?.visible('navbar')).filter(o => o?.placement == 'right').map((x) =>
        <Link href={x.url} key={x.url}>
            <Button color='inherit' startIcon={x.showIcon == 'left' && x.icon} endIcon={x.showIcon == 'right' && x.icon} sx={{ ...styles.button }}>
                {x.name}
            </Button>
        </Link>
    );

    const [transitionStep, setTransitionStep] = useState(0);
    const drawerLinks = items.filter(o => !o?.visible || o?.visible('drawer')).map((x, index) =>
        <Link href={x.url} key={x.url}>
            <Slide in={open && transitionStep > index} direction="right" timeout={200}>
                <ListItem button sx={{ ...styles.drawer }}>
                    <ListItemIcon>
                        {x.icon}
                    </ListItemIcon>
                    <ListItemText primary={x.name} />
                </ListItem>
            </Slide>
        </Link>
    );

    useEffect(() => {
        if (!open) return setTransitionStep(0);
        if (transitionStep <= drawerLinks.length) {
            const tmt = setTimeout(function() {
                setTransitionStep(transitionStep + 1);
            }, (transitionStep == 0 ? 50 : 0) + 30);
            return () => clearTimeout(tmt);
        }
    }, [transitionStep, open]);

    const isMobile = useMediaQuery('(max-width:600px)');
    return <>
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
            <Box sx={{ width: 250, mt: 5 }}>
                <Typography variant="h6" sx={{ textAlign: 'center', mb: 3 }}>Navigation</Typography>
                <Divider orientation='horizontal' />
                <List>
                    {drawerLinks}
                </List>
            </Box>

        </Drawer>



    </>;
}