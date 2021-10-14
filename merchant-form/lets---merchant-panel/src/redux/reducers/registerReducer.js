import {
  NEXT_STEP,
  PREV_STEP,
  SET_STEP_ONE,
  SET_STEP_TWO,
  SAVE_INPUT_DATA,
  SET_ERROR_STEP,
  CLEAR_STEPS,
  LOADING_STEPS,
  STOP_LOADING_STEPS,
  CLEAR_ERROR_STEP,
} from "../types";
const initialState = {
  steps: 1,
  stepOne: null,
  stepTwo: null,
  error: "",
  loading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_ERROR_STEP:
      return {
        ...state,
        error: action.payload,
        loading: false,
        steps: 1,
      };
    case CLEAR_ERROR_STEP:
      return {
        ...state,
        error: "",
        loading: false,
      };
    case NEXT_STEP:
      return {
        ...state,
        steps: state.steps + 1,
        loading: false,
      };
    case PREV_STEP:
      return {
        ...state,
        steps: state.steps - 1,
        error: "",
        loading: false,
      };
    case SET_STEP_ONE:
      return {
        ...state,
        stepOne: {
          ...action.payload,
        },
      };
    case SET_STEP_TWO:
    case SAVE_INPUT_DATA:
      return {
        ...state,
        stepTwo: {
          ...action.payload,
        },
      };
    case LOADING_STEPS: {
      return {
        ...state,
        loading: true,
      };
    }
    case STOP_LOADING_STEPS:
      return {
        ...state,
        loading: false,
      };
    case CLEAR_STEPS: {
      return initialState;
    }
    default:
      return state;
  }
}
