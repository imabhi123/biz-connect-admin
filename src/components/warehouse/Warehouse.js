import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  RadioGroup,
  Radio,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { CalendarMonth, Person } from "@mui/icons-material";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [alternativeContact, setAlternativeContact] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [joinedBizNetwork, setJoinedBizNetwork] = useState("");
  const [designation, setDesignation] = useState("");

  const fetchProfile = async () => {
    try {
      const response = await fetch('https://biz-connect-livid.vercel.app/api/v1/admin/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: localStorage.getItem('accessToken') })
      });
      const resJson = await response.json();
      
      if (resJson.user) {
        console.log(resJson.user)
        setUserData(resJson.user);
        
        // Populate form state with user data
        setEmail(resJson.user.username || '');
        setAlternativeContact(resJson.user.mobile || '');
        setGender(resJson.user.gender || '');
        
        // Format dates
        const formatDate = (dateString) => {
          return dateString ? new Date(dateString).toISOString().split('T')[0] : '';
        };
        
        setDateOfBirth(formatDate(resJson.user.dateOfBirth));
        setJoinedBizNetwork(formatDate(resJson.user.bizConnectJoiningDate));
        
        // You might want to add logic to set a default name or designation
        // This depends on how your backend provides this information
        setName(resJson.user.fullName || 'Not Provided');
        setDesignation('Admin'); // Default designation based on the data
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (
      !name ||
      !email ||
      !alternativeContact ||
      !dateOfBirth ||
      !joinedBizNetwork
    ) {
      alert("Please fill in all fields!");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('https://biz-connect-livid.vercel.app/api/v1/admin/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          fullName:name,
          email,
          mobile: alternativeContact,
          gender,
          dateOfBirth,
          bizConnectJoiningDate: joinedBizNetwork,
          token:localStorage.getItem('accessToken')
        })
      });
      const result = await response.json();
      
      if (result.success) {
        
      } else {
        alert(result.message || "Failed to update profile");
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert("An error occurred while updating the profile");
    } finally {
      setIsLoading(false);
    }
  };

  // Added debugging log for isEditing state
  useEffect(() => {
    console.log('Current editing state:', isEditing);
  }, [isEditing]);

  const handleEditClick = () => {
    console.log('Edit button clicked');
    setIsEditing(true);
  };

  const isFormValid =
    name &&
    email &&
    alternativeContact &&
    dateOfBirth &&
    joinedBizNetwork;

  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f4f4f4",
        p: 4,
        borderRadius: 2,
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        maxWidth: 500,
        mx: "auto",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 4,
        }}
      >
        <IconButton
          sx={{
            bgcolor: "black",
            color: "red",
            mb: 2,
            "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
          }}
        >
          <Person />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Profile
        </Typography>
      </Box>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <TextField
          label="Name"
          variant="outlined"
          value={name}
          disabled={!isEditing}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          variant="outlined"
          value={email}
          disabled={!isEditing}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          type="email"
        />
        <TextField
          label="Alternative Contact"
          variant="outlined"
          disabled={!isEditing}
          value={alternativeContact}
          onChange={(e) => setAlternativeContact(e.target.value)}
          fullWidth
          margin="normal"
          type="tel"
        />
        <RadioGroup
          row
          aria-label="gender"
          name="gender"
          disabled={!isEditing}
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          sx={{ mb: 2 }}
        >
          <Box display="flex" alignItems="center" mr={2}>
            <Radio disabled={!isEditing} value="Male" />
            <Typography>Male</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Radio disabled={!isEditing} value="Female" />
            <Typography>Female</Typography>
          </Box>
        </RadioGroup>
        <Box display="flex" alignItems="center" mb={2}>
          <CalendarMonth sx={{ mr: 1 }} />
          <TextField
            label="Date of Birth"
            disabled={!isEditing}
            variant="outlined"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            fullWidth
            type="date"
            InputLabelProps={{ shrink: true }}
          />
        </Box>
        <Box display="flex" alignItems="center" mb={2}>
          <CalendarMonth sx={{ mr: 1 }} />
          <TextField
            label="Joined Biz-Network"
            variant="outlined"
            value={joinedBizNetwork}
            disabled={!isEditing}
            onChange={(e) => setJoinedBizNetwork(e.target.value)}
            fullWidth
            type="date"
            InputLabelProps={{ shrink: true }}
          />
        </Box>
        <TextField
          label="Designation"
          variant="outlined"
          disabled={!isEditing}
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          fullWidth
          margin="normal"
        />
        {isEditing ? (
          <Box mt={3} display="flex" justifyContent="center">
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              style={{
                backgroundColor: isFormValid ? "red" : "#ccc",
                color: "white",
                padding: "12px 24px",
                border: "none",
                borderRadius: 4,
                fontWeight: 600,
                cursor: isFormValid && !isLoading ? "pointer" : "not-allowed",
              }}
            >
              {isLoading ? <CircularProgress size={20} color="inherit" /> : "Submit"}
            </button>
          </Box>
        ) : (
          <Box mt={3} display="flex" justifyContent="center">
            <button
              type="button"
              style={{
                backgroundColor: "red",
                color: "white",
                padding: "12px 24px",
                border: "none",
                borderRadius: 4,
                fontWeight: 600,
                cursor: "pointer",
              }}
              onClick={() => {
                console.log('Edit button clicked');
                setIsEditing(true);
              }}
            >
              Edit
            </button>
          </Box>
        )}
      </form>
    </Box>
  );
};

export default UserProfile;