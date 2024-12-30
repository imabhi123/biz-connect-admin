import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Button, 
  TextField, 
  List, 
  ListItem, 
  ListItemText, 
  Dialog, 
  DialogTitle, 
  DialogContent,
  Checkbox,
  FormControlLabel,
  Avatar,
  Chip,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Tooltip,
  Paper,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { 
  Send as SendIcon, 
  NotificationsActive as NotificationsIcon,
  Close as CloseIcon,
  MessageOutlined as MessageIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ElevatedCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 16px 32px rgba(0,0,0,0.16)'
  }
}));

const SectionPaper = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ffffff 0%, #f4f6f9 100%)',
  borderRadius: theme.spacing(3),
  padding: theme.spacing(3),
  boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
  border: `1px solid ${theme.palette.divider}`,
}));

const LoadingOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  zIndex: 1,
  borderRadius: theme.spacing(2),
}));

const NotificationManagementPanel = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [userNotifications, setUserNotifications] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newNotification, setNewNotification] = useState({
    title: '',
    description: '',
  });
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [openUserNotificationsModal, setOpenUserNotificationsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Loading states
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [isSendingNotification, setIsSendingNotification] = useState(false);
  const [isLoadingUserNotifications, setIsLoadingUserNotifications] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchNotifications();
  }, []);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await axios.get('https://biz-connect-livid.vercel.app/api/v1/admin/get-all-users');
      setUsers(response.data.data);
      toast.success('Users loaded successfully');
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const fetchNotifications = async () => {
    setIsLoadingNotifications(true);
    try {
      const response = await axios.get('https://biz-connect-livid.vercel.app/api/v1/notifications/all');
      setNotifications(response.data.notifications);
      toast.success('Notifications loaded successfully');
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  const fetchUserNotifications = async (userId) => {
    setIsLoadingUserNotifications(true);
    try {
      const response = await axios.get(`https://biz-connect-livid.vercel.app/api/v1/notifications/user/${userId}`);
      setUserNotifications(response.data.notifications);
      setSelectedUser(users.find(user => user._id === userId));
      setOpenUserNotificationsModal(true);
      toast.success('User notifications loaded successfully');
    } catch (error) {
      console.error('Error fetching user notifications:', error);
      toast.error('Failed to load user notifications');
    } finally {
      setIsLoadingUserNotifications(false);
    }
  };

  const handleUserSelect = (userId, event) => {
    event.stopPropagation();
    if (isAllSelected) return;
    
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    setIsAllSelected(!isAllSelected);
    setSelectedUsers(isAllSelected ? [] : users.map(user => user._id));
  };

  const handleSendNotification = async () => {
    setIsSendingNotification(true);
    try {
      if (isAllSelected) {
        await axios.post('https://biz-connect-livid.vercel.app/api/v1/notifications/send-to-all', newNotification);
        toast.success('Notification sent to all users');
      } else {
        await Promise.all(
          selectedUsers.map(userId => 
            axios.post(`https://biz-connect-livid.vercel.app/api/v1/notifications/send-to-user/${userId}`, newNotification)
          )
        );
        toast.success('Notification sent to selected users');
      }
      
      fetchNotifications();
      setNewNotification({ title: '', description: '' });
      setSelectedUsers([]);
      setIsAllSelected(false);
    } catch (error) {
      console.error('Error sending notifications:', error);
      toast.error('Failed to send notification');
    } finally {
      setIsSendingNotification(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4, backgroundColor: '#f9fafb' }}>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 700, 
            color: '#2c3e50', 
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2
          }}
        >
          <NotificationsIcon fontSize="large" color="primary" />
          Notification Center
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Notification Creation Section */}
        <Grid item xs={12} md={6}>
          <SectionPaper elevation={0}>
            <ElevatedCard sx={{ position: 'relative' }}>
              {isSendingNotification && (
                <LoadingOverlay>
                  <CircularProgress />
                </LoadingOverlay>
              )}
              <CardContent>
                <Typography 
                  variant="h5" 
                  color="primary" 
                  sx={{ mb: 3, fontWeight: 600 }}
                >
                  Create Notification
                </Typography>
                <TextField
                  fullWidth
                  label="Notification Title"
                  variant="outlined"
                  margin="normal"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                  sx={{ mb: 2 }}
                  disabled={isSendingNotification}
                />
                <TextField
                  fullWidth
                  label="Notification Description"
                  variant="outlined"
                  margin="normal"
                  multiline
                  rows={4}
                  value={newNotification.description}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, description: e.target.value }))}
                  sx={{ mb: 2 }}
                  disabled={isSendingNotification}
                />
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                        color="primary"
                        disabled={isSendingNotification}
                      />
                    }
                    label="Send to All Users"
                  />
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {selectedUsers.map(userId => {
                    const user = users.find(u => u._id === userId);
                    return (
                      <Chip
                        key={userId}
                        avatar={<Avatar src={user?.profilePicture} />}
                        label={user?.fullName || 'Unknown User'}
                        onDelete={() => handleUserSelect(userId, { stopPropagation: () => {} })}
                        color="primary"
                        variant="outlined"
                        disabled={isSendingNotification}
                      />
                    );
                  })}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={isSendingNotification ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                    onClick={handleSendNotification}
                    disabled={!newNotification.title || !newNotification.description || 
                            (!isAllSelected && selectedUsers.length === 0) || isSendingNotification}
                    sx={{ 
                      px: 4, 
                      py: 1.5, 
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600
                    }}
                  >
                    {isSendingNotification ? 'Sending...' : 'Send Notification'}
                  </Button>
                </Box>
              </CardContent>
            </ElevatedCard>
          </SectionPaper>
        </Grid>

        {/* User Selection Section */}
        <Grid item xs={12} md={6}>
          <SectionPaper elevation={0}>
            <ElevatedCard sx={{ position: 'relative' }}>
              {isLoadingUsers && (
                <LoadingOverlay>
                  <CircularProgress />
                </LoadingOverlay>
              )}
              <CardContent>
                <Typography 
                  variant="h5" 
                  color="primary" 
                  sx={{ mb: 3, fontWeight: 600 }}
                >
                  Select Recipients
                </Typography>
                
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search users by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  disabled={isLoadingUsers}
                />

                <Box 
                  sx={{ 
                    maxHeight: 500, 
                    overflowY: 'auto', 
                    pr: 1 
                  }}
                >
                  {filteredUsers.map(user => (
                    <Card 
                      key={user._id}
                      sx={{ 
                        mb: 2, 
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        border: selectedUsers.includes(user._id) 
                          ? '2px solid' : '2px solid transparent',
                        borderColor: selectedUsers.includes(user._id) 
                          ? 'primary.main' : 'transparent',
                        '&:hover': {
                          transform: 'scale(1.02)',
                          boxShadow: 2
                        }
                      }}
                    >
                      <CardHeader
                        avatar={
                          <Avatar 
                            src={user.profilePicture} 
                            alt={user.fullName}
                            sx={{ width: 56, height: 56 }}
                          />
                        }
                        title={
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {user.fullName}
                          </Typography>
                        }
                        subheader={user.email}
                        action={
                          <>
                            <Checkbox
                              checked={selectedUsers.includes(user._id)}
                              onChange={(e) => handleUserSelect(user._id, e)}
                              disabled={isAllSelected || isLoadingUsers}
                            />
                            <Tooltip title="View User Notifications">
                              <IconButton 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  fetchUserNotifications(user._id);
                                }}
                                color="primary"
                                disabled={isLoadingUsers}
                              >
                                <MessageIcon />
                              </IconButton>
                            </Tooltip>
                          </>
                        }
                      />
                    </Card>
                  ))}
                </Box>
              </CardContent>
            </ElevatedCard>
          </SectionPaper>
        </Grid>

        {/* Notification History Section */}
        <Grid item xs={12}>
          <SectionPaper elevation={0}>
            <ElevatedCard sx={{ position: 'relative' }}>
              {isLoadingNotifications && (
                <LoadingOverlay>
                  <CircularProgress />
                </LoadingOverlay>
              )}
              <CardContent>
                <Typography 
                  variant="h5" 
                  color="primary" 
                  sx={{ mb: 3, fontWeight: 600 }}
                >
                  Notification History
                </Typography>
                <Box 
                  sx={{ 
                    maxHeight: 500, 
                    overflowY: 'auto', 
                    pr: 1 
                  }}
                >
                  {notifications.map(notification => (
                    <Card 
                      key={notification._id} 
                      sx={{ 
                        mb: 2, 
                        borderRadius: 2,
                        background: 'linear-gradient(145deg, #ffffff 0%, #f4f6f9 100%)',
                        boxShadow: 1
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                          {notification.title}
                        </Typography>
                        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
                          {notification.description}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          color="textSecondary" 
                          sx={{ 
                            display: 'block', 
                            textAlign: 'right', 
                            mt: 2,
                            fontStyle: 'italic' 
                          }}
                        >
                          {new Date(notification.createdAt).toLocaleString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </CardContent>
            </ElevatedCard>
          </SectionPaper>
        </Grid>
      </Grid>

      {/* User Notifications Modal */}
      <Dialog
        open={openUserNotificationsModal}
        onClose={() => setOpenUserNotificationsModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <Avatar 
              src={selectedUser?.profilePicture} 
              sx={{ mr: 2 }}
            />
            <Typography variant="h6">
              Notifications for {selectedUser?.fullName}
            </Typography>
            <Box flexGrow={1} />
            <IconButton onClick={() => setOpenUserNotificationsModal(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ position: 'relative' }}>
          {isLoadingUserNotifications ? (
            <LoadingOverlay>
              <CircularProgress />
            </LoadingOverlay>
          ) : userNotifications.length === 0 ? (
            <Typography variant="body1" color="textSecondary" align="center">
              No notifications found for this user
            </Typography>
          ) : (
            <List>
              {userNotifications.map(notification => (
                <ListItem key={notification._id} divider>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" color="primary">
                        {notification.title}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="textSecondary">
                          {notification.description}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {new Date(notification.createdAt).toLocaleString()}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default NotificationManagementPanel;