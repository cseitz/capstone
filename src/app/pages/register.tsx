import { Button, CircularProgress, Grid, Step, StepContent, StepLabel, Stepper, TextField, Typography, useMediaQuery } from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { RegistrationData } from 'schema/user';
import { useAlert } from "ui/components/alert";
import Head from 'next/head'
import { title } from 'ui/components/navbar'

// List of steps in the registration form
// This is where each step is defined
const steps: {
    title: string;
    optional?: boolean;
    content: (step: (typeof steps[number]) & { index: number, active: boolean }) => JSX.Element
}[] = [];

// React Hook to pull and save to the browser's local state.
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
        data, // registration data
        errors: {}, // any errors in validation
        continue: false, // can we continue? used in next/continue button
        validate: (force: boolean = false) => { return {} }, // placeholder for validate function. overridden by steps.

        // used to pull state from the registration form, allowing persists through page reloads.
        useState<T = string>(key: keyof RegistrationData | string) {
            const [value, setValue] = useLocalState<T>('register.' + key, form.data[key], undefined);
            useEffect(() => {
                form.data[key] = value;
            }, [value]);
            return [value, setValue] as [T, typeof setValue]
        },

        // should reset form be shown?
        get showReset() {
            return Object.keys(storage).find(o => o.includes('register.'))
        },

        // reset the form and clear the value cache. run when registration succeeds.
        reset(reload = true) {
            const keys = Object.keys(storage).filter(o => o.includes('register.'));
            for (const key of keys) {
                storage.removeItem(key);
            }
            if (reload) location.reload();
        },

        submitted: false,

        // placeholder submit function. overriden by the register page.
        submit() {
            if (this.submitted) return;
            this.submitted = true;
            // console.log('submit', form.data);
            form.reset(false);
        }
    }
    // @ts-ignore
    form.errors.untouched = 'untouched';
    return form;
}

export default function RegisterPage() {
    // stepper step
    const [activeStep, setActiveStep] = useState(0);

    // registration form object
    const form = useContext(RegisterContext);
    const { showReset, reset, submit } = form;

    const isMobile = useMediaQuery('(max-width:600px)');

    const alert = useAlert();

    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState(null);

    const router = useRouter();

    // override form placeholder submit
    form.submit = function () {

        // go to the spinner circle page
        setActiveStep(steps.length + 1);

        // submit registration
        fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form.data),
        }).then(async res => {
            if (!res.ok) throw (await res.json())?.error;
            // show success message
            alert.success({
                message: 'Registered Account',
                duration: 2000,
            });

            // redirect
            router.push('/');
            form.reset(false);
        })
            .catch(err => {
                // return to previous step
                setActiveStep(steps.length - 1);
                setSubmitting(false);

                // show error
                setStatus(err);
                alert.error(err, {
                    unique: 'register.error',
                    duration: 2000
                });
            })
    }

    // All the steps turned into stepper entries
    const Steps = steps.map((S, index) => {
        const isLast = index == steps.length - 1;
        return <Step sx={{ pr: '16px' }} key={index}>
            <StepLabel optional={S?.optional}>
                {S.title}
            </StepLabel>
            <StepContent>
                {S.content({ ...S, index, active: activeStep == index })}
                <Box sx={isLast ? { maxWidth: '300px', mx: 'auto', mt: 2 } : { mt: 2 }}>
                    <Button disabled={submitting || Object.keys(form.errors || {}).length != 0 || !form.continue} variant="contained" onClick={() => Object.keys(form.validate(true) || {}).length == 0 && (activeStep == steps.length - 1 ? submit() : setActiveStep(activeStep + 1))} sx={{ mt: 1, float: 'right' }} fullWidth={isLast}>
                        {isLast ? 'Register' : 'Continue'}
                    </Button>
                    <Button variant="text" onClick={() => setActiveStep(activeStep - 1)} disabled={index === 0} sx={{ mt: 1, float: 'left' }} fullWidth={isLast}>
                        Back
                    </Button>
                </Box>
            </StepContent>
        </Step>
    });

    return <>
        <Head>
            <title>{title} - Register</title>
        </Head>
        <Box sx={{ mb: 3, mt: isMobile ? 4 : 10 }}>
            <Box sx={{ margin: 'auto', width: 'min(500px, 90vw)', textAlign: 'center' }}>

                <Typography variant={!isMobile ? 'h3' : 'h4'} style={{ textAlign: 'center', fontWeight: 'bold', marginTop: 25, marginBottom: 25 }}>
                    Register
                </Typography>


                <Stepper activeStep={activeStep} orientation="vertical">
                    {Steps}
                    {activeStep >= steps.length ? (
                        <Box>
                            <CircularProgress />
                        </Box>
                    ) : ''}
                </Stepper>


                {showReset && activeStep != steps.length - 0 && activeStep < steps.length - 1 ? <>
                    <Button onClick={() => reset(true)} sx={{ mt: 2, mb: 1 }}>
                        Reset Form
                    </Button>
                </> : ''}

            </Box>
        </Box>
    </>
}

