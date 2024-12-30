import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Typography,
  IconButton,
  Box,
  Switch,
  Divider,
  Button,
  Card
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const InfoRow = ({ label, value }) => (
  <Grid container spacing={2} sx={{ py: 1 }}>
    <Grid item xs={12} sm={4}>
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
    </Grid>
    <Grid item xs={12} sm={8}>
      <Typography variant="body2">
        {value || '-'}
      </Typography>
    </Grid>
  </Grid>
);

const UserDetailsDialog = ({ open, onClose, user }) => {
  const [status, setStatus] = useState(user?.status || false); // Initial status from user data

  console.log(user?.status, 'abhishek');

  useEffect(() => {
    setStatus(user?.status || false); // Update status when user changes
  }, [user]);
  const handleStatusChange = async (event) => {
    const newStatus = event.target.checked;

    try {
      const response = await axios.put(`https://biz-connect-livid.vercel.app/api/v1/user/status/${user._id}`, {
        status: newStatus,
      });
      if (response.data.success) {
        setStatus(newStatus); // Update local state if API call is successful
      } else {
        console.error("Failed to update user status:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  

  if (!user) return null;
  console.log(user)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">User Detail</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 1 }}>Block</Typography>
            <Switch checked={status} onChange={handleStatusChange} />
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <InfoRow label="Name" value={`${user.firstName} ${user.lastName}`} />
              <InfoRow label="Mobile" value={user.mobile || '-'} />
              <InfoRow label="Plan Name" value={user.planName?.name} />
              {/* <InfoRow label="Used Limit" value={user.usedLimit || '0'} /> */}
              <InfoRow label="Plan Price" value={user.planPrice || '-'} />
            </Grid>
            <Grid item xs={12} md={6}>
              <InfoRow label="Email" value={user.email} />
              <InfoRow label="Date Time" value={new Date().toLocaleDateString()} />
              {/* <InfoRow label="Total Policy Limit" value={user.totalPolicyLimit || '0'} /> */}
              {/* <InfoRow label="Left Limit" value={user.leftLimit || '0'} /> */}
              <InfoRow label="Plan Duration" value={user.planDuration || '-'} />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Payment Details
            </Typography>
            {user?.payments?.map((item, index) => (
              <Card key={index} variant="outlined" sx={{ mb: 2, p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Full Name:
                    </Typography>
                    <Typography variant="body1">{item?.fullName}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Email:
                    </Typography>
                    <Typography variant="body1">{item?.email}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      City:
                    </Typography>
                    <Typography variant="body1">{item?.city}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      GST:
                    </Typography>
                    <Typography variant="body1">{item?.gst}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Phone:
                    </Typography>
                    <Typography variant="body1">{item?.phone}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Pincode:
                    </Typography>
                    <Typography variant="body1">{item?.pincode}</Typography>
                  </Grid>
                </Grid>
              </Card>
            ))}
            {/* <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Show Details
            </Button> */}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsDialog;