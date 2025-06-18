import React from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const dummyBookings = [
  { eventId: 1, userId: 101, username: 'John Doe', seats: ['A1', 'A2'] },
  { eventId: 2, userId: 102, username: 'Jane Smith', seats: ['B1', 'B2'] },
  { eventId: 3, userId: 103, username: 'Alice Johnson', seats: ['C1', 'C2'] },
  { eventId: 4, userId: 104, username: 'Bob Brown', seats: ['D1', 'D2'] },
  { eventId: 5, userId: 105, username: 'Charlie White', seats: ['E1', 'E2'] },
];

export default function ViewBookings() {
  const navigate = useNavigate();
  const bookings = useSelector((state) =>
    state.bookings.length ? state.bookings : dummyBookings
  );
  const events = useSelector((state) => state.events);

  return (
    <Box
      sx={{
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#caf0f8',
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          position: 'relative',
          py: 2,
          px: 3,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <IconButton
          onClick={() => navigate('/admin/dashboard')}
          sx={{
            position: 'absolute',
            left: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: '#f5f5f5',
            '&:hover': { backgroundColor: '#e0e0e0' },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold" textAlign="center">
          All Bookings
        </Typography>
      </Box>

      {/* Content Area */}
      <Box
        sx={{
          flex: 1,
          px: 3,
          pb: 3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: '100%',
            maxWidth: 800,
            height: '100%',
            overflow: 'hidden',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {bookings.length === 0 ? (
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography variant="body1" align="center">
                No bookings made yet.
              </Typography>
            </Box>
          ) : (
            <List
              disablePadding
              sx={{
                flex: 1,
                overflow: 'hidden',
              }}
            >
              {bookings.map((b, i) => {
                const event = events.find((e) => e.id === b.eventId);
                return (
                  <ListItem
                    key={i}
                    divider
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                      },
                      '& .MuiListItemText-secondary': {
                        fontSize: { xs: '0.8rem', sm: '0.9rem' },
                      },
                    }}
                  >
                    <ListItemText
                      primary={`${event?.title || 'Unknown Event'} - ${b.username}`}
                      secondary={`📍 ${event?.location || 'N/A'} | 📅 ${event?.date || 'N/A'} | Seats: ${b.seats.join(', ')}`}
                    />
                  </ListItem>
                );
              })}
            </List>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
