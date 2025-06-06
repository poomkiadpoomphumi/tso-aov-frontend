import React, { useState } from "react";
import {
    TextField, Button, Grid, CardContent, Box, MenuItem
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const FileShareRequest = () => {
    const fields = [
        { name: "foldername", label: "ชื่อแฟ้ม", required: true },
        { name: "departmentownerfolder", label: "ชื่อหน่วยงานเจ้าของแฟ้ม", required: true, select: true },
        { name: "foldersize", label: "ขนาดแฟ้ม (GB)", required: true },
        { name: "permission", label: "รายชื่อพนักงานนอกหน่วยงานที่มีสิทธิ์เข้าใช้", helperText: "(R=Read,W=Write)", required: true },
        { name: "objective", label: "วัตถุประสงค์ในการขอใช้", required: true, multiline: true, minRows: 10 },
    ];

    const departmentOptions = [
        { value: "hr", label: "ฝ่ายบุคคล" },
        { value: "it", label: "ฝ่ายไอที" },
        { value: "finance", label: "ฝ่ายการเงิน" },
    ];

    const [formValues, setFormValues] = useState(() =>
        Object.fromEntries(fields.map(field => [field.name, ""]))
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({ ...prev, [name]: value }));
    };

    const handleClear = () => {
        setFormValues(Object.fromEntries(fields.map(field => [field.name, ""])));
    };

    return (
        <CardContent>
            <Grid container spacing={2}>
                {fields.map((field) => (
                    field.name === "departmentownerfolder" ? (
                        <Grid item xs={12} key={field.name}>
                            <TextField
                                select
                                variant="outlined"
                                color="primary"
                                fullWidth
                                required={field.required}
                                name={field.name}
                                label={field.label}
                                helperText={field.helperText || ""}
                                value={formValues[field.name]}
                                onChange={handleChange}
                            >
                                {departmentOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    ) : field.name === "permission" ? (
                        <Grid item xs={12} key={field.name}>
                            <Grid container spacing={1} alignItems="stretch">
                                <Grid item xs={10}>
                                    <Box sx={{ height: '100%' }}>
                                        <TextField
                                            variant="outlined"
                                            color="primary"
                                            fullWidth
                                            required={field.required}
                                            name={field.name}
                                            label={field.label}
                                            helperText={field.helperText || ""}
                                            multiline={field.multiline || false}
                                            minRows={field.minRows || undefined}
                                            value={formValues[field.name]}
                                            onChange={handleChange}
                                            sx={{ height: '100%' }}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={2} sx={{ display: 'flex' }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        sx={{ height: '70%', whiteSpace: 'nowrap' }}
                                        onClick={() => alert("Add new department")}
                                    >
                                        ตรวจสอบรายชื่อ
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>

                    ) : (
                        <Grid item xs={12} key={field.name}>
                            <TextField
                                variant="outlined"
                                color="primary"
                                fullWidth
                                required={field.required}
                                name={field.name}
                                label={field.label}
                                helperText={field.helperText || ""}
                                multiline={field.multiline || false}
                                minRows={field.minRows || undefined}
                                value={formValues[field.name]}
                                onChange={handleChange}
                            />
                        </Grid>
                    )
                ))}
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 1 }}>
                <Button variant="outlined" size="small" color="warning" onClick={handleClear}>
                    Clear
                </Button>
                <Button variant="contained" size="small" endIcon={<SendIcon />}>
                    Submit
                </Button>
            </Box>
        </CardContent>
    );
};


export default FileShareRequest;