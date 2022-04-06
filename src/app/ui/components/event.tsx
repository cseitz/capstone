import { ExpandMore } from "@mui/icons-material";
import { Button, Card, CardActions, CardContent, CardHeader, Collapse, Typography } from "@mui/material";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

/*
export function EventCard{
    return <>
        <Card>
            <CardHeader title={Title} subheader={Subtitle} action={
                <Button size="large" startIcon={<AssignmentIcon />}>
                    Sign Up
                </Button>
                } />
                <CardContent>
                    <Typography variant="body1">{Preview}</Typography>
                </CardContent>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Typography paragraph>{Description}</Typography>
                    </CardContent>
                </Collapse>
        </Card>
    </>
}
*/
export function EventListComponent(){
    return <></>
}
/*
export function EventList(props: (Parameters<typeof EventListComponent>)[0]) {
    return <QueryClientProvider client={queryClient}>
        <EventListComponent {...props} />
    </QueryClientProvider>
}
*/