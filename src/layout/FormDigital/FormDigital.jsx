import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import SendIcon from '@mui/icons-material/Send';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import {
  TextField, Button, Grid, Stack, CardContent, Typography, Box, Accordion,
  AccordionSummary, AccordionDetails
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { uploadFile, getCodeImg, Delete, isMaxHlvEmployer } from '../../axios/handleSubmit';
import { useNavigate, useLocation } from 'react-router-dom';
import { Item } from './Item';
import Loader from '../../component/Loader/Loader';
import MaxLevel from '../../component/error/MaxLavel';
import DrawIcon from '@mui/icons-material/Draw';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import DescriptionIcon from '@mui/icons-material/Description';
import ExternalUser from '../../component/external/index.jsx';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import useIsMobile from '../Mobile/isMobile.jsx';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DialogContentX from '../../component/Dialog/index';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import LinearBuffer from "../../component/Loader/LinearBuffer";
import { keyframes } from '@mui/system';
import AlertDialogSlide from "../FireWallRequest/alert";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const FromDigital = ({
  data, id, profilePromise, checkStatus, setCheckStatus, setComment, setComment1, setComment2, setApprover, setWait,
  setReject, isDraft, setIsDraft, setNextApproved, setSectionHeadCode, setTicketId
}) => {

  const isMobile = useIsMobile();
  const docotherRef = useRef(null);
  const lawotherRef = useRef(null);
  const lawRef = useRef(null);
  const notlawRef = useRef(null);
  const notmainRef = useRef(null);
  const mainRef = useRef(null);
  const effectiveRef = useRef(null);
  const effRef = useRef(null);
  const location = useLocation();
  const unitRef = useRef(null);
  const customerRef = useRef(null);
  const otherRef = useRef(null);
  const mobileRef = useRef(null);
  const webRef = useRef(null);
  const otherPlatformRef = useRef(null);
  const sectionApproved = useRef(null);
  const departApproved = useRef(null);
  const MocApproved = useRef(null);
  const OtherApproved = useRef(null);
  const navigate = useNavigate();
  const [worktype, setworktype] = useState('');
  const [natureWork, setnatureWork] = useState('');
  const [file, setFile] = useState('');
  const [file1, setFile1] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileName1, setFileName1] = useState('');
  const [buttonColor, setButtonColor] = useState('primary');
  const [buttonColor1, setButtonColor1] = useState('primary');
  const [loading, setLoading] = useState(true);
  const [openSendForm, setOpenSendForm] = useState(false);
  const [OpenFileSzie, setOpenFileSzie] = useState(false);
  const [OpenError, setOpenError] = useState(false);
  const [checkReject, setCheckReject] = useState(false);
  const [openDraft, setOpenDraft] = useState(false);
  const [status, setStatus] = useState('');
  const userLocalToken = useMemo(() => localStorage.getItem('tokenUser'), []);
  const [checkedTarget, setCheckedTarget] = useState({ 0: false, 1: false, 2: false })
  const [checkedPlatform, setCheckedPlatform] = useState({ 0: false, 1: false, 2: false })
  const [ApprovedBy, setApprovedBy] = useState({ 0: false, 1: false, 2: false })
  const [checkedImpact, setCheckedImpact] = useState({ 0: false, 1: false, 2: false, 3: false })
  const [checkedCompli, setCheckedCompli] = useState({ 0: false, 1: false, 2: false, 3: false })
  const [errorText, setErrorText] = useState('');
  const [_delete, setDelete] = useState(false);
  const [external, setExternal] = useState(false);
  const [expandedPlatform, setExpandedPlatform] = useState(false);
  const [expandedTarget, setExpandedTarget] = useState(false);
  const [expandedValueImpact, setExpandedValueImpact] = useState(false);
  const [expandedValueCompli, setExpandedValueCompli] = useState(false);
  const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB in bytes
  const [display, setDisplay] = useState(false);
  const [updateAt, setUpdateAt] = useState('');
  const [OpenAddSystem, setOpenAddSystem] = useState(false);
  const [openAccept, setOpenAccept] = useState(false);
  const [alertPpt, setFilePptAlert] = useState(false);
  const [alertXlsx, setFileXlsxAlert] = useState(false);
  const [newComment, setNewComment] = React.useState('');
  //create object send to database
  const [formValues, setFormValues] = useState({
    coordinatorName: '',
    contactNumber: '',
    department: '',
    requesterCode: '',
    requesterEmail: '',
    jobName: '',
    objectives: '',
    jobDetails: '',
    benefits: '',
    workType: '',
    natureOfWork: '',
    fileName: '',
    fileName1: '',
    system: 'Digital request',
    connecterRequest: {},
    ValueTarget: { 'agency': '', 'client': '', 'otherTg': '' },
    ValuePlatform: { 'mobile': '', 'web': '', 'other': '' },
    ValueImpact: { 'efficiency': '', 'effective': '', 'main': '', 'notmain': '' },
    ValueCompliance: { 'law': '', 'notlaw': '', 'lawother': '', 'docother': '' },
    ValuePeriod: { '6month': false, '1year': false, '2year': false, 'mt2year': false },
    ApprovedBy: { 'section': '', 'depart': '', 'moc': '', 'other': '' },
    budget: '',
    budgetUsed: '',
    comment: []
  });

  const [formErrors, setFormErrors] = useState({
    coordinatorName: false,
    contactNumber: false,
    department: false,
    requesterCode: false,
    requesterEmail: false,
    jobName: false,
    objectives: false,
    jobDetails: false,
    benefits: false,
    workType: false,
    natureOfWork: false,
    ValueTarget: false,
    ValuePlatform: false,
    ValueImpact: false,
    ValueCompliance: false,
    ValuePeriod: false,
    fileName: false,
    fileName1: false,
    budget: false,
    budgetUsed: false,
    ApprovedBy: false,
    connecterRequest: false
  });

  const [systemData, setSystemData] = useState({
    systemName: '',
    dataUsed: '',
    owner: ''
  });

  const [systemList, setSystemList] = useState([]); // List to hold multiple system data
  const [showError, setShowError] = useState(false); // Track validation state

  const handleOkClick = () => {
    // Check if all fields are filled
    if (!systemData.systemName || !systemData.dataUsed || !systemData.owner) {
      setShowError(true); // Trigger validation error
    } else {
      // Proceed with adding the system
      const updatedSystemList = [...systemList, systemData];
      setSystemList(updatedSystemList);
      setFormValues({
        ...formValues,
        connecterRequest: updatedSystemList // Set the entire systemList to connecterRequest
      });
      setOpenAddSystem(false); // Close dialog
      setShowError(false); // Reset error state
      setSystemData({ systemName: '', dataUsed: '', owner: '' }); // Clear form
    }

  };

  const handleInputChangeSystem = (e) => {
    const { name, value } = e.target;
    setSystemData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  const handleAccordionChange = (type) => (event, isExpanded) => {
    switch (type) {
      case 'platform':
        setExpandedPlatform(isExpanded);
        break;
      case 'target':
        setExpandedTarget(isExpanded);
        break;
      case 'Impact':
        setExpandedValueImpact(isExpanded);
        break;
      case 'Compli':
        setExpandedValueCompli(isExpanded);
        break;
      default:
        break;
    }
  };

  const [recallButton, setRecallButton] = useState(false);

  const fetching = useCallback(async () => {
    try {
      const response = await getCodeImg(userLocalToken);
      if (response === 'N' || response === 'No data available') {
        setExternal(true);
      }
      if (id === undefined && profilePromise) {
        setCheckStatus(false);
        const fullName = profilePromise.fname === undefined && profilePromise.lname === undefined ?
          profilePromise.displayName : profilePromise.fname + ' ' + profilePromise.lname;
        setFormValues((prevValues) => ({
          ...prevValues,
          coordinatorName: fullName,
          contactNumber: profilePromise.mobile,
          department: profilePromise.unitabbr,
          requesterCode: profilePromise.code,
          requesterEmail: profilePromise.emailaddr,
        }));
        setLoading(false);
      }
      if (data && id !== '') {
        setTicketId(data.ticketId);
        setApprover(data.maxLevelApprover);
        setComment1(data.sectionHeadComment);
        setComment2(data.departmentHeadComment);
        setUpdateAt(data.updateAt);
        const emp = await isMaxHlvEmployer(data.sectionHeadCode);
        setSectionHeadCode([emp.emp1, emp.emp2]);
        setCheckStatus(true);
        setFormValues((prevValues) => ({
          ...prevValues,
          coordinatorName: data.coordinatorName,
          contactNumber: data.contactNumber,
          department: data.department,
          requesterCode: data.requesterCode,
          requesterEmail: data.requesterEmail,
          jobName: data.jobName,
          objectives: data.objectives,
          jobDetails: data.jobDetails,
          benefits: data.benefits,
          workType: data.workType,
          natureOfWork: data.natureOfWork,
          ValueTarget: data.ValueTarget,
          ValuePlatform: data.ValuePlatform,
          fileName: data.fileName,
          fileName1: data.fileName1,
          FileNameServer: data.FileNameServer,
          FileNameServer1: data.FileNameServer1,
          ValueImpact: data.ValueImpact,
          ValueCompliance: data.ValueCompliance,
          ValuePeriod: data.ValuePeriod,
          connecterRequest: data.connecterRequest,
          ApprovedBy: data.ApprovedBy,
          budget: data.budget,
          budgetUsed: data.budgetUsed,
          comment: data.comment,
        }));
        setComment(data.comment);
        setNextApproved(data.sectionHeadStatus === 'approved' && data.departmentHeadStatus === 'wait');
        setWait(data.sectionHeadStatus === 'wait' && data.departmentHeadStatus === 'wait');
        setReject(data.departmentHeadStatus === 'reject' || data.sectionHeadStatus === 'reject');
        setIsDraft(data.sectionHeadStatus === 'draft' && data.departmentHeadStatus === 'wait');
        setRecallButton(data.sectionHeadStatus === 'approved');
        const isApprovedOrWait =
          (data.sectionHeadStatus === 'approved' &&
            data.departmentHeadStatus === 'wait') ||
          (data.sectionHeadStatus === 'wait' &&
            data.departmentHeadStatus === 'wait') ||
          (data.sectionHeadStatus === 'approved' &&
            data.departmentHeadStatus === 'approved') || data.requesterCode !== response.code;
        setCheckStatus(isApprovedOrWait);
        const Reject = data.sectionHeadStatus === 'reject' ||
          data.departmentHeadStatus === 'reject' ||
          data.sectionHeadStatus === 'draft';
        setCheckReject(Reject);
        setworktype(data.workType);
        setnatureWork(data.natureOfWork);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [
    profilePromise,
    data,
    id,
    userLocalToken,
    setApprover,
    setCheckStatus,
    setComment,
    setComment1,
    setComment2,
    setIsDraft,
    setNextApproved,
    setReject,
    setWait,
    setSectionHeadCode,
    setTicketId
  ]);

  useEffect(() => { fetching(); }, [fetching]);

  const handleFileChange = (event) => {
    setButtonColor('#28a728');
    const fileInput = event.target;
    const file = fileInput.files[0];
    if (file) {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      const allowedExtensions = ['ppt', 'pptx'];

      if (!allowedExtensions.includes(fileExtension)) {
        // If the file type is not supported, reset the input and show an error
        setFilePptAlert(true);
        fileInput.value = null; // Reset the input
        setFile(null);
        setFileName('');
        setFormValues({ ...formValues, fileName: '' });
        return;
      }
      setDisplay(false);
      if (file.size > CHUNK_SIZE) {
        setOpenFileSzie(true);
        setFile(null);
        setFileName('');
        setFormValues({ ...formValues, fileName: '' });
      } else {
        setFile(file);
        setFileName(file.name);
        setFormValues({ ...formValues, fileName: file.name });
      }
    } else {
      setFileName('');
      setFormValues({ ...formValues, fileName: '' });
    }
    // Reset the input value to allow the same file to be uploaded again
    fileInput.value = null;
  };

  const handleFileChange1 = (event) => {
    setButtonColor1('#28a728');
    const fileInput1 = event.target;
    const fileN = fileInput1.files[0];
    if (fileN) {
      const fileExtension = fileN.name.split('.').pop().toLowerCase();
      const allowedExtensions = ['xls', 'xlsx']; // Include Excel extensions
      if (!allowedExtensions.includes(fileExtension)) {
        // If the file type is not supported, reset the input and show an error
        setFileXlsxAlert(true);
        fileInput1.value = null; // Reset the input
        setFile1(null);
        setFileName1('');
        setFormValues({ ...formValues, fileName1: '' });
        return;
      }
      setDisplay(false);
      if (fileN.size > CHUNK_SIZE) {
        setOpenFileSzie(true);
        setFile1(null);
        setFileName1(''); // Use setFileName1 here
        setFormValues({ ...formValues, fileName1: '' });
      } else {
        setFile1(fileN);
        setFileName1(fileN.name); // Correctly set fileName1
        setFormValues({ ...formValues, fileName1: fileN.name });
      }
    } else {
      setFileName1('');
      setFormValues({ ...formValues, fileName1: '' });
    }
    fileInput1.value = null;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
    // Reset error for the current field
    setFormErrors({ ...formErrors, [name]: false });
  };

  const handleChangeworktype = (event) => {
    setworktype(event.target.value);
    handleInputChange({ target: { name: 'workType', value: event.target.value } });
  };

  const handleChangenatureWork = (event) => {
    setnatureWork(event.target.value);
    handleInputChange({ target: { name: 'natureOfWork', value: event.target.value } });
  };

  const handleCloseSendForm = () => { setOpenDraft(false); setOpenSendForm(false); };

  const handleSubmit = () => {
    setStatus('wait');
    const complexFields = [
      'ValueTarget',
      'ValuePlatform',
      'ValueImpact',
      'ValueCompliance',
      'ValuePeriod',
      'ApprovedBy',
      'connecterRequest'
    ];

    const fieldExpansionMap = {
      ValueTarget: setExpandedTarget,
      ValuePlatform: setExpandedPlatform,
      ValueImpact: setExpandedValueImpact,
      ValueCompliance: setExpandedValueCompli,
    };

    const requiredFields = Object.keys(formValues).filter(field => !['budget', 'budgetUsed', 'comment', 'FileNameServer', 'FileNameServer1'].includes(field));
    const errors = {};
    let hasEmptyFields = false;
    const isEmptyValue = (value, isComplex = false) => {
      if (isComplex && typeof value === 'object' && value !== null) {
        return Object.values(value).every(
          v => v === '' || v === false || v === null || v === undefined
        );
      }
      return value === '' || value === null || value === undefined;
    };

    requiredFields.forEach(field => {
      const value = formValues[field];
      const isComplex = complexFields.includes(field);
      const isEmpty = isEmptyValue(value, isComplex);

      if (isEmpty) {
        hasEmptyFields = true;
        errors[field] = true;
        console.warn(`Field "${field}" is considered EMPTY`, value);
        // Auto-expand related UI section if exists
        if (fieldExpansionMap[field]) {
          fieldExpansionMap[field](true);
        }

        clearErrors(field);
      }
    });

    if (hasEmptyFields) {
      console.warn('Form has empty required fields.');
      setFormErrors(errors);
      setButtonColor('#ff413a');
      setButtonColor1('#ff413a');
      return;
    }
    // No errors — proceed
    if (formValues.checkboxChecked) {
      setOpenSendForm(true);
    } else {
      setOpenAccept(true);
    }
  };




  const clearErrors = (field) => {
    setTimeout(() => {
      setButtonColor('primary')
      setButtonColor1('primary')
      setFormErrors(prevErrors => ({ ...prevErrors, [field]: false }));
    }, 2000);
  };

  const handleSubmitDraft = () => { setStatus('draft'); setOpenDraft(true); };

  const [MaxOC, setMaxOC] = useState(false);

  const handleSendForm = () => {
    setOpenSendForm(false);
    try {
      const fetching = async (code) => { return await isMaxHlvEmployer(code) }
      const isMaxHlv = fetching(profilePromise.code);
      isMaxHlv.then(res => {
        if (res.MaxLavel === true) {
          setMaxOC(true);
        } else {
          // Prepare form data
          const updatedFormData = { ...formValues, comment: [...formValues.comment, { text: 'ส่งแบบฟอร์ม', updateAt: '' }] };
          const formData = new FormData();
          formData.append('file', file);      // Assuming `file` is defined
          formData.append('file1', file1);
          formData.append('formValues', JSON.stringify(updatedFormData));
          formData.append('status', status);
          formData.append('id', id);
          const storeData = uploadFile(formData);
          storeData.then(response => {
            if (response[0] === false) {
              const regex = /<!--(.*?)-->/;
              const errorMatch = response[1].response.data.match(regex);
              setOpenError(true);
              setErrorText(`${response[1].code} ${response[1].message} ${errorMatch ? errorMatch[1] : ''}`);
            } else {
              localStorage.setItem('sendForm', 'sent');
              setLoading(true);
              setTimeout(() => {
                setLoading(false);
                navigate(`/`);
              }, 1000);
            }
          })

        }
      })
    } catch (error) {
      console.error("Error during form submission:", error);
      setOpenError(true);
      setErrorText("An error occurred during form submission.");
    }
  };


  const handleCloseFileSize = () => { setOpenFileSzie(false); }

  const handleFocusAndChange = (key, ref, column) => (event, index) => {
    const isChecked = event.target.checked;
    if (column === 'ValuePeriod') {
      const updatedValuePeriod = {
        '6month': false,
        '1year': false,
        '2year': false,
        'mt2year': false,
        [key]: isChecked,
      };
      setFormValues((prevValues) => ({ ...prevValues, ValuePeriod: updatedValuePeriod }));
    } else {
      const setChecked = {
        ValuePlatform: setCheckedPlatform,
        ValueTarget: setCheckedTarget,
        ValueImpact: setCheckedImpact,
        ValueCompliance: setCheckedCompli,
        ApprovedBy: setApprovedBy
      };
      if (setChecked[column]) { setChecked[column]((prevState) => ({ ...prevState, [index]: isChecked, })); }
      if (isChecked && ref && ref.current) { ref.current.focus(); }
      if (!ref || !ref.current) {
        setFormValues((prevState) => ({
          ...prevState,
          [column]: {
            ...prevState[column],
            [key]: isChecked ? key : '',
          },
        }));
      }
    }
  };

  const handleTextChange = (key, column) => (event) => {
    const { value } = event.target;
    setFormValues((prevState) => ({
      ...prevState,
      [column]: {
        ...prevState[column],
        [key]: value,
      },
    }));
  };

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

  const cancel = () => {
    if (location.pathname === '/DigitalRequestForm') {
      navigate(`/dashboard/default`)
    } else {
      localStorage.setItem('cancel', 'cancel');
      navigate(`/MyList`)
    }
  }

  useEffect(() => {
    if (checkReject && !isDraft) {
      setDisplay(true);
    }
  }, [checkReject, isDraft]);

  const [open, setOpen] = useState({ 0: false });
  const [recall, setRecall] = useState(false);
  const [showErrorRecall, setShowErrorRecall] = useState(false);
  const RECALL = () => {
    if (!newComment.trim()) {
      setShowErrorRecall(true);
    } else {
      setRecall(true)
      setOpen(prev => ({ ...prev, 0: false }));
      const updatedFormData = { ...formValues, comment: [...formValues.comment, { text: newComment, updateAt: '' }] };
      const formData = new FormData();
      formData.append('file', file);      // Assuming `file` is defined
      formData.append('file1', file1);
      formData.append('formValues', JSON.stringify(updatedFormData));
      formData.append('status', status);
      formData.append('id', id);
      formData.append('recall', true);
      setTimeout(() => {
        const storeData = uploadFile(formData);
        storeData.then(response => {
          if (response[0] === false) {
            const regex = /<!--(.*?)-->/;
            const errorMatch = response[1].response.data.match(regex);
            setOpenError(true);
            setErrorText(`${response[1].code} ${response[1].message} ${errorMatch ? errorMatch[1] : ''}`);
          } else {
            localStorage.setItem('sendForm', 'sent');
            setLoading(false);
            navigate(`/`);
          }
        })
      }, 5000);
    }

  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loader />
      </Box>
    );
  }

  if (external) {
    return <ExternalUser />
  }
  if (MaxOC) {
    return <MaxLevel />
  }


  return (
    <>
      {open[0] && (
        <AlertDialogSlide
          index={0}
          title="Are you sure Recall?"
          text="Are you sure you want to retrieve all data and the system will send an email to notify the approver? and back to status draft."
          open={open}
          setOpen={setOpen}
          recall={true}
          nextFuntion={RECALL}
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
      <CardContent >
        <Grid container spacing={4} columns={16}>
          <Grid item xs={16} sm={8} md={8}>
            <Item>
              <Grid container alignItems="center" spacing={1}>
                <Grid item xs={4} >
                  <TextField
                    type="text"
                    variant='outlined'
                    color='primary'
                    label="ชื่อผู้ประสานงาน ชื่อ - นามสกุล"
                    fullWidth
                    required
                    name="coordinatorName"
                    value={formValues.coordinatorName}
                    InputProps={{ readOnly: checkStatus }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    type="text"
                    variant='outlined'
                    color='primary'
                    label="หน่วยงาน"
                    fullWidth
                    required
                    name="department"
                    value={formValues.department}
                    InputProps={{ readOnly: checkStatus }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    type='text'
                    variant='outlined'
                    color='primary'
                    label="เบอร์ติดต่อ"
                    fullWidth
                    required
                    name="contactNumber"
                    value={formValues.contactNumber}
                    onChange={handleInputChange}
                    InputProps={{ readOnly: checkStatus }}
                  />
                </Grid>
              </Grid><br />
              <TextField
                type='text'
                variant='outlined'
                color='primary'
                label="ชื่องาน"
                fullWidth
                required
                name="jobName"
                value={formValues.jobName}
                onChange={handleInputChange}
                error={formErrors.jobName}
                InputProps={{
                  readOnly: checkStatus,
                  inputProps: { maxLength: 150 }
                }}
              /><br /><br />
              <Grid container alignItems="center" spacing={1}>
                <Grid item xs={12} sm={6} >
                  <TextField
                    type='number'
                    variant='outlined'
                    color='primary'
                    label="งบประมาณ(บาท)"
                    fullWidth
                    name="budget"
                    value={formValues.budget}
                    onChange={handleInputChange}
                    InputProps={{
                      readOnly: checkStatus,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} style={{ position: 'relative' }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      views={['year']} // Limit to year view only
                      value={formValues.budgetUsed ? dayjs().year(formValues.budgetUsed) : null}
                      onChange={(newDate) => {
                        if (newDate && dayjs.isDayjs(newDate)) {
                          setFormValues({ ...formValues, budgetUsed: newDate.year().toString() }); // Update formValues directly
                        } else {
                          setFormValues({ ...formValues, budgetUsed: '' }); // Clear if no date is selected
                        }
                        // Optionally reset error here if needed
                        setFormErrors({ ...formErrors, budgetUsed: false });
                      }}
                      sx={{ width: '100%' }}
                      disabled={checkStatus}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          fullWidth
                          InputLabelProps={{
                            shrink: true, // Always shrink the label
                          }}
                          error={formErrors.budgetUsed}
                          InputProps={{
                            readOnly: checkStatus, // Optional read-only state handling
                          }}
                          sx={{
                            marginTop: 3, // Adjust margin to provide space for the label
                            position: 'relative', // Make TextField relative for absolute positioning of the label
                          }}
                        />
                      )}
                    />
                  </LocalizationProvider>

                  <Typography
                    style={{
                      position: 'absolute',
                      left: 16, // Adjust left position to match input padding
                      top: -2,   // Adjust top position for proper alignment
                      color: '#000', // Change color as needed
                      backgroundColor: '#fff', // White background for visibility
                      padding: '0 4px', // Small padding around the text
                      pointerEvents: 'none', // Prevent mouse events on Typography
                      fontSize: '11px'
                    }}
                  >
                    ปีงบประมาณที่ใช้
                  </Typography>
                </Grid>


              </Grid><br />
              <Grid container alignItems="center" spacing={1}>
                <Grid item xs={6} >
                  <FormControl fullWidth>
                    <InputLabel id="select-workType" error={formErrors.workType} >ประเภทของงาน</InputLabel>
                    <Select
                      labelId="select-workType"
                      label="ประเภทของงาน"
                      value={worktype}
                      onChange={handleChangeworktype}
                      error={formErrors.workType}
                    >
                      <MenuItem value='Management' disabled={checkStatus}>Management</MenuItem>
                      <MenuItem value='Support' disabled={checkStatus}>Support</MenuItem>
                      <MenuItem value='Operation and Maintenance' disabled={checkStatus}>Operation and Maintenance</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6} >
                  <FormControl fullWidth>
                    <InputLabel id="select-natureWork" error={formErrors.natureOfWork} >ลักษณะของงาน</InputLabel>
                    <Select
                      labelId="select-natureWork"
                      label="ลักษณะของงาน"
                      value={natureWork}
                      onChange={handleChangenatureWork}
                      error={formErrors.natureOfWork}
                    >
                      <MenuItem value='Hardware' disabled={checkStatus}>Hardware</MenuItem>
                      <MenuItem value='Software' disabled={checkStatus}>Software</MenuItem>
                      <MenuItem value='Communication' disabled={checkStatus}>Communication</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid><br />
              <TextField
                multiline
                type="text"
                variant='outlined'
                color='primary'
                label="รายละเอียดของงาน"
                fullWidth
                required
                name="jobDetails"
                value={formValues.jobDetails}
                onChange={handleInputChange}
                minRows={10}
                maxRows={undefined}
                error={formErrors.jobDetails}
                InputProps={{ readOnly: checkStatus }}
              /><br /><br />
              <TextField
                multiline
                type="text"
                variant='outlined'
                color='primary'
                label="วัตถุประสงค์"
                fullWidth
                required
                name="objectives"
                value={formValues.objectives}
                onChange={handleInputChange}
                minRows={6}
                maxRows={undefined}
                error={formErrors.objectives}
                InputProps={{ readOnly: checkStatus }}
              /><br /><br />
              <TextField
                multiline
                type="text"
                variant='outlined'
                color='primary'
                label="ประโยชน์ที่คาดว่าจะได้รับ"
                fullWidth
                required
                name="benefits"
                value={formValues.benefits}
                onChange={handleInputChange}
                minRows={6}
                maxRows={undefined}
                error={formErrors.benefits}
                InputProps={{ readOnly: checkStatus }}
              />
            </Item>
          </Grid>
          <Grid item xs={16} sm={8} md={8}>
            <Item>
              <Accordion sx={{ width: '100%' }} expanded={expandedPlatform || formErrors.ValuePlatform || checkStatus || isMobile || checkReject} onChange={handleAccordionChange('platform')}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                  sx={{ color: formErrors.ValuePlatform ? 'red' : 'black' }}
                >
                  <Typography sx={{ color: formErrors.ValuePlatform ? 'red' : 'black', display: 'flex', justifyContent: 'flex-start', marginLeft: '-15px' }}>
                    Platform ที่ใช้ {formErrors.ValuePlatform ? 'required*' : ''}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails >
                  <FormGroup aria-label="position" row>
                    <Grid container alignItems="center">
                      <Grid item sx={{ marginRight: '39px' }}>
                        <FormControlLabel
                          value="Mobile Application"
                          control={
                            <Checkbox
                              checked={!!formValues.ValuePlatform['mobile'] || checkedPlatform[0]}
                              onChange={(e) => handleFocusAndChange('mobile', mobileRef, 'ValuePlatform')(e, 0)}
                              sx={{ color: formErrors.ValuePlatform ? 'red' : 'black' }}
                            />
                          }
                          label="Mobile Application"
                          labelPlacement="end"
                          disabled={checkStatus}
                          sx={{ width: '100%', color: formErrors.ValuePlatform ? 'red' : 'black' }}
                        />
                      </Grid>
                      <Grid item>
                        <FormControlLabel
                          value="Web Application"
                          control={
                            <Checkbox
                              checked={!!formValues.ValuePlatform['web'] || checkedPlatform[1]}
                              onChange={(e) => handleFocusAndChange('web', webRef, 'ValuePlatform')(e, 1)}
                              sx={{ color: formErrors.ValuePlatform ? 'red' : 'black' }}
                            />
                          }
                          label="Web Application"
                          labelPlacement="end"
                          disabled={checkStatus}
                          sx={{ width: '100%', color: formErrors.ValuePlatform ? 'red' : 'black' }}
                        />
                      </Grid>
                    </Grid>
                  </FormGroup>
                  <FormGroup aria-label="position" row>
                    <Grid container alignItems="center">
                      <Grid item >
                        <FormControlLabel
                          value="Other"
                          control={
                            <Checkbox
                              checked={!!formValues.ValuePlatform['other'] || checkedPlatform[2]}
                              onChange={(e) => handleFocusAndChange('other', otherPlatformRef, 'ValuePlatform')(e, 2)}
                              sx={{ color: formErrors.ValuePlatform ? 'red' : 'black' }}
                            />
                          }
                          label="Other"
                          labelPlacement="end"
                          disabled={checkStatus}
                          sx={{ width: '100%', color: formErrors.ValuePlatform ? 'red' : 'black' }}
                        />
                      </Grid>
                      <Grid item sx={{ width: '87%' }}>
                        <TextField
                          placeholder={checkStatus ? "" : "Enter value other in this field"}
                          onChange={handleTextChange('other', 'ValuePlatform')}
                          inputRef={otherPlatformRef}
                          variant="standard"
                          style={{ marginTop: '3px', color: 'black', width: '100%' }}
                          error={formErrors.ValuePlatform}
                          InputProps={{ readOnly: checkStatus }}
                          value={formValues.ValuePlatform['other'] || ''}
                        />
                      </Grid>
                    </Grid>
                  </FormGroup>
                </AccordionDetails>
              </Accordion>
              <Accordion sx={{ width: '100%' }} expanded={expandedTarget || formErrors.ValueTarget || checkStatus || isMobile || checkReject} onChange={handleAccordionChange('target')}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <Typography sx={{ color: formErrors.ValueTarget ? 'red' : 'black', display: 'flex', justifyContent: 'flex-start', marginLeft: '-15px' }}>
                    กลุ่มเป้าหมาย {formErrors.ValueTarget ? 'required*' : ''}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <FormGroup aria-label="position" row>
                    <Grid container alignItems="center">
                      <Grid item sx={{ flexGrow: 1 }}>
                        <FormControlLabel
                          label="หน่วยงาน"
                          value="agency"
                          control={
                            <Checkbox
                              checked={!!formValues.ValueTarget['agency'] || checkedTarget[0]}
                              sx={{ color: formErrors.ValueTarget ? 'red' : 'black' }}
                              onChange={(e) => {
                                handleFocusAndChange('agency', unitRef, 'ValueTarget')(e, 0);
                              }}
                            />
                          }
                          disabled={checkStatus}
                          sx={{ width: '100%', color: formErrors.ValueTarget ? 'red' : 'black' }}
                        />
                      </Grid>
                      <Grid item sx={{ width: '85%' }}>
                        <TextField
                          placeholder={checkStatus ? "" : "Enter agency in this field"}
                          onChange={handleTextChange('agency', 'ValueTarget')}
                          inputRef={unitRef}
                          variant="standard"
                          sx={{ marginTop: '3px', color: 'black', width: '100%' }}
                          error={formErrors.ValueTarget}
                          InputProps={{ readOnly: checkStatus }}
                          value={formValues.ValueTarget['agency'] || ''}
                        />
                      </Grid>
                    </Grid>
                  </FormGroup>
                  <FormGroup aria-label="position" row>
                    <Grid container alignItems="center">
                      <Grid item sx={{ flexGrow: 1 }}>
                        <FormControlLabel
                          label="ลูกค้า"
                          value="client"
                          control={
                            <Checkbox
                              checked={!!formValues.ValueTarget['client'] || checkedTarget[1]}
                              sx={{ color: formErrors.ValueTarget ? 'red' : 'black' }}
                              onChange={(e) => handleFocusAndChange('client', customerRef, 'ValueTarget')(e, 1)}
                            />
                          }
                          disabled={checkStatus}
                          sx={{ width: '100%', color: formErrors.ValueTarget ? 'red' : 'black' }}
                        />
                      </Grid>
                      <Grid item sx={{ width: '85%' }}>
                        <TextField
                          placeholder={checkStatus ? "" : "Enter customer in this field"}
                          onChange={handleTextChange('client', 'ValueTarget')}
                          inputRef={customerRef}
                          variant="standard"
                          style={{ marginTop: '3px', color: 'black', width: '100%' }}
                          error={formErrors.ValueTarget}
                          InputProps={{ readOnly: checkStatus }}
                          value={formValues.ValueTarget['client'] || ''}
                        />
                      </Grid>
                    </Grid>
                  </FormGroup>
                  <FormGroup aria-label="position" row>
                    <Grid container alignItems="center">
                      <Grid item sx={{ flexGrow: 1 }}>
                        <FormControlLabel
                          value="other"
                          control={
                            <Checkbox
                              checked={!!formValues.ValueTarget['otherTg'] || checkedTarget[2]}
                              sx={{ color: formErrors.ValueTarget ? 'red' : 'black' }}
                              onChange={(e) => handleFocusAndChange('otherTg', otherRef, 'ValueTarget')(e, 2)}
                            />
                          }
                          label="อื่นๆ"
                          labelPlacement="end"
                          disabled={checkStatus}
                          sx={{ width: '100%', color: formErrors.ValueTarget ? 'red' : 'black' }}
                        />
                      </Grid>
                      <Grid item sx={{ width: '85%' }}>
                        <TextField
                          placeholder={checkStatus ? "" : "Enter value other in this field"}
                          onChange={handleTextChange('otherTg', 'ValueTarget')}
                          inputRef={otherRef}
                          variant="standard"
                          style={{ marginTop: '3px', color: 'black', width: '100%' }}
                          error={formErrors.ValueTarget}
                          InputProps={{ readOnly: checkStatus }}
                          value={formValues.ValueTarget['otherTg'] || ''}
                        />
                      </Grid>
                    </Grid>
                  </FormGroup>
                </AccordionDetails>
              </Accordion>
              <Accordion sx={{ width: '100%' }} expanded={expandedValueImpact || formErrors.ValueImpact || checkStatus || isMobile || checkReject} onChange={handleAccordionChange('Impact')}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <Typography sx={{ color: formErrors.ValueImpact ? 'red' : 'black', display: 'flex', justifyContent: 'flex-start', marginLeft: '-15px' }}>
                    Business Impact {formErrors.ValueImpact ? 'required*' : ''}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <FormGroup aria-label="position" row>
                    <Grid container alignItems="center">
                      <Grid item sx={{ marginRight: '96px' }}>
                        <FormControlLabel
                          value="efficiency"
                          control={
                            <Checkbox
                              checked={!!formValues.ValueImpact['efficiency'] || checkedImpact[0]}
                              onChange={(e) => handleFocusAndChange('efficiency', effRef, 'ValueImpact')(e, 0)}
                              sx={{ color: formErrors.ValueImpact ? 'red' : 'black' }}
                            />
                          }
                          label="ประสิทธิภาพ"
                          labelPlacement="end"
                          disabled={checkStatus}
                          sx={{ width: '100%', color: formErrors.ValueImpact ? 'red' : 'black' }}
                        />
                      </Grid>
                      <Grid item>
                        <FormControlLabel
                          value="effective"
                          control={
                            <Checkbox
                              checked={!!formValues.ValueImpact['effective'] || checkedImpact[1]}
                              onChange={(e) => handleFocusAndChange('effective', effectiveRef, 'ValueImpact')(e, 1)}
                              sx={{ color: formErrors.ValueImpact ? 'red' : 'black' }}
                            />
                          }
                          label="ประสิทธิผล"
                          labelPlacement="end"
                          disabled={checkStatus}
                          sx={{ width: '100%', color: formErrors.ValueImpact ? 'red' : 'black' }}
                        />
                      </Grid>
                    </Grid>
                  </FormGroup>
                  <FormGroup aria-label="position" row>
                    <Grid container alignItems="center">
                      <Grid item sx={{ flexGrow: 1 }}>
                        <FormControlLabel
                          value="main"
                          control={
                            <Checkbox
                              checked={!!formValues.ValueImpact['main'] || checkedImpact[2]}
                              sx={{ color: formErrors.ValueImpact ? 'red' : 'black' }}
                              onChange={(e) => handleFocusAndChange('main', mainRef, 'ValueImpact')(e, 2)}
                            />
                          }
                          label="กระบวนการหลัก"
                          labelPlacement="end"
                          disabled={checkStatus}
                          sx={{ width: '100%', color: formErrors.ValueImpact ? 'red' : 'black' }}
                        />
                      </Grid>
                      <Grid item sx={{ width: '75%' }}>
                        <TextField
                          placeholder={checkStatus ? "" : "Enter value in this field"}
                          onChange={handleTextChange('main', 'ValueImpact')}
                          inputRef={mainRef}
                          variant="standard"
                          style={{ marginTop: '3px', color: 'black', width: '100%' }}
                          error={formErrors.ValueImpact}
                          InputProps={{ readOnly: checkStatus }}
                          value={formValues.ValueImpact['main'] || ''}
                        />
                      </Grid>
                    </Grid>
                  </FormGroup>
                  <FormGroup aria-label="position" row>
                    <Grid container alignItems="center">
                      <Grid item sx={{ flexGrow: 1 }}>
                        <FormControlLabel
                          value="notmain"
                          control={
                            <Checkbox
                              checked={!!formValues.ValueImpact['notmain'] || checkedImpact[3]}
                              sx={{ color: formErrors.ValueImpact ? 'red' : 'black' }}
                              onChange={(e) => handleFocusAndChange('notmain', notmainRef, 'ValueImpact')(e, 3)}
                            />
                          }
                          label="ไม่ใช่กระบวนการหลัก"
                          labelPlacement="end"
                          disabled={checkStatus}
                          sx={{ width: '100%', color: formErrors.ValueImpact ? 'red' : 'black' }}
                        />
                      </Grid>
                      <Grid item sx={{ width: '75%' }}>
                        <TextField
                          placeholder={checkStatus ? "" : "Enter value in this field"}
                          onChange={handleTextChange('notmain', 'ValueImpact')}
                          inputRef={notmainRef}
                          variant="standard"
                          style={{ marginTop: '3px', color: 'black', width: '100%' }}
                          error={formErrors.ValueImpact}
                          InputProps={{ readOnly: checkStatus }}
                          value={formValues.ValueImpact['notmain'] || ''}
                        />
                      </Grid>
                    </Grid>
                  </FormGroup>
                </AccordionDetails>
              </Accordion>
              <Accordion sx={{ width: '100%' }} expanded={expandedValueCompli || formErrors.ValueCompliance || checkStatus || isMobile || checkReject} onChange={handleAccordionChange('Compli')}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <Typography sx={{ color: formErrors.ValueCompliance ? 'red' : 'black', display: 'flex', justifyContent: 'flex-start', marginLeft: '-15px' }}>
                    Compliance {formErrors.ValueCompliance ? 'required*' : ''}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <FormGroup aria-label="position" row>
                    <Grid container alignItems="center">
                      <Grid item sx={{ marginRight: '50px' }}>
                        <FormControlLabel
                          value="law"
                          control={
                            <Checkbox
                              checked={!!formValues.ValueCompliance['law'] || checkedCompli[0]}
                              onChange={(e) => handleFocusAndChange('law', lawRef, 'ValueCompliance')(e, 0)}
                              sx={{ color: formErrors.ValueCompliance ? 'red' : 'black' }}
                            />
                          }
                          label="เกี่ยวข้องกับกฏหมาย"
                          labelPlacement="end"
                          disabled={checkStatus}
                          sx={{ width: '100%', color: formErrors.ValueCompliance ? 'red' : 'black' }}
                        />
                      </Grid>
                      <Grid item>
                        <FormControlLabel
                          value="notlaw"
                          control={
                            <Checkbox
                              checked={!!formValues.ValueCompliance['notlaw'] || checkedCompli[1]}
                              onChange={(e) => handleFocusAndChange('notlaw', notlawRef, 'ValueCompliance')(e, 1)}
                              sx={{ color: formErrors.ValueCompliance ? 'red' : 'black' }}
                            />
                          }
                          label="ไม่เกี่ยวข้องกับกฏหมาย"
                          labelPlacement="end"
                          disabled={checkStatus}
                          sx={{ width: '100%', color: formErrors.ValueCompliance ? 'red' : 'black' }}
                        />
                      </Grid>
                    </Grid>
                  </FormGroup>
                  <FormGroup aria-label="position">
                    <Grid container alignItems="center">
                      <Grid item sx={{ flexGrow: 1 }}>
                        <FormControlLabel
                          value="lawother"
                          control={
                            <Checkbox
                              checked={!!formValues.ValueCompliance['lawother'] || checkedCompli[2]}
                              sx={{ color: formErrors.ValueCompliance ? 'red' : 'black' }}
                              onChange={(e) => handleFocusAndChange('lawother', lawotherRef, 'ValueCompliance')(e, 2)}
                            />
                          }
                          label="เกี่ยวข้องกับกฏอื่นๆ"
                          labelPlacement="end"
                          disabled={checkStatus}
                          sx={{ width: '100%', color: formErrors.ValueCompliance ? 'red' : 'black' }}
                        />
                      </Grid>
                      <Grid item sx={{ width: '75%' }}>
                        <TextField
                          placeholder={checkStatus ? "" : "Enter value in this field"}
                          onChange={handleTextChange('lawother', 'ValueCompliance')}
                          inputRef={lawotherRef}
                          variant="standard"
                          style={{ marginTop: '3px', color: 'black', width: '100%' }}
                          error={formErrors.ValueCompliance}
                          InputProps={{ readOnly: checkStatus }}
                          value={formValues.ValueCompliance['lawother'] || ''}
                        />
                      </Grid>
                    </Grid>
                  </FormGroup>
                  <FormGroup aria-label="position" row>
                    <Grid container alignItems="center" sx={{ marginTop: '5px' }}>
                      <Grid item sx={{ flexGrow: 1 }}>
                        <strong style={{ color: formErrors.ValueCompliance ? 'red' : 'black' }} >เอกสารที่เกี่ยวข้อง (เอกสาร P/WI)</strong>
                      </Grid>
                      <Grid item sx={{ width: '65%' }}>
                        <TextField
                          placeholder={checkStatus ? "" : "Enter value in this field"}
                          onChange={handleTextChange('docother', 'ValueCompliance')}
                          inputRef={docotherRef}
                          variant="standard"
                          style={{ marginTop: '3px', color: 'black', width: '100%' }}
                          error={formErrors.ValueCompliance}
                          InputProps={{ readOnly: checkStatus }}
                          value={formValues.ValueCompliance['docother'] || ''}
                        />
                      </Grid>
                    </Grid>
                  </FormGroup>
                </AccordionDetails>
              </Accordion>

              <Accordion expanded >
                <AccordionSummary
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <Typography sx={{ color: formErrors.ValuePeriod ? 'red' : 'black', display: 'flex', justifyContent: 'flex-start', marginLeft: '-15px' }}>
                    ความเร่งด่วนที่ต้องการใช้งานระบบ {formErrors.ValuePeriod ? 'required*' : ''}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ marginTop: '-25px' }}>
                  <Grid container alignItems="center" spacing={4}>
                    <Grid item>
                      <FormControlLabel
                        value="6month"
                        control={
                          <Checkbox
                            checked={!!formValues.ValuePeriod['6month']}
                            sx={{ color: formErrors.ValuePeriod ? 'red' : 'black' }}
                            onChange={(e) => handleFocusAndChange('6month', null, 'ValuePeriod')(e)}
                          />
                        }
                        label="6 เดือน"
                        labelPlacement="end"
                        disabled={checkStatus}
                        sx={{ width: '100%', color: formErrors.ValuePeriod ? 'red' : 'black' }}
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        value="1year"
                        control={
                          <Checkbox
                            checked={!!formValues.ValuePeriod['1year']}
                            sx={{ color: formErrors.ValuePeriod ? 'red' : 'black' }}
                            onChange={(e) => handleFocusAndChange('1year', null, 'ValuePeriod')(e)}
                          />
                        }
                        label="1 ปี"
                        labelPlacement="end"
                        disabled={checkStatus}
                        sx={{ width: '100%', color: formErrors.ValuePeriod ? 'red' : 'black' }}
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        value="2year"
                        control={
                          <Checkbox
                            checked={!!formValues.ValuePeriod['2year']}
                            sx={{ color: formErrors.ValuePeriod ? 'red' : 'black' }}
                            onChange={(e) => handleFocusAndChange('2year', null, 'ValuePeriod')(e)}
                          />
                        }
                        label="2 ปี"
                        labelPlacement="end"
                        disabled={checkStatus}
                        sx={{ width: '100%', color: formErrors.ValuePeriod ? 'red' : 'black' }}
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        value="mt2year"
                        control={
                          <Checkbox
                            checked={!!formValues.ValuePeriod['mt2year']}
                            sx={{ color: formErrors.ValuePeriod ? 'red' : 'black' }}
                            onChange={(e) => handleFocusAndChange('mt2year', null, 'ValuePeriod')(e)}
                          />
                        }
                        label="มากกว่า 2 ปี"
                        labelPlacement="end"
                        disabled={checkStatus}
                        sx={{ width: '100%', color: formErrors.ValuePeriod ? 'red' : 'black' }}
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
              <Box sx={{ marginTop: '-20px' }}>
                <Accordion expanded>
                  <AccordionSummary
                  >
                    <Typography sx={{ color: formErrors.ApprovedBy ? 'red' : 'black', display: 'flex', justifyContent: 'flex-start', marginLeft: '-15px' }}>
                      ผ่านการอนุมัติโดยที่ประชุม
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ marginTop: '-25px' }}>
                    <FormGroup aria-label="position" row>
                      <Grid container alignItems="center">
                        <Grid item sx={{ marginRight: '39px' }}>
                          <FormControlLabel
                            value="ระดับส่วน"
                            control={
                              <Checkbox
                                checked={!!formValues.ApprovedBy['section'] || ApprovedBy[0]}
                                onChange={(e) => handleFocusAndChange('section', sectionApproved, 'ApprovedBy')(e, 0)}
                                sx={{ color: formErrors.ApprovedBy ? 'red' : 'black' }}
                              />
                            }
                            label="ระดับส่วน"
                            labelPlacement="end"
                            disabled={checkStatus}
                            sx={{ width: '100%', color: formErrors.ApprovedBy ? 'red' : 'black' }}
                          />
                        </Grid>
                        <Grid item sx={{ marginRight: '39px' }}>
                          <FormControlLabel
                            value="ระดับฝ่าย"
                            control={
                              <Checkbox
                                checked={!!formValues.ApprovedBy['depart'] || ApprovedBy[1]}
                                onChange={(e) => handleFocusAndChange('depart', departApproved, 'ApprovedBy')(e, 1)}
                                sx={{ color: formErrors.ApprovedBy ? 'red' : 'black' }}
                              />
                            }
                            label="ระดับฝ่าย"
                            labelPlacement="end"
                            disabled={checkStatus}
                            sx={{ width: '100%', color: formErrors.ApprovedBy ? 'red' : 'black' }}
                          />
                        </Grid>
                        <Grid item>
                          <FormControlLabel
                            value="MOC"
                            control={
                              <Checkbox
                                checked={!!formValues.ApprovedBy['moc'] || ApprovedBy[2]}
                                onChange={(e) => handleFocusAndChange('moc', MocApproved, 'ApprovedBy')(e, 2)}
                                sx={{ color: formErrors.ApprovedBy ? 'red' : 'black' }}
                              />
                            }
                            label="MOC"
                            labelPlacement="end"
                            disabled={checkStatus}
                            sx={{ width: '100%', color: formErrors.ApprovedBy ? 'red' : 'black' }}
                          />
                        </Grid>
                      </Grid>
                    </FormGroup>
                    <FormGroup aria-label="position" row>
                      <Grid container alignItems="center">
                        <Grid item >
                          <FormControlLabel
                            value="other"
                            control={
                              <Checkbox
                                checked={!!formValues.ApprovedBy['other'] || ApprovedBy[3]}
                                onChange={(e) => handleFocusAndChange('other', OtherApproved, 'ApprovedBy')(e, 3)}
                                sx={{ color: formErrors.ApprovedBy ? 'red' : 'black' }}
                              />
                            }
                            label="อื่นๆ"
                            labelPlacement="end"
                            disabled={checkStatus}
                            sx={{ width: '100%', color: formErrors.ApprovedBy ? 'red' : 'black' }}
                          />
                        </Grid>
                        <Grid item sx={{ width: '87%' }}>
                          <TextField
                            placeholder={checkStatus ? "" : "Enter value other in this field"}
                            onChange={handleTextChange('other', 'ApprovedBy')}
                            inputRef={OtherApproved}
                            variant="standard"
                            style={{ marginTop: '3px', color: 'black', width: '100%' }}
                            error={formErrors.ApprovedBy}
                            InputProps={{ readOnly: checkStatus }}
                            value={formValues.ApprovedBy['other'] || ''}
                          />
                        </Grid>
                      </Grid>
                    </FormGroup>
                  </AccordionDetails>
                </Accordion>
              </Box>
              <Box
                aria-controls="panel1-content"
                id="panel1-header"
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'nowrap', // Prevents wrapping of text and button
                  width: '100%', // Ensures full width
                }}
              >
                <Typography
                  sx={{
                    color: formErrors.connecterRequest ? 'red' : 'black',
                    fontSize: { xs: '0.9rem', sm: '0.9rem' },
                    whiteSpace: 'nowrap', // Prevents text from wrapping to a new line
                    overflow: 'hidden', // Ensures it doesn't overflow
                    textOverflow: 'ellipsis', // Adds ellipsis if text overflows
                    marginRight: '8px', // Ensures there’s a little space between text and button
                  }}
                >
                  ระบบที่ต้องการเชื่อมข้อมูล
                </Typography>
                {!checkStatus && (
                  <Button
                    size="small"
                    startIcon={<AddCircleOutlineIcon />}
                    color="success"
                    onClick={() => { setOpenAddSystem(true) }}
                    sx={{
                      fontSize: { xs: '0.6rem', sm: '0.8rem' },
                      flexShrink: 0, // Ensures the button doesn't shrink if the container is too small
                    }}
                  >
                    add new
                  </Button>
                )}
              </Box>
              <Box
                sx={{
                  color: checkStatus ? '#bdbdbd' : 'black',
                  border: '1px solid', // Keep the border width and style
                  borderColor: formErrors.connecterRequest ? 'red' : 'rgba(0, 0, 0, 0.23)', // Set border color to red
                  borderRadius: '4px', // Same as default TextField border radius
                  padding: '16.5px 14px', // Match TextField padding
                  fontSize: { xs: '0.8rem', sm: '1rem' }, // Responsive font size
                  height: systemList.length > 0 || formValues.connecterRequest.length > 0 ? 'auto' : '65px',
                }}
              >
                {(systemList.length > 0 || (Array.isArray(formValues.connecterRequest) && formValues.connecterRequest.length > 0)) ? (
                  (Array.isArray(formValues.connecterRequest) ? formValues.connecterRequest : systemList).map((system, index) => (
                    <Box key={index} mb={0}>
                      <Typography>
                        {index + 1}. ระบบ{' '}
                        <Box component="span" sx={{ textDecoration: 'underline', fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                          {system.systemName}
                        </Box>{' '}
                        ข้อมูลที่ใช้{' '}
                        <Box component="span" sx={{ textDecoration: 'underline', fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                          {system.dataUsed}
                        </Box>{' '}
                        หน่วยงานเจ้าของระบบ{' '}
                        <Box component="span" sx={{ textDecoration: 'underline', fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                          {system.owner}
                        </Box>
                      </Typography>
                    </Box>
                  ))
                ) : null}

              </Box>

              <br />
              {!checkStatus ? (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
                    <Box sx={{ width: '100%', marginBottom: '10px', display: 'inline-flex', alignItems: 'center' }}>
                      ไฟล์การนำเสนอที่ประชุม TDC
                      {checkReject && !isDraft && display ? (
                        <Box display="flex" flexDirection="column" alignItems="flex-start" sx={{ marginLeft: '10px' }}>
                          <a
                            href={`https://tso-aov-sr.pttplc.com/api/uploads/digital-project/${formValues.FileNameServer}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button
                              variant="text"
                              color='error'
                              size="small"
                              endIcon={<CloudOffIcon />}
                              style={{ textTransform: 'none' }}
                            >
                              {!formValues.fileName ? 'Undefined' : formValues.fileName}
                            </Button>
                          </a>
                        </Box>
                      ) : (
                        <>
                          <Box display="flex" flexDirection="column" alignItems="flex-start" sx={{ marginLeft: '10px' }}>
                            <span style={{ marginTop: '0px', color: 'red', width: '100%' }}>
                              Maximum File Size is 10 MB*
                            </span>
                          </Box>
                        </>
                      )}
                    </Box>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={2}
                      sx={{ width: '100%', alignItems: 'flex-start' }}
                    >
                      <Box display="flex" flexDirection="column" alignItems="flex-start" sx={{ width: '100%' }}>
                        <a
                          href="https://tso-aov-sr.pttplc.com/api/uploads/digital-project/template/นำเสนอ TDC เพื่อพิจารณา.pptx"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ textDecoration: 'none', width: '100%' }}
                        >
                          <Button
                            variant="outlined"
                            sx={{ width: '100%' }}
                            startIcon={<CloudDownloadIcon />}
                            size="small"
                          >
                            Download template
                          </Button>
                        </a>
                      </Box>
                      {isDraft && formValues.fileName !== '' ? (
                        <Box display="flex" flexDirection="column" alignItems="flex-start" sx={{ width: '100%' }}>
                          <Button
                            variant="contained"
                            component="label"
                            startIcon={<CloudDoneIcon />}
                            size="small"
                            sx={{
                              color: 'white',
                              width: '100%',
                              backgroundColor: '#28a728'
                            }}
                          >
                            {!formValues.fileName ? 'Undefined' : formValues.fileName}
                            <input
                              type="file"
                              hidden
                              onChange={handleFileChange}
                            />
                          </Button>
                        </Box>
                      ) : (
                        <Box display="flex" flexDirection="column" alignItems="flex-start" sx={{ width: '100%' }}>
                          <Button
                            variant="contained"
                            component="label"
                            startIcon={fileName ? <DescriptionIcon /> : <CloudUploadIcon />}
                            size="small"
                            sx={{
                              backgroundColor: buttonColor,
                              color: 'white',
                              width: '100%',
                              '&:hover': {
                                backgroundColor: '#135ba1'
                              }
                            }}
                          >
                            {fileName ? fileName : ' Upload File'}
                            <input
                              type="file"
                              accept=".ppt,.pptx"
                              hidden
                              onChange={handleFileChange}
                            />
                          </Button>
                        </Box>
                      )}
                    </Stack>
                  </Box>
                  <br />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
                    <Box sx={{ width: '100%', marginBottom: '10px', display: 'inline-flex', alignItems: 'center' }}>
                      ไฟล์แบบประเมินคำนวณความคุ้มค่าในการลงทุนด้านพัฒนาระบบงานดิจิทัล
                      {checkReject && !isDraft && display ? (
                        <Box display="flex" flexDirection="column" alignItems="flex-start" sx={{ marginLeft: '10px' }}>
                          <a
                            href={`https://tso-aov-sr.pttplc.com/api/uploads/digital-project/${formValues.FileNameServer1}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button
                              variant="text"
                              color='error'
                              size="small"
                              endIcon={<CloudOffIcon />}
                              style={{ textTransform: 'none' }}
                            >
                              {!formValues.fileName1 ? 'Undefined' : formValues.fileName1}
                            </Button>
                          </a>
                        </Box>
                      ) : (
                        <>
                          <Box display="flex" flexDirection="column" alignItems="flex-start" sx={{ marginLeft: '10px' }}>
                            <span style={{ marginTop: '0px', color: 'red', width: '100%' }}>
                              Maximum File Size is 10 MB*
                            </span>
                          </Box>
                        </>
                      )}
                    </Box>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={2}
                      sx={{ width: '100%', alignItems: 'flex-start' }}
                    >
                      <Box display="flex" flexDirection="column" alignItems="flex-start" sx={{ width: '100%' }}>
                        <a
                          href="https://tso-aov-sr.pttplc.com/api/uploads/digital-project/template/คำนวณความคุ้มค่าในการลงทุนด้านพัฒนาระบบงานดิจิทัล ปตท. v1.xlsx"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ textDecoration: 'none', width: '100%' }}
                        >
                          <Button
                            variant="outlined"
                            sx={{ width: '100%' }}
                            startIcon={<CloudDownloadIcon />}
                            size="small"
                          >
                            Download template
                          </Button>
                        </a>
                      </Box>
                      {isDraft && formValues.fileName1 !== '' ? (
                        <Box display="flex" flexDirection="column" alignItems="flex-start" sx={{ width: '100%' }}>
                          <Button
                            variant="contained"
                            component="label"
                            startIcon={<CloudDoneIcon />}
                            size="small"
                            sx={{
                              color: 'white',
                              width: '100%',
                              backgroundColor: '#28a728'
                            }}
                          >
                            {!formValues.fileName1 ? 'Undefined' : formValues.fileName1}
                            <input
                              type="file"
                              hidden
                              onChange={handleFileChange1}
                            />
                          </Button>
                        </Box>
                      ) : (
                        <Box display="flex" flexDirection="column" alignItems="flex-start" sx={{ width: '100%' }}>
                          <Button
                            variant="contained"
                            component="label"
                            startIcon={fileName1 ? <DescriptionIcon /> : <CloudUploadIcon />}
                            size="small"
                            sx={{
                              backgroundColor: buttonColor1,
                              color: 'white',
                              width: '100%',
                              '&:hover': {
                                backgroundColor: '#135ba1'
                              }
                            }}
                          >
                            {fileName1 ? fileName1 : ' Upload File'}
                            <input
                              type="file"
                              accept=".xls,.xlsx"
                              hidden
                              onChange={handleFileChange1}
                            />
                          </Button>
                        </Box>
                      )}
                    </Stack>
                  </Box>
                </>
              ) : null}
              {(checkStatus) && formValues.fileName !== '' && formValues.fileName1 !== '' && !isDraft ? (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap', gap: '10px', width: '100%' }}>
                    {/* First Box and Stack */}
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ marginBottom: '10px' }}>
                        ไฟล์การนำเสนอที่ประชุม TDC
                      </Box>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        sx={{ alignItems: 'flex-start' }}
                      >
                        <Box display="flex" flexDirection="column" alignItems="flex-start">
                          <a
                            href={`https://tso-aov-sr.pttplc.com/api/uploads/digital-project/${formValues.FileNameServer}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={formValues.fileName}
                          >
                            <Button
                              variant="text"
                              color="success"
                              size="small"
                              endIcon={<CloudDoneIcon />}
                              style={{ textTransform: 'none' }}
                            >
                              {!formValues.fileName ? 'Undefined' : formValues.fileName}
                            </Button>
                          </a>
                        </Box>
                      </Stack>
                    </Box>
                    {/* Second Box and Stack */}
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ marginBottom: '10px' }}>
                        ไฟล์แบบประเมินคุ้มค่าการลงทุน
                      </Box>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        sx={{ alignItems: 'flex-start' }}
                      >
                        <Box display="flex" flexDirection="column" alignItems="flex-start">
                          <a
                            href={`https://tso-aov-sr.pttplc.com/api/uploads/digital-project/${formValues.FileNameServer1}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={formValues.fileName1}
                          >
                            <Button
                              variant="text"
                              color="success"
                              size="small"
                              endIcon={<CloudDoneIcon />}
                            >
                              {!formValues.fileName1 ? 'Undefined' : formValues.fileName1}
                            </Button>
                          </a>
                        </Box>
                      </Stack>
                    </Box>
                  </Box>
                </>
              ) : null}
            </Item>
            {!checkStatus && (
              <Accordion expanded>
                <AccordionDetails sx={{ marginTop: '-17px' }}>
                  <Grid container alignItems="center" spacing={4}>
                    <Grid item >
                      <FormControlLabel
                        control={
                          <Checkbox
                            sx={{ color: 'black' }}
                            checked={formValues.checkboxChecked || false} // Ensure formValues has a key for this checkbox
                            onChange={(e) => setFormValues({ ...formValues, checkboxChecked: e.target.checked })}
                          />
                        }
                        labelPlacement="end"
                        sx={{ width: '100%', color: 'red' }}
                      />
                      <Box sx={{ marginTop: '-31px' }}>
                        <Typography sx={{ color: 'red', marginLeft: '29px', marginTop: '-10px' }}>
                          สำหรับการพัฒนา Application ผู้ขอรับทราบและดำเนินการตามข้อกำหนด บริษัท ปตท. จำกัด(มหาชน) ว่าด้วยการรักษาความมั่นคงปลอดภัยสารสนเทศ ดังต่อไปนี้
                        </Typography>
                        <Typography sx={{ color: 'red', marginLeft: '40px' }}>
                          1. Source code Scan ประกอบด้วย Static Application Security Testing, dynamic Application Security Testing และ Software Composition Analytic
                        </Typography>
                        <Typography sx={{ color: 'red', marginLeft: '40px' }}>
                          2. Venerability Assessment (VA) Scan
                        </Typography>
                        <Typography sx={{ color: 'red', marginLeft: '40px' }}>
                          3. การเชื่อมต่อข้อมูลระหว่าง DB และ Application ต้องผ่าน WSO2
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            )}
          </Grid>

        </Grid >

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' }, // Column on small screens, row on larger screens
            justifyContent: { xs: 'center', sm: 'space-between' }, // Centered on small screens, space between on larger
            width: '100%',
          }}
        >
          {/* Left aligned box for updateAt info */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: { xs: 2, sm: 0 } }}>
            {checkStatus && updateAt && (
              <Typography>Update At : {updateAt}</Typography>
            )}
          </Box>

          {/* Right aligned buttons */}
          <Box sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'flex-end' } }}>
            <Stack direction="row" spacing={1}>
              {(checkStatus || checkReject) && !isDraft && (
                <>
                  {/* BACK button - แสดงทุกคนที่เข้าเงื่อนไขนี้ */}
                  <Button
                    variant="contained"
                    sx={{
                      color: '#fff',
                      backgroundColor: '#f4a100',
                      '&:hover': { backgroundColor: '#84652a' },
                      mr: 1, // เพิ่ม margin ขวาเล็กน้อยให้ไม่ติดกัน
                    }}
                    onClick={cancel}
                    startIcon={<ArrowBackIcon />}
                    size="small"
                  >
                    BACK
                  </Button>

                  {/* RECALL button - เฉพาะ requester */}
                  {!checkReject && data?.requesterCode === profilePromise?.code && !recallButton && (
                    <Button
                      variant="outlined"
                      size="small"
                      color="info"
                      startIcon={
                        <AutorenewIcon
                          sx={recall ? { animation: `${spin} 1s linear infinite` } : {}}
                        />
                      }
                      onClick={() => {
                        setOpen(prev => ({ ...prev, 0: true }));
                        setStatus('draft');
                      }}
                    >
                      RECALL
                    </Button>
                  )}
                </>
              )}

              {/* ถ้าไม่ใช่ draft และไม่เข้าเงื่อนไข status → แสดง CANCEL */}
              {!isDraft && !(checkStatus || checkReject) && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={cancel}
                  size="small"
                >
                  CANCEL
                </Button>
              )}



              {isDraft ? (
                <>
                  <Button
                    color="error"
                    variant="contained"
                    onClick={() => setDelete(true)}
                    endIcon={<DeleteIcon />}
                    size="small"
                  >
                    DELETE
                  </Button>
                  <Button
                    color="warning"
                    variant="outlined"
                    disabled={checkStatus}
                    onClick={handleSubmitDraft}
                    endIcon={<DrawIcon />}
                    size="small"
                  >
                    SAVE
                  </Button>
                </>
              ) : (
                <Button
                  color="warning"
                  variant="outlined"
                  disabled={checkStatus}
                  onClick={handleSubmitDraft}
                  endIcon={<DrawIcon />}
                  size="small"
                >
                  SAVE
                </Button>
              )}

              <Button
                variant="contained"
                endIcon={<SendIcon />}
                onClick={handleSubmit}
                disabled={checkStatus}
                size="small"
              >
                SUBMIT
              </Button>
            </Stack>
          </Box>
        </Box>
      </CardContent>{recall && (<LinearBuffer />)}
      <DialogContentX
        openSendForm={openSendForm}
        handleCloseSendForm={handleCloseSendForm}
        handleSendForm={handleSendForm}
        _delete={_delete}
        setDelete={setDelete}
        handleDelete={handleDelete}
        id={id}
        openDraft={openDraft}
        OpenFileSzie={OpenFileSzie}
        handleCloseFileSize={handleCloseFileSize}
        openAccept={openAccept}
        setOpenAccept={setOpenAccept}
        setFormValues={setFormValues}
        OpenError={OpenError}
        errorText={errorText}
        OpenAddSystem={OpenAddSystem}
        systemData={systemData}
        handleInputChangeSystem={handleInputChangeSystem}
        formValues={formValues}
        setOpenAddSystem={setOpenAddSystem}
        handleOkClick={handleOkClick}
        showError={showError}
        alertPpt={alertPpt}
        setFilePptAlert={setFilePptAlert}
        alertXlsx={alertXlsx}
        setFileXlsxAlert={setFileXlsxAlert}
      />
    </>

  );
}

export default FromDigital;
