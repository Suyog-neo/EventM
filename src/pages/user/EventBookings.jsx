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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';

import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BackButton from '../../components/BackButton';
import { getSeatBookData } from '../../apis/userSeatBook'

export default function EventBookings() {
  const [eventBookHistory, seteventBookHistory] = useState([]);
  const [openDownloadTiket, setOpenDownloadTiket] = useState(false);
  const [eventSeatBookData, seteventSeatBookData] = useState({})

  const handleOpen = (event) => {
    seteventSeatBookData(event)
    setOpenDownloadTiket(true);
  }
  const handleClose = () => setOpenDownloadTiket(false);

  const handleDownloadTicket = () => {
    if (!eventSeatBookData.ticket_qr_img) return;

    const imageURL = `${IP_ADD}/${eventSeatBookData.ticket_qr_img}`;
    const fileName = `${eventSeatBookData.eventname || 'ticket'}.png`;

    const link = document.createElement('a');
    link.href = imageURL;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const handleOnFetchBookingHistory = async () => {
    try {
      const res = await getSeatBookData();
      seteventBookHistory(res.data.data);
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
            {eventBookHistory.map((event, index) => (
              <Grid item xs={12} md={3} lg={3} key={index} >
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
                            <Typography variant="body2">₹{event.price_per_seat}</Typography>
                          </Box>
                        </Box>
                        <Box>
                          <Typography>
                            {event.seats?.length > 0
                              ? `Booked Seats: ${event.seats
                                .slice(0, 5)
                                .map(seat => seat.seat_number)
                                .join(', ')}${event.seats.length > 5 ? ', ...' : ''}`
                              : 'No seats booked'}
                          </Typography>
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
                          onClick={() => handleOpen(event)}
                        />
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
            <Box>
              <Dialog
                open={openDownloadTiket}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                  sx: {
                    border: '2px dashed gray',
                    borderRadius: 2,
                    boxShadow: 6,
                    overflow: 'visible',
                  }
                }}
              >
                <DialogTitle sx={{ textAlign: 'center' }}>
                  {eventSeatBookData.eventname}
                </DialogTitle>

                <DialogContent sx={{ pt: 0 }}>
                  <DialogContentText sx={{ mb: 1, textAlign: 'center' }}>
                    Download Ticket
                  </DialogContentText>
                  <Box sx={{ width: '100%', backgroundColor: "transparent" }}>
                    <CardMedia
                      component="img"
                      image={`${IP_ADD}/${eventSeatBookData.ticket_qr_img}`}
                      alt={eventSeatBookData.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/fallbackimg.svg';
                      }}
                      loading="lazy"
                      sx={{
                        width: { xs: '100%', lg: '100%' },
                        height: { xs: 220, lg: 350 },
                        objectFit: 'contain',
                        borderRadius: 2,
                        padding: 1,


                      }}
                    />
                  </Box>

                  <Box
                    sx={{
                      backgroundColor: '#f0f0f0',
                      p: 2,
                      borderTop: '2px dashed #ccc',
                      position: 'relative',
                      textAlign: 'center',
                      borderBottomLeftRadius: 16,
                      borderBottomRightRadius: 16,
                    }}
                  >
                    {/* Top semi-circles */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '-10px',
                        left: '-10px',
                        width: 20,
                        height: 20,
                        backgroundColor: '#fff',
                        borderRadius: '50%',
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '-10px',
                        right: '-10px',
                        width: 20,
                        height: 20,
                        backgroundColor: '#fff',
                        borderRadius: '50%',
                      }}
                    />

                    <Typography variant="body1">Seat</Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {eventSeatBookData.seats?.map(seat => Number(seat.seat_number)).sort((a, b) => a - b).join(', ')}
                    </Typography>
                    <Typography variant="body2">Seat Price: ₹{eventSeatBookData.price_per_seat || 0}</Typography>
                    <Typography variant="body2">Total Price: ₹{eventSeatBookData.price_per_seat * eventSeatBookData.seats?.length}</Typography>
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: -10,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 40,
                        height: 20,
                        backgroundColor: '#fff',
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                      }}
                    />
                  </Box>
                </DialogContent>

                <DialogActions>
                  <Button onClick={handleClose} color="secondary">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDownloadTicket}
                    variant="contained"
                    color="primary"
                  >
                    Download
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          </Grid>
        )}
      </Box>

    </Fade>
  );
}
