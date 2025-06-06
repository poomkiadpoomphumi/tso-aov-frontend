import React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore.js';
import AttachFileOutlinedIcon from '@mui/icons-material/FilePresentOutlined.js';
import ChromeReaderModeOutlinedIcon from '@mui/icons-material/ChromeReaderModeOutlined.js';
import {
    Card,
    CardContent,
    Grid,
    TextField,
    Avatar,
    Button,
    Typography,
    Pagination,
    Zoom,
    Alert,
    Accordion,
    AccordionActions,
    AccordionSummary,
    AccordionDetails,
    Box
} from '@mui/material';
import { gridSpacing } from '../../config.jsx';
import LoadingButton from '@mui/lab/LoadingButton';
import Loader from '../../component/Loader/Loader.jsx';
import PropTypes from 'prop-types';

const DigitalReq = ({
    CheckApproverValue,
    displayedItems,
    zoom,
    getTargetGroup,
    getImpact,
    getCompliance,
    Period,
    getPlatform,
    newComment,
    setNewComment,
    loadingItemsApprove,
    loadingItemsReject,
    handleApproved,
    handleReject,
    userCode,
    totalPaginationPages,
    currentPage,
    handlePageChange,
}) => {
    
    if (displayedItems.lenght < 0) {
        return <Loader />
    }
    return (
        <>
            <Grid container spacing={gridSpacing}>
                {CheckApproverValue &&
                    Array.isArray(displayedItems) && displayedItems.map((item) => (
                        <Zoom in={zoom} {...(zoom ? { timeout: 1000 } : {})} key={item._id}>
                            <Grid item key={item._id} sx={{ width: '100%' }}>
                                <Card>
                                    <CardContent>
                                        <b>[DIGITAL REQUEST SYSTEM]</b> {item.jobName}
                                        <Accordion >
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
                                                        href={`https://tso-aov-sr.pttplc.com/api/uploads/digital-project/${item.FileNameServer}`}
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
                                                )}

                                                {item.fileName1 && (
                                                    <a
                                                        href={`https://tso-aov-sr.pttplc.com/api/uploads/digital-project/${item.FileNameServer1}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{ textDecoration: 'none' }}
                                                    >
                                                        <Button variant="outlined"
                                                            startIcon={<AttachFileOutlinedIcon />}
                                                            style={{ textTransform: 'none', borderColor: '#0013e8', color: '#0013e8' }}>
                                                            {item.fileName1}
                                                        </Button>
                                                    </a>
                                                )}

                                                <br /><br />
                                                <span style={{ fontSize: '16px' }}>
                                                    <b>เรียนคุณ {item.NameApprover}</b>
                                                    <br />
                                                    <b style={{ marginLeft: '50px' }}>เรื่องขอความอนุเคราะห์ อนุมัติ {item.jobName}</b>
                                                    <br />
                                                    <b>ผู้ประสานงาน :</b>&nbsp;<u>{item.coordinatorName}</u> <b>หน่วยงาน</b> <u>{item.department}</u>
                                                    <br />
                                                    <b>ชื่องาน :</b>&nbsp;<u>{item.jobName}</u>&nbsp;&nbsp;
                                                    <b>กลุ่มเป้าหมาย :</b>&nbsp;<u>{getTargetGroup(item.ValueTarget)}</u>
                                                    <br />
                                                    <b>Business Impact :</b>&nbsp;<u>{getImpact(item.ValueImpact)}</u>&nbsp;&nbsp;
                                                    <b>Compliance :</b>&nbsp;<u>{getCompliance(item.ValueCompliance)}</u>
                                                    <br />
                                                    <b>ระยะเวลาที่การใช้งานระบบ :</b>&nbsp;<u>{Period(item.ValuePeriod)}</u>&nbsp;&nbsp;
                                                    <b>ประเภทของงาน :</b>&nbsp;<u>{item.workType}</u>
                                                    <br />
                                                    <b>Platform ที่ใช้ :</b>&nbsp;<u>{getPlatform(item.ValuePlatform)}</u>&nbsp;&nbsp;
                                                    <b>ลักษณะของงาน :</b>&nbsp;<u>{item.natureOfWork}</u>
                                                    <br />
                                                    <b>วัตถุประสงค์ :</b>&nbsp;{item.objectives}
                                                    <br />
                                                    <b>โดยมีรายละเอียดงาน :</b>&nbsp;{item.jobDetails}
                                                    <br />
                                                    <b>ประโยชน์ที่คาดว่าจะได้รับ :</b>&nbsp;{item.benefits}
                                                </span>
                                                <br /><br />
                                                <TextField
                                                    multiline
                                                    type="text"
                                                    label="Comments"
                                                    variant="outlined"
                                                    name="comments"
                                                    fullWidth
                                                    minRows={3}
                                                    maxRows={10}
                                                    value={newComment || ''}
                                                    onChange={(e) => setNewComment(e.target.value)}
                                                    InputProps={{
                                                        style: { paddingLeft: '13px' }
                                                    }}
                                                />
                                            </AccordionDetails>
                                        </Accordion>
                                        {userCode && (
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
                                                {(item.sectionHeadStatus === 'approved' && item.departmentHeadStatus === 'approved') || item.sectionHeadStatus === 'reject' ? (
                                                    null
                                                ) : (
                                                    <AccordionActions sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                                                        <LoadingButton
                                                            loading={loadingItemsApprove[item._id]}
                                                            variant="contained"
                                                            onClick={() =>
                                                                handleApproved(item._id, item.sectionHeadCode === userCode ? 'approver1' : 'approver2', userCode)
                                                            }
                                                        >
                                                            Approve
                                                        </LoadingButton>
                                                        <LoadingButton
                                                            color="error"
                                                            loading={loadingItemsReject[item._id]}
                                                            variant="contained"
                                                            onClick={() =>
                                                                handleReject(item._id, item.sectionHeadCode === userCode ? 'approver1' : 'approver2', userCode)
                                                            }
                                                        >
                                                            Reject
                                                        </LoadingButton>
                                                    </AccordionActions>
                                                )}
                                            </Accordion>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Zoom>
                    ))}
            </Grid>

            {/*             {totalPaginationPages > 1 && (
                <>
                    <Pagination
                        count={totalPaginationPages}
                        page={currentPage}
                        onChange={handlePageChange}
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
DigitalReq.propTypes = {
    getTargetGroup: PropTypes.func.isRequired,
    getImpact: PropTypes.func.isRequired,
    getCompliance: PropTypes.func.isRequired,
    Period: PropTypes.func.isRequired,
    getPlatform: PropTypes.func.isRequired,
    handleApproved: PropTypes.func.isRequired,
    handleReject: PropTypes.func.isRequired,
}
export default DigitalReq;