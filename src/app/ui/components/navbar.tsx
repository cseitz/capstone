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

export function NavBar() {
    const [open, setOpen] = useState(false)
    const [anchor, setAnchor] = useState('left')

    const handleDrawer = () => {
        setOpen(true)
    }


    const list = () => (


        <List>
            <Link href={"/"}>
                <ListItem button>
                    <ListItemIcon>
                        <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Home" />
                </ListItem>
            </Link>

            <Link href={"/login"}>
                <ListItem button>
                    <ListItemIcon>
                        <LoginIcon />
                    </ListItemIcon>
                    <ListItemText primary="Login" />
                </ListItem>
            </Link>

            <Link href={"/#faq"}>
                <ListItem button>
                    <ListItemIcon>
                        <LiveHelpIcon />
                    </ListItemIcon>
                    <ListItemText primary="FAQ" />
                </ListItem>
            </Link>

            <Link href={"/register"}>
                <ListItem button>
                    <ListItemIcon>
                        <HowToRegIcon />
                    </ListItemIcon>
                    <ListItemText primary="Register" />
                </ListItem>
            </Link>



        </List>

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
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        Hello There Welcome
                    </Typography>

                    <Link href={"/login"}>
                        <Button color='inherit'>
                            Login
                        </Button>
                    </Link>

                    <Link href={"/register"}>
                        <Button color='inherit'>
                            Register
                        </Button>
                    </Link>

                    <Link href={"/#faq"}>
                        <Button color='inherit'>
                            FAQ
                        </Button>
                    </Link>

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
                    {list()}
                </Box>

            </Drawer>

        </div>
    );
}