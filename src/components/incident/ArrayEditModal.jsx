import * as React from "react";
import { styled } from "@mui/material/styles";
import {
  Modal,
  Box,
  Button,
  Typography,
  TextField,
  IconButton,
  TableCell,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import Iconify from "../Iconify";
import axiosInstance from "src/utils/axios";
import axios from "axios";

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

const modalStyle = {
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  position: "fixed",
  width: "80vw",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  height: "60vh",
  overflow: "auto",
  borderRadius: "12px",
};
const modalStyle1 = {
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  position: "fixed",
  width: "fit",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  height: "fit",
  overflow: "auto",
  borderRadius: "12px",
};

export default function InputFileUpload({
  array,
  setArray,
  actions,
  id,
  keys,
  array2,
  malware,victim
}) {
  const [file, setFile] = React.useState(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState({
    show: false,
    error: false,
    message: "",
  });
  const [editArray, setEditArray] = React.useState([...array]);
  const [openModal, setOpenModal] = React.useState(false);
  const [headArray, setHeadArray] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  function convertToNaturalLanguage(variableName) {
    // Replace underscores with spaces
    let words = variableName.replace(/_/g, " ");
  
    // Insert a space before each capital letter, excluding the first word
    words = words.replace(/([a-z])([A-Z])/g, "$1 $2");
  
    // Capitalize the first letter of each word
    return words.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  React.useEffect(() => {
    const fetchHeadings = async () => {
      const response = await axiosInstance.post(
        malware?`/api/v1/admin/get-malware-table-headings`:victim?`/api/v1/admin/get-victim-table-headings`:`/api/v1/admin/get-table-headings`,
        {
          userId: localStorage.getItem("userId"),
        }
      );
      console.log(response?.data?.data,'--->sharma')
      setHeadArray(response.data?.data);
    };
    fetchHeadings();
  }, []);

  const deleteIncident = async (id) => {
    try {
      setIsDeleting(true);
      const response = await axios.delete(
        malware?`https://biz-connect-livid.vercel.app/api/v1/malware/malwares/${id}`:victim?`https://biz-connect-livid.vercel.app/api/v1/victim/victims/${id}`:`https://biz-connect-livid.vercel.app/api/v1/incident/incidents/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        console.log("Incident deleted successfully:", response.data);
        setOpen(false);
        setIsDeleting(false);
        return response.data; // Return the response data if you want to use it elsewhere
      }
    } catch (error) {
      console.error("Error deleting incident:", error);
      setIsDeleting(false);
      throw error; // Throw error to handle it in the calling function if needed
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const validTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv",
      ];
      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
      } else {
        alert("Only .xlsx and .csv files are allowed");
      }
    }
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
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setSubmitStatus({
        show: true,
        error: false,
        message: "File uploaded successfully!",
      });
    } catch (error) {
      setSubmitStatus({
        show: true,
        error: true,
        message: `Error: ${error.message}`,
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(
        () => setSubmitStatus({ show: false, error: false, message: "" }),
        3000
      );
    }
  };

  const handleOpenModal = () => {
    setEditArray([...array]);
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  const handleChange = (index, value) => {
    const newArray = [...editArray];
    newArray[index] = value;
    setEditArray(newArray);
  };

  const handleSave = async () => {
    if (!actions) {
      const response = await axiosInstance.put(
        malware?`/api/v1/admin/update-malware-table-heading`:victim?`/api/v1/admin/update-victim-table-heading`:`/api/v1/admin/update-table-heading`,
        {
          userId: localStorage.getItem("userId"),
          headings: editArray,
        }
      );
      if (response.status === 200) {
        setArray(editArray);
        setOpenModal(false);
      }
    } else {
      const rowData = {};
      headArray.forEach(
        (key, index) =>
          (rowData[key] = editArray?.length > index ? editArray[index] : "")
      );
      const response = await axiosInstance.put(malware?`/api/v1/admin/update-malware-rowdata`:victim?`/api/v1/admin/update-victim-rowdata`:`/api/v1/admin/update-rowdata`, {
        userId: localStorage.getItem("userId"),
        rowData,
        incidentId: id,
      });
      if (response.status === 200) {
        setArray(editArray);
        setOpenModal(false);
      }
    }
  };

  return (
    <>
      {false && (
        <Button
          component="label"
          style={{
            background: "blue",
            marginLeft: "auto",
            marginRight: "20px",
          }}
          variant="contained"
          startIcon={<CloudUploadIcon />}
        >
          Upload file
          <VisuallyHiddenInput
            type="file"
            onChange={handleFileChange}
            accept=".xlsx,.csv"
          />
        </Button>
      )}
      {file && !actions && <p>Selected file: {file.name}</p>}
      {false && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={!file || isSubmitting}
        >
          Submit
        </Button>
      )}
      {submitStatus.show && (
        <div style={{ color: submitStatus.error ? "red" : "green" }}>
          {submitStatus.message}
        </div>
      )}
      {!actions && (
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={handleOpenModal}
        >
          Edit Table Headings
        </Button>
      )}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="edit-array-modal"
      >
        <Box sx={modalStyle}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">Edit Table Headings</Typography>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "20px",
            }}
          >
            {headArray.map((item, index) =>{
              console.log(item,'head-item--->')
              return (
              <TextField
                key={index}
                label={convertToNaturalLanguage(item)}
                variant="outlined"
                fullWidth
                margin="normal"
                value={editArray[index]}
                onChange={(e) => handleChange(index, e.target.value)}
              />
            )})}
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            fullWidth
          >
            Save Changes
          </Button>
        </Box>
      </Modal>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="confirm-delete-modal"
      >
        <Box sx={modalStyle1}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">Confirm Deletion</Typography>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography variant="body1" mb={3}>
            Are you sure you want to delete this item? This action cannot be
            undone.
          </Typography>
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => deleteIncident(id)}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Confirm Delete"}
            </Button>
          </Box>
        </Box>
      </Modal>
      {actions && (
        <TableCell>
          <div style={{ display: "flex", gap: "2px" }}>
            <Iconify
              style={{ cursor: "pointer", height: "20px", width: "20px" }}
              onClick={handleOpenModal}
              icon={"bx:edit"}
            />
            <Iconify
              style={{ cursor: "pointer", height: "20px", width: "20px" }}
              icon={"ic:baseline-delete"}
              onClick={() => setOpen(true)}
            />
          </div>
        </TableCell>
      )}
    </>
  );
}
