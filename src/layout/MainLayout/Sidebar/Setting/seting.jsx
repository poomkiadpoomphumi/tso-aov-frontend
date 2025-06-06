/* **********************************************************************************
, '& .MuiInputBase-input': {
     padding: '7px',
},
ใช้กำหนด INPUT เมื่อมีการบีบกันให้คงที่
********************************************************************************** */
import * as React from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Typography, Button, Stack, TextField } from '@mui/material';
import CustomizedHook from './hook.jsx';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Loader from '../../../../component/Loader/Loader.jsx';
import Divider from '@mui/material/Divider';
/* Icons */
import DataObjectIcon from '@mui/icons-material/DataObject.js';
import ChromeReaderModeOutlinedIcon from '@mui/icons-material/ChromeReaderModeOutlined.js';
import FolderSharedIcon from '@mui/icons-material/FolderOpen.js';
import ShapeLineIcon from '@mui/icons-material/ShapeLine.js';
import SecurityIcon from '@mui/icons-material/Security.js';
import WebIcon from '@mui/icons-material/Web.js';
import StorageIcon from '@mui/icons-material/Storage.js';
// Importing your axios function for handling submit
import { settingDigital, getsettings, getCodeImg } from '../../../../axios/handleSubmit.js';
import { VerticalLinearStepperDigital } from './stepper.jsx';
import useIsMobile from '../../../Mobile/isMobile.jsx';
import Snackbar from '../../../../component/Sanckbar/index.jsx';

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

