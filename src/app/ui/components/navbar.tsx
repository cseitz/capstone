import { useState } from 'react';
import { AppBar, Button, IconButton, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Box from '@mui/material/Box';
import Link from 'next/link'

export function NavBar() {
    const [open, setOpen] = useState(false)
    const [anchor, setAnchor] = useState('left')

    const handleDrawer = () => {
        setOpen(true)
    }

    const list = () => (

        <List>
            {['Home', 'Staff', 'Support', 'Settings'].map((text, index) => (
                <ListItem button key={text}>
                    <ListItemIcon>
                        {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                    </ListItemIcon>
                    <ListItemText primary={text} />
                </ListItem>
            ))}
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

                    <Button color='inherit'>
                        Register
                    </Button>

                    <Button color='inherit'>
                        FAQ
                    </Button>
                </Toolbar>
            </AppBar>

            <Drawer
                anchor='left'
                open={open}
                onClose={() => setOpen(false)}
            >
               <Box
                sx={{p: 5}}>

                <h3> This is a drawer</h3>
                {list()}
                </Box>

            </Drawer>

        </div>
    );
}