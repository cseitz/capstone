import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useAlert } from 'ui/components/alert'
import { isAuthenticated } from 'lib/auth/client'
import Head from 'next/head'
import { title } from 'ui/components/navbar'

// Login Page
export default function LoginPage() {
    const alert = useAlert();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [status, setStatus] = useState<string>(null);
    const router = useRouter();

    // redirect to homepage if logged in
    useEffect(() => {
        if (isAuthenticated()) {
            router.push('/');
        }
    }, [])

    function handleSubmit(e?: any) {
        e?.preventDefault();
        fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
            })
        }).then(async res => {
            if (!res.ok) throw (await res.json())?.error;
            // Show status message
            alert.success({
                message: 'Logged In'
            })
            // Redirect
            router.push('/');
        }).catch(err => {
            // Show error
            setStatus(err);
        })
    }


    return <>
        <Head>
            <title>{title} - Login</title>
        </Head>
        <Box sx={{ mb: 3, mt: 25 }}>
            <Box sx={{ margin: 'auto', width: 'min(400px, 80vw)', textAlign: 'center' }}>
                <Typography variant='h4' sx={{ textAlign: 'center' }}>Login</Typography>

                <br />

                <TextField label="Email" type="text" name="email" placeholder="Email" fullWidth onChange={(e) => { setStatus(null); setEmail(e.target.value) }} />

                <br /><br />

                <TextField label="Password" type="password" name="password" placeholder="Password" fullWidth onChange={(e) => { setStatus(null); setPassword(e.target.value) }} onKeyDown={({ key }) => key == 'Enter' && handleSubmit()} />

                <br /><br />

                <Button variant="contained" type="submit" fullWidth onClick={handleSubmit}>Log In</Button>


                {status ? <Typography sx={{ color: 'red', textAlign: 'center', mt: '1em' }} >{status}</Typography> : ''}
                <a onClick={() => router.push({ pathname: 'register' })}>
                    <Typography sx={{ cursor: 'pointer', textAlign: 'center', mt: 2 }}>
                        Create Account
                    </Typography>
                </a>
            </Box>
        </Box>
    </>
}