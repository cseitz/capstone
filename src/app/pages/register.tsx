import { Button, CircularProgress, Grid, Paper, Step, StepContent, StepLabel, Stepper, TextField, Typography, useMediaQuery } from "@mui/material";
import { Box } from "@mui/system";
import { uniqueId } from "lodash";
import { cloneElement, createContext, useCallback, useContext, useEffect, useState } from "react";
import type { RegistrationData } from 'schema/user';
import { useAlert } from "ui/components/alert";

const steps: {
    title: string;
    optional?: boolean;
    content: (step: (typeof steps[number]) & { index: number, active: boolean }) => JSX.Element
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


const RegisterContext = createContext<ReturnType<typeof RegisterForm>>(RegisterForm());

function RegisterForm() {
    const data: Partial<RegistrationData> = {

    }
    const form = {
        data,
        errors: {},
        validate: (force: boolean = false) => { return {} },
        useState<T = string>(key: keyof RegistrationData | string) {
            const [value, setValue] = useLocalState<T>('register.' + key, form.data[key], undefined);
            useEffect(() => {
                form.data[key] = value;
            }, [value]);
            return [value, setValue] as [T, typeof setValue]
        },
        get showReset() {
            return Object.keys(storage).find(o => o.includes('register.'))
        },
        reset(reload = true) {
            const keys = Object.keys(storage).filter(o => o.includes('register.'));
            for (const key of keys) {
                storage.removeItem(key);
            }
            if (reload) location.reload();
        },
        submitted: false,
        submit() {
            if (this.submitted) return;
            this.submitted = true;
            // fetch('/api/')
            console.log('submit', form.data);
            form.reset(false);
        }
    }
    return form;
}

export default function RegisterPage() {
    const [activeStep, setActiveStep] = useState(0);
    const form = useContext(RegisterContext);
    const { showReset, reset, submit } = form;

    const isMobile = useMediaQuery('(max-width:600px)');

    const alert = useAlert();
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState(null);
    form.submit = function() {
        fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form.data),
        }).then(async res => {
            if (!res.ok) throw (await res.json())?.error;
            // alert('registered');
            alert.success({
                message: 'Registered Account'
            });
            // router.push('/');
        })
        .catch(err => {
            setSubmitting(false);
            setStatus(err);
        })
    }


    return <Box sx={{ mb: 3, mt: isMobile ? 4 : 10 }}>
        <Box sx={{ margin: 'auto', width: 'min(500px, 90vw)', textAlign: 'center' }}>
            <Typography variant={!isMobile ? 'h3' : 'h4'} style={{ textAlign: 'center', fontWeight: 'bold', marginTop: 25, marginBottom: 25 }}>
                Register
            </Typography>
            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((S, index) => {
                    const isLast = index == steps.length - 1;
                    return <Step sx={{ pr: '16px' }} key={index}>
                        <StepLabel optional={S?.optional}>
                            {S.title}
                        </StepLabel>
                        <StepContent>
                            {S.content({ ...S, index, active: activeStep == index })}
                            <Box sx={isLast ? { maxWidth: '300px', mx: 'auto', mt: 2 } : { mt: 2 }}>
                                <Button disabled={submitting || Object.keys(form.errors || {}).length != 0} variant="contained" onClick={() => Object.keys(form.validate(true) || {}).length == 0 && (activeStep == steps.length - 1 ? submit() : setActiveStep(activeStep + 1))} sx={{ mt: 1, float: 'right' }} fullWidth={isLast}>
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
                <Button onClick={() => reset(true)} sx={{ mt: 2, mb: 1 }}>
                    Reset Form
                </Button>
            </> : ''}
        </Box>
    </Box>
}

const REQUIRED_TEXT = 'This field is required!';

