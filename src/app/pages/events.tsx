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
import { Box, Stack, Paper } from '@mui/material';
import { FavoriteBorder } from '@mui/icons-material';
import { QueryClient } from 'react-query';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    color: theme.palette.text.secondary,
  }));

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));
const queryClient = new QueryClient();

const Data = {
    Event: {
        Title: "Sample Event",
        Subtitle: "February 22, 2022", //This will be the date of the event.
        Preview: "This will be a short sentence explaining the event.",
        Description: "This will be a more detailed paragraph that will contain more information",
    }
}

export default function Eventpage() {
    const [expanded, setExpanded] = React.useState(false);
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    const { Event } = Data;
    const { Title, Subtitle, Preview, Description } = Event;
    return <Box height='100vh' display="flex" flexDirection="column">
        <Box sx={{ backgroundColor: "lightblue", width: '100%', height: '100%', backgroundSize: "cover", backgroundRepeat: "no-repeat", text_align: 'center' }}>
            <Box style={{ textAlign: 'center' }}>
                <Typography variant="h1"    >Upcoming Events</Typography>
            </Box>
            <br /><br />
            <Box id="events-container" sx={{ backgroundColor: '', width: '50%', height: '75%', margin: 'auto' }}>
                <Stack spacing={2}>
                        <Card>
                            <CardHeader title={Title} subheader={Subtitle} action={
                                <IconButton aria-label="Sign-Up">
                                    Interested <FavoriteBorder />
                                </IconButton>
                            } />
                            <CardContent>
                                <Typography variant="body1">{Preview}</Typography>
                            </CardContent>
                            <CardActions disableSpacing>
                                <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more">
                                    <ExpandMoreIcon />
                                </ExpandMore>
                            </CardActions>
                            <Collapse in={expanded} timeout="auto" unmountOnExit>
                                <CardContent>
                                    <Typography paragraph>{Description}</Typography>
                                </CardContent>
                            </Collapse>
                        </Card>
                        <Card>
                            <CardHeader title={Title} subheader={Subtitle} action={
                                <IconButton aria-label="Sign-Up">
                                    Interested <FavoriteBorder />
                                </IconButton>
                            } />
                            <CardContent>
                                <Typography variant="body1">{Preview}</Typography>
                            </CardContent>
                            <CardActions disableSpacing>
                                <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more">
                                    <ExpandMoreIcon />
                                </ExpandMore>
                            </CardActions>
                            <Collapse in={expanded} timeout="auto" unmountOnExit>
                                <CardContent>
                                    <Typography paragraph>{Description}</Typography>
                                </CardContent>
                            </Collapse>
                        </Card>
                </Stack>
            </Box>
        </Box>
    </Box>
}
