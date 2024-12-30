// import { useState, useEffect } from "react";

// import Card from "@mui/material/Card";
// import Table from "@mui/material/Table";

// import TableBody from "@mui/material/TableBody";
// import TableContainer from "@mui/material/TableContainer";
// import TablePagination from "@mui/material/TablePagination";

// import axios from "src/utils/axios";
// import { useParams } from 'react-router-dom';

// import Scrollbar from "../Scrollbar";

// import {
//   TableNoData,
//   TableEmptyRows,
//   WarehouseTableRow,
//   TableToolbar,
//   WarehouseTableHead,
// } from "../table";

// import { emptyRows, applyFilter, getComparator } from "../utils/table";
// import CreateItemModal from "./CreateItemModal";
// import InventoryItemRow from "../table/InventoryItemRow";

// // ----------------------------------------------------------------------

// export default function InventoryPage() {
//   const [page, setPage] = useState(0);
//   const [warehouse, setWarehouse] = useState([]);
//   const [totalCount, setTotalCount] = useState(0);
//   const [createModal, setCreateModal] = useState(false);

//   const [order, setOrder] = useState("asc");

//   const [selected, setSelected] = useState([]);

//   const [orderBy, setOrderBy] = useState("item_id");

//   const [filterName, setFilterName] = useState("");

//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [allMgr, setAllMgr] = useState([]);

//   const { prid } = useParams();
//   const handleSort = (event, id) => {
//     const isAsc = orderBy === id && order === "asc";
//     if (id !== "") {
//       setOrder(isAsc ? "desc" : "asc");
//       setOrderBy(id);
//     }
//   };

//   useEffect(() => {
//     fetchInventoryItems();
//   }, [page, rowsPerPage]);

//   const fetchInventoryItems = async () => {
//     try {
//       const response = await axios.get(
//         `/api/v1/inventory/itemmaster/?page=${page + 1}&page_size=${rowsPerPage}`
//       );
//       setWarehouse(
//         applyFilter({
//           inputData: response.data.results,
//           comparator: getComparator(order, orderBy),
//           filterName,
//         })
//       );

//       setTotalCount(response.data.count);
//     } catch (error) {
//       console.error("Error fetching MasterItems:", error);
//     }
//   };

//   const handleSelectAllClick = (event) => {
//     if (event.target.checked) {
//       const newSelecteds = users.map((n) => n.name);
//       setSelected(newSelecteds);
//       return;
//     }
//     setSelected([]);
//   };

//   const handleClick = (event, name) => {
//     const selectedIndex = selected.indexOf(name);
//     let newSelected = [];
//     if (selectedIndex === -1) {
//       newSelected = newSelected.concat(selected, name);
//     } else if (selectedIndex === 0) {
//       newSelected = newSelected.concat(selected.slice(1));
//     } else if (selectedIndex === selected.length - 1) {
//       newSelected = newSelected.concat(selected.slice(0, -1));
//     } else if (selectedIndex > 0) {
//       newSelected = newSelected.concat(
//         selected.slice(0, selectedIndex),
//         selected.slice(selectedIndex + 1)
//       );
//     }
//     setSelected(newSelected);
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setPage(0);
//     setRowsPerPage(parseInt(event.target.value, 10));
//   };

//   const handleFilterByName = (event) => {
//     setFilterName(event.target.value);
//   };

//   const dataFiltered = applyFilter({
//     inputData: warehouse,
//     comparator: getComparator(order, orderBy),
//     filterName,
//   });

//   const notFound = !warehouse.length && !!filterName;
//   const totalPages = Math.ceil(totalCount / rowsPerPage);
//   return (
//     <Card>
//       <TableToolbar
//         numSelected={selected.length}
//         filterName={filterName}
//         onFilterName={handleFilterByName}
//         name="Inventory"
//         newButton="true"
//         newModal={<CreateItemModal allMgr={allMgr} addRow={fetchInventoryItems} />}
//       />

//       <Scrollbar>
//         <TableContainer sx={{ overflow: "unset" }}>
//           <Table sx={{ minWidth: 800 }}>
//             <WarehouseTableHead
//               order={order}
//               orderBy={orderBy}
//               rowCount={warehouse.length}
//               numSelected={selected.length}
//               onRequestSort={handleSort}
//               onSelectAllClick={handleSelectAllClick}
//               headLabel={[
//                 { id: "item_id", label: "Item ID" },
//                 { id: "name", label: "Name" },
//                 { id: "bar_code", label: "BarCode" },
//                 { id: "unit", label: "Unit" },
//                 { id: "code_type", label: "Identity" },
//                 { id: "desc", label: "Desc" },
//                 { id: "active", label: "Status" },
//                 { id: "" },
//               ]}
//             />
//             <TableBody>
//               {dataFiltered.map((row) => (
//                 <InventoryItemRow
//                   key={row.item_id}
//                   name={row.name}
//                   unit={row.unit}
//                   desc={row.desc}
//                   created_at={row.created_at}
//                   active={row.active}
//                   selected={selected.indexOf(row.name) !== -1}
//                   handleClick={(event) => handleClick(event, row.name)}
//                   id={row.item_id}
//                   code_type={row.code_type}
//                   bar_code={row.bar_code}
//                 />
//               ))}

//               <TableEmptyRows
//                 height={77}
//                 emptyRows={emptyRows(page, rowsPerPage, totalCount)}
//               />

//               {notFound && <TableNoData query={filterName} />}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Scrollbar>

//       <TablePagination
//         id="pagination"
//         page={page}
//         component="div"
//         count={totalCount}
//         rowsPerPage={rowsPerPage}
//         onPageChange={handleChangePage}
//         rowsPerPageOptions={[10, 15, 25]}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />
//     </Card>
//   );
// }
import React from 'react'

const InventoryPage = () => {
  return (
    <div>InventoryPage</div>
  )
}

export default InventoryPage