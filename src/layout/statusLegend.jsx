import { Box, Typography } from '@mui/material';

const StatusLegend = ({ sx }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' }, // responsive แนวตั้ง/แนวนอน
        gap: 2,
        mt: 2,
        ...sx
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ width: 16, height: 16, bgcolor: '#ff4e4e', borderRadius: '4px' }} />
        <Typography variant="body2">Rejected</Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ width: 16, height: 16, bgcolor: '#42a5f5', borderRadius: '4px' }} />
        <Typography variant="body2">Recalled</Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ width: 16, height: 16, bgcolor: '#ffa700', borderRadius: '4px' }} />
        <Typography variant="body2">Fill form</Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ width: 16, height: 16, bgcolor: '#4dab33', borderRadius: '4px' }} />
        <Typography variant="body2">Approved and send form</Typography>
      </Box>
    </Box>
  );
};

export default StatusLegend;
