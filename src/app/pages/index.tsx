import { BottomNavigation, Button, CardContent, Container, Fab, Typography } from "@mui/material";
import { alignProperty, convertLength } from "@mui/material/styles/cssUtils";
import Card from '@mui/material/Card';
import { Box } from "@mui/system";
import { FAQ } from "ui/components/faq";
import Link from "next/link";

const Data = {
    Landing: {
        Title: "SAMPLE EVENT",
        Subtitle: "Feb 22nd 2022",
        BackgroundImage: "",
        // Logo: "http://divisqueeze.com/wp-content/uploads/2017/03/YourLogoHere.png",
        Logo: '/assets/logo.png'
    },
    About: {
        Info: "Hey this is some info to put about the event here",
        Content: "This is more information to be put into another box",
        Image: "",
        BackgroundImage: ""
    }
}

function LandingPage() {
    const { Landing } = Data;
    const { Title, Subtitle, BackgroundImage, Logo } = Landing;
    return <Box sx={{ backgroundColor: "lightblue", width: '100%', height: '100%', backgroundSize: "cover", backgroundRepeat: "no-repeat", text_align: 'center' }}>
        <Box id="logo-container" sx={{ textAlign: 'center', mt: 10 }}>
            <img src={Logo} style={{ padding: '20px', width: '300px', maxWidth: '90vw' }} />
            <Typography variant="h2">{Title}</Typography>
        </Box>
        <Box id="lading-content-container" sx={{ textAlign: 'center' }}>
            <Typography variant="h4">{Subtitle}</Typography>
            <Link href={'/register'}>
                <Button variant="contained" color="primary" sx={{ m: 2 }}>
                    <Typography variant="h6">Register Here</Typography>
                </Button>
            </Link>
        </Box>
    </Box>
}

function AboutPage() {
    const { About, Landing: { Title } } = Data;
    const { Info, Content, Image, BackgroundImage } = About;
    return <Box sx={{ backgroundColor: 'lightpink', width: '100%', height: '100%', backgroundSize: "cover", backgroundRepeat: "no-repeat", text_align: 'center' }}>
        <Typography variant="h3" sx={{ textAlign: 'left', padding: '20px' }}>{Title}</Typography>
        <Typography variant="h4" sx={{ textAlign: 'right', padding: '30px' }}>{Info}</Typography>
        <Box sx={{ width: '50%', m: 'auto' }}>
            <Card>
                <CardContent>
                    <Typography sx={{ textAlign: 'center' }}>{Content}</Typography>
                </CardContent>
            </Card>
        </Box>
    </Box>
}

function FAQPage() {
    return <Box id="faq" sx={{ backgroundColor: 'cornsilk', width: '100%', height: '100%', backgroundSize: "cover", backgroundRepeat: "no-repeat", alignContent: 'center', textAlign: 'center', pt: 5 }}>
        <Typography variant="h3">FAQ</Typography>
        <Box sx={{ margin: 'auto', width: 'min(800px, 80vw)', paddingTop: '100px' }}>
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
    return <Box>
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
}