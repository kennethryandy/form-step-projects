import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./../../assets/css/style.css";
import "./Dashboard.css";

import Sidebar from "./../../components/Dashboard/Sidebar";
import { makeStyles } from "@material-ui/core/styles";
//Redux
import { useSelector, useDispatch } from "react-redux";
import {
  getAllProducts,
  // getAllPromos,
  getAllOrders,
  getAllCustomers,
  generateProductCode,
} from "../../redux/actions/dataActions";
import axios from "../../config/axios";
//swr
import useSWR from "swr";

const fetcherGet = (url) => axios.get(url).then((res) => res.data);
const options = {
  revalidateOnFocus: true,
  revalidateOnMount: true,
};

const useStyles = makeStyles((theme) => ({
  headerSpacer: {
    ...theme.mixins.toolbar,
    [theme.breakpoints.up("sm")]: {
      marginBottom: 64,
    },
  },
}));

const Dashboard = ({ childComp, page, shouldFetch }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.user.authenticated);
  const history = useHistory();
  useEffect(() => {
    if (!isAuth) {
      history.push("/login");
    }
  }, [isAuth, history]);

  const { data: products } = useSWR(
    // (isAuth && shouldFetch) || page === "orders" ? "/product" : null,
    isAuth ? "/product" : null,
    fetcherGet,
    options
  );

  const { data: productCode } = useSWR(
    isAuth ? "/product/generate-code" : null,
    fetcherGet,
    options
  );
  const { data: orders, error: _, isValidating: orderLoading } = useSWR(
    isAuth ? "/order" : null,
    fetcherGet,
    options
  );
  const { data: customers, error: __, isValidating: customerLoading } = useSWR(
    isAuth ? "/customer" : null,
    fetcherGet,
    {
      ...options,
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    if (products) {
      dispatch(generateProductCode(productCode?.product_code));
      dispatch(getAllProducts(products?.data));
    }
  }, [products, productCode, dispatch]);

  useEffect(() => {
    if (orders && products) {
      dispatch(getAllOrders(orders?.data, products?.data));
    }
  }, [orders, products, dispatch]);

  useEffect(() => {
    if (customers) {
      dispatch(getAllCustomers(customers.data));
    }
  }, [customers, dispatch]);

  return (
    <div id="wrapper">
      <Sidebar page={page} />

      <div id="content-wrapper" className="dashboard-panel d-flex flex-column">
        <div id="content">
          {/* <Header /> */}
          <div className="dasbboard-content">
            <div className={classes.headerSpacer} />
            {childComp}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
