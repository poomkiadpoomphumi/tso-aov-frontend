import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// material-ui
import { Card, Grid, Box, Typography } from '@mui/material';
// project import
import { gridSpacing } from '../../config.jsx';
import FormDigital from '../../layout/FormDigital/FormDigital.jsx';
import AzureData from '../../service/getApiData.js';
import { getDataFormSent } from '../../axios/handleSubmit.js';
import Expired from '../../component/expired/Expired.jsx';
import AlertDialog from '../../component/expired/index';
import useIsMobile from '../../layout/Mobile/isMobile.jsx';
import img from '../../img/Automation control and Operation application division.png';
import CardMedia from '@mui/material/CardMedia';
import Loader from '../../component/Loader/Loader.jsx';
import BreadcrumbsContainer from '../StyledBreadcrumb/index.jsx';
import BoxContainer from '../BoxContainer/index.jsx';
import StatusLegend from '../../layout/statusLegend.jsx';
import Fade from '@mui/material/Fade';
import ButtonContainer from '../../component/HeaderTimeline/index.jsx';
// Styles for reusable components
const commentBoxStyles = {
  width: 'auto',
  height: 'auto',
  bgcolor: '#fff',
  borderRadius: '10px',
  marginBottom: '10px',
  boxShadow: 1,
};

const commentTypographyStyles = {
  padding: '10px',
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  alignItems: 'center',
  marginLeft: '22px',
  color: '#757575',
};

