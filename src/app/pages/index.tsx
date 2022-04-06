import { BottomNavigation, Button, CardContent, Container, Fab, Typography } from "@mui/material";
import { alignProperty, convertLength } from "@mui/material/styles/cssUtils";
import Card from '@mui/material/Card';
import { Box } from "@mui/system";
import { FAQ } from "ui/components/faq";
import Link from "next/link";
import { useMemo } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";

const queryClient = new QueryClient();

function LandingPage() {
    const { isLoading, error, data } = useQuery(['details', 'landing'], () => {
        return fetch('/api/details/landing')
            .then(response => response.json())
    })
    if (isLoading) return <Box />;
    const { title, subtitle, backgroundImage, logo } = data;
    return <Box sx={{ backgroundColor: "lightblue", width: '100%', height: '100%', backgroundSize: "cover", backgroundRepeat: "no-repeat", textAlign: 'center' }}>
        <Box id="logo-container" sx={{ textAlign: 'center', mt: 10 }}>
            <img src={logo} style={{ padding: '20px', width: '300px', maxWidth: '90vw' }} />
            <Typography variant="h2">{title}</Typography>
        </Box>
        <Box id="lading-content-container" sx={{ textAlign: 'center' }}>
            <Typography variant="h4">{subtitle}</Typography>
            <Link href={'/register'}>
                <Button variant="contained" color="primary" sx={{ m: 2 }}>
                    <Typography variant="h6">Register Here</Typography>
                </Button>
            </Link>
        </Box>
    </Box>
}

function AboutPage() {
    const { isLoading, error, data } = useQuery(['details', 'about'], () => {
        return fetch('/api/details/about')
            .then(response => response.json())
    })
    if (isLoading) return <Box />;
    const { title, subtitle, info, content } = data;
    return <Box sx={{ backgroundColor: 'lightpink', width: '100%', height: '100%', backgroundSize: "cover", backgroundRepeat: "no-repeat", textAlign: 'center' }}>
        <Typography variant="h3" sx={{ textAlign: 'left', padding: '20px' }}>{title}</Typography>
        <Typography variant="h4" sx={{ textAlign: 'right', padding: '30px' }}>{info}</Typography>
        <Box sx={{ width: '50%', m: 'auto' }}>
            <Card>
                <CardContent>
                    <Typography sx={{ textAlign: 'center' }}>{content}</Typography>
                </CardContent>
            </Card>
        </Box>
    </Box>
}

function FAQPage() {
    return <Box id="faq" sx={{ backgroundColor: 'cornsilk', width: '100%', height: '100%', backgroundSize: "cover", backgroundRepeat: "no-repeat", alignContent: 'center', textAlign: 'center', pt: 5 }}>
        <Typography variant="h3">FAQ</Typography>
        <Box sx={{ margin: 'auto', width: 'min(800px, 95vw)', mt: 2 }}>
            <FAQ />
        </Box>
        <Box sx={{ mt: 3 }}>
            <Link href="/contact">
                <Button variant="contained" color="inherit">Contact Us</Button>
            </Link>
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
            <Box height='100vh' display="flex" flexDirection="column" sx={{ alignContent: 'center' }}>
                <FAQPage />
            </Box>
            <Footer />
        </Box>
    </QueryClientProvider>
}