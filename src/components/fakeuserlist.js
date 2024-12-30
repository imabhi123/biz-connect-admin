import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Grid,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  useMediaQuery,
  CircularProgress,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TableHead, TableCell, TableContainer, TableRow, TableBody, Table,
  DialogContentText,
  DialogActions,
  Tooltip
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Country, State, City } from 'country-state-city';

import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { useTheme } from '@mui/material/styles';

const ClubsAndChaptersManagement = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // State management
  const [clubs, setClubs] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [type, setType] = useState('');
  const [idToDelete, setIdToDelete] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // New images state
  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

  // Chapter form states
  const [chapterName, setChapterName] = useState('');
  const [chapterLocation, setChapterLocation] = useState('');
  const [chapterPresident, setChapterPresident] = useState('');
  const [chapterVicePresident, setChapterVicePresident] = useState('');
  const [contactPresident, setContactPresident] = useState('');
  const [contactVicePresident, setContactVicePresident] = useState('');

  // Club form states
  const [clubName, setClubName] = useState('');
  const [clubLocation, setClubLocation] = useState('');
  const [clubChapter, setClubChapter] = useState('');
  const [clubPresident, setClubPresident] = useState('');
  const [clubVicePresident, setClubVicePresident] = useState('');
  const [clubContactPresident, setClubContactPresident] = useState('');
  const [clubContactVicePresident, setClubContactVicePresident] = useState('');
  const [selectedClubs, setSelectedClubs] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [selectedCountry, setSelectedCountry] = useState('IN');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
    setSelectedState('');
    setSelectedDistrict('');
  };

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
    setSelectedDistrict('');
  };

  const handleDistrictChange = (event) => {
    setSelectedDistrict(event.target.value);
  };

  const handleViewEntry = (entry, type) => {
    setSelectedEntry(entry);
    setSelectedType(type);
    setOpenViewModal(true);
  };

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [clubsResponse, chaptersResponse, membersResponse] = await Promise.all([
        axios.get('https://biz-connect-livid.vercel.app/api/v1/clubs'),
        axios.get('https://biz-connect-livid.vercel.app/api/v1/chapters'),
        axios.get('https://biz-connect-livid.vercel.app/api/v1/communities')
      ]);

      setClubs(clubsResponse.data);
      setChapters(chaptersResponse.data);
      setMembers(membersResponse.data?.communities);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch data');
      setLoading(false);
      handleSnackbarOpen('Failed to fetch data', 'error');
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const imagePromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then(base64Images => {
      setImages(base64Images);
      setImagePreview(base64Images[0]); // Show first image as preview
    });
  };

  const resetForm = () => {
    setSelectedType('');
    setChapterName('');
    setChapterLocation('');
    setChapterPresident('');
    setChapterVicePresident('');
    setContactPresident('');
    setContactVicePresident('');
    setClubName('');
    setClubLocation('');
    setClubChapter('');
    setClubPresident('');
    setClubVicePresident('');
    setClubContactPresident('');
    setClubContactVicePresident('');
    setImages([]);
    setImagePreview(null);
    setOpenDialog(false);
    setSelectedId(null);
  };

  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
    setIdToDelete(null);
    setType('');
  };

  const handleSave = async () => {
    try {
      if (selectedType === 'chapter') {
        if (!chapterName || !chapterPresident || !chapterVicePresident ||
          !contactPresident || !contactVicePresident) {
          handleSnackbarOpen('Please fill in all chapter fields', 'error');
          return;
        }

        const chapterPayload = {
          chapterName,
          president: chapterPresident,
          vicePresident: chapterVicePresident,
          contactPresiden: contactPresident,
          contactVicePresident: contactVicePresident,
          images: images,
          creator: localStorage.getItem('userId'),
          clubs: selectedClubs,
          country: 'IN',
          state: selectedState,
          city: selectedDistrict,
        };

        if (selectedId) {
          await axios.put(`https://biz-connect-livid.vercel.app/api/v1/chapters/${selectedId}`, chapterPayload);
          handleSnackbarOpen('Chapter updated successfully', 'success');
        } else {
          await axios.post('https://biz-connect-livid.vercel.app/api/v1/chapters', chapterPayload);
          handleSnackbarOpen('Chapter created successfully', 'success');
        }
      } else if (selectedType === 'club') {
        if (!clubName || !clubChapter || !clubPresident || !clubVicePresident ||
          !clubContactPresident || !clubContactVicePresident) {
          handleSnackbarOpen('Please fill in all club fields', 'error');
          return;
        }

        const clubPayload = {
          Name: clubName,
          clubName,
          chapter: clubChapter,
          president: clubPresident,
          vicePresident: clubVicePresident,
          contactPresiden: clubContactPresident,
          contactVicePresident: clubContactVicePresident,
          images: images,
          creator: localStorage.getItem('userId'),
          country: 'IN',
          state: selectedState,
          city: selectedDistrict,
        };

        if (selectedId) {
          await axios.put(`https://biz-connect-livid.vercel.app/api/v1/clubs/${selectedId}`, clubPayload);
          handleSnackbarOpen('Club updated successfully', 'success');
        } else {
          await axios.post('https://biz-connect-livid.vercel.app/api/v1/clubs', clubPayload);
          handleSnackbarOpen('Club created successfully', 'success');
        }
      }

      fetchInitialData();
      resetForm();
    } catch (err) {
      handleSnackbarOpen('Failed to save', 'error');
    }
  };

  const handleEditEntry = (entry, type) => {
    setSelectedType(type);
    setSelectedId(entry._id);
    setImages(entry.images || []);
    setImagePreview(entry.images?.[0] || null);

    if (type === 'chapter') {
      setChapterName(entry.chapterName);
      setChapterLocation(entry.location);
      setChapterPresident(entry.president);
      setChapterVicePresident(entry.vicePresident);
      setContactPresident(entry.contactPresiden);
      setContactVicePresident(entry.contactVicePresident);
      setSelectedState(entry.state);
      setSelectedDistrict(entry.city);
    } else if (type === 'club') {
      setClubName(entry.clubName);
      setClubLocation(entry.location);
      setClubChapter(entry.chapter);
      setClubPresident(entry.president);
      setClubVicePresident(entry.vicePresident);
      setClubContactPresident(entry.contactPresiden);
      setClubContactVicePresident(entry.contactVicePresident);
      setSelectedState(entry.state);
      setSelectedDistrict(entry.city);
    }

    setOpenDialog(true);
  };

  const handleDeleteEntry = async (id, type) => {
    setIdToDelete(id);
    setType(type);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteEntry = async (id, type) => {
    try {
      if (type === 'chapter') {
        await axios.delete(`https://biz-connect-livid.vercel.app/api/v1/chapters/${id}`);
      } else if (type === 'club') {
        await axios.delete(`https://biz-connect-livid.vercel.app/api/v1/clubs/${id}`);
      }

      handleSnackbarOpen(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`, 'success');
      setDeleteConfirmOpen(false);
      fetchInitialData();
    } catch (err) {
      handleSnackbarOpen(`Failed to delete ${type}`, 'error');
    }
  };

  const handleSnackbarOpen = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const renderDetailModal = () => {
    if (!selectedEntry) return null;

    return (
      <Dialog
        open={openViewModal}
        onClose={() => setOpenViewModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedType === 'chapter' ? 'Chapter Details' : 'Club Details'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <img
                src={selectedEntry.image || "/api/placeholder/300/300"}
                alt={selectedType === 'chapter' ? selectedEntry.chapterName : selectedEntry.clubName}
                style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                {selectedType === 'chapter' ? selectedEntry.chapterName : selectedEntry.clubName}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Location:</strong> {selectedEntry.location || 'N/A'}
                  </Typography>
                </Grid>
                {selectedType === 'club' && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                      <strong>Chapter:</strong> {selectedEntry.chapter?.chapterName || 'N/A'}
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>President:</strong> {selectedEntry.president?.communityName || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Vice President:</strong> {selectedEntry.vicePresident?.communityName || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Contact (President):</strong> {selectedEntry.contactPresiden || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Contact (Vice President):</strong> {selectedEntry.contactVicePresident || 'N/A'}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    );
  };

  // Render table for chapters
  const renderChaptersTable = () => (
    <TableContainer component={Paper} sx={{ mb: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Chapter Name</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>President</TableCell>
            <TableCell>Vice President</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {chapters.map((chapter) => (
            <TableRow key={chapter._id}>
              <TableCell>{chapter.chapterName}</TableCell>
              <TableCell>{chapter.country}/{chapter.state}/{chapter.city}</TableCell>
              <TableCell>{chapter.president?.communityName || 'N/A'}</TableCell>
              <TableCell>{chapter.vicePresident?.communityName || 'N/A'}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => handleViewEntry(chapter, 'chapter')}>
                  <VisibilityIcon />
                </IconButton>
                <IconButton>
                  <EditIcon onClick={() => handleEditEntry(chapter, 'chapter')} />
                </IconButton>
                <IconButton color="error">
                  <DeleteIcon onClick={() => handleDeleteEntry(chapter._id, 'chapter')}
                  />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // Render table for clubs
  const renderClubsTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Club Name</TableCell>
            <TableCell>Chapter</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>President</TableCell>
            <TableCell>Vice President</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clubs.map((club) => (
            <TableRow key={club._id}>
              <TableCell>{club.clubName}</TableCell>
              <TableCell>{club.chapter?.chapterName || 'N/A'}</TableCell>
              <TableCell>{club.country}/{club.state}/{club.city}</TableCell>
              <TableCell>{club.president?.communityName || 'N/A'}</TableCell>
              <TableCell>{club.vicePresident?.communityName || 'N/A'}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => handleViewEntry(club, 'club')}>
                  <VisibilityIcon />
                </IconButton>
                <IconButton>
                  <EditIcon onClick={() => handleEditEntry(club, 'club')} />
                </IconButton>
                <IconButton color="error">
                  <DeleteIcon onClick={() => handleDeleteEntry(club._id, 'club')}
                  />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // Render dialog content based on selected type
  // const renderDialogContent = () => {
  //   if (selectedType === 'chapter') {
  //     return (
  //       <Grid container spacing={2} sx={{ mt: 1 }}>
  //         <Grid
  //           item
  //           xs={12}
  //           md={5}
  //           sx={{
  //             display: 'flex',
  //             flexDirection: 'column',
  //             alignItems: 'center',
  //             justifyContent: 'center',
  //             p: 3
  //           }}
  //         >
  //           <Paper
  //             elevation={0}
  //             sx={{
  //               width: '100%',
  //               aspectRatio: '16/9',
  //               mb: 2,
  //               border: '2px dashed',
  //               borderColor: 'grey.300',
  //               borderRadius: 1,
  //               overflow: 'hidden',
  //               position: 'relative'
  //             }}
  //           >
  //             {imagePreview ? (
  //               <Box
  //                 component="img"
  //                 src={imagePreview}
  //                 alt="Chapter preview"
  //                 sx={{
  //                   width: '100%',
  //                   height: '100%',
  //                   objectFit: 'cover'
  //                 }}
  //               />
  //             ) : (
  //               <Box
  //                 sx={{
  //                   height: '100%',
  //                   display: 'flex',
  //                   flexDirection: 'column',
  //                   alignItems: 'center',
  //                   justifyContent: 'center',
  //                   p: 3
  //                 }}
  //               >
  //                 {/* Custom image placeholder icon */}
  //                 <Box sx={{ position: 'relative', width: 80, height: 80, mb: 2 }}>
  //                   {/* Frame */}
  //                   <Box
  //                     sx={{
  //                       position: 'absolute',
  //                       inset: 0,
  //                       border: 2,
  //                       borderColor: 'grey.400',
  //                       borderRadius: 1
  //                     }}
  //                   >
  //                     {/* Sun */}
  //                     <Box
  //                       sx={{
  //                         position: 'absolute',
  //                         bottom: 8,
  //                         left: 8,
  //                         width: 8,
  //                         height: 8,
  //                         borderRadius: '50%',
  //                         bgcolor: 'grey.400'
  //                       }}
  //                     />
  //                     {/* Mountains */}
  //                     <Box
  //                       sx={{
  //                         position: 'absolute',
  //                         bottom: 12,
  //                         right: 12,
  //                         width: 16,
  //                         height: 12,
  //                         bgcolor: 'grey.400',
  //                         transform: 'rotate(6deg)'
  //                       }}
  //                     />
  //                   </Box>
  //                   {/* Plus icon */}
  //                   <Box
  //                     sx={{
  //                       position: 'absolute',
  //                       top: -8,
  //                       right: -8,
  //                       width: 16,
  //                       height: 16,
  //                       bgcolor: 'primary.main',
  //                       borderRadius: 0.5,
  //                       display: 'flex',
  //                       alignItems: 'center',
  //                       justifyContent: 'center',
  //                       color: 'white',
  //                       fontSize: 14,
  //                       fontWeight: 'bold'
  //                     }}
  //                   >
  //                     +
  //                   </Box>
  //                 </Box>
  //                 <Typography variant="body2" color="text.secondary">
  //                   Upload Chapter Image
  //                 </Typography>
  //               </Box>
  //             )}
  //           </Paper>

  //           <Button
  //             component="label"
  //             variant="contained"
  //             startIcon={<CloudUploadIcon />}
  //             sx={{
  //               mt: 1
  //             }}
  //           >
  //             Choose Image
  //             <input
  //               type="file"
  //               hidden
  //               accept="image/*"
  //               onChange={handleImageUpload}
  //             />
  //           </Button>
  //         </Grid>
  //         <Grid
  //           item
  //           xs={12}
  //           md={7}
  //           sx={{
  //             p: 2,
  //             display: 'flex',
  //             flexDirection: 'column',
  //             justifyContent: 'center'
  //           }}
  //         >
  //           <Grid container spacing={2}>
  //             <Grid item xs={12}>
  //               <TextField
  //                 fullWidth
  //                 label="Chapter Name"
  //                 variant="outlined"
  //                 value={chapterName}
  //                 onChange={(e) => setChapterName(e.target.value)}
  //               />
  //             </Grid>
  //             {/* <Grid item xs={12} sm={6}>
  //               <TextField
  //                 fullWidth
  //                 label="Location"
  //                 variant="outlined"
  //                 value={chapterLocation}
  //                 onChange={(e) => setChapterLocation(e.target.value)}
  //               />
  //             </Grid> */}
  //             {/* Country Dropdown */}
  //             <Grid item xs={12} sm={6}>
  //               <FormControl fullWidth margin="normal">
  //                 <InputLabel id="country-select-label">Country</InputLabel>
  //                 <Select
  //                   labelId="country-select-label"
  //                   id="country-select"
  //                   value={'IN'}
  //                   disabled
  //                   onChange={handleCountryChange}
  //                   label="Country"
  //                 >
  //                   <MenuItem value=""><em>None</em></MenuItem>
  //                   {Country.getAllCountries().map((country) => (
  //                     <MenuItem key={country.isoCode} value={country.isoCode}>
  //                       {country.name}
  //                     </MenuItem>
  //                   ))}
  //                 </Select>
  //               </FormControl>
  //             </Grid>

  //             {/* State Dropdown */}
  //             <Grid item xs={12} sm={6}>
  //               <FormControl fullWidth margin="normal">
  //                 <InputLabel id="state-select-label">State</InputLabel>
  //                 <Select
  //                   labelId="state-select-label"
  //                   id="state-select"
  //                   value={selectedState}
  //                   onChange={handleStateChange}
  //                   label="State"
  //                   disabled={!selectedCountry}
  //                 >
  //                   <MenuItem value=""><em>None</em></MenuItem>
  //                   {selectedCountry &&
  //                     State.getStatesOfCountry(selectedCountry).map((state) => (
  //                       <MenuItem key={state.isoCode} value={state.isoCode}>
  //                         {state.name}
  //                       </MenuItem>
  //                     ))}
  //                 </Select>
  //               </FormControl>
  //             </Grid>

  //             {/* District Dropdown */}
  //             <Grid item xs={12} sm={6}>
  //               <FormControl fullWidth margin="normal">
  //                 <InputLabel id="district-select-label">Cities</InputLabel>
  //                 <Select
  //                   labelId="district-select-label"
  //                   id="district-select"
  //                   value={selectedDistrict}
  //                   onChange={handleDistrictChange}
  //                   label="Cities"
  //                   disabled={!selectedState}
  //                 >
  //                   <MenuItem value=""><em>None</em></MenuItem>
  //                   {selectedState &&
  //                     City.getCitiesOfState(selectedCountry, selectedState).map((city) => (
  //                       <MenuItem key={city.name} value={city.name}>
  //                         {city.name}
  //                       </MenuItem>
  //                     ))}
  //                 </Select>
  //               </FormControl>
  //             </Grid>

  //             <Grid item xs={12} sm={6}>
  //               <TextField
  //                 fullWidth
  //                 label="President Contact Number"
  //                 variant="outlined"
  //                 value={contactPresident}
  //                 onChange={(e) => setContactPresident(e.target.value)}
  //               />
  //             </Grid>
  //             <Grid item xs={12} sm={6}>
  //               <TextField
  //                 fullWidth
  //                 label="Vice President Contact Number"
  //                 variant="outlined"
  //                 value={contactVicePresident}
  //                 onChange={(e) => setContactVicePresident(e.target.value)}
  //               />
  //             </Grid>
  //             <Grid item xs={12} sm={6}>
  //               <FormControl fullWidth variant="outlined">
  //                 <InputLabel>President</InputLabel>
  //                 <Select
  //                   value={chapterPresident}
  //                   onChange={(e) => setChapterPresident(e.target.value)}
  //                   label="President"
  //                 >
  //                   {members?.filter((e) => e.designation === 'president').map((member) => (
  //                     <MenuItem key={member._id} value={member._id}>
  //                       {member.communityName}
  //                     </MenuItem>
  //                   ))}
  //                 </Select>
  //               </FormControl>
  //             </Grid>
  //             <Grid item xs={12} sm={6}>
  //               <FormControl fullWidth variant="outlined">
  //                 <InputLabel>Vice President</InputLabel>
  //                 <Select
  //                   value={chapterVicePresident}
  //                   onChange={(e) => setChapterVicePresident(e.target.value)}
  //                   label="Vice President"
  //                 >
  //                   {members?.filter((e) => e.designation === 'vice-president').map((member) => (
  //                     <MenuItem key={member._id} value={member._id}>
  //                       {member.communityName}
  //                     </MenuItem>
  //                   ))}
  //                 </Select>
  //               </FormControl>
  //             </Grid>
  //             <Grid item xs={12} sm={6}>
  //               <FormControl fullWidth variant="outlined">
  //                 <InputLabel>Select Clubs</InputLabel>
  //                 <Select
  //                   multiple
  //                   value={selectedClubs} // State to store selected clubs
  //                   onChange={(e) => setSelectedClubs(e.target.value)} // Update state on change
  //                   label="Select Clubs"
  //                   renderValue={(selected) =>
  //                     selected.map((id) => clubs.find((club) => club._id === id)?.Name).join(', ') // Show club names
  //                   }
  //                 >
  //                   {clubs?.map((club) => (
  //                     <MenuItem key={club._id} value={club._id}>
  //                       {club.Name}
  //                     </MenuItem>
  //                   ))}
  //                 </Select>
  //               </FormControl>
  //             </Grid>
  //           </Grid>
  //         </Grid>
  //       </Grid>
  //     );
  //   } else if (selectedType === 'club') {
  //     return (
  //       <Grid container spacing={2} sx={{ mt: 1 }}>
  //         <Grid
  //           item
  //           xs={12}
  //           md={5}
  //           sx={{
  //             display: 'flex',
  //             flexDirection: 'column',
  //             alignItems: 'center',
  //             justifyContent: 'center',
  //             p: 3
  //           }}
  //         >
  //           <Paper
  //             elevation={0}
  //             sx={{
  //               width: '100%',
  //               aspectRatio: '16/9',
  //               mb: 2,
  //               border: '2px dashed',
  //               borderColor: 'grey.300',
  //               borderRadius: 1,
  //               overflow: 'hidden',
  //               position: 'relative'
  //             }}
  //           >
  //             {imagePreview ? (
  //               <Box
  //                 component="img"
  //                 src={imagePreview}
  //                 alt="Chapter preview"
  //                 sx={{
  //                   width: '100%',
  //                   height: '100%',
  //                   objectFit: 'cover'
  //                 }}
  //               />
  //             ) : (
  //               <Box
  //                 sx={{
  //                   height: '100%',
  //                   display: 'flex',
  //                   flexDirection: 'column',
  //                   alignItems: 'center',
  //                   justifyContent: 'center',
  //                   p: 3
  //                 }}
  //               >
  //                 {/* Custom image placeholder icon */}
  //                 <Box sx={{ position: 'relative', width: 80, height: 80, mb: 2 }}>
  //                   {/* Frame */}
  //                   <Box
  //                     sx={{
  //                       position: 'absolute',
  //                       inset: 0,
  //                       border: 2,
  //                       borderColor: 'grey.400',
  //                       borderRadius: 1
  //                     }}
  //                   >
  //                     {/* Sun */}
  //                     <Box
  //                       sx={{
  //                         position: 'absolute',
  //                         bottom: 8,
  //                         left: 8,
  //                         width: 8,
  //                         height: 8,
  //                         borderRadius: '50%',
  //                         bgcolor: 'grey.400'
  //                       }}
  //                     />
  //                     {/* Mountains */}
  //                     <Box
  //                       sx={{
  //                         position: 'absolute',
  //                         bottom: 12,
  //                         right: 12,
  //                         width: 16,
  //                         height: 12,
  //                         bgcolor: 'grey.400',
  //                         transform: 'rotate(6deg)'
  //                       }}
  //                     />
  //                   </Box>
  //                   {/* Plus icon */}
  //                   <Box
  //                     sx={{
  //                       position: 'absolute',
  //                       top: -8,
  //                       right: -8,
  //                       width: 16,
  //                       height: 16,
  //                       bgcolor: 'primary.main',
  //                       borderRadius: 0.5,
  //                       display: 'flex',
  //                       alignItems: 'center',
  //                       justifyContent: 'center',
  //                       color: 'white',
  //                       fontSize: 14,
  //                       fontWeight: 'bold'
  //                     }}
  //                   >
  //                     +
  //                   </Box>
  //                 </Box>
  //                 <Typography variant="body2" color="text.secondary">
  //                   Upload Chapter Image
  //                 </Typography>
  //               </Box>
  //             )}
  //           </Paper>

  //           <Button
  //             component="label"
  //             variant="contained"
  //             startIcon={<CloudUploadIcon />}
  //             sx={{
  //               mt: 1
  //             }}
  //           >
  //             Choose Image
  //             <input
  //               type="file"
  //               hidden
  //               accept="image/*"
  //               onChange={handleImageUpload}
  //             />
  //           </Button>
  //         </Grid>
  //         <Grid
  //           item
  //           xs={12}
  //           md={7}
  //           sx={{
  //             p: 2,
  //             display: 'flex',
  //             flexDirection: 'column',
  //             justifyContent: 'center'
  //           }}
  //         >
  //           <Grid container spacing={2}>
  //             <Grid item xs={12}>
  //               <TextField
  //                 fullWidth
  //                 label="Club Name"
  //                 variant="outlined"
  //                 value={clubName}
  //                 onChange={(e) => setClubName(e.target.value)}
  //               />
  //             </Grid>

  //             {/* Country Dropdown */}
  //             <Grid item xs={12} sm={6}>
  //               <FormControl fullWidth margin="normal">
  //                 <InputLabel id="country-select-label">Country</InputLabel>
  //                 <Select
  //                   labelId="country-select-label"
  //                   id="country-select"
  //                   value={'IN'}
  //                   disabled
  //                   onChange={handleCountryChange}
  //                   label="Country"
  //                 >
  //                   <MenuItem value=""><em>None</em></MenuItem>
  //                   {Country.getAllCountries().map((country) => (
  //                     <MenuItem key={country.isoCode} value={country.isoCode}>
  //                       {country.name}
  //                     </MenuItem>
  //                   ))}
  //                 </Select>
  //               </FormControl>
  //             </Grid>

  //             {/* State Dropdown */}
  //             <Grid item xs={12} sm={6}>
  //               <FormControl fullWidth margin="normal">
  //                 <InputLabel id="state-select-label">State</InputLabel>
  //                 <Select
  //                   labelId="state-select-label"
  //                   id="state-select"
  //                   value={selectedState}
  //                   onChange={handleStateChange}
  //                   label="State"
  //                   disabled={!selectedCountry}
  //                 >
  //                   <MenuItem value=""><em>None</em></MenuItem>
  //                   {selectedCountry &&
  //                     State.getStatesOfCountry(selectedCountry).map((state) => (
  //                       <MenuItem key={state.isoCode} value={state.isoCode}>
  //                         {state.name}
  //                       </MenuItem>
  //                     ))}
  //                 </Select>
  //               </FormControl>
  //             </Grid>

  //             {/* District Dropdown */}
  //             <Grid item xs={12} sm={6}>
  //               <FormControl fullWidth margin="normal">
  //                 <InputLabel id="district-select-label">Cities</InputLabel>
  //                 <Select
  //                   labelId="district-select-label"
  //                   id="district-select"
  //                   value={selectedDistrict}
  //                   onChange={handleDistrictChange}
  //                   label="Cities"
  //                   disabled={!selectedState}
  //                 >
  //                   <MenuItem value=""><em>None</em></MenuItem>
  //                   {selectedState &&
  //                     City.getCitiesOfState(selectedCountry, selectedState).map((city) => (
  //                       <MenuItem key={city.name} value={city.name}>
  //                         {city.name}
  //                       </MenuItem>
  //                     ))}
  //                 </Select>
  //               </FormControl>
  //             </Grid>
  //             <Grid item xs={12} sm={6}>
  //               <TextField
  //                 fullWidth
  //                 label="President Contact Number"
  //                 variant="outlined"
  //                 value={clubContactPresident}
  //                 onChange={(e) => setClubContactPresident(e.target.value)}
  //               />
  //             </Grid>
  //             <Grid item xs={12} sm={6}>
  //               <TextField
  //                 fullWidth
  //                 label="Vice President Contact Number"
  //                 variant="outlined"
  //                 value={clubContactVicePresident}
  //                 onChange={(e) => setClubContactVicePresident(e.target.value)}
  //               />
  //             </Grid>
  //             <Grid item xs={12} sm={6}>
  //               <FormControl fullWidth variant="outlined">
  //                 <InputLabel>Chapter</InputLabel>
  //                 <Select
  //                   value={clubChapter}
  //                   onChange={(e) => setClubChapter(e.target.value)}
  //                   label="Chapter"
  //                 >
  //                   {chapters.map((chapter) => (
  //                     <MenuItem key={chapter._id} value={chapter._id}>
  //                       {chapter.chapterName}
  //                     </MenuItem>
  //                   ))}
  //                 </Select>
  //               </FormControl>
  //             </Grid>
  //             <Grid item xs={12} sm={6}>
  //               <FormControl fullWidth variant="outlined">
  //                 <InputLabel>President</InputLabel>
  //                 <Select
  //                   value={clubPresident}
  //                   onChange={(e) => setClubPresident(e.target.value)}
  //                   label="President"
  //                 >
  //                   {members?.filter((e) => e.designation === 'president').map((member) => (
  //                     <MenuItem key={member._id} value={member._id}>
  //                       {member.communityName}
  //                     </MenuItem>
  //                   ))}
  //                 </Select>
  //               </FormControl>
  //             </Grid>
  //             <Grid item xs={12} sm={6}>
  //               <FormControl fullWidth variant="outlined">
  //                 <InputLabel>Vice President</InputLabel>
  //                 <Select
  //                   value={clubVicePresident}
  //                   onChange={(e) => setClubVicePresident(e.target.value)}
  //                   label="Vice President"
  //                 >
  //                   {members?.filter((e) => e.designation === 'vice-president').map((member) => (
  //                     <MenuItem key={member._id} value={member._id}>
  //                       {member.communityName}
  //                     </MenuItem>
  //                   ))}
  //                 </Select>
  //               </FormControl>
  //             </Grid>
  //           </Grid>
  //         </Grid>
  //       </Grid>
  //     );
  //   }
  //   return null;
  // };
const renderDialogContent = () => {
  if (selectedType === 'chapter') {
    return (
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid
          item
          xs={12}
          md={5}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3
          }}
        >
          <Box sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {images.map((image, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  width: 'calc(50% - 8px)',
                  aspectRatio: '16/9',
                  border: '2px dashed',
                  borderColor: 'grey.300',
                  borderRadius: 1,
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                {image ? (
                  <Box sx={{ position: 'relative' }}>
                    <Box
                      component="img"
                      src={URL.createObjectURL(image)}
                      alt={`Image ${index + 1}`}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <IconButton
                      onClick={() => handleRemoveImage(index)}
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        bgcolor: 'background.paper',
                        '&:hover': { bgcolor: 'grey.200' }
                      }}
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 2
                    }}
                  >
                    <Box sx={{ position: 'relative', width: 60, height: 60, mb: 1 }}>
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          border: 2,
                          borderColor: 'grey.400',
                          borderRadius: 1
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          width: 16,
                          height: 16,
                          bgcolor: 'primary.main',
                          borderRadius: 0.5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: 14,
                          fontWeight: 'bold'
                        }}
                      >
                        +
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" align="center">
                      Image {index + 1}
                    </Typography>
                  </Box>
                )}
              </Paper>
            ))}
          </Box>

          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            sx={{ mt: 2 }}
            disabled={images.length >= 4}
          >
            Add Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageUpload}
              multiple
            />
          </Button>
        </Grid>

        <Grid
          item
          xs={12}
          md={7}
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <Grid container spacing={2}>
            {/* Rest of the form fields remain the same */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Chapter Name"
                variant="outlined"
                value={chapterName}
                onChange={(e) => setChapterName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="country-select-label">Country</InputLabel>
                <Select
                  labelId="country-select-label"
                  id="country-select"
                  value={'IN'}
                  disabled
                  onChange={handleCountryChange}
                  label="Country"
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {Country.getAllCountries().map((country) => (
                    <MenuItem key={country.isoCode} value={country.isoCode}>
                      {country.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="state-select-label">State</InputLabel>
                <Select
                  labelId="state-select-label"
                  id="state-select"
                  value={selectedState}
                  onChange={handleStateChange}
                  label="State"
                  disabled={!selectedCountry}
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {selectedCountry &&
                    State.getStatesOfCountry(selectedCountry).map((state) => (
                      <MenuItem key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="district-select-label">Cities</InputLabel>
                <Select
                  labelId="district-select-label"
                  id="district-select"
                  value={selectedDistrict}
                  onChange={handleDistrictChange}
                  label="Cities"
                  disabled={!selectedState}
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {selectedState &&
                    City.getCitiesOfState(selectedCountry, selectedState).map((city) => (
                      <MenuItem key={city.name} value={city.name}>
                        {city.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="President Contact Number"
                variant="outlined"
                value={contactPresident}
                onChange={(e) => setContactPresident(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Vice President Contact Number"
                variant="outlined"
                value={contactVicePresident}
                onChange={(e) => setContactVicePresident(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>President</InputLabel>
                <Select
                  value={chapterPresident}
                  onChange={(e) => setChapterPresident(e.target.value)}
                  label="President"
                >
                  {members?.filter((e) => e.designation === 'president').map((member) => (
                    <MenuItem key={member._id} value={member._id}>
                      {member.communityName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Vice President</InputLabel>
                <Select
                  value={chapterVicePresident}
                  onChange={(e) => setChapterVicePresident(e.target.value)}
                  label="Vice President"
                >
                  {members?.filter((e) => e.designation === 'vice-president').map((member) => (
                    <MenuItem key={member._id} value={member._id}>
                      {member.communityName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Select Clubs</InputLabel>
                <Select
                  multiple
                  value={selectedClubs}
                  onChange={(e) => setSelectedClubs(e.target.value)}
                  label="Select Clubs"
                  renderValue={(selected) =>
                    selected.map((id) => clubs.find((club) => club._id === id)?.Name).join(', ')
                  }
                >
                  {clubs?.map((club) => (
                    <MenuItem key={club._id} value={club._id}>
                      {club.Name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  } else if (selectedType === 'club') {
    return (
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid
          item
          xs={12}
          md={5}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3
          }}
        >
          <Box sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {images.map((image, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  width: 'calc(50% - 8px)',
                  aspectRatio: '16/9',
                  border: '2px dashed',
                  borderColor: 'grey.300',
                  borderRadius: 1,
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                {image ? (
                  <Box sx={{ position: 'relative' }}>
                    <Box
                      component="img"
                      src={URL.createObjectURL(image)}
                      alt={`Image ${index + 1}`}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <IconButton
                      onClick={() => handleRemoveImage(index)}
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        bgcolor: 'background.paper',
                        '&:hover': { bgcolor: 'grey.200' }
                      }}
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 2
                    }}
                  >
                    <Box sx={{ position: 'relative', width: 60, height: 60, mb: 1 }}>
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          border: 2,
                          borderColor: 'grey.400',
                          borderRadius: 1
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          width: 16,
                          height: 16,
                          bgcolor: 'primary.main',
                          borderRadius: 0.5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: 14,
                          fontWeight: 'bold'
                        }}
                      >
                        +
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" align="center">
                      Image {index + 1}
                    </Typography>
                  </Box>
                )}
              </Paper>
            ))}
          </Box>

          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            sx={{ mt: 2 }}
            disabled={images.length >= 4}
          >
            Add Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageUpload}
              multiple
            />
          </Button>
        </Grid>

        <Grid
          item
          xs={12}
          md={7}
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Club Name"
                variant="outlined"
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="country-select-label">Country</InputLabel>
                <Select
                  labelId="country-select-label"
                  id="country-select"
                  value={'IN'}
                  disabled
                  onChange={handleCountryChange}
                  label="Country"
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {Country.getAllCountries().map((country) => (
                    <MenuItem key={country.isoCode} value={country.isoCode}>
                      {country.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="state-select-label">State</InputLabel>
                <Select
                  labelId="state-select-label"
                  id="state-select"
                  value={selectedState}
                  onChange={handleStateChange}
                  label="State"
                  disabled={!selectedCountry}
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {selectedCountry &&
                    State.getStatesOfCountry(selectedCountry).map((state) => (
                      <MenuItem key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="district-select-label">Cities</InputLabel>
                <Select
                  labelId="district-select-label"
                  id="district-select"
                  value={selectedDistrict}
                  onChange={handleDistrictChange}
                  label="Cities"
                  disabled={!selectedState}
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {selectedState &&
                    City.getCitiesOfState(selectedCountry, selectedState).map((city) => (
                      <MenuItem key={city.name} value={city.name}>
                        {city.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="President Contact Number"
                variant="outlined"
                value={clubContactPresident}
                onChange={(e) => setClubContactPresident(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Vice President Contact Number"
                variant="outlined"
                value={clubContactVicePresident}
                onChange={(e) => setClubContactVicePresident(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Chapter</InputLabel>
                <Select
                  value={clubChapter}
                  onChange={(e) => setClubChapter(e.target.value)}
                  label="Chapter"
                >
                  {chapters.map((chapter) => (
                    <MenuItem key={chapter._id} value={chapter._id}>
                      {chapter.chapterName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>President</InputLabel>
                <Select
                  value={clubPresident}
                  onChange={(e) => setClubPresident(e.target.value)}
                  label="President"
                >
                  {members?.filter((e) => e.designation === 'president').map((member) => (
                    <MenuItem key={member._id} value={member._id}>
                      {member.communityName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Vice President</InputLabel>
                <Select
                  value={clubVicePresident}
                  onChange={(e) => setClubVicePresident(e.target.value)}
                  label="Vice President"
                >
                  {members?.filter((e) => e.designation === 'vice-president').map((member) => (
                    <MenuItem key={member._id} value={member._id}>
                      {member.communityName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
  return null;
};

  return (
    <Box sx={{ padding: isSmallScreen ? "16px" : "24px", maxWidth: '100%', margin: "0 auto" }}>
      {/* Header with Create Button */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: "24px"
      }}>
        <Typography
          variant={isSmallScreen ? "h5" : "h4"}
          sx={{ fontWeight: "bold", color: "#F90705" }}
        >
          Clubs & Chapters Management
        </Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Create New</InputLabel>
          <Select
            value=""
            label="Create New"
            onChange={(e) => {
              setSelectedType(e.target.value);
              setOpenDialog(true);
              setSelectedId(null);
              setChapterName('');
              setChapterPresident('');
              setChapterVicePresident('');
              setContactPresident('');
              setContactVicePresident('');
              setSelectedState('')
              setSelectedDistrict('')
              setClubName('');
              setClubChapter('');
              setClubPresident('');
              setClubVicePresident('');
              setClubContactPresident('');
              setClubContactVicePresident('');
              setSelectedState('')
              setSelectedDistrict('')
            }}
          >
            <MenuItem value="chapter">New Chapter</MenuItem>
            <MenuItem value="club">New Club</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Loading State */}
      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress color="error" />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Typography color="error" align="center">
          {error}
        </Typography>
      )}

      {/* Chapters Section */}
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        Chapters
      </Typography>
      {/* {renderEntries(chapters, 'chapter')} */}
      {renderChaptersTable()}

      {/* Clubs Section */}
      <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: "bold" }}>
        Clubs
      </Typography>
      {/* {renderEntries(clubs, 'club')} */}
      {renderClubsTable()}

      {renderDetailModal()}
      {/* Create/Edit Entry Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedId ? 'Edit' : 'Create New'} {selectedType === 'chapter' ? 'Chapter' : 'Club'}
        </DialogTitle>
        <DialogContent>
          {renderDialogContent()}

          {/* Dialog Actions */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mt: 3
            }}
          >
            <Button
              variant="outlined"
              onClick={() => setOpenDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              sx={{
                backgroundColor: '#F90705',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#ff6b6b',
                }
              }}
              onClick={handleSave}
            >
              {selectedId ? 'Update' : 'Save'} Details
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Snackbar for Notifications */}
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
            Are you sure you want to delete this {type == 'chapter' ? 'chapter' : 'club'}
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
            onClick={() => confirmDeleteEntry(idToDelete, type)}
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClubsAndChaptersManagement;