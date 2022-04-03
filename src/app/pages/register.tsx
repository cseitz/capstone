import { Button, CircularProgress, Grid, Paper, Step, StepContent, StepLabel, Stepper, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LoginRegisterContainer } from "./login";


const steps: {
    title: string;
    optional?: boolean;
    content: (step: (typeof steps[number]) & { index: number }) => JSX.Element
}[] = [];


const storage = typeof window == 'undefined' ? {
    getItem(key: string) { return null },
    setItem(key: string, value: any) { },
    removeItem(key: string) { },
} : localStorage;
function useLocalState<T = string>(key: string, defaultValue: T, caster: (value: any) => T = (value: any) => value) {
    const [value, setValue] = useState<T>(caster(storage.getItem(key) as any || defaultValue));
    return [
        value,
        ((value: Parameters<typeof setValue>[0]) => {
            setValue(value);
            storage.setItem(key, value as any);
            return;
        }) as typeof setValue,
    ] as [T, typeof setValue];
}

export default function RegisterPage() {
    const [activeStep, setActiveStep] = useState(0);
    const showReset = Object.keys(storage).find(o => o.includes('register.'));
    const resetForm = useCallback(function (reload: boolean = true) {
        const keys = Object.keys(storage).filter(o => o.includes('register.'));
        for (const key of keys) {
            storage.removeItem(key);
        }
        if (reload) location.reload();
    }, []);
    return <Box sx={{ mb: 3, mt: 10 }}>
        <Box sx={{ margin: 'auto', width: 'min(500px, 90vw)', textAlign: 'center' }}>
            <Typography variant="h3" style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', marginTop: 25, marginBottom: 25 }}>
                Register
            </Typography>
            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((S, index) => {
                    const isLast = index == steps.length - 1;
                    return <Step key={index} sx={{ pr: '16px' }}>
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
            {showReset && activeStep != steps.length - 0 ? <>
                <Button onClick={() => resetForm(true)} sx={{ mt: 2, mb: 1 }}>
                    Reset Form
                </Button>
            </> : ''}
        </Box>
    </Box>
}

steps.push({
    title: 'Account',
    content: (step) => {
        const [firstName, setFirstName] = useLocalState<string>('register.firstName', '');
        const [lastName, setLastName] = useLocalState<string>('register.lastName', '');
        const [email, setEmail] = useLocalState<string>('register.email', '');
        const [password, setPassword] = useLocalState<string>('register.password', '');
        const [confirmPassword, setConfirmPassword] = useLocalState<string>('register.confirmPassword', '');
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
    content: (step) => {

        return <>
            <Typography variant="h5">Demographics</Typography>
            <Typography>Please fill out the following fields.</Typography>
        </>
    }
})

steps.push({
    title: 'Preferences',
    content: (step) => {

        return <>
            <Typography variant="h5">Preferences</Typography>
            <Typography>Please fill out the following fields.</Typography>
        </>
    }
})

steps.push({
    title: 'Review',
    content: (step) => <>
        <Typography variant="h5">Review</Typography>
        <Typography>Please confirm all fields look correct.</Typography>
        <Typography>(show fields)</Typography>
    </>
})