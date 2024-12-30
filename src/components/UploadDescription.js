import React from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';

const UploadDescription = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f9f9f9',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          maxWidth: 500,
          width: '100%',
          padding: 4,
          borderRadius: 3,
          backgroundColor: '#fff',
          textAlign: 'center',
        }}
      >
        {/* Header */}
        <Typography variant="h5" fontWeight="bold" mb={4}>
          Upload an Image
        </Typography>

        {/* Image Upload Section */}
        <Box
          sx={{
            border: '2px dashed #ccc',
            borderRadius: 2,
            padding: 4,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 3,
            backgroundColor: '#f5f5f5',
          }}
        >
          <ImageIcon sx={{ fontSize: 50, color: '#ff0000' }} />
        </Box>
        <Button variant="contained" sx={buttonStyles}>Upload</Button>

        {/* Description Section */}
        <TextField
          label="Description"
          variant="outlined"
          multiline
          rows={4}
          sx={inputStyles}
        />

        {/* Footer Actions */}
        <Button variant="contained" sx={{ ...buttonStyles, mt: 3 }}>Submit</Button>
        <Button variant="outlined" sx={{ ...outlinedButtonStyles, mt: 2 }}>Gallery</Button>

        {/* Footer Branding */}
        <Typography variant="body2" color="#ff0000" mt={4}>
          Biz-Network
        </Typography>
      </Paper>
    </Box>
  );
};

export default UploadDescription;
