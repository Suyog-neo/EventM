import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  IconButton,
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { useSelector } from 'react-redux';

export default function Wishlist() {
  const wishlist = useSelector((state) => state.wishlist);

  const handleShareEvent = (event) => {
    navigator.share({
      title: event.title,
      text: `Check out this event: ${event.title}`,
      url: window.location.href,
    });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        px: { xs: 2, sm: 4 },
        py: 4,
        maxWidth: '1400px',
        mx: 'auto',
        background: '#ffffff',
      }}
    >
      <Typography
        variant="h3"
        fontWeight="bold"
        gutterBottom
        textAlign="center"
        color="#3f51b5"
        sx={{ fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' } }}
      >
        Wishlist
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        {wishlist.map((event) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={event.id}>
            <Card
              sx={{
                cursor: 'pointer',
                borderRadius: 4,
                boxShadow: 6,
                overflow: 'hidden',
                transition: '0.3s',
                height: 440,
                width: 340,
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: 12,
                },
              }}
            >
              <CardActionArea>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                    noWrap
                    sx={{ fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' } }}
                  >
                    {event.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1, fontSize: { xs: '0.8rem', sm: '1rem' } }}
                  >
                    📅 {event.date}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}
                  >
                    📍 {event.location}
                  </Typography>
                </CardContent>
                <IconButton
                  onClick={() => handleShareEvent(event)}
                  sx={{ position: 'absolute', top: 10, right: 10 }}
                >
                  <ShareIcon />
                </IconButton>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
