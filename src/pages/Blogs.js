import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  useMediaQuery,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Snackbar,
  Alert
} from "@mui/material";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "@mui/material/styles";

const OffersManagement = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [offers, setOffers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [offerTitle, setOfferTitle] = useState("");
  const [offerDescription, setOfferDescription] = useState("");
  const [image, setImage] = useState(null);
  const [editingOffer, setEditingOffer] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // Fetch offers on component mount
  useEffect(() => {
    fetchOffers();
  }, []);

  // Fetch offers from backend
  const fetchOffers = async () => {
    try {
      const response = await axios.get("https://biz-connect-livid.vercel.app/api/v1/offers");
      setOffers(response.data);
    } catch (error) {
      handleError("Failed to fetch offers", error);
    }
  }; 

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Prepare dialog for editing an offer
  const handleEditOffer = (offer) => {
    setEditingOffer(offer);
    setOfferTitle(offer.title);
    setOfferDescription(offer.description);
    setImage(offer.image);
    setOpenDialog(true);
  };

  // Handle save offer (create or update)
  const handleSave = async () => {
    if (!offerTitle || !offerDescription || !image) {
      handleError("Please provide an offer title, description, and upload an image.");
      return;
    }
    
    try {
      let response;
      if (editingOffer) {
        // Update existing offer
        response = await axios.put(`https://biz-connect-livid.vercel.app/api/v1/offers/${editingOffer._id}`, {
          title: offerTitle,
          description: offerDescription,
          image,
          creator: localStorage.getItem('userId') // Replace with actual user ID
        });
        
        // Update offer in state
        setOffers(offers.map(offer => 
          offer._id === editingOffer._id ? response.data.offer : offer
        ));
        
        handleSuccess("Offer updated successfully");
      } else {
        // Create new offer
        response = await axios.post("https://biz-connect-livid.vercel.app/api/v1/offers", {
          title: offerTitle,
          description: offerDescription,
          image,
          creator: localStorage.getItem('userId') // Replace with actual user ID
        });
        
        // Add new offer to state
        setOffers([...offers, response.data.offer]);
        
        handleSuccess("Offer created successfully");
      }
      
      // Reset form
      setOfferTitle("");
      setOfferDescription("");
      setImage(null);
      setOpenDialog(false);
      setEditingOffer(null);
    } catch (error) {
      handleError("Failed to save offer", error);
    }
  };

  // Handle delete offer
  const handleDeleteOffer = async (id) => {
    try {
      await axios.delete(`https://biz-connect-livid.vercel.app/api/v1/offers/${id}`);
      
      // Remove offer from state
      setOffers(offers.filter(offer => offer._id !== id));
      
      handleSuccess("Offer deleted successfully");
    } catch (error) {
      handleError("Failed to delete offer", error);
    }
  };

  // Handle error
  const handleError = (message, error = null) => {
    console.error(error);
    setSnackbar({
      open: true,
      message,
      severity: "error"
    });
  };

  // Handle success
  const handleSuccess = (message) => {
    setSnackbar({
      open: true,
      message,
      severity: "success"
    });
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ 
      padding: isSmallScreen ? "16px" : "24px", 
      maxWidth: '100%', 
      margin: "0 auto" 
    }}>
      {/* Create Offer Button */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: "24px"
      }}>
        <Typography 
          variant={isSmallScreen ? "h5" : "h4"} 
          sx={{ fontWeight: "bold", color: "#E53935" }}
        >
          Offers
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          sx={{
            backgroundColor: "#E53935",
            "&:hover": { backgroundColor: "#B71C1C" }
          }}
          onClick={() => {
            setEditingOffer(null);
            setOpenDialog(true);
          }}
        >
          Create Offer
        </Button>
      </Box>

      {/* Offers Grid */}
      <Grid container spacing={3}>
        {offers.map((offer) => (
          <Grid item xs={12} sm={6} md={4} key={offer._id}>
            <Card>
              <CardMedia
                component="img"
                height="194"
                image={offer.image}
                alt={offer.title}
              />
              <CardContent>
                <Typography variant="h6">{offer.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {offer.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  color="primary" 
                  startIcon={<EditIcon />}
                  onClick={() => handleEditOffer(offer)}
                >
                  Edit
                </Button>
                <Button 
                  color="error" 
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDeleteOffer(offer._id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Create/Edit Offer Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => {
          setOpenDialog(false);
          setEditingOffer(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingOffer ? "Edit Offer" : "Create New Offer"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Offer Title"
            variant="outlined"
            value={offerTitle}
            onChange={(e) => setOfferTitle(e.target.value)}
            sx={{ marginBottom: "24px", marginTop: "16px" }}
          />

          <TextField
            fullWidth
            label="Offer Description"
            variant="outlined"
            multiline
            rows={4}
            value={offerDescription}
            onChange={(e) => setOfferDescription(e.target.value)}
            sx={{ marginBottom: "24px" }}
          />

          {/* Upload Offer Image */}
          <Box
            sx={{
              width: "100%",
              height: 200,
              border: "2px dashed #ddd",
              borderRadius: "8px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "16px",
              overflow: "hidden",
              backgroundColor: "#f9f9f9",
            }}
          >
            {image ? (
              <img
                src={image}
                alt="Preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <ImageOutlinedIcon sx={{ fontSize: 60, color: "#ccc" }} />
            )}
          </Box>
          <Button
            fullWidth
            variant="contained"
            component="label"
            sx={{
              backgroundColor: "#E53935",
              color: "#fff",
              marginBottom: "16px",
              "&:hover": { backgroundColor: "#B71C1C" },
            }}
          >
            Upload the offer image
            <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
          </Button>

          {/* Dialog Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button 
              variant="outlined" 
              onClick={() => {
                setOpenDialog(false);
                setEditingOffer(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSave}
              sx={{
                backgroundColor: "#E53935",
                "&:hover": { backgroundColor: "#B71C1C" }
              }}
            >
              {editingOffer ? "Update Offer" : "Save Offer"}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Snackbar for Notifications */}
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
    </Box>
  );
};

export default OffersManagement;