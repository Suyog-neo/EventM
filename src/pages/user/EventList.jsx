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
  DialogActions,
  Button,
} from '@mui/material';
import ChairIcon from '@mui/icons-material/Chair';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { userAllEvents } from '../../apis/event';
import { seatBook, getSeatsAvailable } from '../../apis/userSeatBook'
import IP_ADD from '../../apis/ip';
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
  const [availableSeats, setAvailableSeats] = useState([]);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  const handleClose = () => setOpen(false);

  const handleClickOpen = async (event) => {
    setSelectedEvent(event);
    setSelectedSeats([]);
    setOpen(true);
    try {
      const res = await getSeatsAvailable(event.id);
      setAvailableSeats(res.data.data.available_seats);
      console.log(res.data.data.available_seats)
    } catch (error) {
      console.error("Error fetching seats:", error);
      setAvailableSeats([]);
    }
  };


  const handleSeatToggle = (seatNumber) => {
    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((seat) => seat !== seatNumber)
        : [...prev, seatNumber]
    );
  };
  const handleConfirmBooking = async () => {
    if (selectedSeats.length < 1) {
      setSnack({ open: true, message: 'Please Select seat', severity: 'warning' });
      return;
    }
    try {
      const res = await seatBook({ seat_number: selectedSeats[0], event_id: selectedEvent.id })
      console.log(res.data.message)
      setSnack({ open: true, message: res.data.message, severity: 'success' });
    } catch (error) {
      console.log(error.message)
      setSnack({ open: true, message: error.response?.data?.message || error.message, severity: 'error' });

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


  const available = availableSeats.map(Number);
  const totalSeats = selectedEvent?.total_seats || 300; // fallback to 300
  const allSeats = Array.from({ length: totalSeats }, (_, i) => i + 1);
  const BookedSeat = allSeats.filter(seat => !available.includes(seat));


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
                      image={`${IP_ADD}/${event.event_image}`}
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

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CurrencyRupeeIcon sx={{ color: '#FF0000' }} />
                            <Typography variant="body2">₹{event.price_per_seat}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarTodayIcon color="action" />
                            <Typography variant="body2">
                              {new Date(event.date).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                              <ChairIcon sx={{ color: 'green', paddingRight: '6px' }} />
                              {event.available_seats} seats available
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                              <ChairIcon sx={{ color: 'action', paddingRight: '6px' }} />
                              {event.total_seats} Total seats
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
                  image={`${IP_ADD}/${selectedEvent.event_image}`}
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
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                  <ChairIcon sx={{ color: 'green', paddingRight: '6px' }} />
                  {selectedEvent.available_seats} seats available
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ChairIcon sx={{ paddingRight: '6px' }} />
                  {selectedEvent.total_seats} Total seats
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
                      {Array.from({ length: selectedEvent.total_seats }).map((_, i) => {
                        const seatNumber = i + 1;
                        const isSelected = selectedSeats.includes(seatNumber);
                        const isBooked = BookedSeat.includes(seatNumber);
                        return (
                          <Grid item xs={3} md={3} lg={3} key={seatNumber} >
                            <Button
                              disabled={BookedSeat.includes(seatNumber)}
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
                                width: { sm: '20vw', xs: '21vw', lg: '5vw' },
                                paddingLeft: { lg: '2px' }, marginLeft: { lg: "5px" }
                              }}
                            >
                              <ChairIcon sx={{ color: isBooked ? 'lightgray' : isSelected ? 'white' : '#2196f3', paddingRight: '6px' }} />
                              {seatNumber}
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
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnack({ ...snack, open: false })}
          severity={snack.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
