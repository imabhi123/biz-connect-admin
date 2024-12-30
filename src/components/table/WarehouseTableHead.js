import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableSortLabel from "@mui/material/TableSortLabel";

import { visuallyHidden } from "../utils/table";

// ----------------------------------------------------------------------

export default function WarehouseTableHead({
  order,
  orderBy,
  rowCount,
  headLabel,
  numSelected,
  onRequestSort,
  onSelectAllClick,
}) {
  const onSort = (property) => (event) => {
    onRequestSort(event, property);
  };

  function convertToNaturalLanguage(variableName) {
    // Replace underscores with spaces
    let words = variableName.replace(/_/g, " ");
  
    // Insert a space before each capital letter, excluding the first word
    words = words.replace(/([a-z])([A-Z])/g, "$1 $2");
  
    // Capitalize the first letter of each word
    return words.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  return (
    <TableHead>
      <TableRow>
        {headLabel.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align || "left"}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ width: headCell.width, minWidth: "fit-content" }}
          >
            <TableSortLabel
              sx={{ minWidth: "fit-content", textWrap: "nowrap" }}
              hideSortIcon
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={onSort(headCell.id)}
            >
              {convertToNaturalLanguage(headCell.label)}
              {orderBy === headCell.id ? (
                <Box sx={{ ...visuallyHidden }}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
         <TableCell
           
          >
            <TableSortLabel
              sx={{ minWidth: "fit-content", textWrap: "nowrap" }}
              
            >
              Actions
            </TableSortLabel>
          </TableCell>
      </TableRow>
    </TableHead>
  );
}

WarehouseTableHead.propTypes = {
  order: PropTypes.oneOf(["asc", "desc"]),
  orderBy: PropTypes.string,
  rowCount: PropTypes.number,
  headLabel: PropTypes.array,
  numSelected: PropTypes.number,
  onRequestSort: PropTypes.func,
  onSelectAllClick: PropTypes.func,
};