const ClippedDrawer = ({ onClose }) => {
    const isMobile = React.useState(useIsMobile());
    const userLocalToken = localStorage.getItem('tokenUser');
    const [state, setState] = React.useState({
        right: true,
    });
    const [value, setValue] = React.useState(0);
    const [code, userCode] = React.useState('');
    const [dataSettings, setDataSettings] = React.useState({ approver: '', ccmail: [] });
    const [service, setService] = React.useState('digital');
    const [valueData, setValueData] = React.useState([]);
    const [loader, setLoader] = React.useState(false);
    //Approver Firewall Setting
    const [actionApprover, setActionApprover] = React.useState([
        { email: '', code: '', name: '' },
        { email: '', code: '', name: '' },
        { email: '', code: '', name: '' },
    ]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const toggleDrawer = (anchor, open) => (event) => {
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }

        setState({ ...state, [anchor]: open });
        if (!open && onClose) {
            onClose();
        }
    };

    const handleTabClick = (event, newValue, service) => {
        event.stopPropagation();
        setValue(newValue);
        setService(service);
    };

    const handleCancel = () => {
        setState({ right: false });
        if (onClose) {
            onClose();
        }
    };

    React.useEffect(() => {
        getsettings(service).then(item => {
            const toList = item?.data?.[0]?.to;
            if (Array.isArray(toList)) {
                const padded = [...toList];
                while (padded.length < 3) {
                    padded.push({ email: '', code: '', name: '' });
                }
                setActionApprover(padded.slice(0, 3)); // Limit to 3
            } else {
                // ถ้าไม่มีข้อมูลเลย ให้เคลียร์เป็นค่าว่าง
                setActionApprover([
                    { email: '', code: '', name: '' },
                    { email: '', code: '', name: '' },
                    { email: '', code: '', name: '' }
                ]);
            }
            const ccmail = item.data[0]?.ccmail || [];
            const cc = ccmail.map(email => ({ title: email }));

            setValueData(cc);
            setDataSettings({
                approver: item.data[0].approver,
                ccmail: item.data[0].ccmail,
            });
        });
        const fecthCode = async () => {
            const response = await getCodeImg(userLocalToken);
            userCode(response.code)
        }
        fecthCode();
    }, [userLocalToken, service]);

    const handleChangeSelect = (event) => {
        const selectedApprovers = event.target.value;
        setDataSettings((prevSettings) => ({
            ...prevSettings,
            approver: selectedApprovers,
        }));
    };

    const handleCcMailChange = (newValue) => {
        setDataSettings((prevSettings) => ({
            ...prevSettings,
            ccmail: newValue.map((option) => option.title),
        }));
    };

    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const handleSave = async (service) => {
        try {
            setLoader(true);
            const arrayData =
                service === 'digital' ? dataSettings :
                    service === 'firewall' ? { to: actionApprover, ccmail: dataSettings.ccmail } :
                        [];
            await settingDigital(arrayData, code, service);
        } catch (error) {
            console.error('Error saving settings:', error);
        } finally {
            setOpenSnackbar(true);
            setTimeout(() => {
                setLoader(false);
                onClose();
            }, 2000)
        }
    };

    const handleChangeFirewall = (index, field, value) => {
        setActionApprover(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    // Render the SwipeableDrawer with the list content
    const list = () => (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                height: isMobile ? '100%' : '100vh',
                width: isMobile ? '100%' : '100vw',
            }}
            role="presentation"
            onClick={(event) => event.stopPropagation()} // Prevent clicks from closing the drawer
        >{openSnackbar && (<Snackbar variant='success' text='Submitted and saved settings successfully!' />)}
            <Box
                sx={{ width: '20%', bgcolor: 'background.paper' }}
                onClick={(event) => event.stopPropagation()} // Prevent clicks from closing the drawer
            >
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={value}
                    onChange={handleChange}
                    aria-label="Vertical tabs example"
                    sx={{ borderRight: 1, borderColor: 'divider', height: '100%' }}
                >
                    <Tab
                        icon={<ChromeReaderModeOutlinedIcon />}
                        {...a11yProps(0)}
                        onClick={(event) => handleTabClick(event, 0, 'digital')}
                        sx={{ marginBottom: '10px' }}
                    />
                    <Tab
                        icon={<SecurityIcon />}
                        {...a11yProps(5)}
                        onClick={(event) => handleTabClick(event, 1, 'firewall')}
                        sx={{ marginBottom: '10px' }}
                    />
                    <Tab
                        disabled
                        icon={<FolderSharedIcon />}
                        {...a11yProps(1)}
                        onClick={(event) => handleTabClick(event, 2)}
                        sx={{ marginBottom: '10px' }}
                    />
                    <Tab
                        disabled
                        icon={<ShapeLineIcon />}
                        {...a11yProps(2)}
                        onClick={(event) => handleTabClick(event, 3)}
                        sx={{ marginBottom: '10px' }}
                    />
                    <Tab
                        disabled
                        icon={<WebIcon />}
                        {...a11yProps(3)}
                        onClick={(event) => handleTabClick(event, 4)}
                        sx={{ marginBottom: '10px' }}
                    />
                    <Tab
                        disabled
                        icon={<DataObjectIcon />}
                        {...a11yProps(4)}
                        onClick={(event) => handleTabClick(event, 5)}
                        sx={{ marginBottom: '10px' }}
                    />
                    <Tab
                        disabled
                        icon={<StorageIcon />}
                        {...a11yProps(6)}
                        onClick={(event) => handleTabClick(event, 6)}
                        sx={{ marginBottom: '10px' }}
                    />
                </Tabs>
            </Box>

            <Box
                sx={{ width: '80%', bgcolor: 'background.paper' }}
                onClick={(event) => event.stopPropagation()} // Prevent clicks from closing the drawer
            >
                {/* Start Digital Setting */}
                <TabPanel value={value} index={0}>
                    <Typography variant="h5" gutterBottom>
                        DIGITAL REQUEST FORM SETTINGS
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="body1" sx={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>
                            Approvers settings
                        </Typography>
                        <FormControl fullWidth size="small" sx={{ marginTop: '5px' }}>
                            <Select
                                id="approver-select"
                                value={dataSettings.approver}
                                onChange={handleChangeSelect}
                                sx={{
                                    '& .MuiInputBase-input': {
                                        padding: '7px',
                                    },
                                }}
                            >
                                <MenuItem value={3}>ผู้จัดการส่วน</MenuItem>
                                <MenuItem value={4}>ผู้จัดการฝ่าย</MenuItem>
                            </Select>
                        </FormControl>

                        <VerticalLinearStepperDigital value={dataSettings.approver} /><br />
                        <Divider />
                        <br />
                        <CustomizedHook text={'Cc email send system settings'} onCcMailChange={handleCcMailChange} value={valueData} setValueData={setValueData} />
                        <Typography variant="body2" sx={{ width: 300, fontSize: '12px', marginTop: '5px' }}>
                            Setting up cc email notifications when an approval request is made and when the manager approves or rejects it.
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                            <Stack direction="row" spacing={1}>
                                <Button color="error" variant="contained" size="small" onClick={handleCancel}>
                                    CANCEL
                                </Button>
                                <Button variant="contained" size="small" onClick={() => { handleSave('digital') }}>
                                    SAVE
                                </Button>
                            </Stack>
                        </Box>
                    </Box>
                </TabPanel>
                {/* End Digital Setting */}
                {/* Start Firewall Setting */}
                <TabPanel value={value} index={1}>
                    <Typography variant="h5">FIREWALL REQUEST SETTINGS</Typography>

                    <Typography variant="body1" sx={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>
                        Approvals Email send system settings
                    </Typography>
                    {[0, 1, 2].map((i) => (
                        <React.Fragment key={i}>
                            ผู้อนุมัติคนที่ {i + 1}
                            <TextField
                                sx={{
                                    width: '100%', '& .MuiInputBase-input': {
                                        padding: '7px',

                                    },
                                }}
                                size="small"
                                value={actionApprover[i].email}
                                onChange={(e) => handleChangeFirewall(i, 'email', e.target.value)}
                                placeholder={`กรอกอีเมลของผู้อนุมัติคนที่ ${i + 1}`}
                            /><br />
                            <TextField
                                sx={{
                                    width: '100%', '& .MuiInputBase-input': {
                                        padding: '7px',
                                    },
                                }}
                                size="small"
                                value={actionApprover[i].name}
                                onChange={(e) => handleChangeFirewall(i, 'name', e.target.value)}
                                placeholder={`กรอกชื่อของผู้อนุมัติคนที่ ${i + 1}`}
                            /><br />
                            <TextField
                                sx={{
                                    width: '100%', '& .MuiInputBase-input': {
                                        padding: '7px',
                                    },
                                }}
                                size="small"
                                value={actionApprover[i].code}
                                onChange={(e) => handleChangeFirewall(i, 'code', e.target.value)}
                                placeholder={`กรอกรหัสพนักงานของผู้อนุมัติคนที่ ${i + 1}`}
                            /><br /><br />
                        </React.Fragment>
                    ))}
                    <br />
                    <Divider />
                    <br />
                    <CustomizedHook text={'Cc email send system settings'} onCcMailChange={handleCcMailChange} value={valueData} setValueData={setValueData} />
                    <Typography variant="body2" sx={{ width: 300, fontSize: '12px', marginTop: '5px' }}>
                        Setting up cc email notifications when an approval request is made and when the manager approves or rejects it.
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                        <Stack direction="row" spacing={1}>
                            <Button color="error" variant="contained" size="small" onClick={handleCancel}>
                                CANCEL
                            </Button>
                            <Button variant="contained" size="small" onClick={() => { handleSave('firewall') }}>
                                SAVE
                            </Button>
                        </Stack>
                    </Box>
                </TabPanel>
                {/* End Firewall Setting */}
                <TabPanel value={value} index={2}>
                    <Typography variant="h5" gutterBottom>FILE SHARE REQUEST SETTINGS</Typography><br />
                    <Typography sx={{ width: 300, fontSize: '12px', marginTop: '5px' }}>
                        The system is not yet ready to use. is coming soon...
                    </Typography>
                </TabPanel>
                <TabPanel value={value} index={3}>
                    <Typography variant="h5">PMIS SMART TSO SETTINGS</Typography><br />
                    <Typography sx={{ width: 300, fontSize: '12px', marginTop: '5px' }}>
                        The system is not yet ready to use. is coming soon...
                    </Typography>
                </TabPanel>
                <TabPanel value={value} index={4}>
                    <Typography variant="h5">TSO INTRANET SETTINGS</Typography><br />
                    <Typography sx={{ width: 300, fontSize: '12px', marginTop: '5px' }}>
                        The system is not yet ready to use. is coming soon...
                    </Typography>
                </TabPanel>
                <TabPanel value={value} index={5}>
                    <Typography variant="h5">API REQUEST SETTINGS</Typography><br />
                    <Typography sx={{ width: 300, fontSize: '12px', marginTop: '5px' }}>
                        The system is not yet ready to use. is coming soon...
                    </Typography>
                </TabPanel>
                <TabPanel value={value} index={6}>
                    <Typography variant="h5">TSO DATA CENTER SETTINGS</Typography><br />
                    <Typography sx={{ width: 300, fontSize: '12px', marginTop: '5px' }}>
                        The system is not yet ready to use. is coming soon...
                    </Typography>
                </TabPanel>
            </Box>
        </Box>
    );

    // Render the SwipeableDrawer with the list content
    return (
        <SwipeableDrawer
            anchor="right"
            open={state.right}
            onClose={toggleDrawer('right', false)}
            onOpen={toggleDrawer('right', true)}
        >
            {list()}
            {loader && <Loader />}
        </SwipeableDrawer>
    );
};

export default ClippedDrawer;
