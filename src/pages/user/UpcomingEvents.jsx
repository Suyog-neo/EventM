import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export default function UpcomingEvents() {
  return (
    <Box
      sx={{
        minHeight: '80vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 4,
      }}
    >
      <Paper
        elevation={3}
        sx={{ p: 4, maxWidth: 600, textAlign: 'center', borderRadius: 3 }}
      >
        <Typography variant="h4" gutterBottom>
          Upcoming Events
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here you will find a list of upcoming events curated just for you.
          Stay tuned for exciting updates!
        </Typography>
      </Paper>
    </Box>
  );
}
