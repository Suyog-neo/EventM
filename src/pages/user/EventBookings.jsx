import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import IP_ADD from '../../apis/ip';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useRef } from 'react';
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
  const ticketRef = useRef();


  const handleDownloadTicketAsPDF = async () => {
    if (!ticketRef.current) return;

    const canvas = await html2canvas(ticketRef.current, {
      useCORS: true,
      scale: 2
    });

    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    const x = (pdf.internal.pageSize.getWidth() - pdfWidth) / 2;
    const y = (pdf.internal.pageSize.getHeight() - pdfHeight) / 2;

    pdf.addImage(imgData, 'PNG', x, y, pdfWidth, pdfHeight);
    pdf.save(`${eventSeatBookData.eventname || 'ticket'}.pdf`);
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
          height: {},
          overflowY: 'auto',
          px: 2,
          pt: 2,
          pb: 8,
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
            <Box sx={{ display: 'flex', justifyContent: { xs: 'center' } }}>
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
          <Grid container spacing={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', lg: 'center' } }}>
            {eventBookHistory.map((event, index) => (
              <Grid item xs={12} lg={3} key={index} >
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
                  },
                }}
              >
                <DialogTitle sx={{ textAlign: 'center' }}>
                  {eventSeatBookData.eventname}
                </DialogTitle>

                <DialogContent sx={{ pt: 0 }}>
                  <DialogContentText sx={{ mb: 1, textAlign: 'center' }}>
                    Download Ticket
                  </DialogContentText>
                  <Box
                    ref={ticketRef}
                    sx={{
                      backgroundColor: '#fff',
                      p: 2,
                      border: '1px dashed #ccc',
                      borderRadius: 3,
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={`${IP_ADD}/${eventSeatBookData.ticket_qr_img}`}
                      alt="QR Code"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/fallbackimg.svg';
                      }}
                      loading="lazy"
                      sx={{
                        width: 200,
                        height: 200,
                        objectFit: 'contain',
                        borderRadius: 2,
                      }}
                    />
                    <Box>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Seat Numbers
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {eventSeatBookData.seats
                          ?.map(seat => Number(seat.seat_number))
                          .sort((a, b) => a - b)
                          .join(', ')}
                      </Typography>

                      <Typography variant="body2">
                        Seat Price: ₹{eventSeatBookData.price_per_seat || 0}
                      </Typography>
                      <Typography variant="body2">
                        Total Price: ₹
                        {eventSeatBookData.price_per_seat * (eventSeatBookData.seats?.length || 0)}
                      </Typography>
                    </Box>
                  </Box>
                </DialogContent>

                <DialogActions>
                  <Button onClick={handleClose} color="secondary">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDownloadTicketAsPDF}
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
