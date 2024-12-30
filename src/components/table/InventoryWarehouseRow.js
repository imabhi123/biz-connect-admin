import { useState } from "react";
import PropTypes from "prop-types";

import Stack from "@mui/material/Stack";
import Popover from "@mui/material/Popover";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import Iconify from "../Iconify";

import axios from "src/utils/axios";
import { useSnackbar } from "notistack";
// ----------------------------------------------------------------------

import Label from "../Label";
import EditItemModal from "../inventory/EditItemModal";
import ViewItemModal from "../inventory/ViewItemModal";

export default function InventoryWarehouseRow(props) {
  const [open, setOpen] = useState(null);
  const [dialog, setDialog] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    item: props.item,
    warehouse: props.warehouse,
    quantity: props.quantity,
  });

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={props.selected}>
        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={1}>
              {formData.warehouse.name}
          </Stack>
        </TableCell>
        <TableCell>
          <Label color={formData.quantity>10 ? "primary" : "error"}>
            {formData.quantity} {formData.item.unit}
          </Label>
        </TableCell>
        <TableCell>{formData.warehouse.manager_name}</TableCell>
        <TableCell>{formData.warehouse.tehsil_name}, {formData.warehouse.district} - {formData.warehouse.state}</TableCell>

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
      </Popover>
    </>
  );
}

InventoryWarehouseRow.propTypes = {
  item: PropTypes.any,
  warehouse: PropTypes.any,
  quantity: PropTypes.any,
};
