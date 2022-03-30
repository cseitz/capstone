import { BottomNavigation, Button, CardContent, Container, Fab, Typography } from "@mui/material";
import { alignProperty, convertLength } from "@mui/material/styles/cssUtils";
import Card from '@mui/material/Card';
import { Box } from "@mui/system";
import { FAQ } from "ui/components/faq";
import { useMemo } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";

const queryClient = new QueryClient();

function LandingPage() {
    const { isLoading, error, data }  = useQuery(['details', 'landing'], () => {
        return fetch('/api/details/landing')
        .then(response => response.json())
    })
    if(isLoading) return <Box />;
    const { title, subtitle, backgroundImage, logo } = data;
    return <Box sx={{ backgroundColor: "lightblue", width: '100%', height: '100%', backgroundSize: "cover", backgroundRepeat: "no-repeat", text_align: 'center' }}>
        <Box id="logo-container" style={{ textAlign: 'center' }}>
            <img src={logo} style={{ padding: '20px', width: '300px', maxWidth: '90vw' }}></img>
            <Typography variant="h2">{title}</Typography>
        </Box>
        <Box id="lading-content-container" style={{ textAlign: 'center' }}>
            <Typography variant="h4">{subtitle}</Typography>
            <Button variant="contained" color="secondary" sx={{ m: 2 }}>
                <Typography variant="h6">Register Here</Typography>
            </Button>
        </Box>
    </Box>
}

function AboutPage() {
    const { isLoading, error, data }  = useQuery(['details', 'about'], () => {
        return fetch('/api/details/about')
        .then(response => response.json())
    })
    if(isLoading) return <Box />;
    const { title, subtitle, info, content} = data;
    return <Box sx={{ backgroundColor: 'lightpink', width: '100%', height: '100%', backgroundSize: "cover", backgroundRepeat: "no-repeat", text_align: 'center' }}>
        <Typography variant="h3" style={{ textAlign: 'left', padding: '20px' }}>{title}</Typography>
        <Typography variant="h4" style={{ textAlign: 'right', padding: '30px' }}>{info}</Typography>
        <Box style={{ width: '50%', margin: 'auto' }}>
            <Card>
                <CardContent>
                    <Typography style={{ textAlign: 'center' }}>{content}</Typography>
                </CardContent>
            </Card>
        </Box>
    </Box>
}

function FAQPage() {
    return <Box id="faq" sx={{ backgroundColor: 'cornsilk',  width: '100%', height: '100%', backgroundSize: "cover", backgroundRepeat: "no-repeat", alignContent: 'center', textAlign: 'center', pt: 5 }}>
        <Typography variant="h3">FAQ</Typography>
        <Box style={{ margin: 'auto', width: 'min(800px, 80vw)', paddingTop: '100px' }}>
            <FAQ />
        </Box>
    </Box>
}

function Footer() {
    return <Box sx={{ backgroundColor: 'lightsalmon', height: '100px' }}>
        <Typography variant="h5" sx={{ textAlign: 'initial' }}>Powered By</Typography>
    </Box>
}

export default function Homepage() {
    return <QueryClientProvider client={queryClient}>
    
    <Box>
        <Box height='100vh' display="flex" flexDirection="column">
            <LandingPage />
        </Box>
        <Box height='100vh' display="flex" flexDirection="column">
            <AboutPage />
        </Box>
        <Box height='100vh' display="flex" flexDirection="column" style={{ alignContent: 'center' }}>
            <FAQPage />
        </Box>
        <Footer />
    </Box>
    </QueryClientProvider>
}