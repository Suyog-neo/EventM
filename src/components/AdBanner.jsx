import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export default function AdBanner({ type = 'user' }) {
  const userAdContent = {
    title: "🎉 Special Offer!",
    description: "Get 20% off on your first event booking. Use code: WELCOME20",
    bgColor: "linear-gradient(135deg, #52b788 0%, #52b788 100%)",
  };

  const adminAdContent = {
    title: "📊 Analytics Dashboard",
    description: "New analytics features available! Track your event performance in real-time.",
    bgColor: "linear-gradient(135deg, #48bfe3 0%, #48bfe3 100%)",
  };

  const content = type === 'user' ? userAdContent : adminAdContent;

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        mb: 3,
        borderRadius: 2,
        background: content.bgColor,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
          zIndex: 1,
        },
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {content.title}
        </Typography>
        <Typography variant="body2">
          {content.description}
        </Typography>
      </Box>
    </Paper>
  );
} 