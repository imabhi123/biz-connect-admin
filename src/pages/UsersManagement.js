import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Avatar, 
  Chip, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Grid, 
  Button,
  TablePagination,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Switch,
  FormControlLabel
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Visibility as ViewIcon,
  Search as SearchIcon 
} from '@mui/icons-material';

const UsersManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    role: '',
    verified: '',
    gender: ''
  });

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://biz-connect-livid.vercel.app/api/v1/admin/get-all-users', {
          // Add any necessary headers, like authentication token
          // headers: { 'Authorization': `Bearer ${your_token}` }
        });
        setUsers(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch users');
        setLoading(false);
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setOpenDetailDialog(true);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0); // Reset to first page when searching
  };

  const handleVerificationToggle = async (userId, currentStatus) => {
    try {
      // Make API call to update user verification status
      await axios.patch(`https://biz-connect-livid.vercel.app/api/v1/admin/update-user-verification/${userId}`, {
        verified: !currentStatus
      });

      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === userId 
            ? { ...user, verified: !currentStatus }
            : user
        )
      );

      // Update selected user in modal
      setSelectedUser(prev => ({ ...prev, verified: !currentStatus }));
    } catch (error) {
      console.error('Error updating user verification:', error);
      // Handle error (show notification, etc.)
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilters = 
      (!filters.role || user.role === filters.role) &&
      (filters.verified === '' || user.verified === (filters.verified === 'true')) &&
      (!filters.gender || user.gender === filters.gender);

    return matchesSearch && matchesFilters;
  });

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage, 
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
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

  if (error) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          color: 'error.main'
        }}
      >
        <Typography variant="h6">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: '#f4f6f8' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#333' }}>
        User Management
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={12}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel>Role Filter</InputLabel>
            <Select
              name="role"
              value={filters.role}
              label="Role Filter"
              onChange={handleFilterChange}
            >
              <MenuItem value="">All Roles</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="member">Member</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel>Verification Status</InputLabel>
            <Select
              name="verified"
              value={filters.verified}
              label="Verification Status"
              onChange={handleFilterChange}
            >
              <MenuItem value="">All Users</MenuItem>
              <MenuItem value="true">Verified</MenuItem>
              <MenuItem value="false">Unverified</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel>Gender</InputLabel>
            <Select
              name="gender"
              value={filters.gender}
              label="Gender"
              onChange={handleFilterChange}
            >
              <MenuItem value="">All Genders</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Others">Others</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: '#e0e0e0' }}>
            <TableRow>
              <TableCell>Avatar</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Verification</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user._id} hover>
                <TableCell>
                  <Avatar 
                    src={`${user.avatar}`} 
                    alt={user.fullName} 
                    sx={{ width: 56, height: 56 }}
                  />
                </TableCell>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip 
                    label={user.role} 
                    color={
                      user.role === 'admin' ? 'error' : 
                      user.role === 'member' ? 'primary' : 'default'
                    } 
                    size="small" 
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={user.verified ? 'Verified' : 'Unverified'} 
                    color={user.verified ? 'success' : 'warning'} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>
                  <IconButton 
                    color="primary" 
                    onClick={() => handleViewUser(user)}
                  >
                    <ViewIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* User Details Dialog */}
      <Dialog 
        open={openDetailDialog} 
        onClose={() => setOpenDetailDialog(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedUser && (
          <>
            <DialogTitle>User Details: {selectedUser.fullName}</DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                  <Avatar 
                    src={`${selectedUser.avatar}`} 
                    alt={selectedUser.fullName} 
                    sx={{ width: 150, height: 150, m: 'auto' }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={selectedUser.verified}
                        onChange={() => handleVerificationToggle(selectedUser._id, selectedUser.verified)}
                        color="primary"
                      />
                    }
                    label={selectedUser.verified ? "Verified" : "Unverified"}
                    sx={{ mt: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <Typography variant="h6">Personal Information</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        value={selectedUser.fullName}
                        InputProps={{ readOnly: true }}
                        variant="standard"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        value={selectedUser.email}
                        InputProps={{ readOnly: true }}
                        variant="standard"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Mobile"
                        value={selectedUser.mobile}
                        InputProps={{ readOnly: true }}
                        variant="standard"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Gender"
                        value={selectedUser.gender}
                        InputProps={{ readOnly: true }}
                        variant="standard"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Role"
                        value={selectedUser.role}
                        InputProps={{ readOnly: true }}
                        variant="standard"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Country"
                        value={selectedUser.country}
                        InputProps={{ readOnly: true }}
                        variant="standard"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Created At"
                        value={new Date(selectedUser.createdAt).toLocaleString()}
                        InputProps={{ readOnly: true }}
                        variant="standard"
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default UsersManagementPage;