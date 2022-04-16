import { useEffect, useRef, useState } from 'react';
import { AppBar, Button, IconButton, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Slide, useScrollTrigger, useMediaQuery, Divider } from "@mui/material";
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
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';



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
            name: "Details",
            url: "/details",
            icon:<DriveFileRenameOutlineIcon />
        }, 
        {
       
            name: "Exports",
            url: "/exports",
            icon: <HomeIcon />
        },
        {
            name: "Logout",
            url: "/logout",
            placement: 'right',
            icon: <ExitToAppIcon />,
            showIcon: 'right',
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
    const [visible, setVisible] = useState(false);
    const [anchor, setAnchor] = useState('left');
    const router = useRouter();
    const lastRoute = useRef("");
    useEffect(() => {
        setVisible(router.route != '/login' && router.route != '/denied');
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
            const tmt = setTimeout(function () {
                setTransitionStep(transitionStep + 1);
            }, (transitionStep == 0 ? 50 : 0) + 30);
            return () => clearTimeout(tmt);
        }
    }, [transitionStep, open]);

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