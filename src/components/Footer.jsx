import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      sx={{
        backgroundColor: '#0077b6',
        color: '#ffffff',
        textAlign: 'center',
        py: { xs: 1, sm: 2 },
        mt: 'auto',
        position: 'relative',
        width: '100%',
        fontSize: { xs: '0.8rem', sm: '1rem' },
      }}
    >
      <Typography variant="body2" sx={{ mb: 1 }}>
        © {currentYear} Eventsy. All rights reserved.
      </Typography>
      <Box>
        <IconButton
          aria-label="Facebook"
          href="https://facebook.com"
          target="_blank"
          rel="noopener"
          sx={{ color: 'white' }}
        >
          <FacebookIcon />
        </IconButton>
        <IconButton
          aria-label="Instagram"
          href="https://instagram.com"
          target="_blank"
          rel="noopener"
          sx={{ color: 'white' }}
        >
          <InstagramIcon />
        </IconButton>
        <IconButton
          aria-label="Twitter"
          href="https://twitter.com"
          target="_blank"
          rel="noopener"
          sx={{ color: 'white' }}
        >
          <TwitterIcon />
        </IconButton>
        <IconButton
          aria-label="LinkedIn"
          href="https://linkedin.com"
          target="_blank"
          rel="noopener"
          sx={{ color: 'white' }}
        >
          <LinkedInIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
