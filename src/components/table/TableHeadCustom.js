// import PropTypes from 'prop-types'
// // @mui
// import { Box, Checkbox, TableRow, TableCell, TableHead, TableSortLabel } from '@mui/material'

// // ----------------------------------------------------------------------

// const visuallyHidden = {
//   border: 0,
//   margin: -1,
//   padding: 0,
//   width: '1px',
//   height: '1px',
//   overflow: 'hidden',
//   position: 'absolute',
//   whiteSpace: 'nowrap',
//   clip: 'rect(0 0 0 0)'
// }

// // ----------------------------------------------------------------------

// TableHeadCustom.propTypes = {
//   onSort: PropTypes.func,
//   orderBy: PropTypes.string,
//   headLabel: PropTypes.array,
//   rowCount: PropTypes.number,
//   numSelected: PropTypes.number,
//   onSelectAllRows: PropTypes.func,
//   order: PropTypes.oneOf(['asc', 'desc']),
//   sx: PropTypes.object
// }

// export default function TableHeadCustom({ order, orderBy, rowCount = 0, headLabel, numSelected = 0, onSort, onSelectAllRows, sx }) {
//   return (
//     <TableHead sx={sx}>
//       <TableRow>
//         {headLabel.map((headCell) => (
//           <TableCell
//             key={headCell.id}
//             align={headCell.align || 'left'}
//             sortDirection={orderBy === headCell.id ? order : false}
//             sx={{ width: headCell.width, minWidth: headCell.minWidth }}
//           >
//             {onSort ? (
//               <TableSortLabel
//                 hideSortIcon
//                 active={orderBy === headCell.id}
//                 direction={orderBy === headCell.id ? order : 'asc'}
//                 onClick={() => onSort(headCell.id)}
//                 sx={{ textTransform: 'capitalize' }}
//               >
//                 {headCell.label}

//                 {orderBy === headCell.id ? (
//                   <Box sx={{ ...visuallyHidden }}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</Box>
//                 ) : null}
//               </TableSortLabel>
//             ) : (
//               headCell.label
//             )}
//           </TableCell>
//         ))}
//       </TableRow>
//     </TableHead>
//   )
// }

import React from "react";
import PropTypes from "prop-types";
import {
  TableHead,
  TableRow,
  TableCell,
  Checkbox,
  TableSortLabel,
  Box,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";

export default function TableHeadCustom({
  headCells,
  onSelectAllClick,
  order,
  orderBy,
  numSelected,
  rowCount,
  onRequestSort,
  checkboxes,
}) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {checkboxes && (
          <TableCell padding="checkbox">
            <Checkbox
              disabled={!rowCount}
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                "aria-label": "select all items",
              }}
            />
          </TableCell>
        )}
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={"left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.sortable ? ( // Render TableSortLabel only if sortable is true
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              headCell.label // Render just the label if not sortable
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

TableHeadCustom.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  headCells: PropTypes.array.isRequired,
  checkboxes: PropTypes.bool,
};
