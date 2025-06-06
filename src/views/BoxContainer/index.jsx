import { Box } from '@mui/material';
const BoxContainer = ({ children }) => (
    <Box
        sx={{
            display: 'flex',
            justifyContent: { xs: 'center', sm: 'space-between' },
            alignItems: 'center',
            padding: '10px',
            flexDirection: { xs: 'column', sm: 'row' },
            textAlign: { xs: 'center', sm: 'left' },
            marginBottom: '10px',
        }}
    >
        {children}
    </Box>
);

export default BoxContainer;    