import React, { useState, useEffect } from 'react';
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
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  Grid,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Pagination from '@mui/material/Pagination';
import { useNavigate } from 'react-router-dom';
import { adminAllEvents, adminEditEvents } from '../../apis/event';

export default function ManageEvents() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const eventsPerPage = 7;

  const [selected, setSelected] = useState([]);

  
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState(null); 
  const [eventToDelete, setEventToDelete] = useState(null); 

  // Category mapping for edit form
  const categories = [
    { id: 1, name: 'Sports' },
    { id: 2, name: 'Technology' },
    { id: 3, name: 'Entertainment' },
    { id: 4, name: 'Business' },
    { id: 5, name: 'Art' },
    { id: 6, name: 'Wellness' },
  ];

  // Edit dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [editError, setEditError] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editSuccess, setEditSuccess] = useState(null);

  // Snackbar state for edit success
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  const handlePageChange = (event, value) => {
    setPage(value);
  };

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

  const paginatedEvents = events.slice(
    (page - 1) * eventsPerPage,
    page * eventsPerPage
  );

  
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  
  const selectAllOnPage = () => {
    const currentPageIds = paginatedEvents.map((e) => e.id);
    const allSelected = currentPageIds.every((id) => selected.includes(id));
    if (allSelected) {
     
      setSelected((prev) => prev.filter((id) => !currentPageIds.includes(id)));
    } else {
      
      setSelected((prev) => [...new Set([...prev, ...currentPageIds])]);
    }
  };

 
  const handleSingleDeleteClick = (id) => {
    setDeleteMode('single');
    setEventToDelete(id);
    setConfirmOpen(true);
  };

 
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

  const handleEditClick = (event) => {
    setEditEvent({ ...event });
    setEditOpen(true);
    setEditError(null);
    setEditSuccess(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditEvent((prev) => ({
      ...prev,
      [name]: name === 'category' ? parseInt(value, 10) : value,
    }));
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditEvent(null);
    setEditError(null);
    setEditSuccess(null);
  };

  const handleEditSubmit = async () => {
    setEditLoading(true);
    setEditError(null);
    setEditSuccess(null);
    try {
      const { id, event_image, ...updateData } = editEvent;
      // Convert empty offer to null
      if (updateData.offer === '') updateData.offer = null;
      // Only include event_image if it's a File (for future extensibility)
      if (event_image instanceof File) {
        updateData.event_image = event_image;
      }
      const response = await adminEditEvents(id, updateData);
      if (response.data && response.data.status === 'success') {
        setEditSuccess('Event updated successfully!');
        // Update event in local state
        setEvents((prev) => prev.map((ev) => (ev.id === id ? { ...ev, ...updateData } : ev)));
        setSnackbarMsg(response.data.message || 'Event updated successfully!');
        setSnackbarOpen(true);
        setTimeout(() => {
          handleEditClose();
        }, 1000);
      } else {
        setEditError('Failed to update event');
      }
    } catch (err) {
      setEditError(err.response?.data?.message || 'Failed to update event');
    } finally {
      setEditLoading(false);
    }
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
        background: '#caf0f8',
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
        {loading ? (
          <Typography align="center" sx={{ py: 4 }}>Loading events...</Typography>
        ) : error ? (
          <Typography color="error" align="center" sx={{ py: 4 }}>{error}</Typography>
        ) : events.length === 0 ? (
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

            <Grid container spacing={2}>
              {paginatedEvents.map((e) => (
                <Grid item xs={12} sm={12} md={6} lg={4} key={e.id}>
                  <Paper elevation={2} sx={{ p: 2, mb: 2, display: 'flex', flexDirection: 'column', gap: 1, minHeight: { xs: 180, sm: 200, md: 220 }, height: '100%', justifyContent: 'space-between', boxSizing: 'border-box', width: 300, maxWidth: 280, mx: 'auto' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Checkbox
                        edge="start"
                        checked={selected.includes(e.id)}
                        onChange={() => toggleSelect(e.id)}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': `checkbox-list-label-${e.id}` }}
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="h6" sx={{ flexGrow: 1, fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' }, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180 }}>{e.title}</Typography>
                      <IconButton
                        edge="end"
                        color="primary"
                        onClick={() => handleEditClick(e)}
                        sx={{ mr: 1, p: 0.75 }}
                        aria-label="Edit"
                      >
                        <span role="img" aria-label="edit" style={{ fontSize: 18, display: 'inline-block', lineHeight: 1 }}>✏️</span>
                      </IconButton>
                      <IconButton
                        edge="end"
                        color="error"
                        onClick={() => handleSingleDeleteClick(e.id)}
                        aria-label="Delete"
                        sx={{ p: 0.75 }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Typography variant="body2" sx={{ wordBreak: 'break-word', mb: 0.5 }}>
                      📍 {e.location}
                    </Typography>
                    <Typography variant="body2" sx={{ wordBreak: 'break-word', mb: 0.5 }}>
                      📅 {e.date}
                    </Typography>
                    <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                      💲 {e.price_per_seat}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
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

      {/* Edit Event Dialog */}
      <Dialog open={editOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Event</DialogTitle>
        <DialogContent>
          {editEvent && (
            <Box component="form" sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Title"
                    name="title"
                    value={editEvent.title || ''}
                    onChange={handleEditChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Date"
                    name="date"
                    type="datetime-local"
                    value={editEvent.date ? editEvent.date.slice(0, 16) : ''}
                    onChange={handleEditChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Category"
                    name="category"
                    value={editEvent.category || ''}
                    onChange={handleEditChange}
                    fullWidth
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Location"
                    name="location"
                    value={editEvent.location || ''}
                    onChange={handleEditChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Address"
                    name="address"
                    value={editEvent.address || ''}
                    onChange={handleEditChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Description"
                    name="description"
                    value={editEvent.description || ''}
                    onChange={handleEditChange}
                    fullWidth
                    multiline
                    rows={3}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Total Seats"
                    name="total_seats"
                    type="number"
                    value={editEvent.total_seats || ''}
                    onChange={handleEditChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Available Seats"
                    name="available_seats"
                    type="number"
                    value={editEvent.available_seats || ''}
                    onChange={handleEditChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Price per Seat"
                    name="price_per_seat"
                    type="number"
                    value={editEvent.price_per_seat || ''}
                    onChange={handleEditChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Offer"
                    name="offer"
                    value={editEvent.offer || ''}
                    onChange={handleEditChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Status"
                    name="status"
                    value={editEvent.status || ''}
                    onChange={handleEditChange}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Box>
          )}
          {editError && <Typography color="error" sx={{ mt: 2 }}>{editError}</Typography>}
          {editSuccess && <Typography color="success.main" sx={{ mt: 2 }}>{editSuccess}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="secondary">Cancel</Button>
          <Button onClick={handleEditSubmit} color="primary" variant="contained" disabled={editLoading}>
            {editLoading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
