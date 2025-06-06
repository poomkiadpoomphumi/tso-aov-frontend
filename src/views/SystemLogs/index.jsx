import React, { useEffect, useState, useMemo } from 'react';
import { Grid, Card, CardHeader, CardContent, Typography, Divider, LinearProgress, Button, Box, Stack } from '@mui/material';
import { gridSpacing, ADMIN } from '../../config';
import { useNavigate } from 'react-router-dom';
// assets
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import { useTheme, emphasize, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import { getLogsUser, getDataInMonth, getCodeImg } from '../../axios/handleSubmit';
import RevenuChartCard from './RevenuChartCard';
import { LineChart } from '@mui/x-charts/LineChart';
import FilterListIcon from '@mui/icons-material/FilterList';
import { orange } from '@mui/material/colors';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DialogTitle from '@mui/material/DialogTitle';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import dayjs from 'dayjs';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import RestoreIcon from '@mui/icons-material/Restore';
import Tooltip from '@mui/material/Tooltip';
import { RequestDetail } from './RequestDetail';
import Profile from '../Profile/index';

const ColorButton = styled(Button)(({ theme }) => ({
    color: '#fff',
    backgroundColor: '#3366ff',
    '&:hover': {
        backgroundColor: '#3366ff',
    },
}));
const ColorButtonClear = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(orange[500]),
    backgroundColor: orange[500],
    '&:hover': {
        backgroundColor: orange[700],
    },
}));


const FlatCardBlock = styled((props) => <Grid item sm={6} xs={12} {...props} />)(({ theme }) => ({
    padding: '25px 25px',
    borderLeft: '2px solid ' + theme.palette.background.default,
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)',
    },
    [theme.breakpoints.down('sm')]: {
        borderLeft: 'none',
        borderBottom: '2px solid ' + theme.palette.background.default
    },
    [theme.breakpoints.down('md')]: {
        borderBottom: '2px solid ' + theme.palette.background.default
    }
}));


const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    const backgroundColor =
        theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[800];
    return {
        backgroundColor,
        height: theme.spacing(3),
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightRegular,
        '&:hover, &:focus': {
            cursor: 'pointer',
            backgroundColor: emphasize(backgroundColor, 0.06),
        },
        '&:active': {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(backgroundColor, 0.12),
        },
    };
});

