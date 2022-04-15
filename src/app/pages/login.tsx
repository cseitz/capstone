import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { ButtonGroup, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useAlert } from 'ui/components/alert'
import { isAuthenticated } from 'lib/auth/client'

export function LoginRegisterContainer(props: { variant: 'login' | 'register', children: any }) {
    const { variant, children } = props;
    const router = useRouter();
    const [page, setPage] = useState<'login' | 'register'>(null);
    useEffect(() => {
        if (!router.isReady) return;
        if (!page)
            setPage(router.pathname.includes('login') ? 'login' : 'register');
    }, [router.isReady, router.pathname]);
    useEffect(() => {
        if (router.isReady && page) {
            if (!router.pathname.includes(page)) {
                router.push({ pathname: '/' + page })
            }
        }
    }, [page]);
    return <Box>
        <Box sx={{ margin: 'auto', width: 'min(400px, 80vw)', textAlign: 'center' }}>
            <Box sx={{ mb: 3, mt: 25 }}>
                <ButtonGroup fullWidth>
                    <Button variant={page == 'login' ? 'contained' : 'outlined'} onClick={() => setPage('login')}>
                        <Typography variant="h6">Login</Typography>
                    </Button>
                    <Button variant={page == 'register' ? 'contained' : 'outlined'} onClick={() => setPage('register')}>
                        <Typography variant="h6">Register</Typography>
                    </Button>
                </ButtonGroup>
            </Box>
            <Box>
                {children}
            </Box>

        </Box>
    </Box>
}

export default function LoginPage() {
    const alert = useAlert();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState<string>(null);
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated()) {
            router.push('/');
        }
    }, [])

    function handleSubmit(e?: any) {
        e?.preventDefault();
        console.log("username : " + email + "password: " + password)
        // setStatus("Incorrect Password");
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
            // alert('registered');
            alert.success({
                message: 'Logged In'
            })
            router.push('/');
        })
            .catch(err => {
                setStatus(err);
            })
    }
    return <Box sx={{ mb: 3, mt: 25 }}>
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
}