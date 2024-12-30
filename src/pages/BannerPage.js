import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Paper,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
  IconButton,
  Snackbar
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Close as CloseIcon
} from '@mui/icons-material';

// Configure axios defaults
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://biz-connect-livid.vercel.app/api/v1',
  headers: {
    'Content-Type': 'application/json',
    // Add any authentication headers if needed
    // 'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

const AdminBannerPage = () => {
  const [banners, setBanners] = useState([]);
  const [page, setPage] = useState('Home');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch banners on load
  useEffect(() => {
    fetchBanners();
  }, []);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const response = await api.get('/banner-images/banners');
      setBanners(response.data);
    } catch (err) {
      setError('Failed to fetch banners. ' + (err.response?.data?.message || ''));
      console.error('Fetch banners error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const newFiles = [...e.target.files];
    // Limit to 5 images
    const limitedFiles = newFiles.slice(0, 5);

    // Optional: Add file type and size validation
    const validFiles = limitedFiles.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      return validTypes.includes(file.type) && file.size <= maxSize;
    });

    setImages(validFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!page) {
      return setError('Page name is required.');
    }
    if (images.length === 0) {
      return setError('Please select at least one image.');
    }

    try {
      setLoading(true);
      
      // Convert images to base64
      const base64Images = await Promise.all(
        images.map(async (file) => await fileToBase64(file))
      );

      // Send request with base64 images
      const response = await api.post('/banner-images/banners/upload', {
        page:'Home',
        images: base64Images
      });

      handleSnackbarOpen(`images submitted successfully`, 'success');

      // Reset form
      fetchBanners();
      setPage('');
      setImages([]);
      
    } catch (err) {
      setError('Failed to upload banner. ' + (err.response?.data?.message || ''));
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirmOpen = (bannerPage) => {
    setBannerToDelete(bannerPage);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
    setBannerToDelete(null);
  };
  const handleSnackbarOpen = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/banner-images/banners/${bannerToDelete}`);
      handleSnackbarOpen(`banner deleted successfully`, 'success');
      fetchBanners();
      handleDeleteConfirmClose();
    } catch (err) {
      setError('Failed to delete banner. ' + (err.response?.data?.message || ''));
      console.error('Delete error:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        sx={{
          fontWeight: 'bold',
          mb: 4,
          color: 'primary.main',
          textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
        }}
      >
        Admin Banner Management
      </Typography>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setError('')}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {error}
        </Alert>
      )}

      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          transition: 'box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: 6
          }
        }}
      >
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Page Name"
                variant="outlined"
                value={'Home'}
                disabled
                onChange={(e) => setPage(e.target.value)}
                placeholder="Enter page name (e.g., homepage)"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                fullWidth
                sx={{ height: '100%' }}
              >
                Upload Images (Max 5)
                <input
                  type="file"
                  multiple
                  hidden
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/gif"
                />
              </Button>
            </Grid>

            {/* Image Preview Section */}
            {images.length > 0 && (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                  {images.map((file, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: 'relative',
                        width: 100,
                        height: 100,
                        borderRadius: 2,
                        overflow: 'hidden'
                      }}
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      <Tooltip title="Remove Image">
                        <IconButton
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            color: 'error.main',
                            bgcolor: 'rgba(255,255,255,0.7)',
                            '&:hover': {
                              bgcolor: 'rgba(255,255,255,0.9)'
                            }
                          }}
                          onClick={() => removeImage(index)}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ))}
                </Box>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                startIcon={loading ? <CircularProgress size={24} /> : <CloudUploadIcon />}
                sx={{
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 3
                  }
                }}
              >
                {loading ? 'Uploading...' : 'Upload Banner'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Typography
        variant="h5"
        component="h2"
        sx={{
          mb: 3,
          color: 'primary.main',
          borderBottom: '2px solid',
          borderColor: 'primary.main',
          pb: 1
        }}
      >
        Existing Banners
      </Typography>

      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {!loading && banners.length === 0 && (
        <Typography
          variant="body1"
          color="textSecondary"
          align="center"
          sx={{
            p: 3,
            border: '1px dashed',
            borderColor: 'grey.300',
            borderRadius: 2
          }}
        >
          No banners available. Upload your first banner!
        </Typography>
      )}

      <Grid container spacing={3}>
        {banners.map((banner) => (
          <Grid item xs={12} md={6} key={banner.page}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: 4
                }
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                {banner.page}
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDeleteConfirmOpen(banner.page)}
                >
                  Delete
                </Button>
              </Typography>
              <Grid container spacing={1} sx={{ mb: 2 }}>
                {banner.images.map((img, index) => {
                  console.log(img)
                  return (
                  <Grid item key={index}>
                    <Box
                      component="img"
                      src={`${img.imageBase64}`}
                      alt={banner.page}
                      sx={{
                        width: 100,
                        height: 100,
                        objectFit: 'cover',
                        borderRadius: 2,
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.1)'
                        }
                      }}
                    />
                  </Grid>
                )})}
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteConfirmClose}
        aria-labelledby="delete-banner-dialog-title"
        aria-describedby="delete-banner-dialog-description"
      >
        <DialogTitle id="delete-banner-dialog-title">
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-banner-dialog-description">
            Are you sure you want to delete the banner for {bannerToDelete}?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDeleteConfirmClose}
            color="primary"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminBannerPage;