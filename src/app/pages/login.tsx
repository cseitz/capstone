import React, { useState } from 'react'
export default function login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        console.log("username : " + username + "password: " + password)
    }

    return <div style={{ textAlign: 'center', fontSize: 20 }}>
        <form
            method="POST"
            onSubmit={handleSubmit}>
            <span id="errormessage" style={{ color: 'red' }}></span>
            <p>Username</p>
            <input type="text" name="username" onChange={(e) => setUsername(e.target.value)} placeholder="Username"></input>
            <p>Password</p>
            <input type="text" name="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password"></input>
            <br></br>
            <br></br>
            <button type="submit">Log In</button>
        </form>
    </div>
}