import { useState, useEffect } from "react";

import Card from "@mui/material/Card";
import Table from "@mui/material/Table";

import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";

// import { users } from 'src/_mock/user';
// import { getAllUsers } from 'src/redux/slices/user'

import axios from "src/utils/axios";

import Scrollbar from "../Scrollbar";

import {
  TableNoData,
  TableEmptyRows,
  RoleTableRow,
  UserTableHead,
  TableToolbar,
} from "../table";

import { emptyRows, applyFilter, getComparator } from "../utils/table";

// ----------------------------------------------------------------------

export default function RolePage() {
  const [page, setPage] = useState(0);
  const [allGroups, setAllGroups] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const [order, setOrder] = useState("asc");

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState("name");

  const [filterName, setFilterName] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === "asc";
    if (id !== "") {
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(id);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [page, rowsPerPage]);

  const fetchGroups = async () => {
    try {
      const response = await axios.get(`/api/v1/accounts/groups/`);
      setAllGroups(response.data.results);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: allGroups,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !allGroups.length && !!filterName;
  // const totalPages = Math.ceil(totalCount / rowsPerPage);

  return (
    <Card>
      <TableToolbar
        numSelected={selected.length}
        filterName={filterName}
        onFilterName={handleFilterByName}
        name="Role"
      />

      <Scrollbar>
        <TableContainer sx={{ overflow: "unset" }}>
          <Table>
            <UserTableHead
              order={order}
              orderBy={orderBy}
              rowCount={allGroups.length}
              numSelected={selected.length}
              onRequestSort={handleSort}
              onSelectAllClick={handleSelectAllClick}
              headLabel={[{ id: "name", label: "Roles" }]}
            />
            <TableBody>
              {dataFiltered.map((row) => (
                <RoleTableRow
                  key={row.id}
                  name={row.name}
                  handleClick={(event) => handleClick(event, row.email)}
                  id={row.id}
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
    </Card>
  );
}
