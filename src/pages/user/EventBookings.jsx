import React from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Fade,
} from '@mui/material';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BackButton from '../../components/BackButton'; // ✅ import reusable back button

export default function EventBookings() {
  const bookings = useSelector((state) => state.bookings);

  return (
    <Fade in timeout={500}>
      <Box
        sx={{
          position: 'relative', // needed for positioning back button
          height: 'calc(100vh - 130px)',
          overflowY: 'auto',
          px: 2,
          pt: 2,
          pb: 1,
          boxSizing: 'border-box',
          background: '#ffffff',
        }}
      >
        {/* ✅ Back Button (top-right, icon-only) */}
        <BackButton sx={{ left: 16, right: 'auto' }} />

        <Typography
          variant="h3"
          fontWeight="bold"
          color="primary"
          textAlign="center"
          sx={{ mb: 2 }}
        >
          My Bookings
        </Typography>

        {bookings.length === 0 ? (
          <Typography variant="h6" align="center" color="text.secondary">
            You haven’t booked any events yet.
          </Typography>
        ) : (
          <Grid container spacing={4} justifyContent="center">
            {bookings.map((event, i) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={3}
                key={i}
                sx={{ display: 'flex' }}
              >
                <Card
                  sx={{
                    width: '100%',
                    height: 320,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderRadius: 8,
                    background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      noWrap
                      sx={{ textOverflow: 'ellipsis', overflow: 'hidden', mb: 1 }}
                    >
                      {i + 1}. {event.title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <EventIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                      {event.date}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <LocationOnIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                      {event.location}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Seats: {Array.isArray(event.seats) ? event.seats.join(', ') : event.seats}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Price: ${event.price}
                    </Typography>

                    <Box
                      sx={{
                        mt: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      <Chip
                        icon={<BookmarkAddedIcon />}
                        label="Booked Ticket"
                        color="success"
                        variant="outlined"
                        sx={{ flexGrow: 1 }}
                      />
                      <Chip
                        icon={<BookmarkAddedIcon />}
                        label="Download"
                        color="primary"
                        variant="outlined"
                        sx={{ flexGrow: 1 }}
                        onClick={() => console.log('Download ticket for:', event.title)}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Fade>
  );
}
