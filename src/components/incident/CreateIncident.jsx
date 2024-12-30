import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Typography,
  Alert,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  CircularProgress,
  Switch,
  FormControlLabel,
  Divider,
  Input,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Send as SendIcon,
  Security as SecurityIcon,
  Business as BusinessIcon,
  Image as ImageIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Language as LanguageIcon,
  Link as LinkIcon,
} from "@mui/icons-material";

const styles = {
  gradientHeader: {
    background: "linear-gradient(to right, #1976d2, #9c27b0)",
    color: "white",
    borderRadius: "8px 8px 0 0",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", md: "250px 1fr" },
    gap: "24px",
  },
  navigationItem: {
    cursor: "pointer",
    padding: "12px",
    borderRadius: "8px",
    transition: "all 0.2s",
  },
  navigationItemActive: {
    backgroundColor: "#bbdefb",
    color: "#1976d2",
  },
  iconWrapper: {
    padding: "8px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  formSection: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  victimContainer: {
    backgroundColor: "#f5f5f5",
    padding: "16px",
    borderRadius: "8px",
    marginBottom: "16px",
  },
  imageContainer: {
    backgroundColor: "#f5f5f5",
    padding: "16px",
    borderRadius: "8px",
    marginBottom: "16px",
  },
  submitButton: {
    background: "linear-gradient(to right, #1976d2, #9c27b0)",
    color: "white",
    "&:hover": {
      background: "linear-gradient(to right, #1565c0, #7b1fa2)",
    },
  },
};

const SectionHeader = ({ icon: Icon, title, active, onClick, completed }) => (
  <ListItem
    button
    onClick={onClick}
    sx={{
      ...styles.navigationItem,
      ...(active ? styles.navigationItemActive : {}),
    }}
  >
    <ListItemIcon sx={{ position: "relative" }}>
      <Box sx={styles.iconWrapper}>
        <Icon />
        {completed && (
          <CheckCircleIcon
            sx={{
              position: "absolute",
              top: -4,
              right: -4,
              color: "#4caf50",
              backgroundColor: "white",
              borderRadius: "50%",
              fontSize: "16px",
            }}
          />
        )}
      </Box>
    </ListItemIcon>
    <ListItemText primary={title} />
  </ListItem>
);

