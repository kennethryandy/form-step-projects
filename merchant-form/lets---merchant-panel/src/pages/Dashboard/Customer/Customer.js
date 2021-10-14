import React, { useEffect, useState } from "react";
import tempProfile from "../../../assets/images/testCustomer.jpg";
import { useParams, useHistory } from "react-router-dom";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
//redux
import { useSelector, useDispatch } from "react-redux";
import { banCustomers } from "../../../redux/actions/dataActions";
//Mui
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import CircleIcon from "@material-ui/icons/FiberManualRecord";
import useStyles from "./customerStyle";
//Components
import Title from "../../../components/Dashboard/Title/Title";
import DeletePopup from "../../../components/Dashboard/Popup/DeletePopup";
import CustomSnackbar from "../../../components/Dashboard/Snackbar/CustomSnackbar";

const Customer = ({ type, customerLoading }) => {
  const { customers, orders, loading } = useSelector((state) => state.data);
  const dispatch = useDispatch();
  const slug = useParams();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({});
  const [customerOrders, setCustomerOrders] = useState([]);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const classes = useStyles({isBanned: customerDetails?.is_banned});

  useEffect(() => {
    if (slug.id) {
      const customer = customers.find(
        (customer) => slug.id === customer.id.toString()
      );
      setCustomerDetails(customer);
      if (customer) {
        const findOrders = orders.filter((order) => {
          return (
            order.customer_phone_number === customer.phone_number &&
            order.customer_name ===
              `${customer.first_name} ${customer.last_name}`
          );
        });
        setCustomerOrders(findOrders);
      } else {
        // history.push("/customers");
      }
    }
  }, [slug, customers, orders, history]);

  const handleClose = () => {
    setOpen(false);
  };

  const confirmBan = () => {
    setShowSnackbar(true);
    dispatch(banCustomers([customerDetails.id]));
    handleClose();
  };

  const addDefaultSrc = (e) => {
    e.target.src = tempProfile;
  };

  return loading || customerLoading ? (
    <p>loading...</p>
  ) : (
    <Paper elevation={0}>
      <Title
        id={customerDetails?.id}
        type={type}
        page="customer"
        setOpen={setOpen}
      />
      <div className="dash-box-rowborder" style={{ marginBottom: 16 }} />
      <Grid container spacing={4}>
        <Grid item md={4}>
          <div className={classes.imageSquare}>
            <img
              src={
                customerDetails?.image_url
                  ? `https://api.lets.com.ph/2/public/files/${customerDetails?.image_url}`
                  : tempProfile
              }
              onError={addDefaultSrc}
              alt={customerDetails?.first_name}
            />
          </div>
        </Grid>
        <Grid item md={4}>
          <div className={classes.infos}>
            <Typography
              component="label"
              variant="body2"
              color="textSecondary"
              className={classes.infoLabel}
            >
              Customer Name
            </Typography>
            <Typography variant="body1" className={classes.title}>
              {`${customerDetails?.first_name} ${customerDetails?.last_name}`}
            </Typography>
          </div>
          <div className={classes.infos}>
            <Typography
              component="label"
              variant="body2"
              color="textSecondary"
              className={classes.infoLabel}
            >
              Phone Number
            </Typography>
            <Typography variant="body1">
              {customerDetails?.phone_number}
            </Typography>
          </div>
          <div className={classes.infos}>
            <Typography
              component="label"
              variant="body2"
              color="textSecondary"
              className={classes.infoLabel}
            >
              Performance Rate
            </Typography>
            <Typography variant="body1">
              {customerDetails?.performance_rate?.split(".")[1] + "%"}
            </Typography>
          </div>
        </Grid>
        <Grid item md={4}>
          <div className={classes.infos}>
            <Typography
              component="label"
              variant="body2"
              color="textSecondary"
              className={classes.infoLabel}
            >
              Customer ID
            </Typography>
            <Typography variant="body1">{customerDetails?.id}</Typography>
          </div>
          <div className={classes.infos}>
            <Typography
              component="label"
              variant="body2"
              color="textSecondary"
              className={classes.infoLabel}
            >
              Gender
            </Typography>
            <Typography variant="body1">
              {customerDetails?.gender === "m"
                ? "Male"
                : customerDetails?.gender === "f"
                ? "Female"
                : "Others"}
            </Typography>
          </div>
          <div className={classes.infos}>
            <Typography
              component="label"
              variant="body2"
              color="textSecondary"
              className={classes.infoLabel}
            >
              Status
            </Typography>
            <Typography variant="body1">
              {customerDetails?.is_banned
                ? "Banned"
                : customerDetails?.is_suspended
                ? "Suspended"
                : "Online"}
            </Typography>
          </div>
        </Grid>
      </Grid>
      <Typography varaint="body1" color="textSecondary" className="mt-5 mb-4">
        Recent Order
      </Typography>
      <Grid container spacing={4}>
        {customerOrders.length > 0 &&
          customerOrders.map((order) => (
            <Grid item md={3} key={order.id}>
              <Card className={classes.card} elevation={3}>
                <div className="d-flex align-items-center justify-content-end py-4 card-header">
                  <CircleIcon
                    style={{
                      color:
                        order.status === "processed"
                          ? "#51e57d"
                          : order.status === "cancelled_by_merchant"
                          ? "red"
                          : "#ffc001",
                    }}
                  />
                  <Typography variant="body1" className="text-capitalize">
                    {order.status === "cancelled_by_merchant"
                      ? "Cancelled"
                      : order.status === 'processed' ? "Completed" : order.status}
                  </Typography>
                </div>
                <CardContent classes={{ root: classes.cardContent }}>
                  <div className="d-flex mb-4">
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      className="mr-4"
                    >
                      Transaction Number
                    </Typography>
                    <Typography variant="body1">
                      {order.transaction_number}
                    </Typography>
                  </div>
                  <div className="d-flex my-4">
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      className="mr-4"
                    >
                      Date
                    </Typography>
                    <Typography variant="body1">
                      {dayjs(order.created_at).format("ll")}
                    </Typography>
                  </div>
                  <div className="d-flex">
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      className="align-self-center mr-4"
                    >
                      Total Order Amount
                    </Typography>
                    <Typography variant="body2" className={classes.orderBig}>
                      <span>₱</span>
                      {order.total_order_amount?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </Typography>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
      <DeletePopup
        open={open}
        message={`Are you sure you want to ban this customer? "${customerDetails?.first_name} ${customerDetails?.last_name}"`}
        title="Ban"
        handleClose={handleClose}
        confirmDelete={confirmBan}
      />
      <CustomSnackbar
        open={showSnackbar}
        autoHideDuration={1500}
        onClose={() => setShowSnackbar(false)}
        message="Successfully banned customer."
      />
    </Paper>
  );
};

export default Customer;
