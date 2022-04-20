import { Box } from "@mui/material";
import { Contact } from "ui/components/contact";

// Contact Page
// This form generates tickets on the staff portal.
export default function ContactPage(){
    return <Box>
        <Box sx={{ mx: 'auto', width: 'min(500px, 90vw)', textAlign: 'center', mt: 10 }}>
            <Contact />
        </Box>
    </Box>
}
