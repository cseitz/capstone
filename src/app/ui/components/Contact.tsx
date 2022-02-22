import { useState } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { Typography } from '@mui/material'

export function Contact(){
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [status, setStatus] = useState<string>(null);

    function handleSubmit(e) {
        e.preventDefault();
        console.log("name : " + username + "email: " + email)
        setStatus("Fill out the form")
    }

    return (
    <Box>
        <Box sx={{ margin: 'auto', width: 'min(400px, 80vw)', text_align: 'center'}}>
            <Typography  variant="h3" style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', marginTop: 25 }} >Contact Us</Typography>
            <Typography  variant="h6" style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', marginTop: 15, marginBottom: 25 }} >If you have any questions, concerns, or problems, please do not hesitate to contact us. Someone will get back to you shortly.</Typography>
            <TextField label="Name" type="text" name="username" fullWidth onChange={(e) => { setStatus(null); setUsername(e.target.value) }} placeholder="Name"/>
            <br /><br />
            <TextField label="Email" type="text" name="email" fullWidth onChange={(e) => { setStatus(null); setEmail(e.target.value) }}  placeholder="Email"/>
            <br /><br />
            <TextField label="Whats the topic?" type="text" name="subject" fullWidth onChange={(e) => { setStatus(null); setSubject(e.target.value) }} placeholder="Whats the topic?"/>
            <br /><br />
            <TextField label="Write your message here." type="text" name="body" fullWidth multiline minRows={2} onChange={(e) => { setStatus(null); setBody(e.target.value) }} placeholder="Write your message here."/>
            <br /><br />
            <Button variant="contained" type="submit" fullWidth onClick={handleSubmit}>Send</Button>
            <br /><br />
            {status ? <Typography id="errormessage" style={{ color: 'red', textAlign: 'center' }} >{status}</Typography> : ''}
        </Box>
    </Box>
    )
}