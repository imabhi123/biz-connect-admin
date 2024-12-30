import { useState, useEffect } from "react";

import Card from "@mui/material/Card";
import Table from "@mui/material/Table";

import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";

import axios from "src/utils/axios";
import { useParams } from "react-router-dom";

import Scrollbar from "../Scrollbar";

import {
  TableNoData,
  TableEmptyRows,
  TableToolbar,
  WarehouseTableHead,
} from "../table";

import { emptyRows, getComparator, applyFilterWarehouse } from "../utils/table";
import InventoryWarehouseRow from "../table/InventoryWarehouseRow";
import { Typography } from '@mui/material';
import Label from "../Label";
import { CardHeader } from '@mui/material';
// ----------------------------------------------------------------------

export default function ItemPage() {
  const [page, setPage] = useState(0);
  const [warehouse, setWarehouse] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("warehouse");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [itemName, setItemName] = useState("");
  const { ItemId } = useParams();

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === "asc";
    if (id !== "") {
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(id);
    }
  };

  useEffect(() => {
    fetchInventoryItems();
  }, [page, rowsPerPage]);

  const fetchInventoryItems = async () => {
    try {
      const response = await axios.get(
        `/api/v1/inventory/warehouseitem/?item_id=${ItemId}&page=${
          page + 1
        }&page_size=${rowsPerPage}`
      );
      setWarehouse(
        applyFilterWarehouse({
          inputData: response.data.results,
          comparator: getComparator(order, orderBy),
          filterName,
        })
      );
      setItemName(response.data.results[0].item.name)
      setTotalCount(response.data.count);
    } catch (error) {
      console.error("Error fetching MasterItems:", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilterWarehouse({
    inputData: warehouse,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !warehouse.length && !!filterName;
  const totalPages = Math.ceil(totalCount / rowsPerPage);
  return (
    <Card style={{backgroundColor: "#fff"}}>
      <CardHeader sx={{backgroundColor: "#03A9F4", px: 2, py: 2, color: "#fff"}} title={`Warehouse wise Stock: ${itemName}`}/>
      <br/>
      <Scrollbar>
        <TableContainer sx={{ overflow: "unset" }}>
          <Table sx={{ minWidth: 800 }}>
            <WarehouseTableHead
              order={order}
              orderBy={orderBy}
              rowCount={warehouse.length}
              onRequestSort={handleSort}
              headLabel={[
                { id: "warehouse", label: "Warehouse" },
                { id: "quantity", label: "Quantity" },
                { id: "manager", label: "Manager" },
                { id: "location", label: "Location" },
                { id: "" },
              ]}
            />
            <TableBody>
              {dataFiltered.map((row) => (
                <InventoryWarehouseRow
                  key={row.warehouse.id}
                  warehouse={row.warehouse}
                  item={row.item}
                  quantity={row.quantity}
                  id={row.warehouse.id}
                />
              ))}
              <TableEmptyRows
                height={77}
                emptyRows={emptyRows(page, rowsPerPage, totalCount)}
              />
              {notFound && <TableNoData query={filterName} />}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <TablePagination
        id="pagination"
        page={page}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[10, 15, 25]}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Card>
  );
}
