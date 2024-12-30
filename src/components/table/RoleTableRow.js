import { useState } from "react";
import PropTypes from "prop-types";

import Stack from "@mui/material/Stack";
import TableRow from "@mui/material/TableRow";

import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
export default function UserTableRow(props) {
  const [open, setOpen] = useState(null);

  const [formData, setFormData] = useState({
    id: props.id,
    selected: props.selected,
    name: props.name,
    permissions: props.permissions,
  });

  const changeDataAfterUpdate = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={props.selected} >
        <TableCell component="th" scope="row" padding="normal">
          <Stack direction="row" alignItems="center" spacing={4}>
            <Typography variant="subtitle" noWrap>
              {formData.name}
            </Typography>
          </Stack>
        </TableCell>
      </TableRow>
    </>
  );
}

UserTableRow.propTypes = {
  avatarUrl: PropTypes.any,
  handleClick: PropTypes.func,
  permissions: PropTypes.any,
  name: PropTypes.any,
  selected: PropTypes.any,
};
