import React, { useState } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button';

export default function login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        console.log("username : " + username + "password: " + password)
    }

    return (
        <Box sx={{ margin: 'auto', width: '25ch', text_align: 'center'}}>
            <FormControl>
            <span id="errormessage" style={{ color: 'red' }}></span>
            <p>Username</p>
            <TextField type="text" name="username" onChange={(e) => setUsername(e.target.value)} placeholder="Username"></TextField>
            <p>Password</p>
            <TextField type="text" name="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password"></TextField>
            <br></br>
            <br></br>
            <Button type="submit" onClick={handleSubmit}>Log In</Button>
            </FormControl>
        </Box>);
}