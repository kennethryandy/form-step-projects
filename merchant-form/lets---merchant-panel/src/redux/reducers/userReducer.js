import {
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  SET_STORE_PROFILE,
  LOADING_USER,
  SET_ERRORS,
  SHOW_SNACKBAR,
  HIDE_SNACKBAR,
} from "../types";

const initialState = {
  authenticated: false,
  loading: false,
  storeProfile: {},
  error: "",
  showSnackbar: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true,
        loading: false,
      };
    case SET_UNAUTHENTICATED:
      return initialState;
    case SET_STORE_PROFILE:
      return {
        ...state,
        storeProfile: { ...action.payload, password: "" },
        loading: false,
      };
    case LOADING_USER:
      return {
        ...state,
        loading: true,
      };
    case SET_ERRORS:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case SHOW_SNACKBAR:
      return {
        ...state,
        showSnackbar: true,
      };
    case HIDE_SNACKBAR:
      return {
        ...state,
        showSnackbar: false,
      };
    default:
      return state;
  }
}
