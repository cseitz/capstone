import React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AssignmentIcon from '@mui/icons-material/AssignmentOutlined';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { Box, Stack, Paper, Button } from '@mui/material';
import { FavoriteBorder } from '@mui/icons-material';
import { QueryClient } from 'react-query';
import { EventList } from 'ui/components/event';

export default function Eventpage() {
    return <Box height='100vh' display="flex" flexDirection="column">
        <Box sx={{ backgroundColor: "lightblue", width: '100%', height: '100%', backgroundSize: "cover", backgroundRepeat: "no-repeat", text_align: 'center' }}>
            <Box style={{ textAlign: 'center' }}>
                <Typography variant="h1"    >Upcoming Events</Typography>
            </Box>
            <br />
            <Box id="events-container" sx={{ backgroundColor: '', width: '50%', height: '75%', margin: 'auto'}}>
                <EventList />
            </Box>
        </Box>
    </Box>
}
