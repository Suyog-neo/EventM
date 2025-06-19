import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { userAllEvents } from '../../apis/event';

export default function EventList() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await userAllEvents();
      if (response.data.status === 'success') {
        setEvents(response.data.data);
      } else {
        setError('Failed to fetch events');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

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
            🎟️ Explore All Events
          </Typography>
        </Box>

        
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 4,
            px: 2,
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search events..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 400 }}
          />
        </Box>

       
        <Grid container spacing={3} justifyContent="center">
          {filteredEvents.map((event) => (
            <Grid item key={event.id}>
              <Card
                sx={{
                  width: 320,
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
                <CardActionArea sx={{ height: '100%' }} onClick={() => navigate(`/user/event/${event.id}`)}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={event.event_image ? `http://172.21.0.215:8000${event.event_image}` : 'https://via.placeholder.com/400x200?text=Event+Image'}
                    alt={event.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x200?text=Event+Image';
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography gutterBottom variant="h6" noWrap>
                        {event.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, height: 40, overflow: 'hidden' }}>
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
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EventSeatIcon color="action" />
                        <Typography variant="body2">
                          {event.available_seats} seats available
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        {filteredEvents.length === 0 && (
          <Typography variant="h6" textAlign="center" sx={{ mt: 4 }}>
            No events found matching your criteria
          </Typography>
        )}
      </Box>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}
