import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import { getCodeImg } from '../../axios/handleSubmit.js';
/* import project */
import DigitalReq from './DigitalReq.jsx';
//import FileshareReq from './FileshareReq.jsx';
import FirewallReq from './FirewallReq.jsx';
import Loader from '../../component/Loader/Loader.jsx';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import Tabs from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel'
import Badge from '@mui/material/Badge';
import ReplayIcon from '@mui/icons-material/Replay.js';
import Button from '@mui/material/Button';

const useStyles = makeStyles((theme) => ({
    link: {
        textDecoration: 'none',
        color: 'inherit',
        backgroundColor: '#fff',
        padding: '5px 10px',
        borderRadius: '7px',
        display: 'inline-block',
    },
    disabled: {
        pointerEvents: 'none',
        color: theme.palette.text.disabled,
    },
    dis: {
        color: theme.palette.text.disabled,
        backgroundColor: theme.palette.action.disabledBackground,
    }
}));

const Approvals = ({
    location,
    newComment,
    setNewComment,
    handleApproved,
    handleReject,
    CheckApproverValue,
    filteredData, //data digital form
    loadingItemsApprove,
    loadingItemsReject,
    loader,
    dataFirewall, //data firewall form
    countDigital,
    countFirewall
}) => {
    const classes = useStyles();
    const [userCode, setUserCode] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [zoom, setZoom] = useState(true);
    const itemsPerPage = 2;
    const [displayedItems, setDisplayedItems] = useState([]);
    const [totalPaginationPages, setTotalPaginationPages] = useState(null);
    useEffect(() => {
        const fetchCodeUser = async () => {
            const token = localStorage.getItem('tokenUser');
            const getCode = await getCodeImg(token);
            setUserCode(getCode.code);
        };
        fetchCodeUser();
    }, []);

    const handlePageChange = (event, value) => {
        setZoom(false);
        setTimeout(() => {
            setCurrentPage(value);
            setZoom(true);
        }, 100);
    };

    useEffect(() => {
        if (filteredData && userCode !== null) {
            const filteredItems = filteredData.filter(
                (item) =>
                    (item.sectionHeadStatus === 'wait' && item.departmentHeadStatus === 'wait' && item.maxLevelApprover === 3) ||
                    (item.sectionHeadStatus === 'wait' && item.departmentHeadStatus === 'wait' && item.maxLevelApprover === 4 && item.sectionHeadCode === userCode) ||
                    (item.sectionHeadStatus === 'approved' && item.departmentHeadStatus === 'wait' && item.maxLevelApprover === 4 && item.departmentHeadCode === userCode)
            );
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            setDisplayedItems(filteredItems?.slice().reverse());
            setTotalPaginationPages(Math.ceil(filteredItems.length / itemsPerPage));
        }
    }, [filteredData, userCode, currentPage]);


    const getTargetGroup = (valueTarget) => {
        if (!valueTarget) return '';
        const { agency, client, other } = valueTarget;
        if (agency || client || other) {
            return [
                agency ? `หน่วยงาน ${agency}` : '',
                client ? `ลูกค้า ${client}` : '',
                other ? `อื่นๆ ${other}` : ''
            ].filter(Boolean).join(', ');
        }
    };

    const getPlatform = (valuePlatform) => {
        if (!valuePlatform) return '';
        const { mobile, web, other } = valuePlatform;
        if (mobile || web || other) {
            return [
                mobile ? 'Mobile Application' : '',
                web ? 'Web Application' : '',
                other ? `other ${other}` : ''
            ].filter(Boolean).join(', ');
        }
    };

    const getImpact = (valueImpact) => {
        if (!valueImpact) return '';
        const { efficiency, effective, main, notmain } = valueImpact;
        if (efficiency || effective || main || notmain) {
            return [
                efficiency ? 'ประสิทธิภาพ' : '',
                effective ? 'ประสิทธิผล' : '',
                main ? `กระบวนการหลัก ${main}` : '',
                notmain ? `ไม่ใช่กระบวนการหลัก ${notmain}` : ''
            ].filter(Boolean).join(', ');
        }
    };

    const getCompliance = (valueCompliance) => {
        if (!valueCompliance) return '';
        const { law, notlaw, lawother, docother } = valueCompliance;
        if (law || notlaw || lawother || docother) {
            return [
                law ? 'เกี่ยวข้องกับกฏหมาย' : '',
                notlaw ? 'ไม่เกี่ยวข้องกับกฏหมาย' : '',
                lawother ? `เกี่ยวข้องกับกฏอื่นๆ ${lawother}` : '',
                docother ? `เอกสารที่เกี่ยวข้อง (เอกสาร P/WI) ${docother}` : ''
            ].filter(Boolean).join(', ');
        }
    };

    const Period = (value) => {
        if (!value) return '';
        if (value['6month']) {
            return '6 เดือน'
        } else if (value['1year']) {
            return '1 ปี';
        } else if (value['2year']) {
            return '2 ปี';
        } else if (value['mt2year']) {
            return 'มากกว่า 2 ปี';
        }
    };
    const [valueTabs, setValueTabs] = React.useState('1');
    const handleChangeTabs = (event, newValue) => {
        setValueTabs(newValue);
    };

    const DisplayNonData = () => {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="65vh"
                textAlign="center"
            >
                <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                    <Typography variant="h5" sx={{ color: '#9e9e9e' }}>
                        You don't have an approvals request.
                    </Typography>
                    <Button variant="outlined" startIcon={<ReplayIcon />} color="secondary" size="small"
                        onClick={() => {
                            localStorage.setItem('reload', 'reload');
                            window.location.reload();
                        }}
                    >
                        Reload
                    </Button>
                </Box>
            </Box>
        )
    }
    return (
        <>
            {((CheckApproverValue && !loader && countDigital > 0) || countFirewall > 0) ? (
                <>
                    <Box sx={{ width: '100%', typography: 'body1' }}>
                        <TabContext value={valueTabs} sx={{ marginTop: '0px' }}>
                            <Box sx={{
                                bgcolor: '#fafafa',
                                marginLeft: '20px', // Removed margin to align closer
                                marginRight: '20px', // Removed margin to align closer
                                borderRadius: '7px',
                                boxShadow: '0 3px 6px rgba(0,0,0,0.02), 0 3px 6px rgba(0,0,0,0.03)'
                            }}>
                                <Tabs
                                    value={valueTabs}
                                    onChange={handleChangeTabs}
                                    variant="scrollable"
                                    scrollButtons
                                    aria-label="scrollable auto tabs example"
                                    allowScrollButtonsMobile
                                >
                                    <Tab label="ALL" value="1" sx={{ minWidth: '190px', padding: '0' }} />
                                    <Tab
                                        label={
                                            <Badge
                                                badgeContent={countDigital}
                                                max={countDigital}
                                                color="error"
                                                sx={{ '.MuiBadge-badge': { right: -10 } }}
                                            >
                                                DIGITAL REQUEST
                                            </Badge>
                                        } value="2" sx={{ minWidth: '190px', padding: '0' }} />

                                    <Tab label={
                                        <Badge
                                            badgeContent={countFirewall}
                                            max={countFirewall}
                                            color="error"
                                            sx={{ '.MuiBadge-badge': { right: -10 } }}
                                        >
                                            FIREWALL REQUEST
                                        </Badge>
                                    } value="3" sx={{ minWidth: '190px', padding: '0' }} />
                                    <Tab disabled label="API REQUEST" value="4" sx={{ minWidth: '190px', padding: '0' }} />
                                    <Tab disabled label="FILE SHARE REQUEST" value="5" sx={{ minWidth: '190px', padding: '0' }} />
                                    <Tab disabled label="PMIS SMART REQUEST" value="6" sx={{ minWidth: '190px', padding: '0' }} />
                                    <Tab disabled label="TSO INTRANET REQUEST" value="7" sx={{ minWidth: '190px', padding: '0' }} />
                                    <Tab disabled label="DATA CENTER REQUEST" value="8" sx={{ minWidth: '190px', padding: '0' }} />
                                </Tabs>
                            </Box>

                            <TabPanel value="1">
                                {countDigital > 0 && (
                                    <DigitalReq
                                        CheckApproverValue={CheckApproverValue}
                                        displayedItems={displayedItems}
                                        zoom={zoom}
                                        getTargetGroup={getTargetGroup}
                                        getImpact={getImpact}
                                        getCompliance={getCompliance}
                                        Period={Period}
                                        getPlatform={getPlatform}
                                        newComment={newComment}
                                        setNewComment={setNewComment}
                                        loadingItemsApprove={loadingItemsApprove}
                                        loadingItemsReject={loadingItemsReject}
                                        handleApproved={handleApproved}
                                        handleReject={handleReject}
                                        userCode={userCode}
                                        totalPaginationPages={totalPaginationPages}
                                        currentPage={currentPage}
                                        handlePageChange={handlePageChange}
                                    />
                                )}
                                <br />
                                {countFirewall > 0 && (
                                    <FirewallReq
                                        location={location}
                                        CheckApproverValue={CheckApproverValue}
                                        countApp={countDigital}
                                        userCode={userCode}
                                        classes={classes}
                                        zoom={zoom}
                                        loader={loader}
                                        dataFirewall={dataFirewall}
                                    />
                                )}
                            </TabPanel>
                            <TabPanel value="2">
                                {countDigital > 0 ? (
                                    <DigitalReq
                                        CheckApproverValue={CheckApproverValue}
                                        displayedItems={displayedItems}
                                        zoom={zoom}
                                        getTargetGroup={getTargetGroup}
                                        getImpact={getImpact}
                                        getCompliance={getCompliance}
                                        Period={Period}
                                        getPlatform={getPlatform}
                                        newComment={newComment}
                                        setNewComment={setNewComment}
                                        loadingItemsApprove={loadingItemsApprove}
                                        loadingItemsReject={loadingItemsReject}
                                        handleApproved={handleApproved}
                                        handleReject={handleReject}
                                        userCode={userCode}
                                        totalPaginationPages={totalPaginationPages}
                                        currentPage={currentPage}
                                        handlePageChange={handlePageChange}
                                    />
                                ) : (
                                    <DisplayNonData />
                                )}
                            </TabPanel>
                            <TabPanel value="3">
                                {countFirewall > 0 ? (
                                    <FirewallReq
                                        location={location}
                                        CheckApproverValue={CheckApproverValue}
                                        countApp={countFirewall}
                                        classes={classes}
                                        userCode={userCode}
                                        zoom={zoom}
                                        loader={loader}
                                        dataFirewall={dataFirewall}
                                    />
                                ) : (
                                    <DisplayNonData />
                                )}
                            </TabPanel>

                            <TabPanel value="4"></TabPanel>
                            <TabPanel value="5"></TabPanel>
                            <TabPanel value="6"></TabPanel>
                            <TabPanel value="7"></TabPanel>
                            <TabPanel value="8"></TabPanel>
                        </TabContext>
                    </Box>
                </>
            ) : !CheckApproverValue ? (
                <DisplayNonData />
            ) : (<Loader />)
            }

        </>

    );
};

export default Approvals;
