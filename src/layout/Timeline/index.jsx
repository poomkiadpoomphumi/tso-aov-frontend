import {
    TimelineItem,
    TimelineSeparator,
    TimelineContent,
    TimelineDot,
} from '@mui/lab';
import { useState } from 'react';
import { Typography, Box } from '@mui/material';
import ChromeReaderModeOutlinedIcon from '@mui/icons-material/ChromeReaderModeOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import StatusLegend from '../statusLegend';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Collapse } from '@mui/material';

const CustomizedTimeline = ({ rawData, settingData }) => {
    const [expanded, setExpanded] = useState(true);
    const handleToggleExpand = () => {
        setExpanded(!expanded);
    };
    const draft = rawData.comment?.filter((item) => item.text === 'draft')

    // fallback: assume item list is known even if action missing get form seting database
    const fallbackApprovers = (settingData || []).map(item => ({ name: item.name }));
    const baseTimeline = [
        {
            icon: <ChromeReaderModeOutlinedIcon sx={{ color: '#fff' }} />,
            text: rawData?.coordinatorName || 'กรอกแบบฟอร์ม',
            comment: rawData?.comment?.slice().reverse() || '',
            updateAt: rawData?.createAt || '',
            color: draft && rawData.comment.length <= 1 ? 'warning' : rawData.actionLine?.some((item) => item.action === 'wait' || item.action === 'rejected' || item.action === 'approved') ? 'success' : 'warning',
        },
    ];

    let approvalTimeline = [];

    if (rawData?.actionLine?.length > 0) {
        approvalTimeline = rawData.actionLine.map((item) => {
            let commentArray = [];
            if (Array.isArray(item.comment)) {
                commentArray = item.comment;
            } else if (typeof item.comment === 'object' && item.comment !== null) {
                commentArray = [item.comment];
            }
            return {
                icon:
                    item.action === 'wait' ? <PendingIcon sx={{ color: '#fff' }} />
                        : item.action === 'rejected' ? <CancelIcon sx={{ color: '#fff' }} />
                            : <CheckCircleIcon sx={{ color: '#fff' }} />,
                text: item.name || item.email,
                comment: commentArray, // array ทั้งชุด
                updateAt: commentArray[0]?.updateAt || '', // ล่าสุดจากบนสุด
                color: item.action === 'wait' ? '' : item.action === 'rejected' ? 'error' : 'success',
                alignProperty: item.action === 'wait' ? 'right' : undefined,
            };
        });
    } else {
        approvalTimeline = fallbackApprovers.map((item, index) => ({
            icon: <PendingIcon sx={{ color: '#fff' }} />,
            text: item.name,
            color: '',
            alignProperty: index === fallbackApprovers.length - 1 ? 'right' : undefined,
        }));
    }


    // Combine both
    const timelineItems = [...baseTimeline, ...approvalTimeline];

    const dotSize = 160; // width per step
    return (
        <Box sx={{ overflowX: 'auto', px: 2, backgroundColor: '#ffffff', borderRadius: '8px', marginBottom: '16px' }}>
            <Box sx={{ pt: 3, px: 2 }}>
                <Typography variant="h4" fontWeight="bold" sx={{ color: '#333' }}>
                    Event Timeline Approvals
                </Typography><StatusLegend />
            </Box>
            <Box
                sx={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    minWidth: dotSize * timelineItems.length,
                    pt: 1,
                    pb: 2,
                }}
            >
                {/* Horizontal line through all dots */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50px', // center vertically
                        transform: 'translateY(-50%)',
                        left: `calc(${dotSize / 2}px)`,
                        right: `calc(${dotSize / 2}px)`,
                        height: '2px',
                        backgroundColor: '#ccc',
                        zIndex: 1,
                    }}
                />

                {/* Timeline items */}
                {timelineItems.map((item, index) => (
                    <Box
                        key={index}
                        sx={{
                            width: `${dotSize}px`,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            zIndex: 2,
                        }}
                    >
                        <TimelineItem
                            sx={{
                                flexDirection: 'column',
                                alignItems: 'center',
                                p: 0,
                                m: 0,
                            }}
                        >
                            <TimelineSeparator>
                                <TimelineDot
                                    color={item.color || 'grey'}
                                    variant={item.outlined ? 'outlined' : 'filled'}
                                    sx={{ zIndex: 3 }}
                                >
                                    {item.icon}
                                </TimelineDot>
                            </TimelineSeparator>
                            <TimelineContent sx={{ textAlign: 'center', mt: 1, marginTop: '-5px' }}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        width: `${dotSize}px`,
                                        display: 'inline-block',
                                        mb: 1
                                    }}
                                >
                                    {item?.text}
                                </Typography>
                                {Array.isArray(item?.comment) ? (
                                    (() => {
                                        const filteredComments = item.comment.filter(c => c?.text !== 'draft');
                                        if (filteredComments.length === 0) return null;

                                        const getColor = action =>
                                            action === 'reject' ? '#ff4e4e'
                                                : action === 'approved' || action === 'ส่งแบบฟอร์ม' ? '#4dab33'
                                                    : '#42a5f5';

                                        const renderCommentBox = (c, idx) => (
                                            <Box
                                                key={idx}
                                                sx={{
                                                    position: 'relative',
                                                    backgroundColor: 'white',
                                                    padding: '4px 8px',
                                                    borderRadius: '6px',
                                                    boxShadow: 1,
                                                    mb: 1,
                                                    textAlign: 'right',
                                                    '&::after': {
                                                        content: '""',
                                                        position: 'absolute',
                                                        top: 0,
                                                        bottom: 0,
                                                        right: 0,
                                                        width: '4px',
                                                        backgroundColor: getColor(c.action || c.text),
                                                        borderTopRightRadius: '6px',
                                                        borderBottomRightRadius: '6px'
                                                    }
                                                }}
                                            >
                                                <Typography variant="caption" sx={{ textAlign: 'right', color: '#666' }}>
                                                    {String(c.text || '').trim() === '' ? 'ไม่มีความคิดเห็นเพิ่มเติม' : c.text}
                                                </Typography><br />
                                                <Typography variant="caption" sx={{ textAlign: 'right', color: '#333', fontWeight: 500 }}>
                                                    {c.updateAt}
                                                </Typography>
                                            </Box>
                                        );

                                        return (
                                            <>
                                                {/* แสดง comment ล่าสุดเสมอ */}
                                                {renderCommentBox(filteredComments[0], 0)}

                                                {/* แสดง comment เพิ่มเติมใน Collapse */}
                                                {filteredComments.length > 1 && (
                                                    <>
                                                        <Collapse in={expanded} timeout="auto" unmountOnExit>
                                                            {filteredComments.slice(1).map((c, idx) =>
                                                                renderCommentBox(c, idx + 1)
                                                            )}
                                                        </Collapse>

                                                        <Box sx={{ textAlign: 'right', mb: 1 }}>
                                                            <Typography
                                                                variant="caption"
                                                                onClick={handleToggleExpand}
                                                                sx={{ cursor: 'pointer', color: '#1976d2', display: 'inline-flex', alignItems: 'center' }}
                                                            >
                                                                {expanded ? 'ย่อ' : 'ดูทั้งหมด'}&nbsp;
                                                                {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                                                            </Typography>
                                                        </Box>
                                                    </>
                                                )}
                                            </>
                                        );
                                    })()
                                ) : item?.comment ? (
                                    <Box
                                        sx={{
                                            width: `${dotSize}px`,
                                            backgroundColor: 'white',
                                            padding: '4px 8px',
                                            borderRadius: '6px',
                                            mt: 1,
                                            boxShadow: 1
                                        }}
                                    >
                                        <Typography variant="caption" sx={{ textAlign: 'right', color: '#666' }}>
                                            {item?.comment || 'ไม่มีความคิดเห็นเพิ่มเติม'}
                                        </Typography>
                                        <Typography variant="caption" sx={{ textAlign: 'right', color: '#333', fontWeight: 500 }}>
                                            {item?.updateAt}
                                        </Typography>
                                    </Box>
                                ) : null}


                            </TimelineContent>

                        </TimelineItem>

                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default CustomizedTimeline;
