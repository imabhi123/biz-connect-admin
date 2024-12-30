import * as React from "react";
import Modal from "@mui/material/Modal";
import * as Yup from "yup";
import { useState, useEffect } from "react";

// @mui
import { Box, Grid, Card } from "@mui/material";

import MenuItem from "@mui/material/MenuItem";
import Iconify from "../Iconify";
import { IconButton } from "@mui/material";

import { Typography } from "@mui/material";
import Label from "../Label";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ViewUserModal = (props) => {
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = useState(props.formData);
  const [emailOpen, setEmailOpen] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(
    props.formData.groups?.[0]?.name || null
  );

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleClickEmail = (email) => {
    window.location.href = `mailto:${email}`;
  };
  useEffect(() => {}, []);

  return (
    <div>
      <MenuItem onClick={handleOpen}>
        <Iconify icon="eva:eye-outline" sx={{ mr: 2 }} />
        View
      </MenuItem>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={12}>
              <Card sx={{ py: 1, px: 1, textAlign: "left" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        {formData.name}
                        <Label color="primary" sx={{ marginLeft: 2 }}>
                          {selectedGroup}
                        </Label>
                      </Box>
                    </Typography>

                    <IconButton
                      onClick={() => handleClickEmail(formData.email)}
                    >
                      <Iconify
                        icon={"eva:email-outline"}
                        width={24}
                        height={24}
                      />
                    </IconButton>
                    <Typography variant="caption" color="text.primary">
                      {formData.email}
                    </Typography>
                    <br />

                    {formData.phone_number && (
                      <Grid>
                        <IconButton>
                          <Iconify
                            icon={"eva:phone-outline"}
                            width={24}
                            height={24}
                          />
                        </IconButton>
                        <Typography variant="caption" color="text.primary">
                          {formData.phone_number}
                        </Typography>
                      </Grid>
                    )}
                    <IconButton>
                      <Iconify
                        icon={"eva:home-outline"}
                        width={24}
                        height={24}
                      />
                    </IconButton>
                    <Typography variant="caption" color="text.primary">
                      {formData.address} {formData.city}
                    </Typography>

                    {formData.about && (
                      <Grid>
                        <IconButton>
                          <Iconify
                            icon={"eva:info-outline"}
                            width={24}
                            height={24}
                          />
                        </IconButton>
                        <Typography variant="caption" color="text.primary">
                          {formData.about}
                        </Typography>
                      </Grid>
                    )}
                  </Box>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
};
export default ViewUserModal;
