import { Box } from "@mui/system";
import { QueryClient, QueryClientProvider } from "react-query";
import { EventCard, EventList, EventListItem } from "ui/components/event";

const queryClient = new QueryClient();

export default function EventPage(){
    return <Box>
        <QueryClientProvider client={queryClient}>
            <EventCard event="62475196b3fddc5b06e4a63f"/>
            <EventListItem event="62475196b3fddc5b06e4a63f"/>
        </QueryClientProvider>
        <EventList/>
    </Box>
}