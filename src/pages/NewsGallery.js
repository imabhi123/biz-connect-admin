import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Snackbar,
  Alert,
  Paper,
  Fade,
  IconButton,
  Chip,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  DateRange as DateIcon
} from '@mui/icons-material';
import BlogWritingPage from 'src/components/BlogWriter';
import { useNavigate } from 'react-router';

const NewsGallery = () => {
  const theme = useTheme();
  const navigate=useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentBlog, setCurrentBlog] = useState({ title: '', jsxcode: '', author: localStorage.getItem('userId') ,category:''});
  const [isEditing, setIsEditing] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('https://biz-connect-livid.vercel.app/api/v1/blogs');
      setBlogs(response.data);
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const extractFirstImageSrc = (jsxString) => {
    const imgTagRegex = /<img\s+[^>]*src="([^"]+)"[^>]*>/i;
    const match = imgTagRegex.exec(jsxString);
    
    if (match && match[1]) {
      return match[1]; // Return the value of the `src` attribute
    }
  
    return null; // Return null if no image is found
  };

  const handleDialogOpen = (blog = { title: '', description: '', image: '' }) => {
    console.log(Boolean(blog._id),'abhishek')
    setCurrentBlog(blog);
    setIsEditing(Boolean(blog._id));
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setCurrentBlog({ title: '', description: '', image: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentBlog({ ...currentBlog, [name]: value });
  };

 
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://biz-connect-livid.vercel.app/api/v1/blogs/${id}`);
      setAlert({ open: true, message: 'Blog deleted successfully', severity: 'success' });
      fetchBlogs();
    } catch (error) {
      setAlert({ open: true, message: 'Failed to delete blog', severity: 'error' });
    }
  };

  return (
    <Container maxWidth="">
      <Box
        sx={{
          position: 'relative',
          mb: 8,
          mt: 4,
          borderRadius: 2,
          overflow: 'hidden',
          bgcolor: alpha(theme.palette.primary.main, 0.03),
          p: 4
        }}
      >
        <Paper
          elevation={0}
          sx={{
            // background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '8px',
            width:'100%',
            margin:'0',
            maxWidth:'100% !important',
            
          }}
        />
        <div style={{display:'flex',justifyContent:'space-between',width:'100%'}}>
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: `linear-gradient(45deg, red, black)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            textAlign: 'center'
          }}
        >
          News Management
        </Typography>
        
        <Button
          variant="contained"
          size="large"
          sx={{
            borderRadius: '28px',
            px: 4,
            py: 1.5,
            display: 'flex',
            gap: 1,
            margin: '0 0',
            background: `linear-gradient(45deg, red, black)`,
            boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.6)}`
            }
          }}
          onClick={() => navigate('/dashboard/news-management')}
        >
          <AddIcon /> Create New News
        </Button>
        </div>
      </Box>

      <Grid container spacing={3}>
        {blogs.map((blog, index) => (
          <Grid item xs={12} sm={6} md={4} key={blog._id}>
            <Fade in={true} timeout={500} style={{ transitionDelay: `${index * 100}ms` }}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`
                  }
                }}
              >
                {extractFirstImageSrc(blog?.jsxcode) ? (
                  <Box
                    sx={{
                      position: 'relative',
                      paddingTop: '56.25%', // 16:9 aspect ratio
                      overflow: 'hidden'
                    }}
                  >
                    <Box
                      component="img"
                      src={extractFirstImageSrc(blog?.jsxcode)}
                      alt={blog.title}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.05)'
                        }
                      }}
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      height: 200,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: alpha(theme.palette.primary.main, 0.05)
                    }}
                  >
                    <ImageIcon sx={{ fontSize: 60, color: alpha(theme.palette.primary.main, 0.2) }} />
                  </Box>
                )}

                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {blog.title}
                  </Typography>
                  
                  <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
                    <Chip
                      size="small"
                      icon={<DateIcon sx={{ fontSize: 16 }} />}
                      label={new Date().toLocaleDateString()}
                      sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}
                    />
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {blog.description}
                  </Typography>
                </CardContent>

                <Divider />

                <CardActions sx={{ p: 2, justifyContent: 'space-between' }}>
                  <IconButton
                    color="primary"
                    onClick={() => handleDialogOpen(blog)}
                    sx={{
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.1)
                      }
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(blog._id)}
                    sx={{
                      '&:hover': {
                        bgcolor: alpha(theme.palette.error.main, 0.1)
                      }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        maxWidth="xl"
        fullWidth
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 400 }}
      >
       
        <BlogWritingPage blogs={blogs} setCurrentBlog={setCurrentBlog} setBlogs={setBlogs} currentBlog={currentBlog} isEditing={isEditing} handleDialogClose={handleDialogClose}/>
      </Dialog>

      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={() => setAlert({ ...alert, open: false })}
        TransitionComponent={Fade}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.severity}
          
          sx={{
            width: '100%',
            boxShadow: theme.shadows[3]
          }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default NewsGallery;