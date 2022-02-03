import { Container, Fab } from "@mui/material";
import { alignProperty, convertLength } from "@mui/material/styles/cssUtils";
import { Box } from "@mui/system";
import { FAQ } from "../ui/components/faq";

const LandingPageOBJ ={
    eventname: "SAMPLE EVENT",
    eventdate: "Feb 2nd 2022",
    backgroundsrc: "https://www.freecodecamp.org/news/content/images/2021/06/w-qjCHPZbeXCQ-unsplash.jpg",
    logosrc: "https://png.pngtree.com/element_pic/00/16/07/115783931601b5c.jpg",
};

function LandingPage(){
    return(
        <Box sx={{backgroundImage: `url(${LandingPageOBJ.backgroundsrc})`, width: '100%', height: '100%', backgroundSize: "cover", backgroundRepeat: "no-repeat"}}>
            <div>
                <img src={LandingPageOBJ.logosrc}></img>
                <br/>
                <h1>{LandingPageOBJ.eventname}</h1>
                <h2>{LandingPageOBJ.eventdate}</h2>
                <Fab></Fab>
            </div>
        </Box>
    )
}

export default function Homepage() {
    return (
        <div>
            <Box height='100vh' display="flex" flexDirection="column">
                <LandingPage/>
            </Box>
            <Box height='100vh' display="flex" flexDirection="column">
                <FAQ/>
            </Box>
        </div>
    )
}