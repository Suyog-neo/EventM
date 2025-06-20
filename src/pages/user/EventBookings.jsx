import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import IP_ADD from '../../apis/ip';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Fade,
  CardActionArea,
  CardMedia,

} from '@mui/material';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BackButton from '../../components/BackButton';
import { getSeatBookData } from '../../apis/userSeatBook'

export default function EventBookings() {
  const [eventBookHistory, seteventBookHistory] = useState([]);

  const handleOnFetchBookingHistory = async () => {
    try {
      const res = await getSeatBookData();
      seteventBookHistory(res.data.data);
      console.log(res.data)
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    handleOnFetchBookingHistory();
  }, [])

  return (
    <Fade in timeout={500}>
      <Box
        sx={{
          position: 'relative',
          height: 'calc(93vh - 100px)',
          overflowY: 'auto',
          px: 2,
          pt: 2,
          pb: 1,
          boxSizing: 'border-box',
          background: '#caf0f8',
        }}
      >

        <BackButton sx={{ left: 16, right: 'auto' }} />

        <Typography
          variant="h3"
          fontWeight="bold"
          color="primary"
          textAlign="center"
          sx={{ mb: 2, fontSize: { xs: '25px' } }}
        >
          My Bookings
        </Typography>

        {eventBookHistory.length === 0 ? (

          <Box align="center" color="text.secondary">
            <Box component='img' src='/noresultsfound.svg'
              sx={{
                height: { xs: '30vh', lg: '20vh' },
                width: { xs: '60vw', lg: '20vw' },
                marginTop: { lg: 10 }
              }}
            >
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Typography ariant="h5" component={Link} to='/user/events'
                sx={{
                  border: '2px solid red',
                  borderRadius: 1,
                  width: { xs: 1, lg: '20vw' },
                  padding: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  color: 'black',
                  textDecorationLine: 'none',
                  fontSize: "18px",
                  marginTop: { lg: 10 }
                }}
              >
                Expores Events
              </Typography>
            </Box>

          </Box>

        ) : (
          <Grid container spacing={4} sx={{ justifyContent: { xs: 'flex-start', lg: 'center' } }}>
            {eventBookHistory.map((event) => (
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
                        image={`${IP_ADD}/${event.eventimg}`}
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
                            {event.eventname}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: .5, height: 40, overflow: 'hidden' }}>
                            {event.event_description}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationOnIcon color="action" />
                            <Typography variant="body2" noWrap>{event.event_location}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CalendarTodayIcon color="action" />
                              <Typography variant="body2">
                                {new Date(event.event_date).toLocaleDateString()}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <AttachMoneyIcon color="action" />
                              <Typography variant="body2">₹{event.price}</Typography>
                            </Box>
                          </Box>
                          <Box>
                            <Typography>Book Seats : {event.seat.seat_number}</Typography>
                          </Box>
                        </Box>
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
                            sx={{
                              flexGrow: 1,
                              borderWidth: '1px',
                              height: '35px'
                            }}
                          />
                          <Chip
                            icon={<BookmarkAddedIcon />}
                            label="Download"
                            color="primary"
                            variant="outlined"
                            sx={{
                              flexGrow: 1,
                              borderWidth: '1px',
                              height: '35px'
                            }}
                            onClick={() => console.log('Download ticket for:', event.title)}
                          />
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              </>
            ))}
          </Grid>
        )}
      </Box>
    </Fade>
  );
}
