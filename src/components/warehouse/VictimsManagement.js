import React, { useState, useEffect } from "react";
import axios from 'axios';
import {
  Box,
  Button,
  IconButton,
  TextField,
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Skeleton,
  CircularProgress,
  Link
} from "@mui/material";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import ImageIcon from "@mui/icons-material/Image";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const NEWS_CATEGORIES = ['All', 'General', 'Health', 'Sports', 'Technology', 'Hot News'];
const NEWS_TYPES = ['Regular', 'HotNews', 'Breaking', 'Featured'];
const MAX_PDF_SIZE = 200 * 1024; // 200KB in bytes

const NewsUploadComponent = () => {
  const isMobile = useMediaQuery("(max-width:600px)");

  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [newsItems, setNewsItems] = useState([]);
  const [currentNews, setCurrentNews] = useState({
    _id: null,
    image: null,
    imageUrl: "",
    description: "",
    title: "",
    category: "",
    dateAndTime: new Date(),
    source: "",
    author: "",
    newstype: "",
    newsPdf: null,
    newsPdfName: ""
  });
  const [selectedNewsForDeletion, setSelectedNewsForDeletion] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // Fetch news items on component mount
  useEffect(() => {
    fetchNewsItems();
  }, []);

  // Fetch news items from API
  const fetchNewsItems = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://biz-connect-livid.vercel.app/api/v1/news');
      setNewsItems(response.data.data);
    } catch (error) {
      handleError("Failed to fetch news items", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Truncate text helper
  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  // Handle image upload and convert to base64
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentNews(prev => ({ 
          ...prev, 
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle PDF upload
  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > MAX_PDF_SIZE) {
        handleError("PDF file size must be less than 200KB");
        e.target.value = ''; // Reset input
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentNews(prev => ({
          ...prev,
          newsPdf: reader.result,
          newsPdfName: file.name
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validate inputs
    if (!currentNews.title || !currentNews.category || !currentNews.description || 
        !currentNews.author || !currentNews.source || 
        !currentNews.newstype) {
      handleError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    // Prepare data for submission
    const newsData = {
      ...currentNews
    };

    try {
      let response;
      if (isEditMode) {
        response = await axios.put(`https://biz-connect-livid.vercel.app/api/v1/news/${currentNews._id}`, newsData);
        setNewsItems(prev => prev.map(item => 
          item._id === currentNews._id ? response.data.news : item
        ));
      } else {
        response = await axios.post('https://biz-connect-livid.vercel.app/api/v1/news', newsData);
        setNewsItems(prev => [...prev, response.data.news]);
      }

      resetForm();
      setSnackbar({
        open: true,
        message: isEditMode ? "News item updated successfully" : "News item created successfully",
        severity: "success"
      });
    } catch (error) {
      handleError(isEditMode ? "Failed to update news item" : "Failed to create news item", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setCurrentNews({
      _id: null,
      image: null,
      description: "",
      title: "",
      category: "",
      dateAndTime: new Date(),
      source: "",
      author: "",
      newstype: "",
      newsPdf: null,
      newsPdfName: ""
    });
    setIsDialogOpen(false);
    setIsEditMode(false);
  };

  // Handle news item deletion
  const handleDeleteNews = async () => {
    if (!selectedNewsForDeletion) return;

    setIsSubmitting(true);
    try {
      await axios.delete(`https://biz-connect-livid.vercel.app/api/v1/news/${selectedNewsForDeletion}`);
      setNewsItems(prev => prev.filter(item => item._id !== selectedNewsForDeletion));
      setIsDeleteConfirmOpen(false);
      setSelectedNewsForDeletion(null);
      setSnackbar({
        open: true,
        message: "News item deleted successfully",
        severity: "success"
      });
    } catch (error) {
      handleError("Failed to delete news item", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit news item
  const handleEditNews = (item) => {
    setCurrentNews({
      ...item,
      dateAndTime: new Date(item.dateAndTime)
    });
    setIsEditMode(true);
    setIsDialogOpen(true);
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
    setSelectedNewsForDeletion(id);
    setIsDeleteConfirmOpen(true);
  };

  // Loading skeleton for cards
  const CardSkeleton = () => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Skeleton variant="rectangular" height={200} />
      <CardContent sx={{ flexGrow: 1 }}>
        <Skeleton variant="text" height={32} width="80%" />
        <Skeleton variant="text" height={20} width="100%" />
        <Skeleton variant="text" height={20} width="60%" />
        <Skeleton variant="text" height={20} width="40%" />
      </CardContent>
      <CardActions>
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="circular" width={40} height={40} />
      </CardActions>
    </Card>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="" sx={{ padding: 3, bgcolor: "white" }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box display="flex" alignItems="center">
            <IconButton
              sx={{
                bgcolor: "black",
                width: 60,
                height: 60,
                borderRadius: "50%",
                color: "white",
                fontSize: "1.5rem",
                marginRight: 2,
              }}
            >
              <Typography variant="h5" fontWeight="bold">N</Typography>
            </IconButton>
            <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold" color="error">
              News Gallery
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            color="error"
            onClick={() => {
              resetForm();
              setIsDialogOpen(true);
            }}
          >
            Add News
          </Button>
        </Box>

        {/* News Gallery Grid */}
        <Grid container spacing={3}>
          {isLoading ? (
            // Show skeletons while loading
            Array.from(new Array(6)).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <CardSkeleton />
              </Grid>
            ))
          ) : (
            // Show actual news items
            newsItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item._id}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  '& .MuiCardContent-root': {
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '280px'
                  }
                }}>
                  <CardMedia
                    component="img"
                    height={200}
                    image={item.image || item.imageUrl}
                    alt="News Image"
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      lineHeight: '1.2em',
                      height: '2.4em'
                    }}>
                      {item.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        mb: 1,
                        flexGrow: 1
                      }}
                    >
                      {item.description}
                    </Typography>
                    <Box sx={{ mt: 'auto' }}>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Category: {item.category}
                      </Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        By {truncateText(item.author, 20)} | {truncateText(item.source, 20)}
                      </Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        {new Date(item.dateAndTime).toLocaleString()}
                      </Typography>
                      {item.newsPdf && (
                        <Link
                          href={item.newsPdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ display: 'flex', alignItems: 'center', mt: 1 }}
                        >
                          <PictureAsPdfIcon sx={{ mr: 1, fontSize: 16 }} />
                          <Typography variant="caption">View PDF</Typography>
                        </Link>
                      )}
                    </Box>
                  </CardContent>
                  <CardActions>
                    <IconButton 
                      color="primary" 
                      onClick={() => handleEditNews(item)}
                      disabled={isSubmitting}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => openDeleteConfirmation(item._id)}
                      disabled={isSubmitting}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        {/* Upload/Edit News Dialog */}
        <Dialog
          open={isDialogOpen}
          onClose={() => !isSubmitting && setIsDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Typography variant="h6" color="error">
                {isEditMode ? 'Edit News' : 'Upload News'}
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              {/* Title Section */}
              <Grid item xs={12}>
                <Typography variant="body1" mb={1}>Title</Typography>
                <TextField
                  variant="outlined"
                  placeholder="Enter title"
                  fullWidth
                  value={currentNews.title}
                  onChange={(e) => setCurrentNews(prev => ({
                    ...prev,
                    title: e.target.value
                  }))}
                  disabled={isSubmitting}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              </Grid>

              {/* Author and Source Section */}
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" mb={1}>Author</Typography>
                <TextField
                  variant="outlined"
                  placeholder="Enter author name"
                  fullWidth
                  value={currentNews.author}
                  onChange={(e) => setCurrentNews(prev => ({
                    ...prev,
                    author: e.target.value
                  }))}
                  disabled={isSubmitting}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body1" mb={1}>Source</Typography>
                <TextField
                  variant="outlined"
                  placeholder="Enter news source"
                  fullWidth
                  value={currentNews.source}
                  onChange={(e) => setCurrentNews(prev => ({
                    ...prev,
                    source: e.target.value
                  }))}
                  disabled={isSubmitting}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              </Grid>

              {/* Category and News Type Section */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="category-select-label">Category</InputLabel>
                  <Select
                    labelId="category-select-label"
                    id="category-select"
                    value={currentNews.category}
                    label="Category"
                    onChange={(e) => setCurrentNews(prev => ({
                      ...prev,
                      category: e.target.value
                    }))}
                    disabled={isSubmitting}
                    sx={{ borderRadius: 2 }}
                  >
                    {NEWS_CATEGORIES.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="newstype-select-label">News Type</InputLabel>
                  <Select
                    labelId="newstype-select-label"
                    id="newstype-select"
                    value={currentNews.newstype}
                    label="News Type"
                    onChange={(e) => setCurrentNews(prev => ({
                      ...prev,
                      newstype: e.target.value
                    }))}
                    disabled={isSubmitting}
                    sx={{ borderRadius: 2 }}
                  >
                    {NEWS_TYPES.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Upload Image Section */}
              <Grid item xs={12}>
                <Typography variant="body1" mb={1}>Upload an image</Typography>
                <Box
                  sx={{
                    width: '100%',
                    height: 200,
                    border: "2px dashed #ddd",
                    borderRadius: 2,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mb: 2,
                    overflow: "hidden",
                    backgroundColor: "#f9f9f9",
                    position: "relative"
                  }}
                >
                  {currentNews.image ? (
                    <img
                      src={currentNews.image}
                      alt="Preview"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <ImageIcon sx={{ fontSize: 40, color: "gray" }} />
                  )}
                  {isSubmitting && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.7)'
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  )}
                </Box>
                <Button
                  variant="contained"
                  component="label"
                  color="error"
                  disabled={isSubmitting}
                  sx={{ textTransform: "none", px: 4, float: "right" }}
                >
                  Select Image
                  <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                </Button>
              </Grid>

              {/* Upload PDF Section */}
              <Grid item xs={12}>
                <Typography variant="body1" mb={1}>Upload PDF (max 200KB)</Typography>
                <Box
                  sx={{
                    width: '100%',
                    minHeight: 100,
                    border: "2px dashed #ddd",
                    borderRadius: 2,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mb: 2,
                    p: 2,
                    backgroundColor: "#f9f9f9",
                    flexDirection: 'column',
                    gap: 1
                  }}
                >
                  {currentNews.newsPdf ? (
                    <>
                      <PictureAsPdfIcon sx={{ fontSize: 40, color: "error.main" }} />
                      <Typography variant="body2" color="text.secondary">
                        {currentNews.newsPdfName}
                      </Typography>
                    </>
                  ) : (
                    <AttachFileIcon sx={{ fontSize: 40, color: "gray" }} />
                  )}
                </Box>
                <Button
                  variant="contained"
                  component="label"
                  color="error"
                  disabled={isSubmitting}
                  sx={{ textTransform: "none", px: 4, float: "right" }}
                >
                  Select PDF
                  <input type="file" accept="application/pdf" hidden onChange={handlePdfUpload} />
                </Button>
              </Grid>

              {/* Description Section */}
              <Grid item xs={12}>
                <Typography variant="body1" mb={1}>Description</Typography>
                <TextField
                  variant="outlined"
                  multiline
                  rows={3}
                  placeholder="Enter description"
                  fullWidth
                  value={currentNews.description}
                  onChange={(e) => setCurrentNews(prev => ({
                    ...prev,
                    description: e.target.value
                  }))}
                  disabled={isSubmitting}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              </Grid>
              {/* Submit Button */}
              <Grid item xs={12}>
                <Box textAlign="center">
                  <Button
                    variant="contained"
                    color="error"
                    disabled={isSubmitting}
                    sx={{ 
                      textTransform: "none", 
                      px: 5, 
                      py: 1, 
                      fontSize: "1rem",
                      position: 'relative'
                    }}
                    onClick={handleSubmit}
                  >
                    {isSubmitting ? (
                      <>
                        <CircularProgress
                          size={24}
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            marginTop: '-12px',
                            marginLeft: '-12px',
                          }}
                        />
                        {isEditMode ? 'Updating...' : 'Submitting...'}
                      </>
                    ) : (
                      isEditMode ? 'Update' : 'Submit'
                    )}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog 
          open={isDeleteConfirmOpen} 
          onClose={() => !isSubmitting && setIsDeleteConfirmOpen(false)}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this news item? 
              This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setIsDeleteConfirmOpen(false)} 
              color="primary"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteNews} 
              color="error" 
              disabled={isSubmitting}
              sx={{ position: 'relative' }}
            >
              {isSubmitting ? (
                <>
                  <CircularProgress
                    size={24}
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      marginTop: '-12px',
                      marginLeft: '-12px',
                    }}
                  />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
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
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Footer */}
        <Box textAlign="center" mt={4}>
          <Typography variant="subtitle1" color="error">
            Biz-Network
          </Typography>
        </Box>
      </Container>
    </LocalizationProvider>
  );
};

export default NewsUploadComponent;