const REQUIRED_TEXT = 'This field is required!';

// Add the account step.
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
            console.log('validate', { firstName, lastName, email, password, confirmPassword })
            if (!password) issues['password'] = REQUIRED_TEXT;
            if (password != confirmPassword) {
                issues['confirmPassword'] = 'Password does not match!'
            }
            if (!firstName) issues['firstName'] = REQUIRED_TEXT;
            if (!lastName) issues['lastName'] = REQUIRED_TEXT;
            if (!email) issues['email'] = REQUIRED_TEXT;
            else if (!/\S+@\S+\.\S+/.test(email)) issues['email'] = 'Not a valid email!';
            form.continue = Object.keys(issues).length == 0;
            setIsValid(Object.keys(issues).length == 0);
            if (!force) issues = Object.fromEntries(
                Object.entries(issues).filter(o => form.data[o[0]] != undefined)
            );
            setErrors(issues);
            return issues;
        }, fields);

        useEffect(() => {
            if (step.active) {
                form.errors = errors;
                form.validate = validate;
            }
            const timeout = setTimeout(validate, 500);
            return () => clearTimeout(timeout);
        }, fields);


        if (step.active) {
            form.continue = isValid;
        }

        return <>
            <Typography variant="h5">Account Registration</Typography>
            <Typography>Please fill out the following fields to register for an account.</Typography>

            <br />

            <Grid container spacing={2}>

                <Grid item xs={6}>
                    <TextField fullWidth label="First Name" type="text" placeholder="First Name"
                        value={firstName} onChange={({ target: { value } }) => setFirstName(value)}
                        error={Boolean(errors?.firstName)} helperText={errors?.firstName} />
                </Grid>

                <Grid item xs={6}>
                    <TextField fullWidth label="Last Name" type="text" placeholder="Last Name" value={lastName}
                        onChange={({ target: { value } }) => setLastName(value)}
                        error={Boolean(errors?.lastName)} helperText={errors?.lastName} />
                </Grid>

                <Grid item xs={12}>
                    <TextField fullWidth type="email" name="email" placeholder='Email' label="Email"
                        value={email} onChange={({ target: { value } }) => setEmail(value)}
                        error={Boolean(errors?.email)} helperText={errors?.email} />
                </Grid>

                <Grid item xs={12}>
                    <TextField fullWidth type="password" name="password" placeholder='Password' label="Password" value={password}
                        onChange={({ target: { value } }) => setPassword(value)}
                        error={Boolean(errors?.password)} helperText={errors?.password} />
                </Grid>

                <Grid item xs={12}>
                    <TextField fullWidth type="password" name="confirmPassword" placeholder='Confirm Password' label="Confirm Password"
                        value={confirmPassword} onChange={({ target: { value } }) => setConfirmPassword(value)}
                        error={Boolean(errors?.confirmPassword)} helperText={errors?.confirmPassword} />
                </Grid>

            </Grid>
        </>
    },

})

// Add the review step.
// Shows essential information as confirmation before registration.
steps.push({
    title: 'Review',
    content: (step) => {
        const form = useContext(RegisterContext);
        const { firstName, lastName, email } = form.data;

        form.errors = {};
        form.continue = true;
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