import { BottomNavigation, Button, CardContent, Container, Fab } from "@mui/material";
import { alignProperty, convertLength } from "@mui/material/styles/cssUtils";
import Card from '@mui/material/Card';
import { Box } from "@mui/system";
import { FAQ } from "../ui/components/faq";

const LandingPageOBJ ={
    eventname: "SAMPLE EVENT",
    eventdate: "Feb 2nd 2022",
    backgroundsrc: "https://www.freecodecamp.org/news/content/images/2021/06/w-qjCHPZbeXCQ-unsplash.jpg",
    logosrc: "https://png.pngtree.com/element_pic/00/16/07/115783931601b5c.jpg",
};

const AboutOBJ = {
    eventinfo: "Hey this is some info to put about the event here",
    eventcard: "This is more information to be put into another box",
    image: "",
    backgroundsrc: "https://image.freepik.com/free-vector/hand-painted-watercolor-pastel-sky-background_23-2148902771.jpg?w=1380"
};

function LandingPage(){
    return(
        <Box sx={{backgroundImage: `url(${LandingPageOBJ.backgroundsrc})`, width: '100%', height: '100%', backgroundSize: "cover", backgroundRepeat: "no-repeat", text_align: 'center'}}>
            <div>
                <div id="logo-container" style={{textAlign: 'center'}}>
                    <img src={LandingPageOBJ.logosrc} style={{padding: '20px'}}></img>
                    <h1 style={{fontSize: 'xxx-large'}}>{LandingPageOBJ.eventname}</h1>
                </div>
                <div id="lading-content-container" style={{textAlign: 'center'}}>
                    <h2 style={{fontSize: 'xxx-large'}}>{LandingPageOBJ.eventdate}</h2>
                    <Button variant="outlined" style={{fontSize: 'x-large'}}>Register Here</Button>
                </div>
            </div>
        </Box>
    )
}

function AboutPage(){
   return(
    <Box sx={{backgroundImage: `url(${AboutOBJ.backgroundsrc})`, width: '100%', height: '100%', backgroundSize: "cover", backgroundRepeat: "no-repeat", text_align: 'center'}}>
        <div>
            <h1 style={{textAlign: 'left', padding: '20px', fontSize: 'xxx-large'}}>{LandingPageOBJ.eventname}</h1>
            <div>
                <h2 style={{textAlign: 'right', padding: '30px', fontSize: 'xxx-large'}}>{AboutOBJ.eventinfo}</h2>
            </div>
        </div>
        <div style={{paddingTop: '800px', width: '50%', margin: 'auto'}}>
            <Card>
                <CardContent>
                    <p style={{textAlign: 'center'}}>{AboutOBJ.eventcard}</p>
                </CardContent>
            </Card>
        </div>
    </Box>
   )
}

function FAQPage(){
    return (
        <div style={{alignContent: 'center', textAlign: 'center'}}>
            <h1 style={{fontSize: 'xxx-large'}}>FAQ</h1>
            <Box style={{margin: 'auto', width: '25%', paddingTop: '100px'}}>
                <FAQ/>
            </Box>
        </div>
    )
}

function Footer(){
    return(
        <div>
            <Box sx={{backgroundColor: 'grey', height: '100px'}}>
                <h1 style={{textAlign: 'initial'}}>Powered By</h1>
            </Box>
        </div>
    )
}

export default function Homepage() {
    return (
        <div>
            <Box height='100vh' display="flex" flexDirection="column">
                <LandingPage/>
            </Box>
            <Box height='100vh' display="flex" flexDirection="column">
                <AboutPage/>
            </Box>
            <Box height='100vh' display="flex" flexDirection="column" style={{alignContent: 'center'}}>
                <FAQPage/>
            </Box>
            <Footer/>
        </div>
    )
}