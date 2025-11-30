import { Box, Typography } from '@mui/material';

function App() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom color="primary">
          Task Management System
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Frontend setup complete! 🚀
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }} color="text.secondary">
          React + Vite + TypeScript + TailwindCSS + MUI
        </Typography>
      </Box>
    </Box>
  );
}

export default App;