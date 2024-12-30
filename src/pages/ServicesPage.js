import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Box,
  Alert,
  Snackbar,
  Grid,
  Chip,
  Divider,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  CircularProgress,
  Stack,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LanguageIcon from '@mui/icons-material/Language';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BusinessIcon from '@mui/icons-material/Business';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CategoryIcon from '@mui/icons-material/Category';
import DescriptionIcon from '@mui/icons-material/Description';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

const STATUS_OPTIONS = ['Approved', 'Rejected', 'Pending'];
const STATUS_COLORS = {
  Approved: 'success',
  Rejected: 'error',
  Pending: 'warning'
};

const ServicesDashboard = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, service: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDialog, setFilterDialog] = useState(false);
  const [filters, setFilters] = useState({
    status: [],
    categories: [],
  });

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://biz-connect-livid.vercel.app/api/v1/services');
      const data = await response.json();
      setServices(data.data || []);
      setFilteredServices(data.data || []);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to fetch services',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filters, services]);

  const applyFilters = () => {
    let filtered = [...services];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(service => 
        service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.serviceEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.serviceContact.includes(searchTerm)
      );
    }

    // Apply status filters
    if (filters.status.length > 0) {
      filtered = filtered.filter(service => filters.status.includes(service.status));
    }

    // Apply category filters
    if (filters.categories.length > 0) {
      filtered = filtered.filter(service => 
        service.categories?.some(category => filters.categories.includes(category))
      );
    }

    setFilteredServices(filtered);
  };

  const handleStatusChange = async (serviceId, newStatus) => {
    try {
      const response = await fetch(`https://biz-connect-livid.vercel.app/api/v1/services/${serviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedServices = services.map(service => 
          service._id === serviceId ? { ...service, status: newStatus } : service
        );
        setServices(updatedServices);
        setSnackbar({
          open: true,
          message: 'Status updated successfully',
          severity: 'success'
        });
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to update status',
        severity: 'error'
      });
    }
  };

  const handleDelete = async (serviceId) => {
    setDeleteDialog({ open: false, service: null });
    try {
      const response = await fetch(`https://biz-connect-livid.vercel.app/api/v1/services/${serviceId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setServices(services.filter(service => service._id !== serviceId));
        setSnackbar({
          open: true,
          message: 'Service deleted successfully',
          severity: 'success'
        });
      } else {
        throw new Error('Failed to delete service');
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to delete service',
        severity: 'error'
      });
    }
  };

  const renderServiceHours = (ServiceHours) => {
    if (!ServiceHours || typeof ServiceHours !== 'object') {
      return 'Not specified';
    }

    return (
      <Grid container spacing={1}>
        {Object.entries(ServiceHours).map(([day, hours]) => (
          <Grid item xs={12} sm={6} md={4} key={day}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="subtitle2" color="primary">
                  {day}
                </Typography>
                <Typography variant="body2">
                  {hours || 'Closed'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  const InfoRow = ({ icon, label, value, isMultiline = false }) => (
    <Box sx={{ display: 'flex', alignItems: isMultiline ? 'flex-start' : 'center', mb: 2 }}>
      {icon}
      <Box sx={{ ml: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body1">
          {value || 'Not specified'}
        </Typography>
      </Box>
    </Box>
  );

  // Get unique categories from all services
  const allCategories = [...new Set(services.flatMap(service => service.categories || []))];

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Services Management
        </Typography>
        
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setFilterDialog(true)}
          >
            Filters
          </Button>
        </Stack>

        {filters.status.length > 0 || filters.categories.length > 0 ? (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Active Filters:</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {filters.status.map(status => (
                <Chip
                  key={status}
                  label={status}
                  onDelete={() => setFilters({
                    ...filters,
                    status: filters.status.filter(s => s !== status)
                  })}
                  color={STATUS_COLORS[status]}
                  size="small"
                />
              ))}
              {filters.categories.map(category => (
                <Chip
                  key={category}
                  label={category}
                  onDelete={() => setFilters({
                    ...filters,
                    categories: filters.categories.filter(c => c !== category)
                  })}
                  size="small"
                />
              ))}
            </Stack>
          </Box>
        ) : null}
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={1} sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Service Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Contact</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredServices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body1" sx={{ py: 2 }}>
                      No services found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredServices.map((service) => (
                  <TableRow key={service._id} hover>
                    <TableCell>{service.serviceName}</TableCell>
                    <TableCell>{service.serviceContact}</TableCell>
                    <TableCell>{service.serviceEmail}</TableCell>
                    <TableCell>
                      <FormControl size="small">
                        <Select
                          value={service.status || 'Pending'}
                          onChange={(e) => handleStatusChange(service._id, e.target.value)}
                          sx={{
                            '& .MuiSelect-select': {
                              color: STATUS_COLORS[service.status || 'Pending'],
                              fontWeight: 'bold'
                            }
                          }}
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <MenuItem key={status} value={status}>
                              {status}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => {
                          setSelectedService(service);
                          setOpenDialog(true);
                        }}
                        color="primary"
                        size="small"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => setDeleteDialog({ open: true, service })}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* View Service Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          elevation: 3,
          sx: { borderRadius: 2 }
        }}
      >
        {selectedService && (
          <>
            <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider', pb: 2 }}>
              <Typography variant="h5" component="div">
                {selectedService.serviceName}
              </Typography>
              <Chip 
                label={selectedService.status || 'Pending'} 
                color={STATUS_COLORS[selectedService.status || 'Pending']}
                size="small"
                sx={{ mt: 1 }}
              />
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Basic Information</Typography>
                  <InfoRow 
                    icon={<BusinessIcon color="primary" />}
                    label="Business Details"
                    value={
                      <>
                        <Typography variant="body2">UIN: {selectedService.uin}</Typography>
                        <Typography variant="body2">GST: {selectedService.gst}</Typography>
                      </>
                    }
                    isMultiline
                  />
                  <InfoRow 
                    icon={<EmailIcon color="primary" />}
                    label="Email"
                    value={selectedService.serviceEmail}
                  />
                  <InfoRow 
                    icon={<PhoneIcon color="primary" />}
                    label="Contact"
                    value={selectedService.serviceContact}
                  />
                  <InfoRow 
                    icon={<LanguageIcon color="primary" />}
                    label="Website"
                    value={selectedService.serviceWebsite}
                  />
                  <InfoRow 
                    icon={<LocationOnIcon color="primary" />}
                    label="Address"
                    value={selectedService.serviceAddress}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Contact Person Details</Typography>
                  <InfoRow 
                    icon={<BusinessIcon color="primary" />}
                    label="Name"
                    value={selectedService.personName}
                  />
                  <InfoRow 
                    icon={<PhoneIcon color="primary" />}
                    label="Mobile"
                    value={selectedService.mobileNumber}
                  />
                  <InfoRow 
                    icon={<WhatsAppIcon color="primary" />}
                    label="WhatsApp"
                    value={selectedService.whatsappNumber}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    <AccessTimeIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Service Hours
                  </Typography>
                  {renderServiceHours(selectedService.ServiceHours)}
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <InfoRow 
                    icon={<CategoryIcon color="primary" />}
                    label="Categories"
                    value={
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                        {selectedService.categories?.map((category, index) => (
                          <Chip key={index} label={category} size="small" />
                        ))}
                      </Box>
                    }
                    isMultiline
                  />
                </Grid>

                <Grid item xs={12}>
                  <InfoRow 
                    icon={<DescriptionIcon color="primary" />}
                    label="Description"
                    value={selectedService.description}
                    isMultiline
                  />
                </Grid>

                {selectedService.images?.length > 0 && (
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" sx={{ mb: 2 }}>Images</Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      {selectedService.images.map((image, index) => (
                        <Paper
                          key={index}
                          elevation={2}
                          sx={{
                            width: 150,
                            height: 150,
                            overflow: 'hidden',
                            borderRadius: 2
                          }}
                        >
                          <img
                            src={image}
                            alt={`Service ${index + 1}`}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        </Paper>
                      ))}
                    </Box>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
              <Button 
                onClick={() => setOpenDialog(false)}
                variant="outlined"
                size="large"
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, service: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the service "{deleteDialog.service?.serviceName}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialog({ open: false, service: null })}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleDelete(deleteDialog.service?._id)}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog
        open={filterDialog}
        onClose={() => setFilterDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Filter Services</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>Status</Typography>
          <FormGroup>
            {STATUS_OPTIONS.map((status) => (
              <FormControlLabel
                key={status}
                control={
                  <Checkbox
                    checked={filters.status.includes(status)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters({
                          ...filters,
                          status: [...filters.status, status]
                        });
                      } else {
                        setFilters({
                          ...filters,
                          status: filters.status.filter(s => s !== status)
                        });
                      }
                    }}
                  />
                }
                label={status}
              />
            ))}
          </FormGroup>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" sx={{ mb: 2 }}>Categories</Typography>
          <FormGroup>
            {allCategories.map((category) => (
              <FormControlLabel
                key={category}
                control={
                  <Checkbox
                    checked={filters.categories.includes(category)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters({
                          ...filters,
                          categories: [...filters.categories, category]
                        });
                      } else {
                        setFilters({
                          ...filters,
                          categories: filters.categories.filter(c => c !== category)
                        });
                      }
                    }}
                  />
                }
                label={category}
              />
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setFilters({ status: [], categories: [] });
              setFilterDialog(false);
            }}
            variant="outlined"
          >
            Clear All
          </Button>
          <Button
            onClick={() => setFilterDialog(false)}
            variant="contained"
          >
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ServicesDashboard;