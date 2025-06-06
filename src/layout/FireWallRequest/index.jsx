import React from "react";
import { TextField, Button, Grid, CardContent, Box } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EnhancedTable from "./table";
import Loader from "../../component/Loader/Loader";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AlertDialogSlide from "./alert";
import DrawIcon from '@mui/icons-material/Draw';
import { updateDataFireWall, getDataFormSent, getsettings, Delete } from "../../axios/handleSubmit";
import { useNavigate, useLocation } from 'react-router-dom';
import CloudDoneIcon from '@mui/icons-material/CloudDone';

import DeleteIcon from '@mui/icons-material/Delete';
import DialogContentX from '../../component/Dialog/index';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import LinearBuffer from "../../component/Loader/LinearBuffer";
import { keyframes } from '@mui/system';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const FireWallRequest = ({ profilePromise, id, rawData, setRawData, setSettingData }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [status, setStatus] = React.useState('wait');
    const [errors, setErrors] = React.useState({});
    const [access, setAccess] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [open, setOpen] = React.useState({ 0: false, 1: false, 2: false, 3: false });
    const [openDialog, setOpenDialog] = React.useState(false);
    const [fileName, setFileName] = React.useState('');
    const [selectedFile, setSelectedFile] = React.useState(null);
    const [readOnly, setReadOnly] = React.useState(false);
    const [draft, setDraft] = React.useState(false);
    const [_delete, setDelete] = React.useState(false);
    const [newComment, setNewComment] = React.useState('');
    const [formData, setFormData] = React.useState({
        jobName: 'แก้ไข Firewall Policy สำหรับระบบ',
        coordinatorName: '',
        requesterCode: '',
        requesterEmail: '',
        department: '',
        contactNumber: '',
        systemRequested: '',
        usageReason: '',
        access: access,
        fileName: '',
        FileNameServer: '',
        system: 'Firewall request',
        actionLine: [],
        comment: [],
    });

    React.useEffect(() => {
        const getDataForm = async () => {
            setLoading(true);
            try {
                if (id) {
                    const response = await getDataFormSent(id);
                    //setReadOnly(true);
                    setFileName(response?.fileName || '');
                    setButtonColor('#28a728');
                    setAccess(response?.access || []);
                    setDraft(response?.sectionHeadStatus === 'draft');
                    setReadOnly(
                        response?.sectionHeadStatus === 'wait' ||
                        (response?.sectionHeadStatus === 'approved' && response?.departmentHeadStatus === 'wait') ||
                        (response?.sectionHeadStatus === 'approved' && response?.departmentHeadStatus === 'approved') ||
                        response?.requesterCode !== profilePromise?.code
                    );

                    setFormData((prev) => ({
                        ...prev,
                        coordinatorName: response?.coordinatorName || '',
                        requesterCode: response?.requesterCode,
                        requesterEmail: response?.requesterEmail || '',
                        department: response?.department || '',
                        contactNumber: response?.contactNumber || '',
                        systemRequested: response?.systemRequested || '',
                        usageReason: response?.usageReason || '',
                        access: response?.access || [],
                        fileName: response?.fileName || '',
                        FileNameServer: response?.FileNameServer || '',
                        system: response?.system || '',
                        actionLine: response?.actionLine || [],
                        comment: response?.comment || [],
                    }));
                    setRawData(response);
                } else {
                    if (profilePromise) {
                        setFormData((prev) => ({
                            ...prev,
                            coordinatorName: profilePromise?.fname + ' ' + profilePromise?.lname || '',
                            requesterCode: profilePromise?.code,
                            requesterEmail: profilePromise?.emailaddr || '',
                            department: profilePromise?.unitabbr || '',
                            contactNumber: profilePromise?.mobile || '',
                        }));
                        setLoading(false);
                    } else {
                        setLoading(true);
                    }
                    const fecthSettings = async () => {
                        const setting = await getsettings('firewall');
                        setSettingData(setting.data[0].to);
                    }
                    fecthSettings()
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setTimeout(() => { setLoading(false); }, 300)
            }
        };
        getDataForm();
        const errorHandler = (e) => {
            if (
                e.message.includes("ResizeObserver loop completed with undelivered notifications") ||
                e.message.includes("ResizeObserver loop limit exceeded")
            ) {
                const resizeObserverErr = document.getElementById("webpack-dev-server-client-overlay");
                if (resizeObserverErr) { resizeObserverErr.style.display = "none"; }
            }
        };
        window.addEventListener("error", errorHandler);
        return () => { window.removeEventListener("error", errorHandler); };
    }, [id, profilePromise]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const setAccessItems = () => {
        const isDuplicate = (item, list) => list.some(i => JSON.stringify(i) === JSON.stringify(item));
        const newAccessItems = access.filter(item => !isDuplicate(item, formData.access));
        setFormData((prevFormData) => ({
            ...prevFormData,
            access: [...formData.access, ...newAccessItems]
        }));
    }
    const handleSubmit = (button) => {
        if (button === 'save') {
            setStatus('draft');
            setOpen(prev => ({ ...prev, 2: true })); // set alert to send data
            setAccessItems();
        } else {
            const requiredFields = ['coordinatorName', 'department', 'contactNumber', 'systemRequested', 'usageReason', 'fileName'];
            const newErrors = {};
            requiredFields.forEach(field => {
                if (!formData[field] || formData[field].trim() === '') {
                    newErrors[field] = 'This field is required';
                    if (field === 'fileName') {
                        setButtonColor('#ff413a'); // set error color
                        setTimeout(() => {
                            setButtonColor('primary'); // revert back after 3 seconds (replace with your default)
                        }, 3000);
                    }
                }
            });
            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                // Optional: Clear errors after 3 seconds
                setTimeout(() => setErrors({}), 3000);
                return;
            }
            if (!access || access.length === 0) { setOpen(prev => ({ ...prev, 0: true })); return; }

            setAccessItems()

            setOpen(prev => ({ ...prev, 1: true })); // set alert to send data
        }

    };

    const [buttonColor, setButtonColor] = React.useState('primary');
    const handleFileChange = (event) => {
        setButtonColor('#28a728');
        const file = event.target.files[0];
        const fileName = event.target.files[0].name;
        setFileName(fileName);
        setFormData({ ...formData, fileName: fileName });
        setSelectedFile(file);
    }

    const handleSubmitForm = () => {
        const updatedFormData = { ...formData, comment: [...formData.comment, { text: 'ส่งแบบฟอร์ม', updateAt: '' }] };
        localStorage.setItem('sendForm', 'sent');
        setStatus('wait');
        const payload = new FormData();
        payload.append('file', selectedFile);
        payload.append('formValues', JSON.stringify(updatedFormData));
        payload.append('status', status);
        payload.append('id', id);
        setLoading(true);
        updateDataFireWall(payload); // This function must accept FormData
        setTimeout(() => {
            setLoading(false);
            navigate(`/`);
        }, 1000);
    }

    const handleDelete = async (id) => {
        const response = await Delete(id);
        if (response.data) {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                localStorage.setItem('sendForm', 'sent');
                localStorage.setItem('delete', 'delete');
                navigate(`/MyList`)
            }, 100);
        }
    }

    const fields = [
        { xs: 4, label: 'ชื่อผู้ประสานงาน ชื่อ - นามสกุล', name: 'coordinatorName' },
        { xs: 4, label: 'อีเมล', name: 'department' },
        { xs: 4, label: 'เบอร์ติดต่อ', name: 'contactNumber' },
        { xs: 12, label: 'ระบบ', name: 'systemRequested' },
        { xs: 12, label: 'เหตุผล', name: 'usageReason', minRows: 5 },
    ];

    const cancel = () => {
        if (location.pathname === '/FireWallRequestForm') {
            navigate(`/dashboard/default`)
        } else {
            localStorage.setItem('cancel', 'cancel');
            navigate(`/MyList`)
        }
    }
    const [recall, setRecall] = React.useState(false);
    const [showErrorRecall, setShowErrorRecall] = React.useState(false);
    const RECALL = () => { setOpen(prev => ({ ...prev, 3: true })); setStatus('draft'); setAccessItems(); }
    const ConfirmRecall = () => {
        if (!newComment.trim()) {
            setShowErrorRecall(true);
        } else {
            setRecall(true);
            setOpen(prev => ({ ...prev, 3: false }));
            const updatedFormData = { ...formData, comment: [...formData.comment, { text: newComment, updateAt: '' }] };
            setRecall(true);
            setStatus('draft');
            localStorage.setItem('sendForm', 'sent');
            const payload = new FormData();
            payload.append('file', selectedFile);
            payload.append('formValues', JSON.stringify(updatedFormData));
            payload.append('status', status);
            payload.append('id', id);
            payload.append('recall', true);// set true to recall
            setTimeout(() => {
                updateDataFireWall(payload)
                setLoading(false);
                navigate(`/`);
            }, 5000)
        }

    }

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Loader />
            </Box>
        );
    }

    return (
        <>
            <CardContent>
                {open[0] && (
                    <AlertDialogSlide
                        index={0}
                        title="Firewall Access!"
                        text="Please add at least one access item Firewall Access."
                        open={open}
                        setOpen={setOpen}
                        nextFuntion={setOpenDialog}
                    />
                )}
                {open[1] && (
                    <AlertDialogSlide
                        index={1}
                        title="Are you sure submit?"
                        text="You won't be able to revert this! This form cannot be edited once you submit."
                        open={open}
                        setOpen={setOpen}
                        nextFuntion={handleSubmitForm}
                    />
                )}
                {open[2] && (
                    <AlertDialogSlide
                        index={2}
                        title="Are you sure draft?"
                        text="You will still be able to edit and submit forms and can view drafts in the My list."
                        open={open}
                        setOpen={setOpen}
                        nextFuntion={handleSubmitForm}
                    />
                )}
                {open[3] && (
                    <AlertDialogSlide
                        index={3}
                        title="Are you sure Recall?"
                        text="Are you sure you want to retrieve all data and the system will send an email to notify the approver? and back to status draft."
                        open={open}
                        setOpen={setOpen}
                        recall={true}
                        error={showErrorRecall}
                        nextFuntion={ConfirmRecall}
                        component={
                            <Box sx={{ marginTop: '10px' }}>
                                <TextField size='small' sx={{ width: '100%' }} placeholder="comment"
                                    error={!newComment.trim() && showErrorRecall}
                                    helperText={showErrorRecall ? 'กรุณากรอกความคิดเห็นก่อนเรียกคืนเอกสาร' : ''}
                                    onChange={(e) => setNewComment(e.target.value)} />
                            </Box>
                        }
                    />
                )}

                <br />
                <Grid container alignItems="center" spacing={3}>
                    {fields.map((field, index) => (
                        <Grid item xs={field.xs} key={index}>
                            <TextField
                                type="text"
                                variant="outlined"
                                color="primary"
                                label={field.label}
                                fullWidth
                                required
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleInputChange}
                                multiline={!!field.minRows}
                                minRows={field.minRows || 1}
                                error={!!errors[field.name]}
                                helperText={errors[field.name]}
                                InputProps={{ readOnly: readOnly }}
                            />
                        </Grid>
                    ))}

                </Grid><br />

                <EnhancedTable access={access} setAccess={setAccess} openDialog={openDialog} setOpenDialog={setOpenDialog} readOnly={readOnly} />

                <br />
                <Box sx={{ width: '100%', marginBottom: '10px', display: 'inline-flex', alignItems: 'center' }}>
                    Add Attachments
                    {((!id && !readOnly) || draft) && (
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="flex-start"
                            sx={{ marginLeft: '10px' }}
                        >
                            <span style={{ marginTop: 0, color: 'red', width: '100%' }}>
                                Maximum File Size is 10 MB*
                            </span>
                        </Box>
                    )}
                </Box>


                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: '10px' }}>
                    {readOnly ? (
                        <Box display="flex" flexDirection="column" alignItems="flex-start">
                            <a
                                href={`http://localhost:6006/api/uploads/firewall-project/${formData.FileNameServer}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                download={formData.fileName}
                            >
                                <Button
                                    variant="text"
                                    color="success"
                                    size="small"
                                    endIcon={<CloudDoneIcon />}
                                    style={{ textTransform: 'none' }}
                                >
                                    {!formData.fileName ? 'Undefined' : formData.fileName}
                                </Button>
                            </a>
                        </Box>
                    ) : (
                        <>
                            <Button
                                variant="contained"
                                component="label"
                                startIcon={<CloudUploadIcon />}
                                size="small"
                                sx={{
                                    backgroundColor: buttonColor,
                                    color: 'white',
                                    width: '30%',
                                    '&:hover': { backgroundColor: '#135ba1' },
                                }}
                            >
                                {'Add Attachments'}
                                <input type="file" accept=".ppt,.pptx" onChange={handleFileChange} hidden />
                            </Button>
                            <Box component="span" sx={{ color: 'blue', textDecoration: 'underline', fontSize: '15px' }}>
                                {fileName}
                            </Box>
                        </>
                    )}

                </Box><br />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 1 }}>
                    {draft ? (
                        <Button
                            color="error"
                            variant="contained"
                            onClick={() => setDelete(true)}
                            endIcon={<DeleteIcon />}
                            size="small"
                        >
                            DELETE
                        </Button>
                    ) : id ? (
                        <Button
                            variant="contained"
                            sx={{
                                color: '#fff',
                                backgroundColor: '#f4a100',
                                '&:hover': { backgroundColor: '#84652a' },
                            }}
                            onClick={cancel}
                            startIcon={<ArrowBackIcon />}
                            size="small"
                        >
                            BACK
                        </Button>
                    ) : (
                        <Button variant="contained" size="small" color="error" onClick={cancel}>
                            Cancel
                        </Button>
                    )}
                    {
                        !draft && readOnly && rawData?.requesterCode === profilePromise?.code &&
                        (rawData?.sectionHeadStatus !== 'approved' && rawData?.departmentHeadStatus !== 'approved' ||
                            rawData?.sectionHeadStatus === 'approved' && rawData?.departmentHeadStatus === 'wait') &&
                        (
                            <Button
                                variant="outlined"
                                size="small"
                                color="info"
                                startIcon={
                                    <AutorenewIcon
                                        sx={recall ? { animation: `${spin} 1s linear infinite` } : {}}
                                    />
                                }
                                onClick={RECALL}
                            >
                                RECALL
                            </Button>
                        )}
                    <Button variant="outlined" size="small" color="warning" endIcon={<DrawIcon />} onClick={() => { handleSubmit('save') }} disabled={readOnly}>
                        Save
                    </Button>
                    <Button variant="contained" size="small" endIcon={<SendIcon />} onClick={handleSubmit} disabled={readOnly}>
                        Submit
                    </Button>
                </Box>
            </CardContent>{recall && (<LinearBuffer />)}
            <DialogContentX
                _delete={_delete}
                setDelete={setDelete}
                handleDelete={handleDelete}
                id={id}
            />
        </>
    );
};

export default FireWallRequest;