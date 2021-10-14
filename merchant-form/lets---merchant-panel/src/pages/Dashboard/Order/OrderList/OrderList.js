import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
//Redux
import { useSelector, useDispatch } from "react-redux";
import {
  cancelOrders,
  processOrders,
} from "../../../../redux/actions/dataActions";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
//Mui
import useStyles from "../orderStyle";
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
import { getComparator, stableSort } from "../../../../helpers/sorts";
import useSort from "../../../../hooks/useSort";
import useSearch from "../../../../hooks/useSearch";
import useFilters from "../../../../hooks/useFilters";
import OrderTop from "./OrderTop";
import OrderFilters from "./OrderFilters";
import ListPaginationActions from "../../../../components/Dashboard/Lists/ListPaginationActions";
import ListTableHead from "../../../../components/Dashboard/Lists/ListTableHead";
import YellowCheckBox from "../../../../components/Dashboard/Checkbox/YellowCheckBox";
import ListSkeletons from "../../../../components/Skeleton/ListSkeletons";
import { Snackbar } from "@material-ui/core";
dayjs.extend(localizedFormat);
const OrderList = () => {
  const classes = useStyles();
  const [date, setDate] = useState(null);
  const { orders, loading } = useSelector((state) => state.data);
  const dispatch = useDispatch();
  const search = useSearch("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(12);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const {
    data,
    filterType,
    setFilterType,
    setStatus,
    status,
    resetFilters,
    setByMonths,
  } = useFilters(orders, search, "customer_name", "date");
  const {
    handleClickRow,
    handleRequestSort,
    handleSelectAllClick,
    order,
    orderBy,
    selected,
    setSelected,
    isSelected,
  } = useSort({ data: orders, initialOrderBy: "id" });
  const headCells = [
    {
      id: "transaction_number",
      numeric: false,
      disablePadding: true,
      label: "Transaction Number",
    },
    {
      id: "customer_name",
      numeric: true,
      disablePadding: false,
      label: "Customer Name",
    },
    {
      id: "total_order_amount",
      numeric: true,
      disablePadding: false,
      label: "Order Amount",
    },
    {
      id: "created_at",
      numeric: true,
      disablePadding: false,
      label: "Date",
    },
    { id: "status", numeric: true, disablePadding: false, label: "Status" },
    { id: "view", numeric: true, disablePadding: false, label: "View" },
  ];

  const filterStatus = (selectedStatus) => {
    if (selectedStatus === status) {
      setStatus("");
    } else {
      setStatus(selectedStatus);
    }
  };

  useEffect(() => {
    if (date) {
      filterDate(date);
    }
  }, [date]);
  const filterDate = (d) => {
    if (d === filterType) {
      setFilterType("");
    } else {
      setFilterType(d);
      if (d !== date) {
        setDate(null);
      }
    }
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

  const handleDeleteItems = () => {
    if (selected.length > 0) {
      dispatch(cancelOrders(selected)).then(() => setShowSnackbar(true));
      setSelected([]);
    }
  };

  const handleEditItem = () => {
    if (selected.length > 0) {
      dispatch(processOrders(selected));
      setSelected([]);
    }
  };

  return !loading ? (
    <>
      <OrderTop
        search={search}
        handleDeleteItems={handleDeleteItems}
        handleEditItem={handleEditItem}
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
                    <ListSkeletons length={7} />
                  ) : data.length > 0 ? (
                    stableSort(data, getComparator(order, orderBy))
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((orderItem, index) => {
                        const isItemSelected = isSelected(orderItem.id);
                        const labelId = `enhanced-table-checkbox-${index}`;
                        return (
                          <TableRow
                            hover
                            className={classes.tableRow}
                            classes={{ selected: classes.selected }}
                            onClick={(event) =>
                              handleClickRow(event, orderItem.id)
                            }
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={orderItem.id}
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
                              {orderItem.transaction_number}
                            </TableCell>
                            <TableCell
                              classes={{ root: classes.cellRoot }}
                              align="left"
                            >
                              {orderItem.customer_name}
                            </TableCell>
                            <TableCell
                              classes={{ root: classes.cellRoot }}
                              align="left"
                            >
                              ₱{" "}
                              {orderItem.total_order_amount?.replace(
                                /\B(?=(\d{3})+(?!\d))/g,
                                ","
                              )}
                            </TableCell>
                            <TableCell
                              classes={{ root: classes.cellRoot }}
                              align="left"
                            >
                              {dayjs(orderItem.created_at).format("ll")}
                            </TableCell>
                            <TableCell
                              classes={{ root: classes.cellRoot }}
                              align="left"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                textTransform: "capitalize",
                              }}
                            >
                              <div
                                className={
                                  orderItem.status === "processed"
                                    ? "circle ellipse-green"
                                    : orderItem.status ===
                                      "cancelled_by_merchant"
                                    ? "circle ellipse-red"
                                    : "circle ellipse-yellow"
                                }
                              />
                              <p
                                className={`table-data ${
                                  orderItem.status === "processed"
                                    ? "text-success"
                                    : orderItem.status ===
                                      "cancelled_by_merchant"
                                    ? "text-danger"
                                    : "text-warning"
                                }`}
                              >
                                {orderItem.status === "cancelled_by_merchant"
                                  ? "cancelled"
                                  : orderItem.status === "processed"
                                  ? "completed"
                                  : orderItem.status}
                              </p>
                            </TableCell>
                            <TableCell
                              classes={{ root: classes.cellRoot }}
                              align="left"
                            >
                              <Link
                                to={`/order/view/${orderItem.transaction_number?.toLowerCase()}`}
                              >
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
                          No Orders Found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 30 * emptyRows }}>
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
          <Paper>
            <OrderFilters
              filterDate={filterDate}
              selectedDate={filterType}
              selectedStatus={status}
              filterStatus={filterStatus}
              resetFilters={resetFilters}
              orders={orders}
              loading={loading}
              classes={classes}
              date={date}
              setDate={setDate}
              setByMonths={setByMonths}
            />
          </Paper>
        </Grid>
      </Grid>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        message="Order Successfully Cancelled"
        className={classes.snackbar}
        classes={{ root: classes.snackBarError }}
      />
    </>
  ) : (
    <p>loading ...</p>
  );
};

export default OrderList;
