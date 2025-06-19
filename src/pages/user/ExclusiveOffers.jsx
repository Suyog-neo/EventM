import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Button,
  IconButton,
  Chip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useNavigate } from 'react-router-dom';

const dummyOffers = [
  {
    id: 1,
    title: "Early Bird Special",
    description: "Book any event 30 days in advance and get 20% off on your tickets!",
    validUntil: "2025-07-31T23:59:59Z",
    discount: "20% OFF",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    code: "EARLY20"
  },
  {
    id: 2,
    title: "Group Booking Bonus",
    description: "Book 5 or more tickets together and get 15% off plus a free VIP pass!",
    validUntil: "2025-08-15T23:59:59Z",
    discount: "15% OFF",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
    code: "GROUP15"
  },
  {
    id: 3,
    title: "Weekend Special",
    description: "Special discounts on all weekend events. Limited time offer!",
    validUntil: "2025-09-30T23:59:59Z",
    discount: "25% OFF",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
    code: "WEEKEND25"
  },
  {
    id: 4,
    title: "Student Special",
    description: "Show your student ID and get 30% off on all events!",
    validUntil: "2025-12-31T23:59:59Z",
    discount: "30% OFF",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    code: "STUDENT30"
  }
];

export default function ExclusiveOffers() {
  const navigate = useNavigate();

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
            🎁 Exclusive Offers
          </Typography>
        </Box>

        {/* Offers Grid */}
        <Grid container spacing={3} justifyContent="center" sx={{ mt: 4 }}>
          {dummyOffers.map((offer) => (
            <Grid item key={offer.id}>
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
                <CardActionArea sx={{ height: '100%' }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={offer.image}
                    alt={offer.title}
                  />
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" noWrap>
                          {offer.title}
                        </Typography>
                        <Chip
                          icon={<LocalOfferIcon />}
                          label={offer.discount}
                          color="secondary"
                          size="small"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, height: 40, overflow: 'hidden' }}>
                        {offer.description}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTimeIcon color="action" />
                        <Typography variant="body2">
                          Valid until: {new Date(offer.validUntil).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="primary" fontWeight="bold">
                          Code: {offer.code}
                        </Typography>
                        <Button variant="contained" color="primary" size="small">
                          Apply Offer
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
} 