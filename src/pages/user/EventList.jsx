import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { bookEvent } from '../../redux/slices/bookingsSlice';
import { decrementSeat } from '../../redux/slices/eventsSlice';
import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
  Snackbar,
  Alert,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  IconButton,
  CardMedia,
  Box,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

export default function EventList() {
  const events = useSelector((state) => state.events);
  const bookings = useSelector((state) => state.bookings);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [seatBookingOpen, setSeatBookingOpen] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatsConfirmed, setSeatsConfirmed] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const validateSeatSelection = () => {
    if (selectedSeats.length === 0) {
      setSnackbar({
        open: true,
        message: 'Please select at least one seat.',
        severity: 'error',
      });
      return false;
    }
    return true;
  };

  const handleConfirmSeatBooking = () => {
    if (!validateSeatSelection()) return;

    setSeatsConfirmed(true);
    setSeatBookingOpen(false);
    setSnackbar({
      open: true,
      message: `Seats ${selectedSeats.join(', ')} booked successfully!`,
      severity: 'success',
    });
  };

  const handleBook = () => {
    if (!selectedEvent) {
      setSnackbar({
        open: true,
        message: 'No event selected for booking.',
        severity: 'error',
      });
      return;
    }

    const alreadyBooked = bookings.find((b) => b.id === selectedEvent.id);
    if (!alreadyBooked && selectedEvent.seats > 0 && selectedSeats.length > 0) {
      dispatch(bookEvent({ ...selectedEvent, seats: selectedSeats }));
      dispatch(decrementSeat(selectedEvent.id));
      setSnackbar({ open: true, message: 'Event booked successfully!', severity: 'success' });
    } else {
      setSnackbar({
        open: true,
        message: 'You already booked this event or it is sold out.',
        severity: 'info',
      });
    }
    setSelectedEvent(null);
    setSeatsConfirmed(false);
    setSelectedSeats([]);
  };

  const uniqueLocations = useMemo(() => {
    const locations = events.map((e) => e.location);
    return [...new Set(locations)].sort();
  }, [events]);

  const filteredEvents = useMemo(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');

    return events.filter((event) => {
      const matchTitle = event.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchLocation = selectedLocation ? event.location === selectedLocation : true;
      const matchCategory = category ? event.category === category : true;

      return matchTitle && matchLocation && matchCategory;
    });
  }, [events, searchQuery, selectedLocation]);

  const handleSeatSelection = (seatNumber) => {
    setSelectedSeats((prev) =>
      prev.includes(seatNumber) ? prev.filter((s) => s !== seatNumber) : [...prev, seatNumber]
    );
  };

  const handleOpenModal = (event) => {
    setSelectedEvent(event);
    setSelectedSeats([]);
    setSeatsConfirmed(false);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedEvent(null);
    setSeatsConfirmed(false);
    setSelectedSeats([]);
  };

  const isBookingDisabled = () => {
    return (
      !selectedEvent ||
      selectedEvent.seats === 0 ||
      bookings.some((b) => b.id === selectedEvent.id)
    );
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#caf0f8',
        py: 4,
      }}
    >
      {/* Main Content Area */}
      <Box sx={{ flex: 1 }}>
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

        {/* Search & Filter */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 4,
            justifyContent: 'center',
            px: 2,
          }}
        >
          <TextField
            label="Search by Title"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton onClick={() => setSearchQuery('')}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: { xs: '100%', sm: '25%' } }}
          />

          <TextField
            label="Filter by Location"
            variant="outlined"
            select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            sx={{ width: { xs: '100%', sm: '20%' } }}
          >
            <MenuItem value="">All Locations</MenuItem>
            {uniqueLocations.map((loc) => (
              <MenuItem key={loc} value={loc}>
                {loc}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* Event Grid */}
        <Grid container spacing={2} justifyContent="center" sx={{ px: 2 }}>
          {filteredEvents.map((event) => {
            const isBooked = bookings.some((b) => b.id === event.id);
            const isSoldOut = event.seats === 0;

            return (
              <Grid item xs={12} sm={6} md={3} lg={2.4} key={event.id}>
                <Card
                  onClick={() => handleOpenModal(event)}
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
                  <CardMedia
                    component="img"
                    height="270"
                    image={event.image}
                    alt={event.title}
                    sx={{ objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x200?text=Image+Unavailable';
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                      {event.title}
                    </Typography>
                    <Typography variant="body2">📅 {event.date}</Typography>
                    <Typography variant="body2">📍 {event.location}</Typography>
                    <Typography variant="body2">🎭 Type: {event.type || 'General'}</Typography>
                    <Typography variant="body2">💲 Price: ${event.price}</Typography>
                  </CardContent>
                  <CardActions sx={{ display: 'flex', justifyContent: 'flex-end',px: 2 }}>
                    <Chip
                      label={isSoldOut ? 'Sold Out' : `${event.seats} Seats Left`}
                      color={isSoldOut ? 'error' : 'info'}
                    />
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {/* Footer Spacer */}
      <Box sx={{ height: 80 }} />

      {/* Modal and Seat Selection Dialog */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        {selectedEvent && (
          <>
            <DialogTitle>{selectedEvent.title}</DialogTitle>
            <DialogContent dividers>
              <Typography gutterBottom>📅 <strong>Date:</strong> {selectedEvent.date}</Typography>
              <Typography gutterBottom>📍 <strong>Location:</strong> {selectedEvent.location}</Typography>
              <Typography gutterBottom>🎫 <strong>Seats Left:</strong> {selectedEvent.seats}</Typography>
              <Typography gutterBottom>📝 <strong>Details:</strong> {selectedEvent.details}</Typography>
              {seatsConfirmed && selectedSeats.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" fontWeight="bold" gutterBottom>
                    🎫 Selected Seats:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedSeats.map((seat) => (
                      <Chip key={seat} label={`Seat ${seat}`} color="success" />
                    ))}
                  </Box>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    💲 <strong>Total:</strong> ${selectedEvent.price * selectedSeats.length}
                  </Typography>
                </Box>
              )}
              <Box
                component="img"
                src={selectedEvent.image}
                alt="Event"
                sx={{ mt: 2, width: '100%', borderRadius: 2 }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/600x300?text=No+Image';
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal}>Cancel</Button>
              <Button
                variant="contained"
                disabled={isBookingDisabled() || !seatsConfirmed}
                onClick={handleBook}
              >
                {selectedEvent?.seats === 0
                  ? 'Sold Out'
                  : bookings.some((b) => b.id === selectedEvent?.id)
                  ? 'Already Booked'
                  : !seatsConfirmed
                  ? 'Select Seats to Book'
                  : 'Confirm Booking'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setSeatsConfirmed(false);
                  setSeatBookingOpen(true);
                }}
                disabled={!selectedEvent || selectedEvent.seats === 0}
              >
                Select Seats
              </Button>
            </DialogActions>

            {/* Seat Selection */}
            <Dialog open={seatBookingOpen} onClose={() => setSeatBookingOpen(false)} fullWidth maxWidth="sm">
              <DialogTitle>Select Seats</DialogTitle>
              <DialogContent>
                <Typography gutterBottom>
                  Available seats: {selectedEvent?.seats}
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(50px, 1fr))',
                    gap: 2,
                  }}
                >
                  {[...Array(selectedEvent?.seats || 0)].map((_, index) => (
                    <Button
                      key={index}
                      variant={selectedSeats.includes(index + 1) ? 'contained' : 'outlined'}
                      onClick={() => handleSeatSelection(index + 1)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setSeatBookingOpen(false)}>Cancel</Button>
                <Button onClick={handleConfirmSeatBooking} disabled={selectedSeats.length === 0}>
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
