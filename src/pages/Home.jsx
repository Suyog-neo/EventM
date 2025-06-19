import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Stack,
  Card,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { keyframes } from '@emotion/react';


const fadeInScale = keyframes`
  0% { opacity: 0; transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1); }
`;

const typing = keyframes`
  from { width: 0 }
  to { width: 100% }
`;

const blink = keyframes`
  0%, 100% { border-color: transparent }
  50% { border-color:rgb(36, 41, 39) }
`;

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/login'), 9000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Box
      sx={{
        backgroundImage: 'url(https://e1.pxfuel.com/desktop-wallpaper/574/383/desktop-wallpaper-movie-poster-mix-of-movies.jpg)', // 🔁 Replace this with your image URL or path
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      
      <Card
        sx={{
          px: { xs: 4, sm: 6 },
          py: { xs: 4, sm: 6 },
          width: { xs: '90%', sm: '70%', md: '45%' },
          textAlign: 'center',
          backgroundColor: '#f5f5f5', 
          borderRadius: 6,
          boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
          backdropFilter: 'blur(12px)',
          animation: `${fadeInScale} 0.8s ease-out, ${typing} 2s ease-in-out`,
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
          },
        }}
      >
        
        <Typography
          variant="h3"
          fontWeight={800}
          gutterBottom
          sx={{
            background: 'linear-gradient(90deg, rgb(31, 34, 33), rgb(39, 43, 41))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}
        >
          Welcome to Eventsy
        </Typography>

        <Typography
          variant="h6"
          sx={{
            color: '#0b2b15',
            fontWeight: 500,
            fontSize: { xs: '1rem', sm: '1.15rem' },
            lineHeight: 1.7,
            mb: 3,
            textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
          }}
        >
          Your Gateway to Unforgettable Experiences
          <br />
          <Typography
            component="div"
            sx={{
              display: 'inline-block',
              fontFamily: 'monospace',
              color: 'text.primary',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              borderRight: '2px solid',
              width: '0',
              animation: `${typing} 2.5s steps(30, end) forwards, ${blink} 0.75s step-end infinite`,
              mt: 1,
              textDecoration: 'underline',
            }}
          >
            Book It. Love It. Repeat.
          </Typography>
          <br />
          <Typography
            component="span"
            sx={{
              color: '#0b2b15',
              fontStyle: 'italic',
              fontSize: '0.9rem',
              textTransform: 'capitalize',
            }}
          >
            Unlock the Best Seats in Town.
          </Typography>
        </Typography>

        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
          sx={{ mt: 2 }}
        >
          <CircularProgress color="secondary" />
          <Typography color="text.secondary" fontWeight={500}>
            Redirecting to login...
          </Typography>
        </Stack>
      </Card>
    </Box>
  );
}
