import React, { useEffect, useState } from 'react'
import { Button, Grid, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system';
import { useRouter } from 'next/router';

export default function LoginPage() {
    const [tab, setTab] = useState<'register' | 'login'>('login');

    return <Box>
        <Box sx={{ margin: 'auto', width: 'min(400px, 80vw)', text_align: 'center', mt: 20 }}>
            {tab == 'login' ? <LoginView /> : <RegisterView />}
            <br />
            <a onClick={() => setTab(tab == 'register' ? 'login' : 'register')}>
                <Typography sx={{ cursor: 'pointer', textAlign: 'center' }}>
                    {tab == 'login' ? 'Create Account' : 'Login'}
                </Typography>
            </a>
        </Box>
    </Box>
}

function LoginView() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState<string>(null);
    const router = useRouter();

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
            router.push('/');
        })
        .catch(err => {
            setStatus(err);
        })
    }
    return <Box>
        <Typography variant='h4' sx={{ textAlign: 'center' }}>Login</Typography>
        <br />
        <TextField label="Email" type="text" name="email" placeholder="Email" fullWidth onChange={(e) => { setStatus(null); setEmail(e.target.value) }} />
        <br /><br />
        <TextField label="Password" type="password" name="password" placeholder="Password" fullWidth onChange={(e) => { setStatus(null); setPassword(e.target.value) }} onKeyDown={({ key }) => key == 'Enter' && handleSubmit()} />
        <br /><br />
        <Button variant="contained" type="submit" fullWidth onClick={handleSubmit}>Log In</Button>
        
        {status ? <Typography id="errormessage" sx={{ color: 'red', textAlign: 'center', mt: '1em' }} >{status}</Typography> : ''}
    </Box>
}

function RegisterView() {
    const router = useRouter();
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [errors, setErrors] = useState<{ [key: string]: string }>(null);
    const [status, setStatus] = useState<string>(null);
    useEffect(() => {
        if (errors) setErrors(null);
        if (status) setStatus(null);
    }, [firstName, lastName, email, password]);
    const [submitting, setSubmitting] = useState(false);
    const register = function() {
        const err: typeof errors = {};
        if (!firstName) err.firstName = 'Required';
        if (!lastName) err.lastName = 'Required';
        if (!email) err.email = 'Required';
        if (!password) err.password = 'Required';
        if (Object.keys(err).length > 0) return setErrors(err);
        setSubmitting(true);
        fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                password,
            })
        }).then(async res => {
            if (!res.ok) throw (await res.json())?.error;
            // alert('registered');
            router.push('/');
        })
        .catch(err => {
            setSubmitting(false);
            setStatus(err);
        })
        /*.then(async (res) => {
            setSubmitting(false);
            if (res.status != 200) {
                setStatus(await res.text());
            } else {
                alert('logged in');
            }
        })*/
        
        console.log('register', {
            firstName,
            lastName,
            email,
            password,
        })
    }

    return <Box>
        <Typography variant='h4' sx={{ textAlign: 'center' }}>Register</Typography>
        <br />
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <TextField label="First Name" type="text" placeholder="First Name" value={firstName} onChange={({ target: { value }}) => setFirstName(value)} error={errors && Boolean(errors?.['firstName'])} helperText={errors && errors?.['firstName']} />
            </Grid>
            <Grid item xs={6}>
                <TextField label="Last Name" type="text" placeholder="Last Name" value={lastName} onChange={({ target: { value }}) => setLastName(value)} error={errors && Boolean(errors?.['lastName'])} helperText={errors && errors?.['lastName']} />
            </Grid>
            <Grid item xs={12}>
                <TextField fullWidth type="email" name="email" placeholder='Email' label="Email" value={email} onChange={({ target: { value }}) => setEmail(value)} error={errors && Boolean(errors?.['email'])} helperText={errors && errors?.['email']} />
            </Grid>
            <Grid item xs={12}>
                <TextField fullWidth type="password" name="password" placeholder='Password' label="Password" value={password} onChange={({ target: { value }}) => setPassword(value)} error={errors && Boolean(errors?.['password'])} helperText={errors && errors?.['password']} />
            </Grid>
            <Grid item xs={12}>
                <Button variant='contained' type="submit" fullWidth disabled={submitting} onClick={register}>Register</Button>
            </Grid>
        </Grid>
        {status ? <Typography id="errormessage" sx={{ color: 'red', textAlign: 'center', mt: '1em' }} >{status}</Typography> : ''}
    </Box>
}