import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
//Redux
import { useSelector, useDispatch } from "react-redux";
import { deleteProducts } from "../../../../redux/actions/dataActions";
//Mui
import useStyles from "../productStyle";
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
import ProductTop from "./ProductTop";
import ProductFilters from "./ProductFilters";
import ListPaginationActions from "../../../../components/Dashboard/Lists/ListPaginationActions";
import ListTableHead from "../../../../components/Dashboard/Lists/ListTableHead";
import YellowCheckBox from "../../../../components/Dashboard/Checkbox/YellowCheckBox";
import CustomSnackbar from "../../../../components/Dashboard/Snackbar/CustomSnackbar";
import ListSkeletons from "../../../../components/Skeleton/ListSkeletons";

function ProductList() {
  const classes = useStyles();
  const { products, loading } = useSelector((state) => state.data);
  const dispatch = useDispatch();
  const history = useHistory();
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
  } = useFilters(products, search, "product_name", "category");
  const {
    handleClickRow,
    handleRequestSort,
    handleSelectAllClick,
    order,
    orderBy,
    selected,
    setSelected,
    isSelected,
  } = useSort({ data: products, initialOrderBy: "id" });
  const headCells = [
    {
      id: "product_code",
      numeric: false,
      disablePadding: true,
      label: "Product Code",
    },
    {
      id: "product_name",
      numeric: true,
      disablePadding: false,
      label: "Product Name",
    },
    {
      id: "category",
      numeric: true,
      disablePadding: false,
      label: "Category",
    },
    {
      id: "product_price",
      numeric: true,
      disablePadding: false,
      label: "Price",
    },
    {
      id: "product_quantity",
      numeric: true,
      disablePadding: false,
      label: "Quantity",
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

  const filterCategory = (category) => {
    if (category === filterType) {
      setFilterType("");
    } else {
      setFilterType(category);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

  const handleDeleteItems = () => {
    if (selected.length > 0) {
      setSelected([]);
      dispatch(deleteProducts(selected)).then(() => setShowSnackbar(true));
    } else {
      return;
    }
  };

  const handleEditItem = () => {
    if (selected.length === 1) {
      history.push(`/product/edit/${selected[0]}`);
    } else {
      return;
    }
  };

  return (
    <>
      <ProductTop
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
                      .map((product, index) => {
                        const isItemSelected = isSelected(product.id);
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                          <TableRow
                            hover
                            className={classes.tableRow}
                            classes={{ selected: classes.selected }}
                            onClick={(event) =>
                              handleClickRow(event, product.id)
                            }
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={product.id}
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
                              {product.product_code}
                            </TableCell>
                            <TableCell
                              classes={{ root: classes.cellRoot }}
                              align="left"
                            >
                              {product.product_name}
                            </TableCell>
                            <TableCell
                              classes={{ root: classes.cellRoot }}
                              align="left"
                            >
                              {product.category && product.category !== "-"
                                ? product.category
                                : "N/A"}
                            </TableCell>
                            <TableCell
                              classes={{ root: classes.cellRoot }}
                              align="left"
                            >
                              ₱{" "}
                              {product.product_price?.replace(
                                /\B(?=(\d{3})+(?!\d))/g,
                                ","
                              )}
                            </TableCell>
                            <TableCell
                              classes={{ root: classes.cellRoot }}
                              align="left"
                            >
                              {product.status.toLowerCase() === "out of stock"
                                ? "0 pcs"
                                : `${product.product_quantity} ${
                                    product.product_quantity > 1 ? "pcs" : "pc"
                                  }`}
                            </TableCell>
                            <TableCell
                              classes={{ root: classes.cellRoot }}
                              align="left"
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <p
                                className={`no-margin text-capitalize ${
                                  product.status === "In-Stock"
                                    ? ""
                                    : "text-danger"
                                } `}
                              >
                                {product.status}
                              </p>
                            </TableCell>
                            <TableCell
                              classes={{ root: classes.cellRoot }}
                              align="left"
                            >
                              <Link to={`/product/view/${product.id}`}>
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
                          No Products Found
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
          <Paper elevation={0}>
            <ProductFilters
              classes={classes}
              filterCategory={filterCategory}
              selectedCategory={filterType}
              filterStatus={filterStatus}
              selectedStatus={status}
              resetFilters={resetFilters}
              products={products}
              loading={loading}
            />
          </Paper>
        </Grid>
      </Grid>
      <CustomSnackbar
        open={showSnackbar}
        autoHideDuration={1500}
        onClose={() => setShowSnackbar(false)}
        message="Product Successfully Deleted"
      />
    </>
  );
}

export default ProductList;
