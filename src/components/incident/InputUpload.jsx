import * as React from "react";
import { styled } from "@mui/material/styles";
import {
  Button,
  Box,
  Typography,
  Paper,
  CircularProgress,
  IconButton,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import ArrayEditModal from "./ArrayEditModal";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const DropZone = styled(Paper)(({ theme, isDragging }) => ({
  border: `2px dashed ${
    isDragging ? theme.palette.primary.main : theme.palette.grey[300]
  }`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  textAlign: "center",
  cursor: "pointer",
  transition: theme.transitions.create(["border", "background-color"]),
  backgroundColor: isDragging ? theme.palette.action.hover : "transparent",
  "&:hover": {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
}));

const FilePreview = styled(Paper)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(1, 2),
  marginTop: theme.spacing(2),
  backgroundColor: theme.palette.grey[50],
}));

export default function InputFileUpload({ onClose,malware,victim }) {
  const [file, setFile] = React.useState(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelection(droppedFile);
  };

  const handleFileSelection = (selectedFile) => {
    if (selectedFile) {
      const validTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv",
      ];
      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
      } else {
        setSnackbar({
          open: true,
          message: "Only .xlsx and .csv files are allowed",
          severity: "error",
        });
      }
    }
  };

  const handleFileChange = (event) => {
    handleFileSelection(event.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("userId", localStorage.getItem("userId"));
    formData.append("file", file);

    try {
      const response = await fetch(
        malware?"https://biz-connect-livid.vercel.app/api/v1/malware/malwares/create-by-fileupload":victim?"https://biz-connect-livid.vercel.app/api/v1/victim/victims/create-by-fileupload":"https://biz-connect-livid.vercel.app/api/v1/incident/incidents/create-by-fileupload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSnackbar({
        open: true,
        message: "Threat intelligence data submitted successfully!",
        severity: "success",
      });
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Error submitting data:", error);
      setSnackbar({
        open: true,
        message: `Error submitting data: ${error.message}`,
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
      <DropZone
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        isDragging={isDragging}
        elevation={0}
      >
        <Box sx={{ mb: 2 }}>
          <CloudUploadIcon color="primary" sx={{ fontSize: 48 }} />
        </Box>

        <Typography variant="h6" gutterBottom>
          Drop your file here or
        </Typography>

        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
          disabled={isSubmitting}
        >
          Browse Files
          <VisuallyHiddenInput
            type="file"
            onChange={handleFileChange}
            accept=".xlsx,.csv"
          />
        </Button>

        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Supports .xlsx and .csv files
        </Typography>
      </DropZone>

      {file && (
        <FilePreview elevation={0}>
          <DescriptionIcon color="action" sx={{ mr: 1 }} />
          <Typography
            variant="body2"
            sx={{
              flex: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              color: "black",
            }}
          >
            {file.name}
          </Typography>
          <IconButton size="small" onClick={() => setFile(null)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </FilePreview>
      )}

      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={!file || isSubmitting}
          startIcon={
            isSubmitting ? <CircularProgress size={20} color="inherit" /> : null
          }
        >
          {isSubmitting ? "Uploading..." : "Upload File"}
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
