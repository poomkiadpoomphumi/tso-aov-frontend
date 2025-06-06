import React, { use, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore.js';
import FolderSharedIcon from '@mui/icons-material/FolderOpen.js';
import {
    Card,
    CardContent,
    Grid,
    Zoom,
    Avatar,
    Typography,
    Pagination,
    Accordion,
    AccordionActions,
    AccordionSummary,
    AccordionDetails,
    Alert,
    Button,
    TextField
} from '@mui/material';
import { gridSpacing } from '../../config.jsx';
import LoadingButton from '@mui/lab/LoadingButton';
import AttachFileOutlinedIcon from '@mui/icons-material/FilePresentOutlined.js';
import { updateStatusFirewall } from '../../axios/handleSubmit.js';

const FirewallReq = ({ location, CheckApproverValue, countApp, userCode, classes, zoom, loader, dataFirewall }) => {
    const [comment, setComment] = useState([]);
    const [loadingItemsApprove, setLoadingItemsApprove] = useState({});
    const [loadingItemsReject, setLoadingItemsReject] = useState({});

    const handleUpdateStatus = async (id, comment, params, userCode, button) => {
        const isApprove = button === 'approve';
        // Set loading state
        const setLoading = isApprove ? setLoadingItemsApprove : setLoadingItemsReject;
        setLoading((prevState) => ({ ...prevState, [id]: true }));
        try {
            await updateStatusFirewall(id, comment, params, userCode, button);
            // Set localStorage
            localStorage.setItem('showTab2', 'true');
            localStorage.setItem(isApprove ? 'approved' : 'reject', 'true');
            localStorage.setItem('lastVisitedRoute', location.pathname);
            // Refresh page after delay
            setTimeout(() => {
                window.location.reload();
            }, 800);

        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const styleTable = { textAlign: 'center', border: '1px solid #ccc', padding: '8px' };
    return (
        <>
            <Grid container spacing={gridSpacing}>
                {CheckApproverValue && !loader && dataFirewall.map((item) => {
                    const match = item.actionLine.find(item1 => item1.code === userCode);
                    return (
                        <Zoom in={zoom} {...(zoom ? { timeout: 1000 } : {})} key={item._id}>
                            <Grid item sx={{ width: '100%' }}>
                                <Card>
                                    <CardContent>
                                        <b>[FIREWALL REQUEST SYSTEM]</b> {item.jobName + ' ' + item.systemRequested}
                                        <Accordion>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2-content" id="panel2-header">
                                                <Avatar src={`https://hq-web-s13.pttplc.com/directory/photo/${item.requesterCode}.jpg?36JVBHXSPL`} />
                                                <div style={{ marginLeft: '5px', marginTop: '-2px' }}>
                                                    <span style={{ fontSize: '14px' }}>
                                                        {item.coordinatorName}
                                                        <span style={{ fontSize: '11px' }}>
                                                            {' '}
                                                            ({item.requesterCode}){' '}
                                                            {item.maxLevelApprover === 4 && item.sectionHeadStatus === 'approved'
                                                                ? 'Reviewed by ' + item.Managerdata
                                                                : null}
                                                        </span>
                                                    </span>
                                                    <br />
                                                    <span style={{ display: 'block', marginTop: '-4px', fontSize: '12px' }}>
                                                        {item.contactNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}
                                                    </span>
                                                </div>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                {item.fileName && (
                                                    <a
                                                        href={`https://tso-aov-sr.pttplc.com/api/uploads/firewall-project/${item.FileNameServer}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{ textDecoration: 'none', marginRight: '5px' }}
                                                    >
                                                        <Button variant="outlined"
                                                            startIcon={<AttachFileOutlinedIcon />}
                                                            style={{ textTransform: 'none', borderColor: '#0013e8', color: '#0013e8' }}>
                                                            {item.fileName}
                                                        </Button>
                                                    </a>
                                                )}<br /><br />
                                                <span style={{ fontSize: '16px' }}>
                                                    <b>เรียนคุณ {item.NameApprover}</b>
                                                    <br />
                                                    <b style={{ marginLeft: '50px' }}>ขอความอนุเคราะห์ อนุมัติ {item.jobName + ' ' + item.systemRequested}</b>
                                                    <br />
                                                    <b>ผู้ประสานงาน :</b>&nbsp;<u>{item.coordinatorName}</u> <b>หน่วยงาน</b> <u>{item.department}</u>
                                                    <br />
                                                    <b>ชื่องาน :</b>&nbsp;<u>{item.jobName + ' ' + item.systemRequested}</u>&nbsp;&nbsp;
                                                    <br />
                                                    <b>เหตุผล :</b>&nbsp;<u>{item.usageReason}</u>&nbsp;&nbsp;
                                                    <br /><b>และข้อมูลของ Firewall Access ตามที่แนบมาตามด้านล่าง</b>
                                                </span><br /><br />
                                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                    <thead>
                                                        <tr>
                                                            <th style={styleTable}>Source IP</th>
                                                            <th style={styleTable}>Destination IP</th>
                                                            <th style={styleTable}>Port</th>
                                                            <th style={styleTable}>Start Date</th>
                                                            <th style={styleTable}>End Date</th>
                                                            <th style={styleTable}>Usage</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {item.access.map((row, index) => (
                                                            <tr key={index}>
                                                                <td style={styleTable}>{row.sourceip}</td>
                                                                <td style={styleTable}>{row.destinationip}</td>
                                                                <td style={styleTable}>{row.port}</td>
                                                                <td style={styleTable}>{row.startdate || '--'}</td>
                                                                <td style={styleTable}>{row.enddate || '--'}</td>
                                                                <td style={{
                                                                    ...styleTable, color: row.startdate === '' && row.enddate === ''
                                                                        ? '#2e7d32' // green for success
                                                                        : '#ed6c02' // orange for warning
                                                                }}
                                                                >
                                                                    <b>{row.startdate === '' && row.enddate === '' ? 'Permanent' : 'Temporary'}</b>
                                                                </td>

                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table><br />
                                                <TextField
                                                    multiline
                                                    type="text"
                                                    label="Comments"
                                                    variant="outlined"
                                                    name="comments"
                                                    fullWidth
                                                    minRows={3}
                                                    maxRows={10}
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                    InputProps={{
                                                        style: { paddingLeft: '13px' }
                                                    }}
                                                />

                                            </AccordionDetails>
                                        </Accordion>
                                        <Accordion defaultExpanded>
                                            {item.maxLevelApprover === 3 ? (
                                                item.sectionHeadStatus === 'wait' || item.departmentHeadStatus === 'wait' ? (
                                                    <Alert severity="warning">Waiting for your approval.</Alert>
                                                ) : null
                                            ) : item.maxLevelApprover === 4 ? (
                                                item.departmentHeadStatus === 'wait' || item.sectionHeadStatus === 'approved' ? (
                                                    <Alert severity="warning">Waiting for your approval.</Alert>
                                                ) : null
                                            ) : null}
                                            <AccordionDetails>
                                                {item.sectionHeadStatus === 'approved' && item.departmentHeadStatus === 'wait' && item.maxLevelApprover === 4 && userCode === item.sectionHeadCode ? (
                                                    <span>
                                                        Updated: {item.updateAt}, Next Approval: {item.NextApprover}
                                                    </span>
                                                ) : item.updateAt === '' ? (
                                                    <span>Created: {item.createAt}</span>
                                                ) : (
                                                    <span>Updated: {item.updateAt}</span>
                                                )}
                                            </AccordionDetails>
                                            <AccordionActions sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                                                <LoadingButton
                                                    loading={loadingItemsApprove[item._id]}
                                                    variant="contained"
                                                    onClick={() =>
                                                        handleUpdateStatus(
                                                            item._id,
                                                            comment || match?.comment,
                                                            item.sectionHeadCode === userCode ? 'approver1' : 'approver2',
                                                            userCode,
                                                            'approve'
                                                        )
                                                    }
                                                >
                                                    Approve
                                                </LoadingButton>
                                                <LoadingButton
                                                    color="error"
                                                    variant="contained"
                                                    loading={loadingItemsReject[item._id]}
                                                    onClick={() =>
                                                        handleUpdateStatus(
                                                            item._id,
                                                            comment || match?.comment,
                                                            item.sectionHeadCode === userCode ? 'approver1' : 'approver2',
                                                            userCode,
                                                            'reject'
                                                        )
                                                    }
                                                >
                                                    Reject
                                                </LoadingButton>
                                            </AccordionActions>
                                        </Accordion>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Zoom>
                    );
                })}
            </Grid >
            {/*             {4 > 1 && (
                <>
                    <Pagination
                        disabled
                        count={4}
                        page={1}
                        shape="rounded"
                        color="primary"
                        sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}
                    />
                    <br />
                    <hr />
                </>
            )} */}
        </>
    );
}
FirewallReq.propTypes = {}
export default FirewallReq;