import React, { useState } from 'react';
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
} from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
  const events = useSelector((state) => state.events);

  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [newEvent, setNewEvent] = useState({
    id: '',
    title: '',
    date: '',
    location: '',
    seats: '',
    image: '',
    type: '',
    details: '',
    price: '',
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setErrors({});
  };

  const handleChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const validateFields = () => {
    const newErrors = {};
    if (!newEvent.id || isNaN(newEvent.id)) newErrors.id = 'Valid ID required';
    if (!newEvent.title.trim()) newErrors.title = 'Title required';
    if (!newEvent.date) newErrors.date = 'Date required';
    if (!newEvent.location.trim()) newErrors.location = 'Location required';
    if (!newEvent.seats || isNaN(newEvent.seats)) newErrors.seats = 'Valid seats required';
    if (!newEvent.image.trim()) newErrors.image = 'Image URL required';
    if (!newEvent.type.trim()) newErrors.type = 'Type required';
    if (!newEvent.details.trim()) newErrors.details = 'Details required';
    if (!newEvent.price || isNaN(newEvent.price)) newErrors.price = 'Valid price required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateEvent = () => {
    if (!validateFields()) return;

    console.log('Creating event:', newEvent);
    setSnackbarOpen(true);
    setNewEvent({
      id: '',
      title: '',
      date: '',
      location: '',
      seats: '',
      image: '',
      type: '',
      details: '',
      price: '',
    });
    handleClose();
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

  const chartData = {
    labels: events.map((e) => e.title),
    datasets: [
      {
        label: 'Seats Left',
        data: events.map((e) => e.seats),
        backgroundColor: 'rgba(63, 81, 181, 0.6)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { bottom: 30 },
    },
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
          {/* Ad Banner */}
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

          {/* Carousel */}
          <Carousel items={carouselItems} />

          {/* Action Cards */}
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

          {/* Chart Section */}
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
            <Typography
              variant="h5"
              fontWeight="bold"
              mb={2}
              color="#3f51b5"
              textAlign="center"
            >
              Analytics
            </Typography>
            <Bar data={chartData} options={chartOptions} />
          </Box>

          {/* Dialog for Creating Event */}
          <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle>Create New Event</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} mt={1}>
                {[
                  { name: 'id', label: 'ID', type: 'number' },
                  { name: 'title', label: 'Title' },
                  { name: 'date', label: 'Date', type: 'date' },
                  { name: 'location', label: 'Location' },
                  { name: 'seats', label: 'Seats', type: 'number' },
                  { name: 'image', label: 'Image URL' },
                  { name: 'type', label: 'Type' },
                  { name: 'details', label: 'Details' },
                  { name: 'price', label: 'Price', type: 'number' },
                ].map(({ name, label, type }) => (
                  <Grid item xs={12} sm={6} key={name}>
                    <TextField
                      fullWidth
                      label={label}
                      name={name}
                      type={type || 'text'}
                      value={newEvent[name]}
                      onChange={handleChange}
                      error={Boolean(errors[name])}
                      helperText={errors[name]}
                      InputLabelProps={type === 'date' ? { shrink: true } : {}}
                    />
                  </Grid>
                ))}
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

          {/* Snackbar */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={1000}
            onClose={() => setSnackbarOpen(false)}
            message="Event created successfully!"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          />
        </Box>
      </Box>
    </Fade>
  );
}
