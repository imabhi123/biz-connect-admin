import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Grid,
  Container,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Chip,
  Divider
} from '@mui/material';
import axios from 'axios';

const UnapprovedCommunities = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [viewCommunity, setViewCommunity] = useState(null);
  const [newAssignId, setNewAssignId] = useState('');
  const [assignIdError, setAssignIdError] = useState('');

  useEffect(() => {
    const fetchUnapprovedCommunities = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://biz-connect-livid.vercel.app/api/v1/communities/get-unapproved');
        setCommunities(response.data?.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch unapproved communities');
        setLoading(false);
      }
    };

    fetchUnapprovedCommunities();
  }, []);

  const sendNotification = async (userId, status, communityName) => {
    try {
      const notificationData = {
        title: status === 'approved'
          ? "Community Registration Approved! 🎉"
          : "Community Registration Update",
        description: status === 'approved'
          ? `Congratulations! Your community "${communityName}" has been approved. You can now start connecting with other businesses and growing your network.`
          : `Your community "${communityName}" registration request could not be approved at this time. Please review our community guidelines and consider submitting a new request that aligns with our platform's standards.`
      };

      const response = await axios.post(
        `https://biz-connect-livid.vercel.app/api/v1/notifications/send-to-user/${userId}`,
        notificationData
      );

      if (!response.data.success) {
        throw new Error('Notification sending failed');
      }
    } catch (err) {
      console.error('Failed to send notification:', err);
      throw err;
    }
  };

  const handleApprove = async (communityId, approvalStatus) => {
    try {
      await axios.patch(`https://biz-connect-livid.vercel.app/api/v1/communities/update-approval-status/${communityId}`, {
        approved: approvalStatus
      });

      const community = communities.find(c => c._id === communityId);

      if (community?._id) {
        try {
          await sendNotification(
            "674eeea41cf6670a36c4968f",
            approvalStatus ? 'approved' : 'rejected',
            community.communityName
          );
        } catch (notificationError) {
          console.error('Notification failed but community status was updated:', notificationError);
        }
      }

      setCommunities(prev =>
        prev.filter(community => community._id !== communityId)
      );
    } catch (err) {
      setError('Failed to update community status');
      throw err;
    }
  };

  const handleAssignIdChange = async () => {
    if (!newAssignId.trim()) {
      setAssignIdError('AssignId cannot be empty');
      return;
    }

    try {
      await axios.post(`https://biz-connect-livid.vercel.app/api/v1/admin/update-assignId/${viewCommunity._id}`, {
        newAssignId: newAssignId
      });

      setCommunities(prev =>
        prev.map(community =>
          community._id === viewCommunity._id
            ? { ...community, assignId: newAssignId }
            : community
        )
      );

      setViewCommunity(prev => ({
        ...prev,
        assignId: newAssignId
      }));

      setNewAssignId('');
      setAssignIdError('');
    } catch (err) {
      setAssignIdError('AssignId Already in use, please assign a new one');
      console.error('Failed to update AssignId:', err);
    }
  };

  const openConfirmationDialog = (community, approvalStatus) => {
    setSelectedCommunity({ id: community._id, approvalStatus });
    setOpenDialog(true);
  };

  const handleViewDetails = (community) => {
    setViewCommunity(community);
    setNewAssignId(community.assignId || '');
    setOpenViewDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCommunity(null);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setViewCommunity(null);
    setNewAssignId('');
    setAssignIdError('');
  };

  const confirmAction = async () => {
    if (selectedCommunity) {
      try {
        await handleApprove(selectedCommunity.id, selectedCommunity.approvalStatus);
        handleCloseDialog();
      } catch (err) {
        console.error('Action failed:', err);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Unapproved Communities
      </Typography>

      {communities.length === 0 ? (
        <Typography variant="body1">No unapproved communities found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {communities.map((community) => (
            <Grid item xs={12} sm={6} md={4} key={community._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="194"
                  image={community.image || '/uploads/placeholder.png'}
                  alt={community.communityName}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="div">
                    {community.communityName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {community.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Contact: {community.contact}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Email: {community.email}
                  </Typography>
                  {community.assignId && (
                    <Typography variant="body2" color="text.secondary">
                      AssignId: {community.assignId}
                    </Typography>
                  )}
                </CardContent>
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={() => handleViewDetails(community)}
                    fullWidth
                  >
                    View
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => openConfirmationDialog(community, "approved")}
                    fullWidth
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => openConfirmationDialog(community, "rejected")}
                    fullWidth
                  >
                    Reject
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirm Action
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to {selectedCommunity?.approvalStatus ? 'approve' : 'reject'} this community?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmAction} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={handleCloseViewDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Community Details
        </DialogTitle>
        <DialogContent>
          {viewCommunity && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ mb: 3 }}>
                <img
                  src={viewCommunity.image || '/uploads/placeholder.png'}
                  alt={viewCommunity.communityName}
                  style={{ width: '100%', height: 'auto', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px' }}
                />
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Basic Information
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" color="primary">
                      {viewCommunity.communityName}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {viewCommunity.description}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Status:</strong> {viewCommunity.status}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Designation:</strong> {viewCommunity.designation}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Contact:</strong> {viewCommunity.contact}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Email:</strong> {viewCommunity.email}
                    </Typography>
                  </Box>

                  <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                    Location
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      <strong>Country:</strong> {viewCommunity.country}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>State:</strong> {viewCommunity.state}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>City:</strong> {viewCommunity.city}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Creator Information
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      <strong>Name:</strong> {viewCommunity.creator?.fullName}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Email:</strong> {viewCommunity.creator?.email}
                    </Typography>
                  </Box>

                  <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                    User Information
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      <strong>Name:</strong> {viewCommunity.user?.fullName}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Email:</strong> {viewCommunity.user?.email}
                    </Typography>
                  </Box>

                  <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                    Dates
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      <strong>Joining Date:</strong> {formatDate(viewCommunity.joiningDate)}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Created At:</strong> {formatDate(viewCommunity.createdAt)}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Updated At:</strong> {formatDate(viewCommunity.updatedAt)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Memberships
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Clubs ({viewCommunity.clubs?.length || 0})
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {viewCommunity.clubs?.map((clubId) => (
                        <Chip key={clubId._id} label={clubId.clubName} size="small" />
                      ))}
                    </Box>

                    <Typography variant="subtitle2" gutterBottom>
                      Chapters ({viewCommunity.chapters?.length || 0})
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {viewCommunity.chapters?.map((chapterId) => (
                        <Chip key={chapterId._id} label={chapterId.chapterName} size="small" />
                      ))}
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    AssignId Management
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" gutterBottom>
                      <strong>Current AssignId:</strong> {viewCommunity.assignId || 'Not assigned'}
                    </Typography>
                    <TextField
                      fullWidth
                      label="New AssignId"
                      value={newAssignId}
                      onChange={(e) => setNewAssignId(e.target.value)}
                      error={!!assignIdError}
                      helperText={assignIdError}
                      sx={{ mt: 1 }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAssignIdChange}
                      sx={{ mt: 2 }}
                      fullWidth
                    >
                      Update AssignId
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UnapprovedCommunities;