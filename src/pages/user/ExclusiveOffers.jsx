import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Tooltip,
  Snackbar,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useNavigate } from 'react-router-dom';
import { userOffers } from '../../apis/event';

export default function ExclusiveOffers() {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await userOffers();
        if (response.data && Array.isArray(response.data.data)) {
          setOffers(response.data.data);
        } else {
          setError('Failed to fetch offers');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch offers');
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f1f9ff', py: 4, px: 2 }}>
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
            color="#1976d2"
            sx={{ fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' } }}
          >
            🎉 Exclusive Offers Just for You!
          </Typography>
        </Box>

        {/* Offers Grid */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>
        ) : offers.length === 0 ? (
          <Typography align="center" sx={{ mt: 4 }}>No offers available.</Typography>
        ) : (
          <Grid container spacing={3} justifyContent="center" sx={{ mt: 4 }}>
            {offers.map((offer, index) => (
              <Grid item key={offer.id || index}>
                <Card
                  sx={{
                    width: 320,
                    minHeight: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    background: 'linear-gradient(to right, #e0f7fa, #fce4ec)',
                    boxShadow: 3,
                    transition: 'transform 0.25s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', pr: 1, pt: 1 }}>
                    <Tooltip title="Copy Code">
                      <IconButton size="small" onClick={() => handleCopy(offer.offer_code)}>
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Box>
                      <Chip
                        icon={<LocalOfferIcon />}
                        label={offer.offer_code}
                        color="primary"
                        size="small"
                        sx={{ fontWeight: 'bold', mb: 1 }}
                      />
                      <Typography variant="body1" sx={{ mb: 2, color: '#333', fontWeight: 500 }}>
                        {offer.offer_text}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Snackbar for Copy Feedback */}
      <Snackbar
        open={copied}
        autoHideDuration={2000}
        onClose={() => setCopied(false)}
        message="Promo code copied!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}
