import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Typography,
  Container,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Snackbar,
  Alert,
  Button,
  Chip,
  CircularProgress,
  useTheme,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  InputAdornment,
  Drawer,
  Divider
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";

const EVENT_STATUSES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

const EventAdminComponent = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [eventItems, setEventItems] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEventForDeletion, setSelectedEventForDeletion] = useState(null);
  const [selectedEventForView, setSelectedEventForView] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // Fetch events on component mount
  useEffect(() => {
    fetchEventItems();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...eventItems];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(event => event.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== "all") {
      const today = new Date();
      const eventDate = new Date();
      
      switch(dateFilter) {
        case "today":
          filtered = filtered.filter(event => 
            new Date(event.dateAndTime).toDateString() === today.toDateString()
          );
          break;
        case "upcoming":
          filtered = filtered.filter(event => 
            new Date(event.dateAndTime) > today
          );
          break;
        case "past":
          filtered = filtered.filter(event => 
            new Date(event.dateAndTime) < today
          );
          break;
        default:
          break;
      }
    }

    setFilteredEvents(filtered);
  }, [eventItems, searchTerm, statusFilter, dateFilter]);

  // Fetch event items from API
  const fetchEventItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://biz-connect-livid.vercel.app/api/v1/events');
      const data = await response.json();
      setEventItems(data.data);
      setFilteredEvents(data.data);
    } catch (error) {
      handleError("Failed to fetch event items", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle event status update
  const handleStatusUpdate = async (eventId, newStatus) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`https://biz-connect-livid.vercel.app/api/v1/events/${eventId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });
      const updatedEvent = await response.json();
      
      setEventItems(prev => prev.map(item => 
        item._id === eventId ? { ...item, status: newStatus } : item
      ));

      setSnackbar({
        open: true,
        message: `Event ${newStatus} successfully`,
        severity: "success"
      });
    } catch (error) {
      handleError(`Failed to ${newStatus} event`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle event deletion
  const handleDeleteEvent = async () => {
    if (!selectedEventForDeletion) return;

    setIsSubmitting(true);
    try {
      await fetch(`https://biz-connect-livid.vercel.app/api/v1/events/${selectedEventForDeletion}`, {
        method: 'DELETE'
      });
      setEventItems(prev => prev.filter(item => item._id !== selectedEventForDeletion));
      setIsDeleteConfirmOpen(false);
      setSelectedEventForDeletion(null);
      setSnackbar({
        open: true,
        message: "Event deleted successfully",
        severity: "success"
      });
    } catch (error) {
      handleError("Failed to delete event", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generic error handler
  const handleError = (message, error = null) => {
    console.error(error);
    setSnackbar({
      open: true,
      message: message,
      severity: "error"
    });
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Open delete confirmation dialog
  const openDeleteConfirmation = (id) => {
    setSelectedEventForDeletion(id);
    setIsDeleteConfirmOpen(true);
  };

  // Open view dialog
  const openViewDialog = (event) => {
    setSelectedEventForView(event);
    setIsViewDialogOpen(true);
  };

  // Get status chip color
  const getStatusChipColor = (status) => {
    switch (status) {
      case EVENT_STATUSES.APPROVED:
        return "success";
      case EVENT_STATUSES.REJECTED:
        return "error";
      default:
        return "warning";
    }
  };

  // Loading skeleton
  const CardSkeleton = () => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ height: 200, bgcolor: 'grey.200' }} />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ bgcolor: 'grey.200', height: 24, width: '75%', mb: 1 }} />
        <Box sx={{ bgcolor: 'grey.200', height: 20, width: '100%', mb: 1 }} />
        <Box sx={{ bgcolor: 'grey.200', height: 20, width: '60%' }} />
      </CardContent>
      <CardActions>
        <Box sx={{ bgcolor: 'grey.200', height: 30, width: 30, borderRadius: '50%' }} />
      </CardActions>
    </Card>
  );

  return (
    <Container maxWidth="" sx={{ py: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box display="flex" alignItems="center">
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #FF5252 30%, #FF1744 90%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
              boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)'
            }}
          >
            <Typography variant="h4">E</Typography>
          </Box>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            sx={{
              background: 'linear-gradient(45deg, #FF5252 30%, #FF1744 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold'
            }}
          >
            Event Administration
          </Typography>
        </Box>
      </Box>

      {/* Search and Filter Bar */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search events..."
          variant="outlined"
          size="small"
          sx={{ flexGrow: 1, minWidth: '200px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={() => setIsFilterDrawerOpen(true)}
        >
          Filters
        </Button>
      </Box>

      {/* Event Gallery Grid */}
      <Grid container spacing={3}>
        {isLoading ? (
          Array.from(new Array(6)).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <CardSkeleton />
            </Grid>
          ))
        ) : (
          filteredEvents.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height={200}
                  image={item.image || `https://via.placeholder.com/400x200`}
                  alt="Event Image"
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1, position: 'relative' }}>
                  <Box 
                    sx={{ 
                      position: 'absolute',
                      top: -20,
                      left: 16,
                      zIndex: 1
                    }}
                  >
                    <Chip
                      label={item.status}
                      color={getStatusChipColor(item.status)}
                      size="small"
                      sx={{ 
                        textTransform: 'capitalize',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    />
                  </Box>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{
                      mt: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {item.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PersonIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      {item.organizer}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarTodayIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      {new Date(item.dateAndTime).toLocaleString()}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1 }}>
                  <Box>
                    {item.status === EVENT_STATUSES.PENDING && (
                      <>
                        <IconButton
                          onClick={() => handleStatusUpdate(item._id, EVENT_STATUSES.APPROVED)}
                          disabled={isSubmitting}
                          color="success"
                          size="small"
                        >
                          <CheckIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleStatusUpdate(item._id, EVENT_STATUSES.REJECTED)}
                          disabled={isSubmitting}
                          color="error"
                          size="small"
                        >
                          <CloseIcon />
                        </IconButton>
                      </>
                    )}
                  </Box>
                  <Box>
                    <IconButton
                      onClick={() => openViewDialog(item)}
                      disabled={isSubmitting}
                      color="primary"
                      size="small"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => openDeleteConfirmation(item._id)}
                      disabled={isSubmitting}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Filter Drawer */}
      <Drawer
        anchor="right"
        open={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
      >
<Box sx={{ width: 300, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value={EVENT_STATUSES.PENDING}>Pending</MenuItem>
              <MenuItem value={EVENT_STATUSES.APPROVED}>Approved</MenuItem>
              <MenuItem value={EVENT_STATUSES.REJECTED}>Rejected</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Date</InputLabel>
            <Select
              value={dateFilter}
              label="Date"
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <MenuItem value="all">All Dates</MenuItem>
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="upcoming">Upcoming</MenuItem>
              <MenuItem value="past">Past</MenuItem>
            </Select>
          </FormControl>

          <Button 
            fullWidth 
            variant="contained" 
            onClick={() => {
              setStatusFilter("all");
              setDateFilter("all");
              setSearchTerm("");
            }}
            sx={{ mt: 2 }}
          >
            Clear Filters
          </Button>
        </Box>
      </Drawer>

      {/* View Event Dialog */}
      <Dialog
        open={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedEventForView && (
          <>
            <DialogTitle sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              pb: 1
            }}>
              Event Details
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              <Box sx={{ position: 'relative', mb: 3 }}>
                <img
                  src={selectedEventForView.image || `https://via.placeholder.com/600x300`}
                  alt="Event"
                  style={{ 
                    width: '100%',
                    height: '300px',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
                <Chip
                  label={selectedEventForView.status}
                  color={getStatusChipColor(selectedEventForView.status)}
                  sx={{ 
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    textTransform: 'capitalize'
                  }}
                />
              </Box>

              <Typography variant="h5" gutterBottom>
                {selectedEventForView.title}
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {selectedEventForView.description}
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body2">
                      Organized by: {selectedEventForView.organizer}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarTodayIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body2">
                      Date & Time: {new Date(selectedEventForView.dateAndTime).toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>
                {selectedEventForView.location && (
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2">
                        Location: {selectedEventForView.location}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions sx={{ borderTop: 1, borderColor: 'divider', px: 3, py: 2 }}>
              <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
              {selectedEventForView.status === EVENT_STATUSES.PENDING && (
                <>
                  <Button 
                    onClick={() => {
                      handleStatusUpdate(selectedEventForView._id, EVENT_STATUSES.APPROVED);
                      setIsViewDialogOpen(false);
                    }}
                    color="success"
                    variant="contained"
                  >
                    Approve
                  </Button>
                  <Button 
                    onClick={() => {
                      handleStatusUpdate(selectedEventForView._id, EVENT_STATUSES.REJECTED);
                      setIsViewDialogOpen(false);
                    }}
                    color="error"
                    variant="contained"
                  >
                    Reject
                  </Button>
                </>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteConfirmOpen}
        onClose={() => !isSubmitting && setIsDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this event? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsDeleteConfirmOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteEvent}
            disabled={isSubmitting}
            color="error"
            variant="contained"
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Footer */}
      <Box textAlign="center" mt={4}>
        <Typography 
          variant="subtitle1" 
          sx={{
            background: 'linear-gradient(45deg, #FF5252 30%, #FF1744 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'medium'
          }}
        >
          Event Administration Portal
        </Typography>
      </Box>
    </Container>
  );
};

export default EventAdminComponent;