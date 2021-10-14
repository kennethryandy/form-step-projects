import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import dayjs from "dayjs";
//Redux
import { useSelector, useDispatch } from "react-redux";
import { deletePromos } from "../../../../redux/actions/dataActions";
//Mui
import useStyles from "../promoStyle";
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
import PromoTop from "./PromoTop";
import PromoFilters from "./PromoFilters";
import ListPaginationActions from "../../../../components/Dashboard/Lists/ListPaginationActions";
import ListTableHead from "../../../../components/Dashboard/Lists/ListTableHead";
import YellowCheckBox from "../../../../components/Dashboard/Checkbox/YellowCheckBox";
import CustomSnackbar from "../../../../components/Dashboard/Snackbar/CustomSnackbar";
import ListSkeletons from "../../../../components/Skeleton/ListSkeletons";

function PromoList() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const search = useSearch("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(12);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const { promos, loading } = useSelector((state) => state.data);
  const {
    data,
    // filterType,
    // setFilterType,
    setStatus,
    status,
    resetFilters,
    setData,
  } = useFilters(promos, search, "promo", "percentage");
  const {
    handleClickRow,
    handleRequestSort,
    handleSelectAllClick,
    order,
    orderBy,
    selected,
    setSelected,
    isSelected,
  } = useSort({ data: promos, initialOrderBy: "id" });
  const headCells = [
    {
      id: "promo_code",
      numeric: false,
      disablePadding: true,
      label: "Promo Code",
    },
    {
      id: "promo",
      numeric: true,
      disablePadding: false,
      label: "Promo Name",
    },
    {
      id: "percentage",
      numeric: true,
      disablePadding: false,
      label: "Percentage",
    },
    {
      id: "start_date",
      numeric: true,
      disablePadding: false,
      label: "Start Date",
    },
    {
      id: "end_date",
      numeric: true,
      disablePadding: false,
      label: "End Date",
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

  // const filterPercent = (percent) => {
  //   if (percent === filterType) {
  //     setFilterType("");
  //   } else {
  //     setFilterType(percent);
  //   }
  // };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, data?.length - page * rowsPerPage);

  const handleDeleteItems = () => {
    if (selected.length > 0) {
      setSelected([]);
      dispatch(deletePromos(selected)).then(() => setShowSnackbar(true));
    } else {
      return;
    }
  };
  const handleEditItem = () => {
    if (selected.length === 1) {
      history.push(`/promo/edit/${selected[0]}`);
    } else {
      return;
    }
  };

  return (
    <>
      <PromoTop
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
                  ) : data?.length > 0 ? (
                    stableSort(data, getComparator(order, orderBy))
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((promo, index) => {
                        const isItemSelected = isSelected(promo.id);
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                          <TableRow
                            hover
                            className={classes.tableRow}
                            classes={{ selected: classes.selected }}
                            onClick={(event) => handleClickRow(event, promo.id)}
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={promo.id}
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
                              {promo.promo_code}
                            </TableCell>
                            <TableCell
                              classes={{ root: classes.cellRoot }}
                              align="left"
                            >
                              {promo.promo}
                            </TableCell>
                            <TableCell
                              classes={{ root: classes.cellRoot }}
                              align="left"
                            >
                              {promo.percentage.split(".")[0] === "0"
                                ? "Free"
                                : `${
                                    promo.percentage.split(".")[0]
                                  } % Discount`}
                            </TableCell>
                            <TableCell
                              classes={{ root: classes.cellRoot }}
                              align="left"
                            >
                              {dayjs(promo.start_date).format("DD/MM/YYYY")}
                            </TableCell>
                            <TableCell
                              classes={{ root: classes.cellRoot }}
                              align="left"
                            >
                              {dayjs(promo.end_date).format("DD/MM/YYYY")}
                            </TableCell>
                            <TableCell
                              classes={{ root: classes.cellRoot }}
                              align="left"
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              {promo.status === "expired" ? (
                                <>
                                  <div className="circle ellipse-grey" />
                                  <p className="no-margin text-capitalize">
                                    Expired
                                  </p>
                                </>
                              ) : (
                                <>
                                  <div
                                    className={
                                      promo.status === "active"
                                        ? "circle ellipse-green"
                                        : "circle ellipse-red"
                                    }
                                  />
                                  <p
                                    className={`no-margin text-capitalize ${
                                      promo.status === "active"
                                        ? ""
                                        : "text-danger"
                                    } `}
                                  >
                                    {promo.status}
                                  </p>
                                </>
                              )}
                            </TableCell>
                            <TableCell
                              classes={{ root: classes.cellRoot }}
                              align="left"
                            >
                              <Link to={`/promo/view/${promo.id}`}>
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
                          No Promos Found
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
              count={data?.length}
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
            <PromoFilters
              classes={classes}
              setData={setData}
              filterStatus={filterStatus}
              selectedStatus={status}
              resetFilters={resetFilters}
              promos={promos}
              loading={loading}
              status={status}
            />
          </Paper>
        </Grid>
      </Grid>
      <CustomSnackbar
        open={showSnackbar}
        autoHideDuration={1500}
        onClose={() => setShowSnackbar(false)}
        message="Promo Successfully Deleted"
      />
    </>
  );
}

export default PromoList;
