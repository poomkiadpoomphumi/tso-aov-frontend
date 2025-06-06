import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';

const steps = [
    { label: 'ผู้ทำการขออนุมัติร้องขอ', description: '' },
    { label: 'ส่งคำร้องขออนุมัติไปที่ผู้จัดการส่วน', description: 'ส่งคำขอไปที่ ผจ.ส่วน และส่งกลับไปที่ผู้ขอ', },
    { label: 'ส่งคำร้องขออนุมัติไปที่ผู้จัดการฝ่าย', description: 'ส่งคำขอไปที่ ผจ.ส่วน และ ผจ.ฝ่าย และส่งกลับไปที่ผู้ขอ' },
];

export const VerticalLinearStepperDigital = ({ value }) => {
    const [activeStep, setActiveStep] = useState(0);
    useEffect(() => {
        if (value === 3) {
            setActiveStep(1);
        }
        if (value === 4) {
            setActiveStep(2);
        }
    }, [value])
    return (
        <Box sx={{ maxWidth: 400 }}>
            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                    <Step key={step.label}>
                        <StepLabel
                            optional={
                                activeStep === 1 && index === 1 ? (
                                    <Typography variant="caption">{step.description}</Typography>
                                ) : activeStep === 2 && index === 2 ? (
                                    <Typography variant="caption">{step.description}</Typography>
                                ) : null
                            }
                        >
                            <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '13px' }}>
                                {step.label}
                            </Typography>
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
}