const ThreatIntelForm = ({item}) => {
  const [formData, setFormData] = useState({
    title: item?.title||"",
    status: item?.status||"",
    url: item?.url||"",
    threatActor: item?.threatActor||{},
    rawContent: item?.rawContent||"",
    publicationDate: item?.publicationDate||"",
    plannedPublicationDate: item?.plannedPublicationDate||"",
    category: item?.category||"",
    network: item?.network||"",
    victims: item?.victims||[],
    images: item?.images||[],
  });
  

  console.log(item);

  const [activeSection, setActiveSection] = useState("basic");
  const [submitStatus, setSubmitStatus] = useState({
    show: false,
    error: false,
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e, section = null, index = null, subfield = null) => {
    console.log(e);
    const { name, value, checked } = e.target;
    const fieldValue = e.target.type === "checkbox" ? checked : value;

    if (section && index !== null && subfield) {
      setFormData((prev) => ({
        ...prev,
        [section]: prev[section].map((item, i) =>
          i === index ? { ...item, [subfield]: fieldValue } : item
        ),
      }));
    } else if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: { ...prev[section], [name]: fieldValue },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: fieldValue,
      }));
    }
  };

  const addArrayItem = (section) => {
    const newItem =
      section === "victims"
        ? { country: "", industry: "", organization: "", site: "" }
        : { description: "", url: "" };

    setFormData((prev) => ({
      ...prev,
      [section]: [...prev[section], newItem],
    }));
  };

  const removeArrayItem = (section, index) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `https://biz-connect-livid.vercel.app/api/v1/incident/incidents/${item?._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      setSubmitStatus({
        show: true,
        error: false,
        message: "Threat intelligence data submitted successfully!",
      });

      setTimeout(() => {
        setSubmitStatus({ show: false, error: false, message: "" });
        setActiveSection("basic");
      }, 3000);
    } catch (error) {
      console.error("Error submitting data:", error);
      setSubmitStatus({
        show: true,
        error: true,
        message: `Error submitting data: ${error.message}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={styles.container}>
      {/* <Card>
        <CardHeader
          sx={styles.gradientHeader}
          title="Threat Intelligence Submission"
          subheader={
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Submit detailed cyber threat intelligence data for analysis
            </Typography>
          }
        />
      </Card> */}

      <Box sx={{ mt: 3, ...styles.grid }}>
        {/* Navigation Sidebar */}
        <Card>
          <List>
            <SectionHeader
              icon={SecurityIcon}
              title="Basic Information"
              active={activeSection === "basic"}
              onClick={() => setActiveSection("basic")}
              completed={formData.title && formData.category}
            />
            <SectionHeader
              icon={WarningIcon}
              title="Threat Actor"
              active={activeSection === "threat"}
              onClick={() => setActiveSection("threat")}
              completed={formData.threatActor.name && formData.threatActor.type}
            />
            <SectionHeader
              icon={BusinessIcon}
              title="Victims"
              active={activeSection === "victims"}
              onClick={() => setActiveSection("victims")}
              completed={formData.victims[0]?.organization}
            />
            <SectionHeader
              icon={ImageIcon}
              title="Evidence"
              active={activeSection === "evidence"}
              onClick={() => setActiveSection("evidence")}
              completed={formData.images[0]?.url}
            />
          </List>
        </Card>

        {/* Main Form Content */}
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {/* Basic Information Section */}
              <Box
                sx={{
                  ...styles.formSection,
                  display: activeSection === "basic" ? "flex" : "none",
                }}
              >
                <Typography variant="h6">Basic Information</Typography>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.status}
                      onChange={handleChange}
                      name="status"
                    />
                  }
                  label="Active Status"
                />
                <TextField
                  fullWidth
                  label="URL"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  label="Network"
                  name="network"
                  value={formData.network}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  label="Raw Content"
                  name="rawContent"
                  value={formData.rawContent}
                  onChange={handleChange}
                  multiline
                  rows={4}
                />
                <TextField
                  fullWidth
                  label="Publication Date"
                  name="publicationDate"
                  type="date"
                  value={formData.publicationDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  fullWidth
                  label="Planned Publication Date"
                  name="plannedPublicationDate"
                  type="date"
                  value={formData.plannedPublicationDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>

              {/* Threat Actor Section */}
              <Box
                sx={{
                  ...styles.formSection,
                  display: activeSection === "threat" ? "flex" : "none",
                }}
              >
                <Typography variant="h6">Threat Actor Information</Typography>
                <TextField
                  fullWidth
                  label="Threat Actor Name"
                  name="name"
                  value={formData.threatActor.name}
                  onChange={(e) => handleChange(e, "threatActor")}
                />
                <TextField
                  fullWidth
                  label="Threat Actor Type"
                  name="type"
                  value={formData.threatActor.type}
                  onChange={(e) => handleChange(e, "threatActor")}
                />
              </Box>

              {/* Victims Section */}
              <Box
                sx={{
                  ...styles.formSection,
                  display: activeSection === "victims" ? "flex" : "none",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6">Victims</Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => addArrayItem("victims")}
                  >
                    Add Victim
                  </Button>
                </Box>

                {formData.victims.map((victim, index) => (
                  <Paper key={index} sx={styles.victimContainer}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <BusinessIcon sx={{ color: "text.secondary" }} />
                        Victim {index + 1}
                      </Typography>
                      <IconButton
                        onClick={() => removeArrayItem("victims", index)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <TextField
                        fullWidth
                        label="Country"
                        value={victim.country}
                        onChange={(e) =>
                          handleChange(e, "victims", index, "country")
                        }
                      />
                      <TextField
                        fullWidth
                        label="Industry"
                        value={victim.industry}
                        onChange={(e) =>
                          handleChange(e, "victims", index, "industry")
                        }
                      />
                      <TextField
                        fullWidth
                        label="Organization"
                        value={victim.organization}
                        onChange={(e) =>
                          handleChange(e, "victims", index, "organization")
                        }
                      />
                      <TextField
                        fullWidth
                        label="Site"
                        value={victim.site}
                        onChange={(e) =>
                          handleChange(e, "victims", index, "site")
                        }
                      />
                    </Box>
                  </Paper>
                ))}
              </Box>

              {/* Evidence Section */}
              <Box
                sx={{
                  ...styles.formSection,
                  display: activeSection === "evidence" ? "flex" : "none",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6">Evidence Images</Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => addArrayItem("images")}
                  >
                    Add Image
                  </Button>
                </Box>

                {formData.images.map((image, index) => (
                  <Paper key={index} sx={styles.imageContainer}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <ImageIcon sx={{ color: "text.secondary" }} />
                        Image {index + 1}
                      </Typography>
                      <IconButton
                        onClick={() => removeArrayItem("images", index)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <TextField
                        fullWidth
                        label="Image Description"
                        value={image.description}
                        onChange={(e) =>
                          handleChange(e, "images", index, "description")
                        }
                      />
                      <TextField
                        fullWidth
                        label="Image URL"
                        value={image.url}
                        onChange={(e) =>
                          handleChange(e, "images", index, "url")
                        }
                      />
                    </Box>
                  </Paper>
                ))}
              </Box>

              {/* Submit Button */}
              {activeSection === "evidence" && (
                <Box
                  sx={{ borderTop: 1, borderColor: "divider", pt: 3, mt: 3 }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={isSubmitting}
                    sx={styles.submitButton}
                    onClick={() => {
                      // if(activeSection=='basic')setActiveSection('threat');
                      // else if(activeSection=='threat')setActiveSection('victims');
                      // else if(activeSection=='victims')setActiveSection('evidence')
                    }}
                    startIcon={
                      isSubmitting ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <SendIcon />
                      )
                    }
                  >
                    {isSubmitting
                      ? "Submitting..."
                      : "Submit Threat Intelligence"}
                  </Button>
                </Box>
              )}

              {/* Status Message */}
              {submitStatus.show && (
                <Box sx={{ mt: 2 }}>
                  <Alert
                    severity={submitStatus.error ? "error" : "success"}
                    icon={
                      submitStatus.error ? <WarningIcon /> : <CheckCircleIcon />
                    }
                  >
                    {submitStatus.message}
                  </Alert>
                </Box>
              )}
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default ThreatIntelForm;
