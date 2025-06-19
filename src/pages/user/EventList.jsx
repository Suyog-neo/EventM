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
  Snackbar, Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { userAllEvents } from '../../apis/event';
import { seatBook } from '../../apis/userSeatBook'
export default function EventList() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [open, setOpen] = useState(false);
  const [showSeats, setShowSeats] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });


  const handleClose = () => setOpen(false);

  const handleClickOpen = (event) => {
    setSelectedEvent(event);
    setOpen(true);
  };
  const handleSeatToggle = (seatNumber) => {
    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((seat) => seat !== seatNumber)
        : [...prev, seatNumber]
    );
  };
  const handleConfirmBooking = async () => {
    console.log("Selected Seats:", selectedSeats);
    console.log("Event ID:", selectedEvent?.id);

    try {
      const res = await seatBook({ seat_number: selectedSeats[0], event_id: selectedEvent.id })
      console.log(res.data.message)
      setSnack({ open: true, message: res.data.message , severity: 'success' });
    } catch (error) {
      console.log(error.message)
    }
    setTimeout(() => {
      handleClose();
    }, 200);
  };


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
      <Box sx={{ display: 'flex', justifyContent: { lg: 'center' }, alignItems: { lg: 'center' }, minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#caf0f8', py: 4, px: 2 }}>
      <Box sx={{ mx: 'auto' }}>
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
            sx={{ maxWidth: { xs: '100vw', lg: 400 } }}
          />
        </Box>


        <Grid container spacing={4} sx={{ justifyContent: { xs: 'flex-start', lg: 'center' } }}>
          {filteredEvents.map((event) => (
            <>
              <Grid item xs={12} md={3} lg={3} key={event.id} >
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

                  <CardActionArea sx={{ height: '100%' }} >
                    <CardMedia
                      component="img"
                      height="45%"
                      image={`http://172.21.0.206:8000/${event.event_image}`}
                      alt={event.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/fallbackimg.svg';
                      }}
                      loading='lazy'
                    />
                    <CardContent sx={{ height: '55%' }}>
                      <Box>
                        <Typography gutterBottom variant="h6" noWrap>
                          {event.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: .5, height: 40, overflow: 'hidden' }}>
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

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
                        <Button onClick={() => handleClickOpen(event)} variant='contained'>Book Event</Button>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            </>
          ))}
        </Grid>

        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>Book Event</DialogTitle>
          <DialogContent>
            {selectedEvent ? (
              <>
                <CardMedia
                  component="img"
                  height="200"
                  image={`http://172.21.0.206:8000/${selectedEvent.event_image}`}
                  alt={selectedEvent.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/fallbackimg.svg';
                  }}
                  sx={{ borderRadius: 2, mb: 2 }}
                />

                <Typography variant="h6" gutterBottom>
                  {selectedEvent.title}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {selectedEvent.description}
                </Typography>
                <Typography variant="body2">
                  📍 {selectedEvent.location}
                </Typography>
                <Typography variant="body2">
                  📅 {new Date(selectedEvent.date).toLocaleDateString()}
                </Typography>
                <Typography variant="body2">
                  💰 ₹{selectedEvent.price_per_seat}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  🪑 {selectedEvent.available_seats} seats available
                </Typography>

                <Button variant="outlined" onClick={() => setShowSeats(!showSeats)}>
                  {showSeats ? 'Hide Seats' : 'Select Seat'}
                </Button>
                {showSeats && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      🎫 Available Seats:
                    </Typography>
                    <Grid container spacing={1}>
                      {Array.from({ length: selectedEvent.available_seats }).map((_, i) => {
                        const seatNumber = i + 1;
                        const isSelected = selectedSeats.includes(seatNumber);

                        return (
                          <Grid item xs={3} key={seatNumber}>
                            <Button
                              fullWidth
                              size="small"
                              variant="outlined"
                              onClick={() => handleSeatToggle(seatNumber)}
                              sx={{
                                borderColor: '#2196f3',
                                backgroundColor: isSelected ? '#2196f3' : 'transparent',
                                color: isSelected ? 'white' : 'inherit',
                                '&:hover': {
                                  backgroundColor: isSelected ? '#1976d2' : '#e3f2fd',
                                },
                              }}
                            >
                              Seat {seatNumber}
                            </Button>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                )}

              </>
            ) : (
              <Typography>Loading event details...</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" onClick={handleConfirmBooking}>
              Confirm Booking
            </Button>
          </DialogActions>
        </Dialog>


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
