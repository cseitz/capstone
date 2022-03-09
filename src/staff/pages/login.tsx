import React, { useEffect, useState } from 'react'
import { Button, Grid, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system';

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
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState<string>(null);

    function handleSubmit(e) {
        e.preventDefault();
        console.log("username : " + username + "password: " + password)
        setStatus("Incorrect Password")
    }
    return <Box>
        <Typography variant='h4' sx={{ textAlign: 'center' }}>Login</Typography>
        <br />
        <TextField label="Username" type="text" name="username" fullWidth onChange={(e) => { setStatus(null); setUsername(e.target.value) }} placeholder="Username" />
        <br /><br />
        <TextField label="Password" type="password" name="password" fullWidth onChange={(e) => { setStatus(null); setPassword(e.target.value) }} placeholder="Password" />
        <br /><br />
        <Button variant="contained" type="submit" fullWidth onClick={handleSubmit}>Log In</Button>
        
        {status ? <Typography id="errormessage" sx={{ color: 'red', textAlign: 'center', mt: '1em' }} >{status}</Typography> : ''}
    </Box>
}

function RegisterView() {
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
            if (!res.ok) throw await res.text();
            alert('registered');
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