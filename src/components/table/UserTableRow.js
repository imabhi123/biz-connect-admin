import { useState } from "react";
import PropTypes from "prop-types";

import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Popover from "@mui/material/Popover";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Iconify from "../Iconify";
import { LABLE_COLORS } from "src/config";

// ----------------------------------------------------------------------

import EditUserModal from "../staff/EditUserModal";
import ViewUserModal from "../staff/ViewUserModal";
import Label from "../Label";

export default function UserTableRow(props) {
  const [open, setOpen] = useState(null);

  const [formData, setFormData] = useState({
    id: props.id,
    selected: props.selected,
    name: props.name,
    avatarUrl: props.avatarUrl,
    email: props.email,
    groups: props.groups,
    city: props.city,
    phone_number: props.phone_number,
    address: props.address,
    about: props.about,
  });

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const changeDataAfterUpdate = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  // let group = props.allGroups.find(group => group.id === formData.groups);

  // let groupName = group ? group.name : undefined;
  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={props.selected} key={props.id}>
        <TableCell padding="checkbox">
          <Checkbox
            disableRipple
            checked={props.selected}
            onChange={props.handleClick}
            name="select-cb"
          />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              sx={{ color: "#fff" }}
              alt={formData.name}
              src={formData.avatarUrl}
            />
            <Typography variant="subtitle2" noWrap>
              {formData.name} <br />
              <Typography variant="caption" noWrap color="#666">
                {formData.email}
              </Typography>
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{formData.phone_number}</TableCell>
        <TableCell>{formData.city}</TableCell>
        <TableCell align="left">
          {formData.groups.slice(0, 5).map((group, index) => {
            return <Label color="info" key={index}>{group.name}</Label>;
          })}
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
        <ViewUserModal formData={formData} allGroups={props.allGroups} />
        <EditUserModal
          formData={formData}
          changeDataAfterUpdate={setFormData}
          allGroups={props.allGroups}
        />

        <MenuItem onClick={handleCloseMenu} sx={{ color: "error.main" }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}

UserTableRow.propTypes = {
  avatarUrl: PropTypes.any,
  handleClick: PropTypes.func,
  groups: PropTypes.any,
  name: PropTypes.any,
  email: PropTypes.any,
  selected: PropTypes.any,
  phone_number: PropTypes.any,
  city: PropTypes.any,
  address: PropTypes.any,
  about: PropTypes.any,
};
