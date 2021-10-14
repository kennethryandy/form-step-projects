import {
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_STORE_PROFILE,
  LOADING_USER,
  CLEAR_STEPS,
} from "../types";
import axios from "../../config/axios";
import { setCategory } from "../actions/categoryActions";
import { persistor } from "../store";

//Login User
export const loginUser = (userData, history) => async (dispatch) => {
  dispatch({ type: LOADING_UI });
  try {
    const res = await axios.post("/sign-in", userData);
    if (res.data.success) {
      setAuthorizationHeaders(res.data.token);
      dispatch(getStoreProfile());
      dispatch({ type: CLEAR_STEPS });
      dispatch({ type: CLEAR_ERRORS });
      dispatch({ type: SET_AUTHENTICATED });
      history.push("/store");
    } else {
      dispatch({
        type: SET_ERRORS,
        payload: res.data.message,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//Signup User
export const signupUser = (history) => async (dispatch, getState) => {
  dispatch({ type: LOADING_UI });
  const newUserData = {
    ...getState().registerSteps.stepOne,
    ...getState().registerSteps.stepTwo,
  };
  try {
    const res = await axios.post("/sign-up", newUserData);
    if (res.data.success) {
      setAuthorizationHeaders(res.data.token);
      dispatch(getStoreProfile());
      dispatch({ type: CLEAR_ERRORS });
      dispatch({ type: SET_AUTHENTICATED });
      history.push("/store");
    } else if (res.data.success === false) {
      dispatch({
        type: SET_ERRORS,
        payload: res.data.message,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//Logout user
export const logoutUser = (history) => async (dispatch) => {
  try {
    await axios.post("/sign-out");
    dispatch({ type: SET_UNAUTHENTICATED });
    localStorage.removeItem("userToken");
    delete axios.defaults.headers.common["Authorization"];
    persistor.purge().then(localStorage.removeItem("persist:root"));
    if (history) {
      history.push("/login");
    }
  } catch (error) {
    if (history) {
      history.push("/login");
    }
    console.error(error);
  }
};

//Get user store profile
export const getStoreProfile = () => async (dispatch) => {
  try {
    const res = await axios.get("/store/profile");
    if (res.data.success) {
      dispatch({
        type: SET_STORE_PROFILE,
        payload: res.data.data[0],
      });
      if (res.data.data[0].category) {
        dispatch(
          setCategory({ item: res.data.data[0].category, default: false })
        );
      }
    } else {
      console.log("ERROR: ", res.data);
    }
  } catch (error) {
    console.log(error);
  }
};

//Deactivate Store
export const deactivateStore = () => async (dispatch) => {
  dispatch({ type: LOADING_USER });
  try {
    const res = await axios.put("/store/profile/deactivate");
    if (res.data.success) {
      dispatch(getStoreProfile());
    } else {
      console.log(res.data);
    }
  } catch (error) {
    console.log(error);
  }
};
//Activate Store
export const activateStore = () => async (dispatch) => {
  dispatch({ type: LOADING_USER });
  try {
    const res = await axios.put("/store/profile/activate");
    if (res.data.success) {
      dispatch(getStoreProfile());
    } else {
      console.log(res.data);
    }
  } catch (error) {
    console.log(error);
  }
};

//Permanently Delete Store
export const permaDeleteStore = () => async (dispatch) => {
  dispatch({ type: LOADING_USER });
  try {
    const res = await axios.put("/store/profile/permanently-delete");
    if (res.data.success) {
      dispatch(getStoreProfile());
    } else {
      console.log(res.data);
    }
  } catch (error) {
    console.error(error);
  }
};

//Upload store logo
export const uploadStoreLogo = (formData) => async (dispatch) => {
  try {
    const res = await axios.post("/upload-file", formData);
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

//Edit Store
export const editStore = (updatedData) => async (dispatch) => {
  try {
    const res = await axios.put("/store/profile/update", updatedData);
    if (res.data.success) {
      dispatch(getStoreProfile());
    } else {
      console.log(res.data);
    }
    return res.data.success;
  } catch (error) {
    console.log(error);
  }
};

//Forgot Password
export const forgotPassword = async (params) => {
  try {
    return await axios.post("/forgot-password", params);
  } catch (error) {
    console.error(error);
  }
};

//Reset Password
export const resetPassword = async (params) => {
  try {
    return await axios.post("/reset-password", params);
  } catch (error) {
    console.error(error);
  }
};

//Set axios headers
export const setAuthorizationHeaders = (token) => {
  const userToken = `Bearer ${token}`;
  localStorage.setItem("userToken", userToken);
  axios.defaults.headers.common["Authorization"] = userToken;
};
