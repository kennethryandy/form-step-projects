import React, { useEffect } from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./config/muiTheme";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
} from "react-router-dom";

import "./assets/css/sb-admin-2.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// template
// import Base from "./templates/Base";
import Login from "./templates/Login";
import Dashboard from "./templates/Dashboard";

// page
import PageNotFound from "./pages/PageNotFound";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";

//Auth Route
import AuthRoute from "./util/AuthRoute";
// dashoboard pages
// import DashMain from "./pages/Dashboard/Main";
import DashProduct from "./pages/Dashboard/Product";
import ProductList from "./pages/Dashboard/Product/ProductList/ProductList";
import DashStore from "./pages/Dashboard/StoreProfile";
import DashOrder from "./pages/Dashboard/Order/Order";
// import OrderDetails from "./pages/Dashboard/Order/OrderDetails";
// import DashWallet from "./pages/Dashboard/Wallet/Wallet";
// import Promo from "./pages/Dashboard/Promo/Promo";
// import PromoList from "./pages/Dashboard/Promo/PromoList/PromoList";
import OrderList from "./pages/Dashboard/Order/OrderList/OrderList";
import CustomerList from "./pages/Dashboard/Customer/CustomerList/CustomerList";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import EditStore from "./pages/Dashboard/StoreProfile/EditStore";
import Category from "./pages/Dashboard/Product/Categories/Category";
import Customer from "./pages/Dashboard/Customer/Customer";
import NewAccount from "./pages/NewAccount/NewAccount";
import TermsAndCondition from "./pages/Terms/TermsAndCondition";
// import Maintanance from "./templates/Maintanance/Maintanance";
//Redux
// import { useSelector, useDispatch } from "react-redux";
// import {
//   getAllProducts,
//   getAllPromos,
//   getAllOrders,
//   getAllCustomers,
//   generateProductCode,
// } from "./redux/actions/dataActions";
// import axios from "./config/axios";
// //swr
// import useSWR from "swr";