const SystemLogs = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [openFilter, setOpenFilter] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [dataCountUser, setDataCountUser] = useState([]);
    const [dataMonth, setDataMonth] = useState([]);
    const [systemReq, setSystemReq] = useState([]);
    const [clickFilter, setClick] = useState(false);
    const [inMonth, setInMonth] = useState(false);
    const [currentMonth, setCurrentMonth] = useState([]);
    const [nData, setNData] = useState([]);
    const [nuData, setNuData] = useState([]);
    const [MaxDays, setMaxDays] = useState(0);
    const [loader, setLoader] = useState(false);
    const [systemRevenu, setSystemRevenu] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [clickDetail, setClickDetail] = useState(false);
    const handleClick = (type) => { setClickDetail(true); setSelectedRequest(type); };
    const [rows, setRow] = React.useState([]);
    const [admin, setAdmin] = useState(false);
    const userLocalToken = useMemo(() => localStorage.getItem('tokenUser'), []);

    const getData = async () => {
        try {
            const response = await getCodeImg(userLocalToken);
            const hasAllowedCode = ADMIN[0].ADMINSETTING.includes(parseInt(response?.code, 10));
            setAdmin(hasAllowedCode || ADMIN[0].ADMINSYSTEM[0] === response?.code);
            const logData = await getLogsUser();
            setDataCountUser(logData.data.countUser || []);
            setDataMonth(logData.data.getMonth || []);
            setSystemReq(logData.data.systemRequest || []);
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoader(false);
        }
    };
    
    const fetchingInmonth = async (s, e) => {
        try {
            const logData = await getDataInMonth(s, e);
            setNData(logData.data.systemRequest || []);
            setNuData(logData.data.getMonth || []);
            setDataCountUser(logData.data.countUser || []);
            setSystemRevenu(logData.data.systemRevenu || [])
        } catch (error) {
            console.error('Error fetching filtered logs:', error);
        } finally {
            setLoader(false);
        }
    };

    useEffect(() => { getData(); }, []);
    const handleFilterClick = () => {
        if (startDate && endDate && startDate.isValid() && endDate.isValid()) {
            setClick(true);
            setLoader(true);
            const s = startDate.format('YYYY-MM-DD');
            const e = endDate.format('YYYY-MM-DD');
            setMaxDays(endDate.format('DD'));
            if (startDate.format('MM') === endDate.format('MM')) {
                const year = new Date().getFullYear(); // Current year
                const daysInMonth = new Date(year, startDate.format('MM'), 0).getDate();
                const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
                setCurrentMonth(daysArray); //[1, 2, 3,..., 29, 30] day in month
                fetchingInmonth(s, e);
                setInMonth(true);
                setOpenFilter(false)
            } else {
                const fetching = async () => {
                    try {
                        const logData = await getLogsUser(s, e);
                        setDataCountUser(logData.data.countUser || []);
                        setDataMonth(logData.data.getMonth || []);
                        setSystemReq(logData.data.systemRequest || []);
                    } catch (error) {
                        console.error('Error fetching filtered logs:', error);
                    } finally {
                        setLoader(false);
                    }
                };
                fetching().then(() => setOpenFilter(false));
            }

        }
    };
    const xLabelsMonths = dataMonth ? dataMonth.map(item => item.month) : []; //['Apr', 'May', 'June', 'July', 'Aug', 'Sept'];
    const uData = dataMonth ? dataMonth.map(item => item.count) : [];//[13, 56, 99, 4, 9, 5]
    const pData = new Array(xLabelsMonths.length).fill(0); // Output:  [0, 0, 0, 0, 9, 0]
    // Loop through each item in systemReq Map index to month
    systemReq.forEach(item => {
        const systemKey = Object.keys(item).find(key => key !== 'lastDate'); // Find the key that isn't 'lastDate'
        const count = item[systemKey] || 0; // Get the count associated with that key
        const lastDate = item.lastDate || ''; // Get the lastDate value
        const index = xLabelsMonths.indexOf(lastDate);// Find the index of lastDate in xLabelsMonths
        if (index !== -1) { pData[index] += count; }// Add the count to the corresponding index in pData
    });
    // Map currentMonth to the corresponding count in data, but only up to maxLastDate
    const mappedArray = Array.from({ length: parseInt(MaxDays, 10) }, (_, i) => {
        const day = i + 1; // Days start from 1
        const match = nData.find(item => parseInt(item.lastDate) === day);
        return match ? match.count : 0; //[0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 1, 0, 2]
    });
    const mappedArrayVData = Array.from({ length: parseInt(MaxDays, 10) }, () => 0);
    nuData.forEach(item => {
        const { _id, count } = item;
        if (_id >= 1 && _id <= parseInt(MaxDays, 10)) {
            mappedArrayVData[_id - 1] = count; // -1 because array indices are 0-based
        }
    });
    const chartSetting = {
        series: [
            { data: inMonth ? mappedArray : pData, label: 'Request Count', yAxisId: 'leftAxisId' },
            { data: inMonth ? mappedArrayVData : uData, label: 'Visits Count', yAxisId: 'rightAxisId' }
        ],
        xAxis: [{ scaleType: 'point', data: inMonth ? currentMonth : xLabelsMonths }],
        yAxis: [{ id: 'leftAxisId' }, { id: 'rightAxisId' }],
        rightAxis: "rightAxisId",
    };
    // Combine user data with defaults if needed

    const combinedData = dataCountUser
        .map((item) => ({
            name: `${item._id} (${item.unitabbr})`,
            percentage: item.count,
        }))
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 10);
    // Define an array of colors for the progress bar
    const progressColors = ['primary', 'warning', 'info', 'success', 'secondary'];

    // Function to get a random color
    const getRandomColor = () => {
        return progressColors[Math.floor(Math.random() * progressColors.length)];
    };

    const clearFilter = () => {
        setLoader(true);
        setInMonth(false);
        setStartDate(null);  // Reset start date
        setEndDate(null);    // Reset end date
        getData();           // Call getData to reset and reload data
    };

    const countValue = Array.isArray(inMonth ? systemRevenu : systemReq)
        ? systemReq.map(item => Object.values(item)[0]) : [];

    useEffect(() => {
        const getData = async () => {
            try {
                setLoader(true);
                if (!selectedRequest) { setRow([]); return; }
                // กำหนด modules ที่ต้องการ
                let module = [];
                if (selectedRequest === 'DIGITAL_REQUEST') {
                    module = ['Digital request'];
                }
                if (selectedRequest === 'FIREWALL_REQUEST') {
                    module = ['Firewall request'];
                }
                const params = { s: null, e: null };
                // ดึงข้อมูลทั้งหมดในครั้งเดียวด้วย Promise.all
                const results = await Promise.all(module.map((module) => getLogsUser(params.s, params.e, module)));

                // รวม formData จากทุก module เข้าด้วยกัน
                const combinedData = results.flatMap(result => result.data.formData || []);

                setRow(combinedData);
            } catch (error) {
                console.error('Error fetching logs:', error);
                setRow([]);
            } finally {
                setLoader(false);
            }
        };

        if (!selectedRequest) { setRow([]); } else { getData(); }
    }, [selectedRequest]);


    return (

        <Grid container spacing={gridSpacing} >
            {clickDetail && (<RequestDetail rows={rows} loader={loader} type={selectedRequest} open={clickDetail} close={setClickDetail} />)}

            <Grid item xs={12} sx={{ overflow: 'auto', position: 'relative', }}>
                <Breadcrumbs aria-label="breadcrumb">
                    <StyledBreadcrumb component="a" href="#" label="Home" icon={<HomeIcon fontSize="small" />} onClick={() => navigate(`/dashboard/default`)} />
                    <StyledBreadcrumb component="a" href="#" label="My List" icon={<RestoreIcon fontSize="small" />} onClick={() => navigate(`/MyList`)} />
                </Breadcrumbs><br />
                <Profile />
                <br />
                {
                    clickFilter && startDate && endDate && admin && (
                        <>
                            <Box sx={{ display: 'flex-start', flexDirection: 'column', width: '100%' }}>
                                <Stack
                                    direction={{ xs: 'column', sm: 'row' }}
                                    spacing={1}
                                    sx={{ width: '100%' }}
                                >
                                    <Breadcrumbs
                                        sx={{ flexGrow: 1 }}
                                        separator={<NavigateNextIcon fontSize="small" />}
                                        aria-label="breadcrumb"
                                    >
                                        <Typography key="1" color="text.primary">ข้อมูลระหว่างวันที่ </Typography>
                                        <Typography key="1" color="text.primary">{startDate && startDate.format('YYYY-MM-DD')}</Typography>
                                        <Typography key="2" color="text.primary">{endDate && endDate.format('YYYY-MM-DD')}</Typography>
                                    </Breadcrumbs>
                                </Stack>
                            </Box>
                            <br />
                        </>
                    )
                }
                {admin && (
                <Grid container spacing={gridSpacing} >
                    <Grid item xs={12} md={6}>
                        <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <CardHeader
                                title={
                                    <Typography component="div" className="card-header">
                                        Web Application Visits in the Last Six Months
                                    </Typography>
                                }
                                action={
                                    <>
                                        <Tooltip title="Clear filter" placement="bottom" arrow>
                                            <ColorButtonClear variant="contained" sx={{ marginRight: 2, color: '#fff' }} onClick={clearFilter}>
                                                <FilterListOffIcon />
                                            </ColorButtonClear>
                                        </Tooltip>
                                        <Tooltip title="filter data" placement="bottom" arrow>
                                            <ColorButton variant="contained" sx={{ marginRight: 2 }} onClick={() => { setOpenFilter(true) }}>
                                                <FilterListIcon />
                                            </ColorButton>
                                        </Tooltip>
                                    </>
                                }
                            />
                            <Divider />
                            <CardContent>
                                <div style={{
                                    minHeight: '400px', // Set a minimum height to ensure visibility
                                    overflow: 'auto',
                                    position: 'relative',
                                    width: '100%', // Ensure the div takes up full width
                                    height: '560px', // Set an explicit height for the chart container
                                }}>
                                    {xLabelsMonths.length > 0 && (
                                        <LineChart
                                            {...chartSetting}
                                            grid={{ vertical: false, horizontal: true }}
                                            sx={{ flex: 1, height: '100%', width: '100%' }}
                                        />
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardHeader title={<Typography component="div" className="card-header">Top 10 user visits</Typography>} />
                            <Divider />
                            <CardContent sx={{ maxHeight: '620px', overflowY: 'auto' }}>
                                <Grid container spacing={gridSpacing}>
                                    {combinedData.map((item, index) => (
                                        <Grid item xs={12} key={index}>
                                            <Grid container alignItems="center" spacing={1}>
                                                <Grid item xs={6} sm={8}>
                                                    <Typography variant="body2">{item.name}</Typography>
                                                </Grid>
                                                <Grid item xs={6} sm={4}>
                                                    <Typography variant="body2" align="right">{item.percentage}</Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        aria-label={item.name}
                                                        value={item.percentage}
                                                        color={index === 0 ? 'error' : getRandomColor()}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    ))}
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <RevenuChartCard systemReq={inMonth ? systemRevenu : systemReq} />
                    </Grid>
                    <Grid item xs={12} md={6} >
                        <Typography
                            component="div"
                            className="card-header"
                            sx={{ marginLeft: '22px' }}
                        >The number of requests per service.</Typography><br />
                        <Card>
                            <CardContent sx={{ p: '0 !important' }}>
                                <Grid container alignItems="center" spacing={0}>
                                    <FlatCardBlock onClick={() => handleClick("DIGITAL_REQUEST")} sx={{ cursor: "pointer" }}>
                                        <Grid container alignItems="center" spacing={1}>
                                            <Grid item>
                                                <Typography variant="subtitle2" align="left">
                                                    DIGITAL REQUEST
                                                </Typography>
                                            </Grid>
                                            <Grid item sm zeroMinWidth>
                                                <Typography variant="h5" align="right">
                                                    {countValue[0] || '0'}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </FlatCardBlock>
                                    <FlatCardBlock onClick={() => handleClick("FIREWALL_REQUEST")} sx={{ cursor: "pointer" }}>
                                        <Grid container alignItems="center" spacing={1}>
                                            <Grid item>
                                                <Typography variant="subtitle2" align="left">
                                                    FIREWALL REQUEST
                                                </Typography>
                                            </Grid>
                                            <Grid item sm zeroMinWidth>
                                                <Typography variant="h5" align="right">
                                                    {countValue[1] || '0'}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </FlatCardBlock>

                                </Grid>
                            </CardContent>
                        </Card><br />
                        <Card>
                            <CardContent sx={{ p: '0 !important' }}>
                                <Grid container alignItems="center" spacing={0}>
                                    <FlatCardBlock onClick={() => handleClick("PMIS_SMART_REQUEST")} sx={{ cursor: "pointer" }}>
                                        <Grid container alignItems="center" spacing={1}>
                                            <Grid item>
                                                <Typography variant="subtitle2" align="left">
                                                    PMIS SMART REQUEST
                                                </Typography>
                                            </Grid>
                                            <Grid item sm zeroMinWidth>
                                                <Typography variant="h5" sx={{ color: theme.palette.secondary.main }} align="right">
                                                    0
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </FlatCardBlock>
                                    <FlatCardBlock onClick={() => handleClick("TSO_INTRANET_REQUEST")} sx={{ cursor: "pointer" }}>
                                        <Grid container alignItems="center" spacing={1}>
                                            <Grid item>
                                                <Typography variant="subtitle2" align="left">
                                                    TSO INTRANET REQUEST
                                                </Typography>
                                            </Grid>
                                            <Grid item sm zeroMinWidth>
                                                <Typography variant="h5" sx={{ color: theme.palette.secondary.main }} align="right">
                                                    0
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </FlatCardBlock>
                                </Grid>
                            </CardContent>
                        </Card><br />
                        <Card>
                            <CardContent sx={{ p: '0 !important' }}>
                                <Grid container alignItems="center" spacing={0}>
                                    <FlatCardBlock onClick={() => handleClick("API_REQUEST")} sx={{ cursor: "pointer" }}>
                                        <Grid container alignItems="center" spacing={1}>
                                            <Grid item>
                                                <Typography variant="subtitle2" align="left">
                                                    API REQUEST
                                                </Typography>
                                            </Grid>
                                            <Grid item sm zeroMinWidth>
                                                <Typography variant="h5" sx={{ color: theme.palette.secondary.main }} align="right">
                                                    0
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </FlatCardBlock>
                                    <FlatCardBlock onClick={() => handleClick("FILESHARE_REQUEST")} sx={{ cursor: "pointer" }}>
                                        <Grid container alignItems="center" spacing={1}>
                                            <Grid item>
                                                <Typography variant="subtitle2" align="left">
                                                    FILESHARE REQUEST
                                                </Typography>
                                            </Grid>
                                            <Grid item sm zeroMinWidth>
                                                <Typography variant="h5" sx={{ color: theme.palette.secondary.main }} align="right">
                                                    0
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </FlatCardBlock>
                                </Grid>
                            </CardContent>
                        </Card><br />
                        <Card>
                            <CardContent sx={{ p: '0 !important' }}>
                                <Grid container alignItems="center" spacing={0}>
                                    <FlatCardBlock onClick={() => handleClick("TSO_DATA_CENTER_REQUEST")} sx={{ cursor: "pointer" }}>
                                        <Grid container alignItems="center" spacing={1}>
                                            <Grid item>
                                                <Typography variant="subtitle2" align="left">
                                                    TSO DATA CENTER REQUEST
                                                </Typography>
                                            </Grid>
                                            <Grid item sm zeroMinWidth>
                                                <Typography variant="h5" sx={{ color: theme.palette.secondary.main }} align="right">
                                                    0
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </FlatCardBlock>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid >
                )}
            </Grid >
            <Dialog
                open={openFilter}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >        <DialogTitle id="alert-dialog-title">
                    {"Filter visits Web Application"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker', 'DatePicker']}>
                                <DatePicker
                                    label="Picker date start"
                                    value={startDate}
                                    onChange={(newValue) => setStartDate(newValue)} // Update state on date change
                                    maxDate={dayjs()}
                                />
                                <DatePicker
                                    label="Picker date end"
                                    value={endDate}
                                    onChange={(newValue) => setEndDate(newValue)} // Update state on date change
                                    maxDate={dayjs()}
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setOpenFilter(false) }} color='error'>CANCEL</Button>
                    <Button onClick={handleFilterClick} autoFocus>FIlTER</Button>
                </DialogActions>
            </Dialog>
            
        </Grid >

    );
}

export default SystemLogs;
