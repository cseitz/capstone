import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import { EventList } from 'ui/components/event';
import Head from 'next/head';
import { title } from 'ui/components/navbar';


// Events Page
// This page shows a list of events for users to sign up for
export default function EventPage() {
    return <>
        <Head>
            <title>{title} - Events</title>
        </Head>
        <Box height='100vh' display="flex">
            <Box sx={{ backgroundColor: "lightblue", width: '100%', height: '100%', backgroundSize: "cover", backgroundRepeat: "no-repeat", textAlign: 'center', pt: 4 }}>
                <Box style={{ textAlign: 'center' }}>
                    <Typography variant="h3">Upcoming Events</Typography>
                </Box>
                <br />
                {/* Events container that holds the eventlist component that is pull from ui/components/event */}
                <Box id="events-container" sx={{ backgroundColor: '', width: '700px', maxWidth: '95vw', margin: 'auto' }}>
                    <EventList />
                </Box>
            </Box>
        </Box>
    </>
}
