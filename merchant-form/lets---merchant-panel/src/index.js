import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "flatpickr/dist/themes/material_green.css";
import "react-datepicker/dist/react-datepicker.css";
import axios from "./config/axios";
//Redux
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import { SET_AUTHENTICATED } from "./redux/types";
import { getStoreProfile } from "./redux/actions/userAction";

const token = localStorage.userToken;
if (token) {
  axios.defaults.headers.common["Authorization"] = token;
  store.dispatch({ type: SET_AUTHENTICATED });
  store.dispatch(getStoreProfile());
}

//Auto Logout when token expires

// import { logoutUser } from "./redux/actions/userAction";
// import jwtDecode from "jwt-decode";
// const token = localStorage.userToken;
// if (token) {
//   const decodedToken = jwtDecode(token);
//   if (decodedToken.exp * 1000 < Date.now()) {
//     store.dispatch(logoutUser());
//     window.location.href = "/login";
//   } else {
//     axios.defaults.headers.common["Authorization"] = token;
//   }
// }

ReactDOM.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
