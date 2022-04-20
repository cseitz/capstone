import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import { useRouter } from 'next/router';
import CheckIcon from '@mui/icons-material/Check';
import { useUser } from 'lib/auth/client';
import { useAlert } from './alert';

export function Contact() {
    const router = useRouter();
    const alert = useAlert();
    const user = useUser();

    // Fields
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    // Autofill name and email from logged in user, if applicable
    useEffect(() => {
        if (user) {
            setName(user?.info?.firstName + ' ' + user?.info?.lastName);
            setEmail(user?.email);
        }
    }, [user?.ready, user])

    const [errors, setErrors] = useState<{ [key: string]: string }>(null);
    const [status, setStatus] = useState<string>(null);
    const [submitting, setSubmitting] = useState(false);
    const [doneSubmitting, setDoneSubmitting] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();

        const err: typeof errors = {};
        if (!name) err.name = 'Required';
        if (!email) err.email = 'Required';
        if (!subject) err.subject = 'Required';
        if (!message) err.body = 'Required';

        setSubmitting(true);

        fetch('/api/tickets/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                email,
                subject,
                message
            })
        }).then(async res => {
            if (!res.ok) throw (await res.json())?.error;
            setSubmitting(false);
            setDoneSubmitting(true);
        }).catch(err => {
            setSubmitting(false);
            setDoneSubmitting(false);
            //setStatus(err);
            console.log(err);

            // Show error
            alert.error(err, {
                unique: 'register.error',
                duration: 2000
            });

        })
        setStatus("Fill out the form")
    }

    // Show spinner circle when submitting
    if (submitting) return <>
        <Box sx={{ margin: 'auto', width: 'min(400px, 80vw)', textAlign: 'center' }}>
            <CircularProgress style={{ textAlign: 'center', marginTop: 25, fontSize: 40 }} />
        </Box>
    </>;

    // Show success message when successfully submitted
    if (doneSubmitting) return <>
        <Box sx={{ margin: 'auto', width: 'min(400px, 80vw)', textAlign: 'center', mt: '25vh' }}>
            <CheckIcon style={{ textAlign: 'center', marginTop: 25, fontSize: 40 }} />
            <Typography variant="h5" style={{ textAlign: 'center', marginTop: 20 }} >Message Delivered!</Typography>
            <Typography variant="h6" style={{ textAlign: 'center', marginTop: 15 }} >We'll get back to you soon!</Typography>
            <Typography sx={{ mt: 2 }}>Updates will be sent to {email}</Typography>
        </Box>
    </>;

    // Contact Form
    return <>
        <Box>
            <Typography variant="h4" style={{ textAlign: 'center', fontWeight: 'bold', marginTop: 25 }} >Contact Us</Typography>
            <Typography style={{ textAlign: 'center', marginTop: 15, marginBottom: 25 }} >If you have any questions, concerns, or problems, please do not hesitate to contact us. Someone will get back to you shortly.</Typography>

            <TextField fullWidth label="Name" type="text" name="name" placeholder="Name"
                value={name} onChange={(e) => { setStatus(null); setName(e.target.value) }} />

            <br /><br />

            <TextField fullWidth label="Email" type="text" name="email" placeholder="Email"
                value={email} onChange={(e) => { setStatus(null); setEmail(e.target.value) }} />

            <br /><br />

            <TextField fullWidth label="Whats the topic?" type="text" name="subject" placeholder="Whats the topic?"
                value={subject} onChange={(e) => { setStatus(null); setSubject(e.target.value) }} />

            <br /><br />

            <TextField fullWidth multiline minRows={2} label="Write your message here." type="text" name="message" placeholder="Write your message here."
                value={message} onChange={(e) => { setStatus(null); setMessage(e.target.value) }} />

            <br /><br />

            <Button variant="contained" type="submit" fullWidth onClick={handleSubmit}>Send</Button>

            <br /><br />

            {status ? <Typography id="errormessage" style={{ color: 'red', textAlign: 'center' }} >{status}</Typography> : ''}
        </Box>
    </>
}