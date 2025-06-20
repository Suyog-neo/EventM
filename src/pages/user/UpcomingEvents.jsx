import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import IP_ADD from '../../apis/ip';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useNavigate } from 'react-router-dom';
import { userUpcoming } from '../../apis/event';

export default function UpcomingEvents() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await userUpcoming();
        if (response.data && Array.isArray(response.data.data)) {
          // Only show events with status 'ongoing'
          setEvents(response.data.data.filter(e => e.status === 'ongoing'));
        } else {
          setError('Failed to fetch events');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#caf0f8', py: 4, px: 2 }}>
      <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2, position: 'relative' }}>
          <IconButton
            onClick={() => navigate('/user/dashboard')}
            sx={{
              position: 'absolute',
              left: { xs: 16, sm: 24, md: 32 },
              backgroundColor: '#f5f5f5',
              '&:hover': {
                backgroundColor: '#e0e0e0',
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h3"
            fontWeight="bold"
            gutterBottom
            textAlign="center"
            color="#3f51b5"
            sx={{ fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' } }}
          >
            🎯 Upcoming Events
          </Typography>
        </Box>

        {/* Events Grid */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>
        ) : events.length === 0 ? (
          <Typography align="center" sx={{ mt: 4 }}>No upcoming events available.</Typography>
        ) : (
          <Grid container spacing={4} sx={{ justifyContent: { xs: 'flex-start', lg: 'center' }, mt: 4 }}>
            {events.map((event) => (
              <Grid item xs={12} md={3} lg={3} key={event.id}>
                <Card
                  sx={{
                    width: { sm: '60vw', xs: '90vw', lg: '19vw' },
                    height: 450,
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 2,
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                    },
                  }}
                >
                  <CardActionArea sx={{ height: '100%' }}>
                    <CardMedia
                      component="img"
                      height="45%"
                      image={`${IP_ADD}/${event.event_image}`}
                      alt={event.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/fallbackimg.svg';
                      }}
                      loading='lazy'
                    />
                    <CardContent sx={{ height: '55%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="h6" noWrap>
                            {event.title}
                          </Typography>
                          {/* <Chip label={event.category} size="small" color="primary" /> */}
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, height: 40, overflow: 'hidden' }}>
                          {event.description}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationOnIcon color="action" />
                          <Typography variant="body2" noWrap>{event.location}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarTodayIcon color="action" />
                          <Typography variant="body2">
                            {new Date(event.date).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AttachMoneyIcon color="action" />
                          <Typography variant="body2">₹{event.price_per_seat}</Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}
