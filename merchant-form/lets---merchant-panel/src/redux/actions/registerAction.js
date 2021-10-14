import {
  NEXT_STEP,
  PREV_STEP,
  SET_STEP_ONE,
  SET_STEP_TWO,
  CLEAR_ERRORS,
  CLEAR_ERROR_STEP,
  SET_ERROR_STEP,
  LOADING_STEPS,
  SAVE_INPUT_DATA,
  STOP_LOADING_STEPS,
  SET_AUTHENTICATED,
} from "../types";
import axios from "../../config/axios";
import { convertTime12to24 } from "../../helpers/timeConverter";
import { getStoreProfile, setAuthorizationHeaders } from "./userAction";
export const nextStep = () => ({
  type: NEXT_STEP,
});
export const prevStep = () => ({
  type: PREV_STEP,
});

export const saveData = (data) => ({
  type: SAVE_INPUT_DATA,
  payload: data,
});

export const stepOne = (stepOneData) => (dispatch) => {
  dispatch({
    type: SET_STEP_ONE,
    payload: stepOneData,
  });
  dispatch({ type: CLEAR_ERROR_STEP });
};

export const sendData = (stepTwoData, products) => async (dispatch) => {
  dispatch({
    type: SET_STEP_TWO,
    payload: stepTwoData,
  });
  dispatch({ type: LOADING_STEPS });
  dispatch(signUp(stepTwoData, products));
};

export const uploadImage = async (image, setProgress) => {
  let options = {};
  if (setProgress) {
    options = {
      onUploadProgress: (event) => {
        const { loaded, total } = event;
        let percent = Math.floor((loaded * 100) / total);
        if (percent < 100) {
          setProgress(percent);
        }
      },
    };
  }
  const res = await axios.post(`/upload-file`, image, options);
  return res;
};

export const validateCred = async (params) => {
  try {
    return await axios.post("/validate-cred", params);
  } catch (error) {
    console.error(error);
  }
};

const signUp = (stepTwoData, products) => async (dispatch, getState) => {
  const stepOne = getState().registerSteps.stepOne;
  const newUserData = sort({
    ...stepTwoData,
    ...stepOne,
  });
  try {
    const res = await axios.post("/sign-up", newUserData);
    if (res.data.success) {
      dispatch({ type: CLEAR_ERRORS });
      const token = res.data.token;
      if (products && products?.length > 0) {
        const responses = await Promise.all(
          products.map(async (product) => {
            const res = await axios.post(
              "/product/add",
              {
                ...product,
                product_price: product.product_price.replace(/\D/g, ""),
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            return res.data.success;
          })
        );
        if (responses[0]) {
          dispatch({ type: STOP_LOADING_STEPS });
          dispatch(nextStep());
        } else {
          console.log(responses);
        }
      }
      dispatch({ type: STOP_LOADING_STEPS });
      setAuthorizationHeaders(token);
      dispatch(getStoreProfile());
      dispatch({ type: SET_AUTHENTICATED });
    } else {
      if (res.data.message.includes("username")) {
        dispatch({
          type: SET_ERROR_STEP,
          payload: `Username '${stepOne.username}' already exists.`,
        });
      } else if (res.data.message.includes("email")) {
        dispatch({
          type: SET_ERROR_STEP,
          payload: `Email address '${stepOne.email}' already exists.`,
        });
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const sort = (data) => {
  const hours = {
    monday_store_hours_start: data.monday_store_hours_start
      ? convertTime12to24(data.monday_store_hours_start)
      : null,
    monday_store_hours_end: data.monday_store_hours_end
      ? convertTime12to24(data.monday_store_hours_end)
      : null,
    tuesday_store_hours_start: data.tuesday_store_hours_start
      ? convertTime12to24(data.tuesday_store_hours_start)
      : null,
    tuesday_store_hours_end: data.tuesday_store_hours_end
      ? convertTime12to24(data.tuesday_store_hours_end)
      : null,
    wednesday_store_hours_start: data.wednesday_store_hours_start
      ? convertTime12to24(data.wednesday_store_hours_start)
      : null,
    wednesday_store_hours_end: data.wednesday_store_hours_end
      ? convertTime12to24(data.wednesday_store_hours_end)
      : null,
    thursday_store_hours_start: data.thursday_store_hours_start
      ? convertTime12to24(data.thursday_store_hours_start)
      : null,
    thursday_store_hours_end: data.thursday_store_hours_end
      ? convertTime12to24(data.thursday_store_hours_end)
      : null,
    friday_store_hours_start: data.friday_store_hours_start
      ? convertTime12to24(data.friday_store_hours_start)
      : null,
    friday_store_hours_end: data.friday_store_hours_end
      ? convertTime12to24(data.friday_store_hours_end)
      : null,
    saturday_store_hours_start: data.saturday_store_hours_start
      ? convertTime12to24(data.saturday_store_hours_start)
      : null,
    saturday_store_hours_end: data.saturday_store_hours_end
      ? convertTime12to24(data.saturday_store_hours_end)
      : null,
    sunday_store_hours_start: data.sunday_store_hours_start
      ? convertTime12to24(data.sunday_store_hours_start)
      : null,
    sunday_store_hours_end: data.sunday_store_hours_end
      ? convertTime12to24(data.sunday_store_hours_end)
      : null,
  };
  const phone_number = data.phone_number.replace(/[^0-9]+/g, "");
  // const category = data.category.join();
  return {
    ...data,
    ...hours,
    phone_number: phone_number.split(" ").join("").startsWith("639")
      ? phone_number.split("63")[1]
      : phone_number.split(" ").join(""),
    store_description: data.store_description ? data.store_description : null,
    // category,
    lat: data.location_lat,
    lng: data.location_lng,
    landline_number: data.landline_number ? data.landline_number : null,
    store_hours_start:
      data.store_hours_start && !data.store_hours_start.includes("undefined")
        ? convertTime12to24(data.store_hours_start)
        : "00:00",
    store_hours_end:
      data.store_hours_end && !data.store_hours_end.includes("undefined")
        ? convertTime12to24(data.store_hours_end)
        : "00:00",
  };
};
