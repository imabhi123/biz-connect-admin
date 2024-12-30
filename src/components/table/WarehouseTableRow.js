import { useEffect, useState } from "react";
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

import EditWarehouseModal from "../warehouse/EditWarehouseModal";
import Label from "../Label";
import { FormControlLabel, Switch } from "@mui/material";
import ThreatIntelForm from "../incident/CreateIncident";
import CustomModal from "../incident/Modal";
import ArrayEditModal from "../incident/ArrayEditModal";

export default function WarehouseTableRow(props) {
  const [open, setOpen] = useState(null);
  const [dialog, setDialog] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [flag, setFlag] = useState(props.status);
  const [flag1, setFlag1] = useState(false);
  const [item, setItem] = useState({});
  const [rowsData, setRowsData] = useState([]);
  const mainItem = props.item;
  const headArray=props.headArray;

  useEffect(() => {
    const newArray = [];
    Object.entries(mainItem?.data[0]?.row).forEach(([key, value]) => {
      newArray.push(value);
    });
    setRowsData(newArray);
  }, []);
  console.log(localStorage.getItem("accessToken"), "abhishek");

  const [formData, setFormData] = useState({
    id: props.id,
    title: props.title,
    category: props.category,
    network: props.network,
    name: props.name,
    type: props.type,
    status: props.status,
    id: props.id,
    // tehsil: props.tehsil,
    // tehsil_name: props.tehsil_name,
    // pincode: props.pincode,
    // phone: props.phone,
    // address: props.address,
    // state: props.state,
    // district: props.district,
    // district_name: props.district_name,
    // manager_name: props.manager_name,
    // active: props.active,
  });

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const toggleIncidentStatus = async (incidentId) => {
    try {
      const response = await axios.patch(
        `https://biz-connect-livid.vercel.app/api/v1/incident/incidents/${incidentId}/toggle-status`
      );
      console.log("Incident status updated:", response.data);
      setFlag(response.data?.incident.status);
      return response.data; // Return the updated incident data
    } catch (error) {
      console.error("Failed to toggle incident status:", error);
      return null;
    }
  };

  const toggleActive = async (id, active) => {
    try {
      
      const updatedFormData = {
        ...formData,
        active: !active,
      };
      await new Promise((resolve) => setTimeout(resolve, 500));
      const response = await axios.patch(
        `/api/v1/warehouse/warehouse/${formData.id}/`,
        updatedFormData
      );
      if (response.status === 200 || response.status === 204) {
        enqueueSnackbar("Update success!");
        setFormData(response.data);
      } else {
        console.error("Failed to update Warehouse:", response.data);
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
          {"Make this Warehouse " +
            (formData.active ? "Inactive" : "Active") +
            "?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Make sure you are making correct warehouse as{" "}
            {formData.active ? "Inactive" : "Active"}. {formData.name} -{" "}
            {formData.tehsil_name}
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
      <TableRow
        hover
        tabIndex={-1}
        sx={{}}
        role="checkbox"
        selected={props.selected}
      >
        {headArray?.map((item,index) => (
          <TableCell sx={{ minWidth: "fit-content", minHeight: "100%" }}>
            {rowsData[index]}
          </TableCell>
        ))}
      
        <ArrayEditModal
          array={rowsData}
          array2={headArray}
          setArray={setRowsData}
          actions={true}
          id={mainItem._id}
          keys={mainItem.data[0].row}
          malware={props.malware}
          victim={props.victim}
        />

        {/* <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell> */}
      </TableRow>
      <CustomModal
        content={<ThreatIntelForm item={item} />}
        onClose={() => setFlag1(false)}
        open={flag1}
      />
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
        <MenuItem onClick={handleCloseMenu}>
          <Iconify icon="eva:eye-outline" sx={{ mr: 2 }} />
          View
        </MenuItem>

        <EditWarehouseModal
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

WarehouseTableRow.propTypes = {
  id: PropTypes.any,
  name: PropTypes.any,
  manager: PropTypes.any,
  tehsil: PropTypes.any,
  pincode: PropTypes.any,
  phone: PropTypes.any,
  address: PropTypes.any,
  district: PropTypes.any,
  state: PropTypes.any,
  handleClick: PropTypes.func,
  selected: PropTypes.any,
  active: PropTypes.any,
};