const DigitalRequest = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { id } = useParams();
  const Expiration = Expired();
  const profilePromise = AzureData();
  const [showTimeline, setShowTimeline] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [checkStatus, setCheckStatus] = useState(false);
  const [Comment, setComment] = useState('');
  const [Comment1, setComment1] = useState('');
  const [Comment2, setComment2] = useState('');
  const [Approver, setApprover] = useState();
  const [wait, setWait] = useState(false);
  const [reject, setReject] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [nextApproved, setNextApproved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sectionHeadCode, setSectionHeadCode] = useState([]);
  const [ticketId, setTicketId] = useState('');

  useEffect(() => {
    const getDataForm = async () => {
      setLoading(true);
      try {
        if (id) {
          const response = await getDataFormSent(id);
          setResponseData(response);
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
  }, [id]);

  const emp = responseData?.requesterCode ? `คุณ${responseData.coordinatorName}` : '';
  const emp1 = sectionHeadCode[0] ? `คุณ${sectionHeadCode[0].fname} ${sectionHeadCode[0].lname}` : '';
  const emp2 = sectionHeadCode[1] ? `คุณ${sectionHeadCode[1].fname} ${sectionHeadCode[1].lname}` : '';

  const CommentBox = ({ comment, employee }) => {
    const validComments = Array.isArray(comment)
      ? comment.filter((item) => item.text?.trim() || item.action?.trim() === 'approved'|| item.action?.trim() === 'reject')
      : [];
    return (
      <Box sx={commentBoxStyles}>
        <Typography sx={commentTypographyStyles}>
          <b style={{ position: 'relative', top: '-10px' }}>
            {employee || `คุณ${profilePromise?.fname + ' ' + profilePromise?.lname}`}&nbsp;&nbsp;&nbsp;
          </b>

          {validComments.length > 0 ? (
            validComments.map((item, index) => (
              <Box
                key={index}
                sx={{
                  position: 'relative',
                  backgroundColor: 'white',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  textAlign: 'left',
                  top: '3px',
                  mb: 1,
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    width: '4px',
                    backgroundColor:
                      item.text === 'ส่งแบบฟอร์ม'
                        ? '#4dab33'
                        : item?.action === 'reject'
                          ? '#ff4e4e'
                          : item?.action === 'approved'
                            ? '#4dab33'
                            : '#42a5f5',
                    borderTopLeftRadius: '6px',
                    borderBottomLeftRadius: '6px'
                  }
                }}
              >
                <Typography variant="caption" sx={{ color: '#333' }}>
                  {item.text || 'ไม่มีความคิดเห็นเพิ่มเติม'}
                </Typography>
                <br />
                <Typography variant="caption" sx={{ color: '#777' }}>
                  {item.updateAt}
                </Typography>
              </Box>
            ))
          ) : (
            // กรณีไม่มี comment หรือว่างทั้งหมด
            <Box
              sx={{
                position: 'relative',
                backgroundColor: 'white',
                padding: '4px 8px',
                borderRadius: '6px',
                textAlign: 'left',
                top: '3px',
                mb: 1,
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  width: '4px',
                  backgroundColor: '#ffa700',
                  borderTopLeftRadius: '6px',
                  borderBottomLeftRadius: '6px'
                }
              }}
            >
              <Typography variant="caption" sx={{ color: '#333' }}>
                กรอกแบบฟอร์ม
              </Typography><br />
              <Typography variant="caption" sx={{ color: '#333' }}>
                yyyy-mm-dd 00:00:00
              </Typography>
            </Box>
          )}
        </Typography>
      </Box>
    );
  };


  return (
    <>
      {!loading ? (
        <>
          {Expiration && <AlertDialog />}
          <Grid container spacing={gridSpacing}>
            <Grid item sx={{ width: '100%' }}>
              <BreadcrumbsContainer />
              {
                !isMobile ? (
                  <CardMedia
                    component="img"
                    image={img}
                    style={{ width: '100%', height: 'auto', borderRadius: '10px' }}
                  />
                ) : null
              }
              <BoxContainer>
                <Typography component="div" variant="h3" sx={{ color: '#757575' }}>
                  {showTimeline ? (
                    <b>Digital Project Event timeline approvals tracking and timestamp</b>
                  ) : (
                    <b>แบบฟอร์มขออนุมัติในหลักการดำเนินงานด้าน Digital ของสายงานระบบท่อส่งก๊าซธรรมชาติ</b>
                  )}
                </Typography>
                <ButtonContainer setShowTimeline={setShowTimeline} showTimeline={showTimeline} setLoading={setLoading} isMobile={isMobile} />
              </BoxContainer>

              <Card id="form-section" style={{ display: showTimeline ? 'none' : 'block' }}>
                <FormDigital
                  data={responseData}
                  id={id}
                  profilePromise={profilePromise}
                  checkStatus={checkStatus}
                  setCheckStatus={setCheckStatus}
                  setComment={setComment}
                  setComment1={setComment1}
                  setComment2={setComment2}
                  setApprover={setApprover}
                  setWait={setWait}
                  setReject={setReject}
                  isDraft={isDraft}
                  setIsDraft={setIsDraft}
                  setNextApproved={setNextApproved}
                  setSectionHeadCode={setSectionHeadCode}
                  setTicketId={setTicketId}
                />
              </Card>
              <Fade in={showTimeline} timeout={300} unmountOnExit>
                <div id="timeline-section" style={{ display: showTimeline ? 'block' : 'none' }}>
                  <Box
                    sx={{
                      backgroundColor: '#fff',
                      borderRadius: 2,
                      boxShadow: 1,
                      p: 3,
                      mt: 2,
                      mb: 4
                    }}
                  >
                    <Typography variant="h4" fontWeight="bold" sx={{ color: '#333', mb: 2 }}>
                      Event Timeline Approvals
                    </Typography>

                    <StatusLegend sx={{ mb: 3 }} />

                    {Comment ? (
                      <CommentBox comment={Comment} employee={emp} />
                    ) : (
                      <CommentBox comment={[]} employee={emp} />
                    )}
                    {Comment1 && (
                      <CommentBox comment={Comment1} employee={emp1} />
                    )}
                    {checkStatus && Approver === 4 && (
                      <CommentBox comment={Comment2} employee={emp2} />
                    )}
                  </Box>
                </div>
              </Fade>
            </Grid>
          </Grid>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default DigitalRequest;
