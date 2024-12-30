import { useState } from "react";
import PropTypes from "prop-types";

import Stack from "@mui/material/Stack";
import Popover from "@mui/material/Popover";
import TableRow from "@mui/material/TableRow";
import MenuItem from "@mui/material/MenuItem";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Iconify from "../Iconify";

import Button from "@mui/material/Button";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "src/utils/axios";
import { useSnackbar } from "notistack";
// ----------------------------------------------------------------------
import Link from '@mui/material/Link';

import Label from "../Label";
import EditItemModal from "../inventory/EditItemModal";
import ViewItemModal from "../inventory/ViewItemModal";

export default function InventoryItemRow(props) {
  const [open, setOpen] = useState(null);
  const [dialog, setDialog] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    item_id: props.id,
    name: props.name,
    unit: props.unit,
    desc: props.desc,
    created_at: props.created_at,
    active: props.active,
    code_type: props.code_type,
    bar_code: props.bar_code
  });

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const toggleActive = async (id, active) => {
    try {
      // console.log(id)
      console.log(!active);
      const updatedFormData = {
        ...formData,
        active: !active,
      };
      await new Promise((resolve) => setTimeout(resolve, 500));
      const response = await axios.patch(
        `/api/v1/inventory/itemmaster/${formData.item_id}/`,
        updatedFormData
      );
      if (response.status === 200 || response.status === 204) {
        enqueueSnackbar("Update success!");
        setFormData(response.data);
      } else {
        console.error("Failed to update Item:", response.data);
        enqueueSnackbar("Update failed!", { variant: "error" });
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Update failed!", { variant: "error" });
    } finally {
      setDialog(false);
    }
  };

  const handleOpenDialog = () => {
    setDialog(true);
  };
  const handleCloseDialog = () => {
    setDialog(false);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  return (
    <>
      <Dialog
        open={dialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Make this Inventory Item " +
            (formData.active ? "Inactive" : "Active") +
            "?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Make sure you are making correct Inventory Item as{" "}
            {formData.active ? "Inactive" : "Active"}. <br />
            {formData.name}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Disagree</Button>
          <Button
            onClick={() => toggleActive(formData.id, formData.active)}
            autoFocus
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      <TableRow hover tabIndex={-1} role="checkbox" selected={props.selected}>
        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Link variant="subtitle2" href={`${formData.item_id}/`} noWrap>
              {formData.item_id}
            </Link>
          </Stack>
        </TableCell>

        <TableCell>{formData.name}</TableCell>
        <TableCell>{formData.bar_code}</TableCell>
        <TableCell>{formData.unit}</TableCell>
        <TableCell>{formData.code_type}</TableCell>
        <TableCell>{formData.desc}</TableCell>
        <TableCell>
          <Label color={formData.active ? "primary" : "error"}>
            {formData.active ? "Active" : "Inactive"}
          </Label>
        </TableCell>
        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <ViewItemModal formData={formData} />
        <EditItemModal
          formData={formData}
          changeDataAfterUpdate={setFormData}
          allMgr={props.allMgr}
        />
        {formData.active ? (
          <MenuItem onClick={handleOpenDialog} sx={{ color: "error.main" }}>
            <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
            Inactive
          </MenuItem>
        ) : (
          <MenuItem onClick={handleOpenDialog} sx={{ color: "green" }}>
            <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
            Active
          </MenuItem>
        )}
      </Popover>
    </>
  );
}

InventoryItemRow.propTypes = {
  item_id: PropTypes.any,
  name: PropTypes.any,
  unit: PropTypes.any,
  desc: PropTypes.any,
  created_at: PropTypes.any,
  active: PropTypes.any,
};
