import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteEvent } from '../../redux/slices/eventsSlice';
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Pagination from '@mui/material/Pagination';
import { useNavigate } from 'react-router-dom';

export default function ManageEvents() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const events = useSelector((state) => state.events);
  const [page, setPage] = useState(1);
  const eventsPerPage = 7;

  // For multiple select
  const [selected, setSelected] = useState([]);

  // For confirmation dialog
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState(null); // 'single' or 'multiple'
  const [eventToDelete, setEventToDelete] = useState(null); // id of single event to delete

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const paginatedEvents = events.slice(
    (page - 1) * eventsPerPage,
    page * eventsPerPage
  );

  // Toggle select one event
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  // Select all events on current page
  const selectAllOnPage = () => {
    const currentPageIds = paginatedEvents.map((e) => e.id);
    const allSelected = currentPageIds.every((id) => selected.includes(id));
    if (allSelected) {
      // unselect all
      setSelected((prev) => prev.filter((id) => !currentPageIds.includes(id)));
    } else {
      // add all
      setSelected((prev) => [...new Set([...prev, ...currentPageIds])]);
    }
  };

  // Open confirmation dialog for single delete
  const handleSingleDeleteClick = (id) => {
    setDeleteMode('single');
    setEventToDelete(id);
    setConfirmOpen(true);
  };

  // Open confirmation dialog for multiple delete
  const handleMultipleDeleteClick = () => {
    if (selected.length === 0) return;
    setDeleteMode('multiple');
    setConfirmOpen(true);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
    setEventToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (deleteMode === 'single' && eventToDelete !== null) {
      dispatch(deleteEvent(eventToDelete));
      setSelected((prev) => prev.filter((id) => id !== eventToDelete));
    } else if (deleteMode === 'multiple') {
      selected.forEach((id) => dispatch(deleteEvent(id)));
      setSelected([]);
    }
    setConfirmOpen(false);
    setEventToDelete(null);
  };

  return (
    <Box
      sx={{
        minHeight: '85vh',
        px: { xs: 2, sm: 4 },
        py: 4,
        mx: 'auto',
        width: '100%',
        maxWidth: { xs: '100%', sm: '90%', md: '80%', lg: '70%' },
        background: '#ffffff',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <IconButton
          onClick={() => navigate('/admin/dashboard')}
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
          variant="h4"
          gutterBottom
          sx={{
            textAlign: { xs: 'center', sm: 'left' },
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
          }}
        >
          Manage Events
        </Typography>
      </Box>

      <Paper
        elevation={3}
        sx={{
          p: { xs: 1, sm: 2 },
          mt: 2,
        }}
      >
        {events.length === 0 ? (
          <Typography
            variant="body1"
            align="center"
            sx={{
              py: 4,
              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.2rem' },
            }}
          >
            No events available.
          </Typography>
        ) : (
          <>
            {/* Select All Checkbox */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 1,
                pl: 2,
              }}
            >
              <Checkbox
                checked={
                  paginatedEvents.length > 0 &&
                  paginatedEvents.every((e) => selected.includes(e.id))
                }
                indeterminate={
                  paginatedEvents.some((e) => selected.includes(e.id)) &&
                  !paginatedEvents.every((e) => selected.includes(e.id))
                }
                onChange={selectAllOnPage}
                inputProps={{ 'aria-label': 'Select all events on this page' }}
              />
              <Typography>Select All</Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Button
                variant="contained"
                color="error"
                disabled={selected.length === 0}
                onClick={handleMultipleDeleteClick}
              >
                Delete Selected
              </Button>
            </Box>

            <List>
              {paginatedEvents.map((e) => (
                <ListItem
                  key={e.id}
                  divider
                  secondaryAction={
                    <IconButton
                      edge="end"
                      color="error"
                      onClick={() => handleSingleDeleteClick(e.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontSize: { xs: '0.9rem', sm: '1rem', md: '1.2rem' },
                    },
                    '& .MuiListItemText-secondary': {
                      fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                    },
                  }}
                >
                  {/* Checkbox to select single event */}
                  <Checkbox
                    edge="start"
                    checked={selected.includes(e.id)}
                    onChange={() => toggleSelect(e.id)}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': `checkbox-list-label-${e.id}` }}
                    sx={{ mr: 2 }}
                  />
                  <ListItemText
                    id={`checkbox-list-label-${e.id}`}
                    primary={e.title}
                    secondary={`📍 ${e.location} | 📅 ${e.date} | 💲 ${e.price}`}
                  />
                </ListItem>
              ))}
            </List>
          </>
        )}
        <Pagination
          count={Math.ceil(events.length / eventsPerPage)}
          page={page}
          onChange={handlePageChange}
          sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}
        />
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={handleConfirmClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {deleteMode === 'single'
              ? 'Are you sure you want to delete this event? This action cannot be undone.'
              : `Are you sure you want to delete these ${selected.length} events? This action cannot be undone.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
