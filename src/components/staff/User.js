import { useState, useEffect } from "react";

import Card from "@mui/material/Card";
import Table from "@mui/material/Table";

import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";

// import { users } from 'src/_mock/user';
// import { getAllUsers } from 'src/redux/slices/user'

import axios from "src/utils/axios";

import Scrollbar from "../Scrollbar";

import {
  TableNoData,
  TableEmptyRows,
  UserTableRow,
  UserTableHead,
  TableToolbar,
} from "../table";

import { emptyRows, applyFilter, getComparator } from "../utils/table";

// ----------------------------------------------------------------------

export default function UserPage() {
  const [page, setPage] = useState(0);
  const [users, setUsers] = useState([]);
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
    fetchUsers();
    fetchGroups();
  }, [page, rowsPerPage]);

  const fetchUsers = async () => {
    try {
      // const response = await axios.get(`/api/v1/accounts/users/?page=${page + 1}&page_size=${rowsPerPage}`);
      const response = await axios.get(
        `/api/v1/accounts/users/?page=${page + 1}&page_size=${rowsPerPage}`
      );
      setUsers(
        applyFilter({
          inputData: response.data.results,
          comparator: getComparator(order, orderBy),
          filterName,
        })
      );

      setTotalCount(response.data.count);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

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

  const dataFiltered = applyFilter({
    inputData: users,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !users.length && !!filterName;
  // const totalPages = Math.ceil(totalCount / rowsPerPage);

  return (
    <Card>
      <TableToolbar
        numSelected={selected.length}
        filterName={filterName}
        onFilterName={handleFilterByName}
        name="User"
        newButton={true}
      />

      <Scrollbar>
        <TableContainer sx={{ overflow: "unset" }}>
          <Table sx={{ minWidth: 800 }}>
            <UserTableHead
              order={order}
              orderBy={orderBy}
              rowCount={users.length}
              numSelected={selected.length}
              onRequestSort={handleSort}
              onSelectAllClick={handleSelectAllClick}
              selectCheckBox={true}
              headLabel={[
                { id: "name", label: "Name" },
                { id: "phone_number", label: "Phone" },
                { id: "city", label: "City" },
                { id: "role", label: "Role" },
                { id: "" },
              ]}
            />
            <TableBody>
              {dataFiltered.map((row) => (
                <UserTableRow
                  key={row.id}
                  name={row.name}
                  email={row.email}
                  groups={row.groups}
                  phone_number={row.phone_number}
                  city={row.city}
                  address={row.address}
                  avatarUrl={row.avatar}
                  selected={selected.indexOf(row.email) !== -1}
                  handleClick={(event) => handleClick(event, row.email)}
                  about={row.about}
                  id={row.id}
                  allGroups={allGroups}
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
