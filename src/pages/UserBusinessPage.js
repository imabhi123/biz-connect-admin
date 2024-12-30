import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  TextField,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ImageList,
  ImageListItem
} from '@mui/material';
import { 
  Visibility as EyeIcon, 
  Delete as DeleteIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';

const StatusChip = ({ status }) => {
  const statusColors = {
    Pending: 'warning',
    Approved: 'success',
    Rejected: 'error'
  };
  return (
    <Chip 
      label={status} 
      color={statusColors[status] || 'default'} 
      size="small" 
      variant="outlined"
    />
  );
};

const BusinessTable = ({ businesses, onStatusUpdate, onDelete, onView, showStatusControl }) => (
  <TableContainer component={Paper} elevation={0}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Business Name</TableCell>
          <TableCell>Contact Person</TableCell>
          <TableCell>City</TableCell>
          <TableCell>State</TableCell>
          <TableCell>Status</TableCell>
          <TableCell align="right">Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {businesses.map((business) => (
          <TableRow hover key={business._id}>
            <TableCell>{business.businessName || 'N/A'}</TableCell>
            <TableCell>{business.personName || 'N/A'}</TableCell>
            <TableCell>{business.city || 'N/A'}</TableCell>
            <TableCell>{business.state || 'N/A'}</TableCell>
            <TableCell>
              {showStatusControl && business.step === 6 ? (
                <FormControl fullWidth variant="outlined" size="small">
                  <Select
                    value={business.status || 'Pending'}
                    onChange={(e) => onStatusUpdate(business._id, e.target.value)}
                    renderValue={(selected) => (
                      <StatusChip status={selected} />
                    )}
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Approved">Approved</MenuItem>
                    <MenuItem value="Rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
              ) : (
                <StatusChip status={business.status || 'Pending'} />
              )}
            </TableCell>
            <TableCell align="right">
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton 
                  color="primary" 
                  onClick={() => onView(business)}
                >
                  <EyeIcon />
                </IconButton>
                <IconButton 
                  color="error" 
                  onClick={() => onDelete(business._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const AdminBusinessDetails = ({ userId }) => {
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState({ completed: [], incomplete: [] });
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchUserBusinesses(userId);
    } else {
      fetchAllBusinesses();
    }
  }, [userId]);

  useEffect(() => {
    filterBusinesses();
  }, [businesses, searchTerm, statusFilter]);

  const fetchUserBusinesses = async (userId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://biz-connect-livid.vercel.app/api/v1/business/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch businesses');
      const data = await response.json();
      setBusinesses(data.data);
    } catch (err) {
      setError(err.message);
      setBusinesses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllBusinesses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://biz-connect-livid.vercel.app/api/v1/business');
      if (!response.ok) throw new Error('Failed to fetch businesses');
      const data = await response.json();
      setBusinesses(data.data);
    } catch (err) {
      setError(err.message);
      setBusinesses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterBusinesses = () => {
    let filtered = [...businesses];
    
    if (searchTerm) {
      filtered = filtered.filter(business => 
        business.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.personName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.city?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'All') {
      filtered = filtered.filter(business => business.status === statusFilter);
    }
    
    setFilteredBusinesses({
      completed: filtered.filter(business => business.step === 6),
      incomplete: filtered.filter(business => business.step !== 6)
    });
  };

  const handleStatusUpdate = async (businessId, newStatus) => {
    try {
      const response = await fetch(`https://biz-connect-livid.vercel.app/api/v1/business/${businessId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update business status');
      
      if (userId) {
        fetchUserBusinesses(userId);
      } else {
        fetchAllBusinesses();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteBusiness = async (businessId) => {
    try {
      const response = await fetch(`https://biz-connect-livid.vercel.app/api/v1/business/${businessId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete business');
      
      if (userId) {
        fetchUserBusinesses(userId);
      } else {
        fetchAllBusinesses();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Business Management
        </Typography>

        <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search businesses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="All">All Statuses</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {isLoading ? (
          <Typography>Loading businesses...</Typography>
        ) : (
          <>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">
                  Completed Businesses ({filteredBusinesses.completed.length})
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {filteredBusinesses.completed.length > 0 ? (
                  <BusinessTable 
                    businesses={filteredBusinesses.completed}
                    onStatusUpdate={handleStatusUpdate}
                    onDelete={handleDeleteBusiness}
                    onView={setSelectedBusiness}
                    showStatusControl={true}
                  />
                ) : (
                  <Typography>No completed businesses found</Typography>
                )}
              </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded sx={{ mt: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">
                  Incomplete Business Profiles ({filteredBusinesses.incomplete.length})
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {filteredBusinesses.incomplete.length > 0 ? (
                  <BusinessTable 
                    businesses={filteredBusinesses.incomplete}
                    onStatusUpdate={handleStatusUpdate}
                    onDelete={handleDeleteBusiness}
                    onView={setSelectedBusiness}
                    showStatusControl={false}
                  />
                ) : (
                  <Typography>No incomplete businesses found</Typography>
                )}
              </AccordionDetails>
            </Accordion>
          </>
        )}
      </Paper>

      {selectedBusiness && (
        <Dialog
          open={!!selectedBusiness}
          onClose={() => setSelectedBusiness(null)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Business Details
            <StatusChip 
              status={selectedBusiness.status || 'Pending'} 
              sx={{ ml: 2 }} 
            />
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
                <Typography variant="body1">
                  <strong>Name:</strong> {selectedBusiness.businessName || 'N/A'}
                </Typography>
                <Typography variant="body1">
                  <strong>Location:</strong> {selectedBusiness.city || 'N/A'}, {selectedBusiness.state || 'N/A'}
                </Typography>
                <Typography variant="body1">
                  <strong>Pincode:</strong> {selectedBusiness.pincode || 'N/A'}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Contact Details
                </Typography>
                <Typography variant="body1">
                  <strong>Contact Person:</strong> {selectedBusiness.personName || 'N/A'}
                </Typography>
                <Typography variant="body1">
                  <strong>Mobile:</strong> {selectedBusiness.mobileNumber || 'N/A'}
                </Typography>
                <Typography variant="body1">
                  <strong>Email:</strong> {selectedBusiness.email || 'N/A'}
                </Typography>
              </Grid>

              {selectedBusiness.businessHours?.days?.length > 0 && (
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Business Hours
                  </Typography>
                  <Typography variant="body1">
                    Days: {selectedBusiness.businessHours.days.join(', ')}
                    <br />
                    {selectedBusiness.businessHours.openingTime && 
                      `Hours: ${selectedBusiness.businessHours.openingTime} - ${selectedBusiness.businessHours.closingTime}`}
                  </Typography>
                </Grid>
              )}

              {selectedBusiness.categories?.length > 0 && (
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Categories
                  </Typography>
                  <Typography variant="body1">
                    {selectedBusiness.categories.join(', ')}
                  </Typography>
                </Grid>
              )}

              {selectedBusiness.description && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Description
                  </Typography>
                  <Typography variant="body1">
                    {selectedBusiness.description}
                  </Typography>
                </Grid>
              )}

              {selectedBusiness.images && selectedBusiness.images.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Business Images
                  </Typography>
                  <ImageList cols={3} gap={8}>
                    {selectedBusiness.images.map((image, index) => (
                      <ImageListItem 
                        key={index}
                        onClick={() => setSelectedImage(image)}
                        sx={{ cursor: 'pointer' }}
                      >
                        <img
                          src={image}
                          alt={`Business image ${index + 1}`}
                          loading="lazy"
                          style={{ 
                            width: '100%', 
                            height: '200px', 
                            objectFit: 'cover' 
                          }}
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                </Grid>
              )}
            </Grid>
          </DialogContent>
        </Dialog>
      )}

      {/* Image Preview Dialog */}
      <Dialog
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        maxWidth="lg"
      >
        <DialogContent>
          <img
            src={selectedImage}
            alt="Business image preview"
            style={{ 
              width: '100%',
              height: 'auto',
              maxHeight: '80vh',
              objectFit: 'contain'
            }}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default AdminBusinessDetails;