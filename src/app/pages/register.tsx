import { Button, Paper, Step, StepContent, StepLabel, Stepper, Typography } from "@mui/material";
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
        <Box sx={{ margin: 'auto', width: 'min(800px, 80vw)' }}>
            <Typography variant="h3" style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', marginTop: 25, marginBottom: 25 }}>
                Register
            </Typography>
            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((S, index) => (
                    <Step key={index}>
                        <StepLabel optional={S?.optional}>
                            {S.title}
                        </StepLabel>
                        <StepContent>
                            {S.content({ ...S, index })}
                            <Box sx={{ mb: 2 }}>
                                <Button variant="contained" onClick={() => setActiveStep(activeStep + 1)} sx={{ mt: 1, mr: 1 }}>
                                    {index == steps.length - 1 ? 'Register' : 'Continue'}
                                </Button>
                                <Button variant="text" onClick={() => setActiveStep(activeStep - 1)} disabled={index === 0} sx={{ mt: 1, mr: 1 }}>
                                    Back
                                </Button>
                            </Box>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
        </Box>
    </Box>
}

steps.push({
    title: 'First Step',
    content: (step) => <>
        <Typography>{step.title}</Typography>
    </>,

})

steps.push({
    title: 'Second Step',
    content: (step) => <>
        <Typography>{step.title}</Typography>
    </>
})

steps.push({
    title: 'Third Step',
    content: (step) => <>
        <Typography>{step.title}</Typography>
    </>
})