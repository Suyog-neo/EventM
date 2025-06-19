import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Snackbar,
  Slide,
  Fade,
  MenuItem,
  Alert,
} from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useNavigate } from 'react-router-dom';
import { adminCreateEvent, adminAllEvents } from '../../apis/event';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Carousel from '../../components/Carousel';
import AdBanner from '../../components/AdBanner';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [errors, setErrors] = useState({});
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    category: '',
    location: '',
    description: '',
    status: 'upcoming',
    total_seats: '',
    available_seats: '',
    price_per_seat: '',
    address: '',
  });

  const categories = [
    { id: 1, name: 'Sports' },
    { id: 2, name: 'Technology' },
    { id: 3, name: 'Entertainment' },
    { id: 4, name: 'Business' },
    { id: 5, name: 'Art' },
    { id: 6, name: 'Wellness' },
  ];

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setErrors({});
    setNewEvent({
      title: '',
      date: '',
      category: '',
      location: '',
      description: '',
      status: 'upcoming',
      total_seats: '',
      available_seats: '',
      price_per_seat: '',
      address: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category') {
      setNewEvent((prev) => ({
        ...prev,
        category: value,
      }));
    } else {
      setNewEvent((prev) => ({
        ...prev,
        [name]: value,
        ...(name === 'total_seats' && { available_seats: value }),
      }));
    }
  };

  const validateFields = () => {
    const newErrors = {};
    if (!newEvent.title.trim()) newErrors.title = 'Title is required';
    if (!newEvent.date) newErrors.date = 'Date is required';
    if (!newEvent.category) newErrors.category = 'Category is required';
    if (!newEvent.location.trim()) newErrors.location = 'Location is required';
    if (!newEvent.description.trim()) newErrors.description = 'Description is required';
    if (!newEvent.total_seats || isNaN(newEvent.total_seats) || newEvent.total_seats <= 0) {
      newErrors.total_seats = 'Valid total seats is required';
    }
    if (!newEvent.price_per_seat || isNaN(newEvent.price_per_seat) || newEvent.price_per_seat <= 0) {
      newErrors.price_per_seat = 'Valid price per seat is required';
    }
    if (!newEvent.address.trim()) newErrors.address = 'Address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateEvent = async () => {
    if (!validateFields()) return;

    try {
      const eventData = {
        ...newEvent,
        category: parseInt(newEvent.category, 10),
        total_seats: parseInt(newEvent.total_seats),
        available_seats: parseInt(newEvent.total_seats),
        price_per_seat: parseFloat(newEvent.price_per_seat),
      };

      const response = await adminCreateEvent(eventData);
      if (response.data) {
        setSnackbarMessage('Event created successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        handleClose();
      }
    } catch (error) {
      setSnackbarMessage(error.response?.data?.message || 'Failed to create event');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const actions = [
    {
      title: 'Create Event',
      icon: <AddCircleOutlineIcon sx={{ fontSize: 40, color: '#6a1b9a' }} />,
      onClick: handleOpen,
    },
    {
      title: 'Manage Events',
      icon: <EventNoteIcon sx={{ fontSize: 40, color: '#3949ab' }} />,
      onClick: () => navigate('/admin/manage-events'),
    },
    {
      title: 'View Bookings',
      icon: <ListAltIcon sx={{ fontSize: 40, color: '#00897b' }} />,
      onClick: () => navigate('/admin/bookings'),
    },
  ];

  const carouselItems = [
    {
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80',
      caption: 'Effortless Event Management',
    },
    {
      image: 'https://akm-img-a-in.tosshub.com/businesstoday/images/story/202410/672085ac85ede-chris-martin-gestures-on-stage-as-coldplay-performs-on-nbcs-today-show-at-rockefeller-plaza-in-ne-295014672-16x9.jpg?size=948:533',
      caption: 'Track Bookings and Analytics',
    },
    {
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80',
      caption: 'Collaborate with Your Team',
    },
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await adminAllEvents();
        if (response.data && Array.isArray(response.data.data)) {
          setEvents(response.data.data);
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

  const chartData = {
    labels: events.map((e) => e.title),
    datasets: [
      {
        label: 'Seats Left',
        data: events.map((e) => e.available_seats ?? 0),
        backgroundColor: 'rgba(63, 81, 181, 0.6)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { bottom: 30 } },
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Event Seats Overview' },
    },
  };

  return (
    <Fade in timeout={500}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          minHeight: '100vh',
          background: '#caf0f8',
          px: 2,
          py: 4,
        }}
      >
        <Box
          sx={{
            maxWidth: '1600px',
            width: '100%',
            backgroundColor: '#ffffff',
            borderRadius: 2,
            boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            p: 3,
          }}
        >
          
          <Box sx={{ px: 2, pt: 2, pb: 1 }}>
            <AdBanner type="admin" />
          </Box>

          <Typography
            variant="h3"
            fontWeight="bold"
            gutterBottom
            textAlign="center"
            color="#3f51b5"
            sx={{ fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' }, mt: 2 }}
          >
            Admin Dashboard
          </Typography>

          <Carousel items={carouselItems} />

          
          <Grid container spacing={4} justifyContent="center">
            {actions.map((action, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Slide in direction="up" timeout={400}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 4,
                      background: 'linear-gradient(135deg, #ffffff, #f3e5f5)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                      },
                    }}
                  >
                    <CardActionArea onClick={action.onClick} sx={{ p: 3, textAlign: 'center' }}>
                      {action.icon}
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

          
          <Box
            sx={{
              mt: 6,
              width: '100%',
              maxWidth: { xs: '100%', sm: '600px', md: '800px' },
              mx: 'auto',
              height: { xs: 350, sm: 400, md: 450 },
              pb: 4,
            }}
          >
            <Typography variant="h5" fontWeight="bold" mb={2} color="#3f51b5" textAlign="center">
              Analytics
            </Typography>
            {loading ? (
              <Typography align="center" sx={{ py: 4 }}>Loading chart...</Typography>
            ) : error ? (
              <Typography color="error" align="center" sx={{ py: 4 }}>{error}</Typography>
            ) : (
              <Bar data={chartData} options={chartOptions} />
            )}
          </Box>

          
          <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle>Create New Event</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} mt={1}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Title"
                    name="title"
                    value={newEvent.title}
                    onChange={handleChange}
                    error={Boolean(errors.title)}
                    helperText={errors.title}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Date"
                    name="date"
                    type="datetime-local"
                    value={newEvent.date}
                    onChange={handleChange}
                    error={Boolean(errors.date)}
                    helperText={errors.date}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Category"
                    name="category"
                    value={newEvent.category}
                    onChange={handleChange}
                    error={Boolean(errors.category)}
                    helperText={errors.category}
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Location"
                    name="location"
                    value={newEvent.location}
                    onChange={handleChange}
                    error={Boolean(errors.location)}
                    helperText={errors.location}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={newEvent.address}
                    onChange={handleChange}
                    error={Boolean(errors.address)}
                    helperText={errors.address}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    multiline
                    rows={4}
                    value={newEvent.description}
                    onChange={handleChange}
                    error={Boolean(errors.description)}
                    helperText={errors.description}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Total Seats"
                    name="total_seats"
                    type="number"
                    value={newEvent.total_seats}
                    onChange={handleChange}
                    error={Boolean(errors.total_seats)}
                    helperText={errors.total_seats}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Price per Seat"
                    name="price_per_seat"
                    type="number"
                    value={newEvent.price_per_seat}
                    onChange={handleChange}
                    error={Boolean(errors.price_per_seat)}
                    helperText={errors.price_per_seat}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="secondary">
                Cancel
              </Button>
              <Button onClick={handleCreateEvent} variant="contained" color="primary">
                Create
              </Button>
            </DialogActions>
          </Dialog>

          
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Box>
      </Box>
    </Fade>
  );
}
