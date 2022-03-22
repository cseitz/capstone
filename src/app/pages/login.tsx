import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { ButtonGroup, Typography } from '@mui/material'
import { useRouter } from 'next/router'

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
                {/* <Typography variant="h3" style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', marginTop: 25, marginBottom: 25 }}>
                    {page == 'login' ? 'Login' : 'Register'}
                </Typography> */}
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
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState<string>();
    const router = useRouter();

    function handleSubmit(e) {
        e.preventDefault();
        console.log("username : " + username + "password: " + password)
        setStatus("Incorrect Password")
    }

    return <Box sx={{ mb: 3, mt: 25 }}>
        <Box sx={{ margin: 'auto', width: 'min(400px, 80vw)', textAlign: 'center' }}>
            <Typography variant="h3" style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', marginTop: 25, marginBottom: 25 }}>
                Login
            </Typography>
            <TextField label="Username" type="text" name="username" fullWidth onChange={(e) => { setStatus(null); setUsername(e.target.value) }} placeholder="Username" />
            <br /><br />
            <TextField label="Password" type="password" name="password" fullWidth onChange={(e) => { setStatus(null); setPassword(e.target.value) }} placeholder="Password" />
            <br /><br />
            <Button variant="contained" type="submit" fullWidth onClick={handleSubmit}>Log In</Button>
            {status ? <Typography id="errormessage" sx={{ color: 'red', textAlign: 'center', mt: '1em' }} >{status}</Typography> : ''}
            <a onClick={() => router.push({ pathname: 'register' })}>
                <Typography sx={{ cursor: 'pointer', textAlign: 'center', mt: 2 }}>
                    Create Account
                </Typography>
            </a>

        </Box>
    </Box>
}