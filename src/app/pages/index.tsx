import { BottomNavigation, Button, CardContent, Container, Fab, Typography } from "@mui/material";
import { alignProperty, convertLength } from "@mui/material/styles/cssUtils";
import Card from '@mui/material/Card';
import { Box } from "@mui/system";
import { FAQ } from "../ui/components/faq";
import { NavBar } from "../ui/components/navbar";

const Data = {
    Landing: {
        Title: "SAMPLE EVENT",
        Subtitle: "Feb 2nd 2022",
        BackgroundImage: "",
        Logo: "https://png.pngtree.com/element_pic/00/16/07/115783931601b5c.jpg",
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
        <Box id="logo-container" style={{ textAlign: 'center' }}>
            <img src={Logo} style={{ padding: '20px' }}></img>
            <Typography variant="h2">{Title}</Typography>
        </Box>
        <Box id="lading-content-container" style={{ textAlign: 'center' }}>
            <Typography variant="h4">{Subtitle}</Typography>
            <Button variant="outlined" sx={{ m: 2 }}>
                <Typography variant="h6">Register Here</Typography>
            </Button>
        </Box>
    </Box>
}

function AboutPage() {
    const { About, Landing: { Title} } = Data;
    const { Info, Content, Image, BackgroundImage } = About;
    return <Box sx={{ backgroundColor: 'lightpink', width: '100%', height: '100%', backgroundSize: "cover", backgroundRepeat: "no-repeat", text_align: 'center' }}>
        <Typography variant="h3" style={{ textAlign: 'left', padding: '20px' }}>{Title}</Typography>
        <Typography variant="h4" style={{ textAlign: 'right', padding: '30px' }}>{Info}</Typography>
        <Box style={{ width: '50%', margin: 'auto' }}>
            <Card>
                <CardContent>
                    <Typography style={{ textAlign: 'center' }}>{Content}</Typography>
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
    return <Box>
        <NavBar />
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
}