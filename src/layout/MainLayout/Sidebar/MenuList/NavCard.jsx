// material-ui
import { Button, Card, CardContent, Link, Stack, Typography, Box } from '@mui/material';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import financial from '../../../../img/Financial.png';
// assets


// ==============================|| DRAWER CONTENT - NAVIGATION CARD ||============================== //

const NavCard = () => {
  return (
    <Card sx={{ bgcolor: '#fff', border: '1px solid rgb(230, 235, 241)', m: 2 }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Stack sx={{ flex: 1, alignItems: 'center', spacing: 1.5 }}>
          <Stack alignItems="center">
            {/* Background image container */}
            <Typography variant="h6" color="secondary" textAlign="center">
              คู่มือการใช้งานระบบ
            </Typography>
            <Box
              sx={{
                width: '120%',
                height: '70px',  // Adjust the height as needed
                backgroundImage: `url(${financial})`,  
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                mb: 2,  // Margin below the image
              }}
            />
          </Stack>
        </Stack>
        <Button
          startIcon={<DisplaySettingsIcon />}
          component={Link}
          target="_blank"
          href="https://tso-aov-sr.pttplc.com/api/uploads/template/Utilizing.pdf"
          variant="contained"
          color="primary"
          size="small"
        >
          Learn more
        </Button>
      </CardContent>
    </Card>

  );
};

export default NavCard;
