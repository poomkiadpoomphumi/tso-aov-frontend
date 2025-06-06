import { Box, Button } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ButtonContainer = ({ setShowTimeline, showTimeline, setLoading ,isMobile}) => (
    <Box
        sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: { xs: 'column', sm: 'row' }
        }}
    >
        {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: { xs: 2, sm: 0 } }}>
                <Button
                    size="small"
                    variant="contained"
                    color={showTimeline ? "warning" : "primary"}
                    startIcon={showTimeline ? <ArrowBackIcon /> : <HistoryIcon />}
                    onClick={() => {
                        setShowTimeline(!showTimeline);
                        setLoading(true);
                        setTimeout(() => {
                            setLoading(false);
                            const targetId = !showTimeline ? 'timeline-section' : 'form-section';
                            const target = document.getElementById(targetId);
                            if (target) {
                                target.scrollIntoView({ behavior: 'smooth' });
                            }
                        }, 100); // ให้ DOM render ก่อน
                    }}
                    sx={{
                        color: '#fff',
                        fontSize: { xs: '0.8rem', sm: '1rem' },
                        width: { xs: '100%', sm: 'auto' },
                        fontWeight: 'bold',
                    }}
                >
                    {showTimeline ? 'Back to Form' : 'Event Timeline'}
                </Button>
            </Box>
        )}
    </Box>
);

export default ButtonContainer;