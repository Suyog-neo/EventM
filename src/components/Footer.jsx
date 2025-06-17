import React from 'react';
import { Box, Typography } from '@mui/material';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      sx={{
        backgroundColor: '#3f51b5',
        color: '#ffffff',
        textAlign: 'center',
        py: { xs: 1, sm: 2 },
        mt: 'auto',
        position: 'relative',
        width: '100%',
        fontSize: { xs: '0.8rem', sm: '1rem' },
      }}
    >
      <Typography variant="body2">
        © {currentYear} Eventsy. All rights reserved.
      </Typography>
    </Box>
  );
}
//
