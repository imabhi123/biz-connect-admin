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

import { styled } from "@mui/material/styles";

const Div = styled("div")(({ theme }) => ({
  ...theme.typography.h5,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1),
}));

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

const ViewItemModal = (props) => {
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = useState(props.formData);
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
            <Div>{formData.name}</Div>
              <Card sx={{ py: 1, px: 1, textAlign: "left" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
};
export default ViewItemModal;
