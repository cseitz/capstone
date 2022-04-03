import { Button, CircularProgress, FormControl, FormHelperText, FormLabel, Grid, Paper, RadioGroup, Step, StepContent, StepLabel, Stepper, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { cloneElement, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";


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


const RegisterContext = createContext<ReturnType<typeof RegisterForm>>(RegisterForm());

type RegistrationData = {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    confirmPassword: string;
};

function RegisterForm() {
    const data: RegistrationData = {
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: '',
    }
    return {
        data,
        useState<T = string>(key: keyof RegistrationData) {
            const [value, setValue] = useLocalState<T>('register.' + key, this.data[key]);
            useEffect(() => {
                this.data[key] = value;
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
        submit() {
            console.log(this.data);
            this.reset(false);
        }
    }
}

export default function RegisterPage() {
    const [activeStep, setActiveStep] = useState(0);
    const form = useContext(RegisterContext);
    const { showReset } = form;
    return <Box sx={{ mb: 3, mt: 10 }}>
        <Box sx={{ margin: 'auto', width: 'min(500px, 90vw)', textAlign: 'center' }}>
            <Typography variant="h3" style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', marginTop: 25, marginBottom: 25 }}>
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
                            {S.content({ ...S, index })}
                            <Box sx={isLast ? { maxWidth: '300px', mx: 'auto', mt: 2 } : { mt: 2 }}>
                                <Button variant="contained" onClick={() => activeStep == steps.length - 1 ? form.submit() : setActiveStep(activeStep + 1)} sx={{ mt: 1, float: 'right' }} fullWidth={isLast}>
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
                <Button onClick={() => form.reset(true)} sx={{ mt: 2, mb: 1 }}>
                    Reset Form
                </Button>
            </> : ''}
        </Box>
    </Box>
}


const REQUIRED_TEXT = 'This field is required!';
function ValidatedInput(props: {
    children: any,
    label?: string,
    value?: any,
    onChange?: any,
    validate?: (value: any) => string,
    required?: boolean,
    enforced?: boolean,
}) {
    let { children, label, value, onChange, validate, required, enforced } = props;
    if (required) {
        validate = (value: string) => value ? (props.validate ? props.validate(value) : undefined) : REQUIRED_TEXT;
    }
    if (onChange) onChange = props.onChange ? ({ target }) => props.onChange((target as any).value) : undefined;
    const [touched, setTouched] = useState(enforced);
    if (enforced && !touched) setTouched(true);
    let error = useMemo(() => validate(value), [value]);
    if (!touched) error = undefined;
    const isValid = !error || !touched;
    useEffect(() => {
        console.log('changed', value);
        if (!touched && value) setTouched(true);
    }, [value]);
    const passed = {
        label,
        placeholder: label,
        onChange,
        value,
        error: !isValid,
        helperText: error
    }
    const failed = {}
    for (const key in passed) {
        if (!children?.type?.propTypes?.[key]) {
            failed[key] = passed[key];
            delete passed[key];
        }
    }
    console.log({ failed })
    const element = cloneElement(children, passed);
    return <FormControl error={Boolean(error)}>
        {label && failed?.['label'] ? <FormLabel>{label}</FormLabel> : ''}
        {element}
        {error && failed?.['helperText'] ? <FormHelperText>{error}</FormHelperText> : ''}
    </FormControl>
}


steps.push({
    title: 'Account',
    content: (step) => {
        const form = useContext(RegisterContext);
        const [firstName, setFirstName] = form.useState('firstName');
        const [lastName, setLastName] = form.useState('lastName');
        const [email, setEmail] = form.useState('email');
        const [password, setPassword] = form.useState('password');
        const [confirmPassword, setConfirmPassword] = form.useState('confirmPassword');

        const [issues, setIssues] = useState<any>({});
        const [isValid, setIsValid] = useState(false);
        const validate = useCallback(() => {
            const issues = {};
            if (password != confirmPassword) {
                issues['confirmPassword'] = 'Password does not match!'
            }
            if (!firstName) issues['firstName'] = REQUIRED_TEXT;
            if (!lastName) issues['lastName'] = REQUIRED_TEXT;
            if (!email) issues['email'] = REQUIRED_TEXT;
            else if (!/\S+@\S+\.\S+/.test(email)) issues['email'] = 'Not a valid email!';
            setIssues(issues);
            setIsValid(Object.keys(issues).length == 0);
            return issues;
        }, [firstName, lastName, email, password, confirmPassword]);

        return <>
            <Typography variant="h5">Account Registration</Typography>
            <Typography>Please fill out the following fields to register for an account.</Typography>
            <br />
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    {/* <TextField label="First Name" type="text" placeholder="First Name" value={firstName} onChange={({ target: { value } }) => setFirstName(value)} onBlur={() => firstName && validate()} fullWidth /> */}
                    <ValidatedInput label="First Name" onChange={setFirstName} value={firstName} required>
                        <TextField type="text" fullWidth />
                        {/* <RadioGroup /> */}
                    </ValidatedInput>
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