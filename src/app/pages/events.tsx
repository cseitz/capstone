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


//Event page export.. this is the websites event page
export default function Eventpage() {
    return <Box height='100vh' display="flex">
        <Box sx={{ backgroundColor: "lightblue", width: '100%', height: '100%', backgroundSize: "cover", backgroundRepeat: "no-repeat", textAlign: 'center', pt: 4 }}>
            <Box style={{ textAlign: 'center' }}>
                <Typography variant="h3">Upcoming Events</Typography>
            </Box>
            <br />
            {/* Events container that holds the eventlist component that is pull from ui/componenets/event */}
            <Box id="events-container" sx={{ backgroundColor: '', width: '700px', maxWidth: '90vw', margin: 'auto', border: 2, borderRadius: 1}}>
                <EventList />
            </Box>
        </Box>
    </Box>
}