// const fetcherGet = (url) => axios.get(url).then((res) => res.data);
// const options = {
//   revalidateOnFocus: false,
// };
const App = () => {
  // const dispatch = useDispatch();
  // const isAuth = useSelector((state) => state.user.authenticated);
  // const { data: products } = useSWR(
  //   isAuth ? "/product" : null,
  //   fetcherGet,
  //   options
  // );
  // const { data: productCode } = useSWR(
  //   isAuth ? "/product/generate-code" : null,
  //   fetcherGet,
  //   options
  // );
  // const { data: orders, error: _, isValidating: orderLoading } = useSWR(
  //   isAuth ? "/order" : null,
  //   fetcherGet,
  //   options
  // );
  // const { data: customers, error: __, isValidating: customerLoading } = useSWR(
  //   isAuth ? "/customer" : null,
  //   fetcherGet,
  //   {
  //     ...options,
  //     revalidateOnFocus: false,
  //   }
  // );

  // useEffect(() => {
  //   if (products) {
  //     dispatch(generateProductCode(productCode?.product_code));
  //     dispatch(getAllProducts(products?.data));
  //   }
  // }, [products, productCode, dispatch]);

  // useEffect(() => {
  //   if (orders && products) {
  //     dispatch(getAllOrders(orders?.data, products?.data));
  //   }
  // }, [orders, products, dispatch]);

  // useEffect(() => {
  //   if (customers) {
  //     dispatch(getAllCustomers(customers.data));
  //   }
  // }, [customers, dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <AuthRoute
            exact
            path="/home"
            component={() => <Login page="sign-in" childComp={<Signin />} />}
          />
          <AuthRoute
            exact
            path="/"
            component={() => <Login page="sign-in" childComp={<Signin />} />}
          />
          <AuthRoute
            exact
            path="/login"
            component={() => <Login page="sign-in" childComp={<Signin />} />}
          />
          <AuthRoute exact path="/register" component={() => <Signup />} />
          <AuthRoute
            exact
            path="/forgot-password"
            component={() => <ForgotPassword />}
          />
          <Route exact path="/terms" component={() => <TermsAndCondition />} />
          <Route
            exact
            path="/new-account/:token"
            render={() => {
              return (
                <Login>
                  <NewAccount />
                </Login>
              );
            }}
          />
          <Route
            exact
            path="/reset-password/:token"
            render={() => {
              return (
                <Login>
                  <NewAccount />
                </Login>
              );
            }}
          />
          <Route
            exact
            path="/orders"
            render={() => {
              return (
                <Dashboard
                  page="orders"
                  shouldFetch
                  childComp={<OrderList type="view" path="order" />}
                />
              );
            }}
          />
          <Route
            exact
            path="/order/view/:id"
            render={() => {
              return (
                <Dashboard
                  page="orders"
                  childComp={
                    <DashOrder
                      type="view"
                      path="order"
                      // orderLoading={orderLoading}
                    />
                  }
                />
              );
            }}
          />
          <Route
            exact
            path="/products"
            render={() => {
              return (
                <Dashboard
                  shouldFetch
                  page="products"
                  childComp={<ProductList />}
                />
              );
            }}
          />
          <Route
            exact
            path="/product/add"
            component={(props) => (
              <Dashboard
                shouldFetch
                page="new_product"
                childComp={<DashProduct type="add" {...props} />}
              />
            )}
          />
          <Route
            exact
            path="/product/view/:id"
            render={() => {
              return (
                <Dashboard
                  shouldFetch
                  page="products"
                  childComp={<DashProduct type="view" />}
                />
              );
            }}
          />
          <Route
            exact
            path="/product/edit/:id"
            render={() => {
              return (
                <Dashboard
                  page="products"
                  childComp={<DashProduct type="edit" />}
                />
              );
            }}
          />
          <Route
            exact
            path="/product/categories"
            render={() => {
              return <Dashboard page="category" childComp={<Category />} />;
            }}
          />
          {/* <Route
            // exact+
            path="/promos"
            render={() => {
              // dispatch(getAllPromos());
              // return (
              //   <Dashboard
              //     page="promos"
              //     childComp={<PromoList type="view" path="promos" />}
              //   />
              // );

              //Maintanance
              return (
                <Dashboard
                  page="promos"
                  childComp={<Maintanance type="unavailable" page="promos" />}
                />
              );
            }}
          />
          <Route
            exact
            path="/promo/view/:id"
            render={() => {
              // dispatch(getAllPromos());
              // return (
              //   <Dashboard
              //     page="promos"
              //     childComp={<Promo type="view" path="promos" />}
              //   />
              // );
              return (
                <Dashboard
                  page="promos"
                  childComp={<Maintanance type="unavailable" page="promos" />}
                />
              );
            }}
          />
          <Route
            exact
            path="/promo/edit/:id"
            render={() => {
              // dispatch(getAllPromos());
              // return (
              //   <Dashboard
              //     page="promos"
              //     childComp={<Promo type="edit" path="promos" />}
              //   />
              // );
              return (
                <Dashboard
                  page="promos"
                  childComp={<Maintanance type="unavailable" page="promos" />}
                />
              );
            }}
          />
          <Route
            exact
            path="/promo/add"
            component={() => (
              // <Dashboard
              //   page="promos"
              //   childComp={<Promo type="add" path="promos" />}
              // />
              <Dashboard
                page="promos"
                childComp={<Maintanance type="unavailable" page="promos" />}
              />
            )}
          /> */}
          <Route
            exact
            path="/customers"
            render={() => {
              return (
                <Dashboard
                  page="customers"
                  childComp={<CustomerList path="customers" />}
                />
              );
            }}
          />
          <Route
            exact
            path="/customer/view/:id"
            render={() => {
              return (
                <Dashboard
                  page="customers"
                  childComp={
                    <Customer
                      type="view"
                      path="customers"
                      // customerLoading={customerLoading}
                    />
                  }
                />
              );
            }}
          />
          {/* <Route
            exact
            path="/wallet"
            component={() => (
              // <Dashboard
              //   page="wallet"
              //   childComp={<DashWallet type="view" path="wallet" />}
              // />
              <Dashboard
                page="wallet"
                childComp={<Maintanance type="unavailable" page="wallet" />}
              />
            )}
          /> */}
          <Route
            exact
            path="/store"
            component={() => (
              <Dashboard page="store" childComp={<DashStore type="view" />} />
            )}
          />
          <Route
            exact
            path="/store/edit"
            component={() => (
              <Dashboard page="store" childComp={<EditStore type="edit" />} />
            )}
          />
          <Route
            path="/dashboard/*"
            component={() => <Dashboard childComp={<PageNotFound />} />}
          />
          <Route
            path="*"
            component={() => <Dashboard childComp={<PageNotFound />} />}
          />
        </Switch>
      </Router>
    </ThemeProvider>
  );
};
export default App;
