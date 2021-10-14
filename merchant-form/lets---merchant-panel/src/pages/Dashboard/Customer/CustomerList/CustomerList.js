import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
//Redux
import { useSelector, useDispatch } from "react-redux";
import { banCustomers } from "../../../../redux/actions/dataActions";
//Mui
import useStyles from "../customerStyle";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TablePagination from "@material-ui/core/TablePagination";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
//Components
import CustomerTop from "./CustomerTop";
import CustomerFilters from "./CustomerFilters";
import ListPaginationActions from "../../../../components/Dashboard/Lists/ListPaginationActions";
import ListTableHead from "../../../../components/Dashboard/Lists/ListTableHead";
import YellowCheckBox from "../../../../components/Dashboard/Checkbox/YellowCheckBox";
import { getComparator, stableSort } from "../../../../helpers/sorts";
import useSort from "../../../../hooks/useSort";
import CustomSnackbar from "../../../../components/Dashboard/Snackbar/CustomSnackbar";
import useSearch from "../../../../hooks/useSearch";
import useFilters from "../../../../hooks/useFilters";
import ListSkeletons from "../../../../components/Skeleton/ListSkeletons";

function CustomerList() {
  const classes = useStyles();
  const { customers, loading } = useSelector((state) => state.data);
  const dispatch = useDispatch();
  const history = useHistory();
  const search = useSearch("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(12);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [status, setStatus] = useState("");
  const { data, filterType, setFilterType, resetFilters, setData } = useFilters(
    customers,
    search,
    "first_name",
    "performance_rate"
  );
  const {
    handleClickRow,
    handleRequestSort,
    handleSelectAllClick,
    order,
    orderBy,
    selected,
    setSelected,
    isSelected,
  } = useSort({ data: customers, initialOrderBy: "" });
  const headCells = [
    {
      id: "id",
      numeric: false,
      disablePadding: true,
      label: "Customer ID",
    },
    {
      id: "frist_name",
      numeric: true,
      disablePadding: false,
      label: "Customer Name",
    },
    {
      id: "phone_number",
      numeric: true,
      disablePadding: false,
      label: "Phone Number",
    },
    {
      id: "performance_rate",
      numeric: true,
      disablePadding: false,
      label: "Performance Rate",
    },
    { id: "is_banned", numeric: true, disablePadding: false, label: "Status" },
    { id: "view", numeric: true, disablePadding: false, label: "View" },
  ];

  const filterStatus = (selectedStatus) => {
    if (selectedStatus === status) {
      setStatus("");
    } else {
      setStatus(selectedStatus);
    }
    setData(() => {
      return customers.filter((data) => {
        if (filterType) {
          return data.performance_rate === filterType &&
            selectedStatus !== "online"
            ? data.selectedStatus
            : !data.is_suspended && !data.is_banned;
        } else {
          return selectedStatus !== "online"
            ? data.selectedStatus
            : !data.is_suspended && !data.is_banned;
        }
      });
    });
  };

  const filterPercentRate = (rate) => {
    if (rate === filterType) {
      setFilterType("");
    } else {
      setFilterType(rate);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

  const handleDeleteItems = () => {
    if (selected.length > 0) {
      dispatch(banCustomers(selected)).then(() => setShowSnackbar(true));
      setSelected([]);
    } else {
      return;
    }
  };

  return (
    <>
      <CustomerTop
        search={search}
        handleDeleteItems={handleDeleteItems}
        selected={selected}
      />
      <Grid container spacing={2}>
        <Grid item xs={10}>
          <Paper className={classes.paper} elevation={0}>
            <TableContainer>
              <Table
                className={classes.table}
                aria-labelledby="tableTitle"
                size="medium"
                aria-label="enhanced table"
              >
                <ListTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={data?.length}
                  setSelected={setSelected}
                  headCells={headCells}
                />
                <TableBody>
                  {loading ? (
                    <ListSkeletons />
                  ) : data.length > 0 ? (
                    stableSort(data, getComparator(order, orderBy))
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((customer, index) => {
                        const isItemSelected = isSelected(
                          customer.phone_number
                        );
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                          <TableRow
                            hover
                            className={classes.tableRow}
                            classes={{ selected: classes.selected }}
                            onClick={(event) =>
                              handleClickRow(event, customer.phone_number)
                            }
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={customer.id}
                            selected={isItemSelected}
                          >
                            <TableCell
                              classes={{ root: classes.cellRoot }}
                              padding="checkbox"
                            >
                              <YellowCheckBox
                                checked={isItemSelected}
                                inputProps={{ "aria-labelledby": labelId }}
                              />
                            </TableCell>
                            <TableCell
                              component="th"
                              id={labelId}
                              scope="row"
                              padding="none"
                              classes={{ root: classes.cellRoot }}
                            >
                              {customer.id}
                            </TableCell>
                            <TableCell
                              classes={{ root: classes.cellRoot }}
                              align="left"
                            >
                              {customer.first_name + " " + customer.last_name}
                            </TableCell>
                            <TableCell
                              classes={{ root: classes.cellRoot }}
                              align="left"
                            >
                              {customer.phone_number}
                            </TableCell>
                            <TableCell
                              classes={{ root: classes.cellRoot }}
                              align="left"
                            >
                              {customer.performance_rate?.split(".")[1] + "%"}
                            </TableCell>
                            <TableCell
                              classes={{ root: classes.cellRoot }}
                              align="left"
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <div
                                className={
                                  !customer.is_banned || !customer.is_suspended
                                    ? "circle ellipse-green"
                                    : "circle ellipse-red"
                                }
                              />
                              <p
                                className={`no-margin text-capitalize ${
                                  !customer.is_banned || !customer.is_suspended
                                    ? ""
                                    : "text-danger"
                                } `}
                              >
                                {customer.is_banned
                                  ? "Banned"
                                  : customer.is_suspended
                                  ? "Suspended"
                                  : "Online"}
                              </p>
                            </TableCell>
                            <TableCell
                              classes={{ root: classes.cellRoot }}
                              align="left"
                            >
                              <Link to={`/customer/view/${customer.id}`}>
                                <i className="icon icon-eye text-center"></i>
                              </Link>
                            </TableCell>
                          </TableRow>
                        );
                      })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          className="text-center"
                        >
                          No Customer Found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={7} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              classes={{
                root: classes.paginationRoot,
                spacer: classes.paginationSpacer,
              }}
              className="dash-box-rowborder-top"
              labelDisplayedRows={({ from, to, count }) => (
                <Typography variant="body2" color="textSecondary">
                  Showing {from} to {to} of{" "}
                  {count !== -1 ? `${count} entries` : `more than ${to}`}
                </Typography>
              )}
              rowsPerPageOptions={[]}
              labelRowsPerPage=""
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              colSpan={3}
              ActionsComponent={ListPaginationActions}
            />
          </Paper>
        </Grid>
        <Grid item xs={2}>
          <Paper elevation={0}>
            <CustomerFilters
              classes={classes}
              filterPercentRate={filterPercentRate}
              selectedRate={filterType}
              filterStatus={filterStatus}
              selectedStatus={status}
              resetFilters={resetFilters}
              loading={loading}
              customers={customers}
            />
          </Paper>
        </Grid>
      </Grid>
      <CustomSnackbar
        open={showSnackbar}
        autoHideDuration={1500}
        onClose={() => setShowSnackbar(false)}
        message="Customer Successfully Deleted"
      />
    </>
  );
}

export default CustomerList;
