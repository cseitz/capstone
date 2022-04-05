import { Button, Icon, IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { QueryClient, QueryClientProvider } from "react-query";
import { EventCard, EventList, EventListItem } from "ui/components/event";
import CreateIcon from '@mui/icons-material/Create';

//const queryClient = new QueryClient();

export default function EventPage(){
    return <Box>
        <Typography variant="h3" sx={{m:"10px", ml: "40px"}}>Events
            <Button variant="contained" size="large" sx={{float: "right", m: "10px", mr: "40px"}}>
                <CreateIcon></CreateIcon>
            Create Event
            </Button>
        </Typography>
        <hr/>
        <EventList />
    </Box>
}