import { useState } from 'react';
import { AppBar, Button, IconButton, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Box from '@mui/material/Box';
import Link from 'next/link'
import { FAQ } from './faq';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import HowToRegIcon from '@mui/icons-material/HowToReg';

const items = [

    {
        name: "Home",
        url: "/",
        icon: <HomeIcon />
    },
    {
        name: "Login",
        url: "/login",
        icon: <LoginIcon />
    },
    {
        name: "FAQ",
        url: "/#faq",
        icon: <LiveHelpIcon />
    },
    {
        name: "Register",
        url: "/Register",
        icon: <HowToRegIcon />
    },
]

export function NavBar() {
    const [open, setOpen] = useState(false)
    const [anchor, setAnchor] = useState('left')

    const handleDrawer = () => {
        setOpen(true)
    }

  
    const info = items.map((x) =>
        <Link href={x.url}>
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
                    
                    {info}
                    

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
                    {info}
                    </List>
                </Box>

            </Drawer>

            
        </div>
    );
}