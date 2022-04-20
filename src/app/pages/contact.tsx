import { Box } from "@mui/material";
import Head from "next/head";
import { Contact } from "ui/components/contact";
import { title } from "ui/components/navbar";

// Contact Page
// This form generates tickets on the staff portal.
export default function ContactPage() {
    return <>
        <Head>
            <title>{title} - Contact</title>
        </Head>
        <Box>
            <Box sx={{ mx: 'auto', width: 'min(500px, 90vw)', textAlign: 'center', mt: 10 }}>
                <Contact />
            </Box>
        </Box>
    </>
}
