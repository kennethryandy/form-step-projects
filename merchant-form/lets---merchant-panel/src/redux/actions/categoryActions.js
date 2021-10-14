import {
  SET_CATEGORY,
  ADD_CATEGORY,
  DELETE_CATEGORY,
  SELECT_CATEGORY,
} from "../types";
export const setCategory = (category) => ({
  type: SET_CATEGORY,
  payload: category,
});

export const addCategory = (data) => ({
  type: ADD_CATEGORY,
  payload: data,
});

export const deleteCategory = (data) => ({
  type: DELETE_CATEGORY,
  payload: data,
});

export const selectCategory = (data) => ({
  type: SELECT_CATEGORY,
  payload: data,
});
