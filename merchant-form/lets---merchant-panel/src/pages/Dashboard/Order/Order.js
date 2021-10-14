import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
//Redux
import { useSelector, useDispatch } from "react-redux";
import {
  processOrders,
  cancelOrders,
} from "../../../redux/actions/dataActions";
//Mui
import Grid from "@material-ui/core/Grid";
import ListTopButton from "../../../components/Dashboard/Buttons/ListTopButton";
import OrderPopup from "../../../components/Dashboard/Popup/OrderPopup";
import DeletePopup from "../../../components/Dashboard/Popup/DeletePopup";
import CustomSnackbar from "../../../components/Dashboard/Snackbar/CustomSnackbar";

import OrderDetails from "./OrderDetails";
import OrderHead from "./OrderHead";
function Order({ orderLoading }) {
  const { orderDetails, loading } = useSelector((state) => state.data);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarType, setSnackbarType] = useState("delete");
  const [details, setDetails] = useState({});
  const params = useParams();

  useEffect(() => {
    const findData = orderDetails.filter(
      (order) => order?.transaction_number.toLowerCase() === params.id
    );
    setDetails({ ...findData[0] });
  }, [orderDetails, params.id]);

  const handleClose = () => {
    setOpen(false);
    setOpenDelete(false);
  };

  const confirm = () => {
    if (open) {
      setSnackbarType("complete");
      dispatch(processOrders(details.order_id, details.transaction_number));
    } else {
      dispatch(cancelOrders(details.order_id, details.transaction_number));
    }
    setShowSnackbar(true);
    handleClose();
  };
  return !loading && !orderLoading ? (
    <>
      <OrderHead id={params.id.toUpperCase()} status={details.status} />
      <div className="row">
        <div className="col-xs-12 col-md-4">
          <div className="dash-box d-flex flex-column">
            <div className="mb-3">
              <h5>{details.customer_name}</h5>
              <p className="color-faded-black small">Customer Name</p>
            </div>
            <div className="dash-box-rowborder mb-3">
              <h5>{details.customer_id}</h5>
              <p className="color-faded-black small">Customer ID</p>
            </div>
            <div className="my-3">
              <h4 className="mb-4 color-faded-black text-center">
                Total Order Amount
              </h4>
              <h1 className="color-red big no-margin text-center">
                <span className="medium mr-1">₱</span>
                {details?.total_order_amount
                  ?.toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </h1>
            </div>
          </div>
        </div>
        <div className="col-xs-12 col-md-8">
          <div className="dash-box">
            <div className="row my-1">
              <div className="col-xs-12 col-md-3">
                <p className="no-margin text-center">Product Code</p>
              </div>
              <div className="col-xs-12 col-md-3">
                <p className="no-margin text-center">Product Name</p>
              </div>
              <div className="col-xs-12 col-md-2">
                <p className="no-margin text-center">Product Price</p>
              </div>
              <div className="col-xs-12 col-md-2">
                <p className="no-margin text-center">Quantity</p>
              </div>
              <div className="col-xs-12 col-md-2">
                <p className="no-margin text-center">Total</p>
              </div>
            </div>
            <div className="dash-box-rowborder my-3" />
            <OrderDetails products={details.products} />
          </div>
          {/* <div className="dash-box d-flex">
            <p>Additional Request: </p>
            <p className="ml-5">
              Please put extra ketchup on the burger. And some hot sauce too.
            </p>
          </div> */}
        </div>
        {details.status === "pending" && (
          <Grid container>
            <Grid item md={7} />
            <Grid md={5} className="d-flex">
              <ListTopButton
                variant="outlined"
                fullWidth
                className="mr-4"
                onClick={() => setOpenDelete(true)}
              >
                Cancel Order
              </ListTopButton>
              <ListTopButton fullWidth onClick={() => setOpen(true)}>
                Proceess Order
              </ListTopButton>
            </Grid>
          </Grid>
        )}
      </div>
      <OrderPopup
        open={open}
        handleClose={handleClose}
        order={details}
        confirm={confirm}
      />
      <DeletePopup
        open={openDelete}
        handleClose={handleClose}
        confirmDelete={confirm}
        title="Cancel"
        subtitle={`Transaction Number: ${details.transaction_number}`}
        message="Are you sure you want to cancel this order?"
      />
      <CustomSnackbar
        open={showSnackbar}
        autoHideDuration={1500}
        onClose={() => setShowSnackbar(false)}
        type={snackbarType}
        message={
          snackbarType === "delete"
            ? "Order Successfully Cancelled"
            : "Order Successfully Completed"
        }
      />
    </>
  ) : (
    "loading..."
  );
}

export default Order;
