import { Button, CircularProgress, Grid, Paper, Step, StepContent, StepLabel, Stepper, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { LoginRegisterContainer } from "./login";


const steps: {
    title: string;
    optional?: boolean;
    content: (step: (typeof steps[number]) & { index: number }) => JSX.Element
}[] = [];

export default function RegisterPage() {
    const [activeStep, setActiveStep] = useState(0);
    return <Box sx={{ mb: 3, mt: 10 }}>
        <Box sx={{ margin: 'auto', width: 'min(500px, 90vw)' }}>
            <Typography variant="h3" style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', marginTop: 25, marginBottom: 25 }}>
                Register
            </Typography>
            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((S, index) => {
                    const isLast = index == steps.length - 1;
                    return <Step key={index}>
                        <StepLabel optional={S?.optional}>
                            {S.title}
                        </StepLabel>
                        <StepContent>
                            {S.content({ ...S, index })}
                            <Box sx={isLast ? { maxWidth: '300px', mx: 'auto', mt: 2 } : { mt: 2 }}>
                                <Button variant="contained" onClick={() => setActiveStep(activeStep + 1)} sx={{ mt: 1, float: 'right' }} fullWidth={isLast}>
                                    {isLast ? 'Register' : 'Continue'}
                                </Button>
                                <Button variant="text" onClick={() => setActiveStep(activeStep - 1)} disabled={index === 0} sx={{ mt: 1, float: 'left' }} fullWidth={isLast}>
                                    Back
                                </Button>
                            </Box>
                        </StepContent>
                    </Step>
                })}
                {activeStep >= steps.length ? (
                    <Box>
                        <CircularProgress />
                    </Box>
                ) : ''}
            </Stepper>
        </Box>
    </Box>
}

steps.push({
    title: 'Account',
    content: (step) => {
        const [firstName, setFirstName] = useState<string>('');
        const [lastName, setLastName] = useState<string>('');
        const [email, setEmail] = useState<string>('');
        const [password, setPassword] = useState<string>('');
        const [confirmPassword, setConfirmPassword] = useState<string>('');
        return <>
            <Typography variant="h5">Account Registration</Typography>
            <Typography>Please fill out the following fields to register for an account.</Typography>
            <br />
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextField label="First Name" type="text" placeholder="First Name" value={firstName} onChange={({ target: { value } }) => setFirstName(value)} fullWidth />
                </Grid>
                <Grid item xs={6}>
                    <TextField label="Last Name" type="text" placeholder="Last Name" value={lastName} onChange={({ target: { value } }) => setLastName(value)} fullWidth />
                </Grid>
                <Grid item xs={12}>
                    <TextField fullWidth type="email" name="email" placeholder='Email' label="Email" value={email} onChange={({ target: { value } }) => setEmail(value)} />
                </Grid>
                <Grid item xs={12}>
                    <TextField fullWidth type="password" name="password" placeholder='Password' label="Password" value={password} onChange={({ target: { value } }) => setPassword(value)} />
                </Grid>
                <Grid item xs={12}>
                    <TextField fullWidth type="password" name="confirmPassword" placeholder='Confirm Password' label="Confirm Password" value={confirmPassword} onChange={({ target: { value } }) => setConfirmPassword(value)} />
                </Grid>
            </Grid>
        </>
    },

})

steps.push({
    title: 'Demographics',
    content: (step) => <>
        <Typography variant="h5">Demographics</Typography>
        <Typography>Please fill out the following fields.</Typography>
    </>
})

steps.push({
    title: 'Preferences',
    content: (step) => <>
        <Typography variant="h5">Preferences</Typography>
        <Typography>Please fill out the following fields.</Typography>
    </>
})

steps.push({
    title: 'Review',
    content: (step) => <>
        <Typography variant="h5">Review</Typography>
        <Typography>Please confirm all fields look correct.</Typography>
        <Typography>(show fields)</Typography>
    </>
})