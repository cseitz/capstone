import React, { useState } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { Typography } from '@mui/material'

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState<string>(null);

    function handleSubmit(e) {
        e.preventDefault();
        console.log("username : " + username + "password: " + password)
        setStatus("Incorrect Password")
    }

    return <Box>
        <Box sx={{ margin: 'auto', width: 'min(400px, 80vw)', text_align: 'center', mt: 20 }}>
            <TextField label="Username" type="text" name="username" fullWidth onChange={(e) => { setStatus(null); setUsername(e.target.value) }} placeholder="Username" />
            <br /><br />
            <TextField label="Password" type="password" name="password" fullWidth onChange={(e) => { setStatus(null); setPassword(e.target.value) }} placeholder="Password" />
            <br /><br />
            <Button variant="contained" type="submit" fullWidth onClick={handleSubmit}>Log In</Button>
            <br /><br />
            {status ? <Typography id="errormessage" style={{ color: 'red', textAlign: 'center' }} >{status}</Typography> : ''}
        </Box>
    </Box>
}