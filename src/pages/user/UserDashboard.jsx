import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Fade,
  Slide,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import EventNoteIcon from '@mui/icons-material/EventNote'; 
import LocalOfferIcon from '@mui/icons-material/LocalOffer'; 
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import AdBanner from '../../components/AdBanner';

export default function UserDashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const actions = [
    {
      title: 'View All Events',
      icon: <EventAvailableIcon sx={{ fontSize: 40, color: '#0288d1' }} />,
      onClick: () => navigate('/user/events'),
    },
    {
      title: 'My Bookings',
      icon: <BookmarkIcon sx={{ fontSize: 40, color: '#7b1fa2' }} />,
      onClick: () => navigate('/user/bookings'),
    },
    {
      title: 'Upcoming Events',
      icon: <EventNoteIcon sx={{ fontSize: 40, color: '#f57c00' }} />,
      onClick: () => navigate('/user/upcoming-events'),
    },
    {
      title: 'Exclusive Offers',
      icon: <LocalOfferIcon sx={{ fontSize: 40, color: '#388e3c' }} />,
      onClick: () => navigate('/user/exclusive-offers'),
    },
  ];

  const carouselItems = [
    {
      image:
        'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80',
      caption: 'Book Your Favorite Events',
    },
    {
      image:
        'https://images.unsplash.com/photo-1619229667009-e7e51684e8e6?auto=format&fit=crop&w=1600&q=80',
      caption: 'Experience Live Concerts',
    },
    {
      image:
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80',
      caption: 'Join Exciting Workshops',
    },
  ];

  
  const categories = [
    {
      title: 'Technology',
      description: 'Explore tech events and conferences.',
      image:
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Entertainment',
      description: 'Enjoy concerts, movies, and festivals.',
      image:
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Business',
      description: 'Network at business meetups and expos.',
      image:
        'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Art',
      description: 'Discover art exhibitions and creative workshops.',
      image:
        'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Sports',
      description: 'Participate in sports events and competitions.',
      image:
        'https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Wellness',
      description: 'Relax with yoga retreats and wellness programs.',
      image:
        'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    adaptiveHeight: true,
    arrows: !isMobile,
  };

  return (
    <Fade in timeout={500}>
      <Box
        sx={{
          background: '#caf0f8',
          minHeight: '100vh',
          px: 2,
          pt: 4,
          pb: 8,
        }}
      >
        <Box
          sx={{
            maxWidth: '1600px',
            mx: 'auto',
            backgroundColor: '#ffffff',
            borderRadius: 3,
            boxShadow: 3,
            overflow: 'hidden',
          }}
        >
          {/* Ad Banner */}
          <Box sx={{ px: 3, pt: 4 }}>
            <AdBanner type="user" />
          </Box>

          {/* TITLE */}
          <Typography
            variant="h3"
            fontWeight="bold"
            gutterBottom
            textAlign="center"
            color={theme.palette.primary.main}
            sx={{ fontSize: { xs: '2rem', md: '2.8rem' }, mt: 4 }}
          >
            Welcome to Your Dashboard
          </Typography>

          {/* CAROUSEL */}
          <Slider {...sliderSettings} style={{ marginBottom: '2rem' }}>
            {carouselItems.map((item, index) => (
              <Box
                key={index}
                sx={{
                  position: 'relative',
                  height: { xs: 220, sm: 300, md: 400 },
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: 3,
                }}
              >
                <img
                  src={item.image}
                  alt={item.caption}
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      'https://dummyimage.com/800x300/cccccc/000000&text=Image+Unavailable';
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    background:
                      'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.1))',
                    color: 'white',
                    p: 2,
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    {item.caption}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Slider>

          {/* QUICK ACTIONS */}
          <Typography
            variant="h5"
            textAlign="center"
            mt={4}
            mb={2}
            fontWeight="bold"
            color="text.primary"
          >
            Quick Actions
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {actions.map((action, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Slide in direction="up" timeout={400}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 4,
                      background: theme.palette.grey[100],
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardActionArea
                      onClick={action.onClick}
                      sx={{ p: 3, textAlign: 'center' }}
                      aria-label={action.title}
                    >
                      <Box mb={1} aria-hidden>
                        {action.icon}
                      </Box>
                      <CardContent>
                        <Typography variant="h6" fontWeight="medium">
                          {action.title}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Slide>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 5 }} />

          {/* EXPLORE CATEGORIES */}
          <Box sx={{ px: 3, pb: 5 }}>
            <Typography
              variant="h5"
              textAlign="center"
              mb={4}
              fontWeight="bold"
              color="text.primary"
            >
              Explore Categories
            </Typography>

            <Grid container spacing={3} justifyContent="center">
              {categories.map((category, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate(`/user/events?category=${category.title}`)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        navigate(`/user/events?category=${category.title}`);
                      }
                    }}
                    sx={{
                      position: 'relative',
                      borderRadius: 3,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      height: 280,
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      boxShadow: 3,
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.03)',
                        boxShadow: 6,
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={category.image}
                      alt={category.title}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        zIndex: 1,
                        filter: 'brightness(0.75)',
                      }}
                    />

                    <Box
                      sx={{
                        position: 'relative',
                        zIndex: 2,
                        p: 3,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2))',
                        color: 'white',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <Typography variant="h5" fontWeight="bold" gutterBottom>
                        {category.title}
                      </Typography>
                      <Typography variant="body1" sx={{ opacity: 0.9 }}>
                        {category.description}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Box>
    </Fade>
  );
}
