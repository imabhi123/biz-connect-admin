import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  TextField,
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
  IconButton,
  Input
} from "@mui/material";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import LinkIcon from "@mui/icons-material/Link";
import ImageIcon from "@mui/icons-material/Image";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

const ConfirmDialog = ({ open, title, message, onConfirm, onCancel }) => (
  <Dialog open={open} onClose={onCancel}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>{message}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancel} color="primary">
        Cancel
      </Button>
      <Button onClick={onConfirm} color="error" variant="contained">
        Confirm
      </Button>
    </DialogActions>
  </Dialog>
);

const UploadBizReels = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [reels, setReels] = useState([]);
  const [currentReel, setCurrentReel] = useState({
    _id: null,
    videoUrl: "",
    thumbnailUrl: "",
    title: "",
    description: "",
    category: "",
    type: "short"
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    action: null,
    data: null
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const API_BASE_URL = 'https://biz-connect-livid.vercel.app/api/v1/reels';

  useEffect(() => {
    fetchReels();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const fetchReels = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setReels(response.data);
    } catch (error) {
      handleError('Failed to fetch reels', error);
    }
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        handleError('File size should be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        handleError('Please upload an image file');
        return;
      }

      setSelectedFile(file);
      
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      try {
        const base64String = await convertToBase64(file);
        setCurrentReel(prev => ({
          ...prev,
          thumbnailUrl: base64String
        }));
      } catch (error) {
        handleError('Failed to process image', error);
      }
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentReel(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    const { videoUrl, thumbnailUrl, title, description, category, type, _id } = currentReel;
    
    if (!videoUrl || !title) {
      handleError('Video URL and Title are required');
      return;
    }

    setConfirmDialog({
      open: true,
      title: isEditMode ? 'Confirm Update' : 'Confirm Upload',
      message: isEditMode 
        ? 'Are you sure you want to update this reel?'
        : 'Are you sure you want to upload this reel?',
      action: async () => {
        try {
          const reelData = {
            videoUrl,
            thumbnailUrl,
            title,
            description,
            category: category || 'Uncategorized',
            type: type || 'short',
            creator: localStorage.getItem('userId')
          };

          let response;
          if (isEditMode && _id) {
            response = await axios.put(`${API_BASE_URL}/${_id}`, reelData);
            setReels(prev => prev.map(reel => 
              reel._id === _id ? response.data.reel : reel
            ));
          } else {
            response = await axios.post(API_BASE_URL, reelData);
            setReels(prev => [...prev, response.data.reel]);
          }
          
          resetForm();
          handleSuccess(isEditMode ? 'Reel updated successfully' : 'Reel uploaded successfully');
          if(!isEditMode)setPreviewUrl(null);
        } catch (error) {
          handleError(isEditMode ? 'Failed to update reel' : 'Failed to upload reel', error);
        }
      }
    });
  };

  const handleDeleteClick = (id) => {
    setConfirmDialog({
      open: true,
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this reel? This action cannot be undone.',
      action: () => handleDeleteReel(id)
    });
  };

  const handleDeleteReel = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      setReels(prev => prev.filter(reel => reel._id !== id));
      handleSuccess('Reel deleted successfully');
    } catch (error) {
      handleError('Failed to delete reel', error);
    }
  };

  const handleEditReel = (reel) => {
    if (currentReel._id && isDialogOpen) {
      setConfirmDialog({
        open: true,
        title: 'Unsaved Changes',
        message: 'You have unsaved changes. Do you want to discard them?',
        action: () => {
          setCurrentReel({
            _id: reel._id,
            videoUrl: reel.videoUrl,
            thumbnailUrl: reel.thumbnailUrl,
            title: reel.title,
            description: reel.description,
            category: reel.category,
            type: reel.type
          });
          setIsEditMode(true);
          setIsDialogOpen(true);
        }
      });
    } else {
      setCurrentReel({
        _id: reel._id,
        videoUrl: reel.videoUrl,
        thumbnailUrl: reel.thumbnailUrl,
        title: reel.title,
        description: reel.description,
        category: reel.category,
        type: reel.type
      });
      setIsEditMode(true);
      setIsDialogOpen(true);
    }
  };

  const handleDialogClose = () => {
    if (currentReel.videoUrl || currentReel.title || currentReel.description || selectedFile) {
      setConfirmDialog({
        open: true,
        title: 'Discard Changes',
        message: 'Are you sure you want to discard your changes?',
        action: () => {
          resetForm();
          setSelectedFile(null);
          if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
          }
        }
      });
    } else {
      resetForm();
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    }
  };

  const resetForm = () => {
    setCurrentReel({
      _id: null,
      videoUrl: "",
      thumbnailUrl: "",
      title: "",
      description: "",
      category: "",
      type: "short"
    });
    setIsDialogOpen(false);
    setIsEditMode(false);
  };

  const handleSuccess = (message) => {
    setSnackbar({ 
      open: true, 
      message, 
      severity: 'success' 
    });
  };

  const handleError = (message, error) => {
    console.error(error);
    setSnackbar({ 
      open: true, 
      message, 
      severity: 'error' 
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleConfirmDialogClose = () => {
    setConfirmDialog(prev => ({ ...prev, open: false }));
  };

  const handleConfirmAction = async () => {
    if (confirmDialog.action) {
      await confirmDialog.action();
    }
    handleConfirmDialogClose();
  };

  return (
    <Box sx={{ minHeight: "calc(100vh - 100px)", backgroundColor: "#f4f4f4", padding: 2 }}>
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={3}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              backgroundColor: "#FF3D00",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mr: 1,
            }}
          >
            <VideoLibraryIcon sx={{ color: "#fff", fontSize: 30 }} />
          </Box>
          <Typography variant="h5" fontWeight="600" color="#FF3D00">
            Biz Reels Gallery
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          color="error"
          onClick={() => {
            setIsEditMode(false);
            setIsDialogOpen(true);
          }}
        >
          Add Reel
        </Button>
      </Box>

      <Grid container spacing={3}>
        {reels.map((reel) => (
          <Grid item xs={12} sm={6} md={4} key={reel._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                image={reel.thumbnailUrl || 'default-thumbnail.jpg'}
                alt="Reel Thumbnail"
                sx={{ aspectRatio: '16/9', objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{reel.title?.substring(0,40)}{reel.title?.length>40?'...':''}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {reel.description?.substring(0,300)}{reel.description?.length>300?'...':''}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Category: {reel.category}
                  {' | '}
                  Type: {reel.type}
                </Typography>
              </CardContent>
              <CardActions>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <Box>
                    <Typography variant="caption">
                      Likes: {reel.likes || 0}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton 
                      color="primary"
                      onClick={() => window.open(reel.videoUrl, '_blank')}
                    >
                      <LinkIcon />
                    </IconButton>
                    <IconButton 
                      color="primary"
                      onClick={() => handleEditReel(reel)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error"
                      onClick={() => handleDeleteClick(reel._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog 
        open={isDialogOpen} 
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            {isEditMode ? 'Edit Biz Reel' : 'Upload Biz Reel'}
            <IconButton onClick={handleDialogClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            name="videoUrl"
            label="Video URL"
            fullWidth
            value={currentReel.videoUrl}
            onChange={handleInputChange}
            required
            sx={{ mb: 2, mt: 2 }}
          />

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Thumbnail Image
            </Typography>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              sx={{ display: 'none' }}
              id="thumbnail-upload"
            />
            <label htmlFor="thumbnail-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<ImageIcon />}
                sx={{ mb: 1 }}
              >
                Choose Image
              </Button>
            </label>
            {previewUrl && (
              <Box sx={{ mt: 1, position: 'relative' }}>
                <img
                  src={previewUrl}
                  alt="Thumbnail preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '200px',
                    objectFit: 'contain'
                  }}
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bgcolor: 'rgba(255, 255, 255, 0.8)'
                  }}
                  onClick={() => {
                    setSelectedFile(null);
                    URL.revokeObjectURL(previewUrl);
                    setPreviewUrl(null);
                    setCurrentReel(prev => ({
                      ...prev,
                      thumbnailUrl: ''
                    }));
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
          </Box>

          <TextField
            name="title"
            label="Title"
            fullWidth
            value={currentReel.title}
            onChange={handleInputChange}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            name="description"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={currentReel.description}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />

          <TextField
            name="category"
            label="Category"
            fullWidth
            value={currentReel.category}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />

          <TextField
            name="type"
            label="Type"
            select
            fullWidth
            value={currentReel.type}
            onChange={handleInputChange}
            SelectProps={{ native: true }}
            sx={{ mb: 2 }}
          >
            <option value="short">Short</option>
            <option value="long">Long</option>
          </TextField>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
            disabled={!currentReel.videoUrl || !currentReel.title}
          >
            {isEditMode ? 'Update' : 'Submit'}
          </Button>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={handleConfirmAction}
        onCancel={handleConfirmDialogClose}
      />

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

      <Typography
        variant="caption"
        fontWeight="500"
        color="#FF3D00"
        sx={{ mt: 3, display: "block", textAlign: "center" }}
      >
        Biz-Network
      </Typography>
    </Box>
  );
};

export default UploadBizReels;