steps.push({
    title: 'Account',
    content: (step) => {
        const form = useContext(RegisterContext);
        const [firstName, setFirstName] = form.useState('firstName');
        const [lastName, setLastName] = form.useState('lastName');
        const [email, setEmail] = form.useState('email');
        const [password, setPassword] = form.useState('password');
        const [confirmPassword, setConfirmPassword] = form.useState('confirmPassword');

        const [errors, setErrors] = useState<any>({});
        const [isValid, setIsValid] = useState(false);
        const fields = [firstName, lastName, email, password, confirmPassword];
        const validate = useCallback((force: boolean = false) => {
            let issues = {};
            // console.log('validate', { firstName, lastName, email, password, confirmPassword })
            if (!password) issues['password'] = REQUIRED_TEXT;
            if (password != confirmPassword) {
                issues['confirmPassword'] = 'Password does not match!'
            }
            if (!firstName) issues['firstName'] = REQUIRED_TEXT;
            if (!lastName) issues['lastName'] = REQUIRED_TEXT;
            if (!email) issues['email'] = REQUIRED_TEXT;
            else if (!/\S+@\S+\.\S+/.test(email)) issues['email'] = 'Not a valid email!';
            if (!force) issues = Object.fromEntries(
                Object.entries(issues).filter(o => form.data[o[0]] != undefined)
            );
            setErrors(issues);
            setIsValid(Object.keys(issues).length == 0);
            return issues;
        }, fields);
        // console.log({ issues })
        useEffect(() => {
            const timeout = setTimeout(validate, 500);
            return () => clearTimeout(timeout);
        }, fields);
        if (step.active) {
            form.errors = errors;
            form.validate = validate;
        }
        

        console.log(errors);

        return <>
            <Typography variant="h5">Account Registration</Typography>
            <Typography>Please fill out the following fields to register for an account.</Typography>
            <br />
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextField label="First Name" type="text" placeholder="First Name" value={firstName} onChange={({ target: { value } }) => setFirstName(value)} fullWidth error={Boolean(errors?.firstName)} helperText={errors?.firstName} />
                </Grid>
                <Grid item xs={6}>
                    <TextField label="Last Name" type="text" placeholder="Last Name" value={lastName} onChange={({ target: { value } }) => setLastName(value)} fullWidth error={Boolean(errors?.lastName)} helperText={errors?.lastName} />
                </Grid>
                <Grid item xs={12}>
                    <TextField fullWidth type="email" name="email" placeholder='Email' label="Email" value={email} onChange={({ target: { value } }) => setEmail(value)} error={Boolean(errors?.email)} helperText={errors?.email} />
                </Grid>
                <Grid item xs={12}>
                    <TextField fullWidth type="password" name="password" placeholder='Password' label="Password" value={password} onChange={({ target: { value } }) => setPassword(value)} error={Boolean(errors?.password)} helperText={errors?.password} />
                </Grid>
                <Grid item xs={12}>
                    <TextField fullWidth type="password" name="confirmPassword" placeholder='Confirm Password' label="Confirm Password" value={confirmPassword} onChange={({ target: { value } }) => setConfirmPassword(value)} error={Boolean(errors?.confirmPassword)} helperText={errors?.confirmPassword} />
                </Grid>
            </Grid>
        </>
    },

})

steps.push({
    title: 'Review',
    content: (step) => {
        const form = useContext(RegisterContext);
        const { firstName, lastName, email, password } = form.data;
        form.errors = {};
        form.validate = (force = false) => ({});
        return <>
            <Typography variant="h5">Review</Typography>
            <Typography>Please confirm all fields look correct.</Typography>
            <br />
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextField disabled label="First Name" type="text" placeholder="First Name" value={firstName} fullWidth />
                </Grid>
                <Grid item xs={6}>
                    <TextField disabled label="Last Name" type="text" placeholder="Last Name" value={lastName} fullWidth />
                </Grid>
                <Grid item xs={12}>
                    <TextField disabled fullWidth type="email" name="email" placeholder='Email' label="Email" value={email} />
                </Grid>
            </Grid>
        </>
    }
})