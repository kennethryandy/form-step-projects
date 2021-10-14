import {
  LOADING_DATA,
  SET_PRODUCTS,
  SET_PROMOS,
  GENERATE_PRODUCT_CODE,
  ADD_PRODUCT,
  EDIT_PRODUCT,
  ADD_PROMO,
  EDIT_PROMO,
  SET_CUSTOMERS,
  BAN_CUSTOMERS,
  SET_ORDERS,
  DELETE_PRODUCTS,
  DELETE_PROMOS,
  CANCEL_ORDERS,
  PROCESS_ORDERS,
} from "../types";
import axios from "../../config/axios";

//Get all products
export const getAllProducts = (data) => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  dispatch({
    type: SET_PRODUCTS,
    payload: data,
  });
  // try {
  //   const res = await axios.get("/product");
  //   const needUpdate = res.data.data.filter(
  //     (item) =>
  //       item.status.toLowerCase() === "out of stock" &&
  //       item.product_quantity > 0
  //   );
  //   if (needUpdate.length > 0) {
  //     await Promise.all(
  //       needUpdate.map(
  //         async (item) =>
  //           await axios.put("/product/update", {
  //             ...item,
  //             product_quantity: 0,
  //             merchant_product_id: item.id,
  //           })
  //       )
  //     );
  //     const updatedData = await axios.get("/product");
  //     dispatch({
  //       type: SET_PRODUCTS,
  //       payload: updatedData.data.data,
  //     });
  //   } else {
  //     dispatch({
  //       type: SET_PRODUCTS,
  //       payload: res.data.data,
  //     });
  //   }
  // } catch (error) {
  //   console.error(error);
  // }
};

//Generate product code
export const generateProductCode = (code) => ({
  type: GENERATE_PRODUCT_CODE,
  payload: code,
});

//Upload product image
export const uploadProductImages = (imgs) => async (dispatch) => {
  dispatch({ type: LOADING_DATA });
  const images = await Promise.all(
    imgs.map(async (img, i) => {
      const res = await axios.post("/upload-file", img);
      if (!res.data.error) {
        return {
          ...img,
          [`image${i + 1}_id`]: res.data.file_id,
        };
      } else {
        return;
      }
    })
  );

  return images;
};

export const uploadImage = async (img) => {
  try {
    const res = await axios.post("/upload-file", img);
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

//Add Product
export const addProduct = (newProduct, history) => async (dispatch) => {
  dispatch({ type: LOADING_DATA });
  const product_price = newProduct.product_price
    .toString()
    .split(".")[0]
    .replace(/[^0-9]+/g, "");
  try {
    const res = await axios.post("/product/add", {
      ...newProduct,
      product_price: parseInt(product_price),
    });
    if (res.data.success) {
      dispatch({
        type: ADD_PRODUCT,
        payload: newProduct,
      });
      history.push("/products");
    } else {
      console.log(res.data);
    }
  } catch (error) {
    console.error(error);
  }
};

//Edit Product
export const editProduct = (updatedProduct) => async (dispatch) => {
  dispatch({ type: LOADING_DATA });
  const product_price = updatedProduct.product_price
    .toString()
    .split(".")[0]
    .replace(/[^0-9]+/g, "");
  try {
    const res = await axios.put("/product/update", {
      ...updatedProduct,
      product_price,
    });
    if (res.data.success) {
      dispatch({
        type: EDIT_PRODUCT,
        payload: updatedProduct,
      });
      return res.data.success;
    } else {
      console.log(res.data);
    }
  } catch (error) {
    console.error(error);
  }
};

//Delete products
export const deleteProducts = (ids) => async (dispatch) => {
  dispatch({ type: LOADING_DATA });
  try {
    const res = await axios.put("/product/delete", {
      merchant_product_ids: [...ids],
    });
    if (res.data.success) {
      dispatch({
        type: DELETE_PRODUCTS,
        payload: ids,
      });
    }
    return res.data.success;
  } catch (error) {
    console.error(error);
  }
};

//Get all Promos
export const getAllPromos = () => async (dispatch) => {
  dispatch({ type: LOADING_DATA });
  try {
    const res = await axios.get("/promo");
    if (res.data.data) {
      const needUpdate = res.data.data.filter(
        (item) =>
          new Date(item.end_date).toISOString() < new Date().toISOString()
      );
      if (needUpdate.length > 0) {
        await Promise.all(
          needUpdate.map(
            async (item) =>
              await axios.put("/promo/update", {
                ...item,
                status: "expired",
                promo_id: item.id,
              })
          )
        );
        const updatedData = await axios.get("/promo");
        dispatch({
          type: SET_PROMOS,
          payload: updatedData.data.data,
        });
      } else {
        dispatch({
          type: SET_PROMOS,
          payload: res.data.data,
        });
      }
    } else {
      dispatch({
        type: SET_PROMOS,
        payload: [],
      });
    }
  } catch (error) {
    console.error(error);
  }
};

//Add promo
export const addPromo = (newPromo, history) => async (dispatch) => {
  dispatch({ type: LOADING_DATA });
  try {
    const res = await axios.post("/promo/add", newPromo);
    if (res.data.success) {
      dispatch({
        type: ADD_PROMO,
        payload: newPromo,
      });
      history.push("/promos");
    } else {
      console.log(res.data);
    }
  } catch (error) {
    console.error(error);
  }
};

//Edit promo
export const editPromo = (updatedPromo) => async (dispatch) => {
  dispatch({ type: LOADING_DATA });
  try {
    const res = await axios.put("/promo/update", updatedPromo);
    if (res.data.success) {
      dispatch({
        type: EDIT_PROMO,
        payload: updatedPromo,
      });
      return res.data.success;
    } else {
      console.log(res.data);
    }
  } catch (error) {
    console.error(error);
  }
};

//Delete promos
export const deletePromos = (ids) => async (dispatch) => {
  dispatch({ type: LOADING_DATA });
  try {
    const res = await axios.put("/promo/delete", {
      merchant_promo_ids: [...ids],
    });
    if (res.data.success) {
      dispatch({
        type: DELETE_PROMOS,
        payload: ids,
      });
      return res.data.success;
    }
  } catch (error) {
    console.error(error);
  }
};

//Get all customers
export const getAllCustomers = (data) => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  dispatch({
    type: SET_CUSTOMERS,
    payload: data,
  });
};

//Delete customers
export const banCustomers = (nums) => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  try {
    const res = axios.post("/customer/ban", {
      merchant_customer_phone_numbers: nums,
    });
    if (res.data.success) {
      dispatch({ type: BAN_CUSTOMERS, payload: nums });
    }
  } catch (error) {
    console.error(error);
  }
};

//Get all orders
export const getAllOrders = (data, products) => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  dispatch({
    type: SET_ORDERS,
    payload: { data, products },
  });
};

//Order transaction
export const orderTransaction = (order_id) => async (dispatch) => {
  // dispatch({ type: LOADING_DATA });
  try {
    const res = await axios.post("/order/transaction", { order_id });
    console.log(res);
    // dispatch(getAllOrders);
  } catch (error) {
    console.error(error);
  }
};

//Cancel orders
export const cancelOrders = (ids, transaction_number) => async (dispatch) => {
  dispatch({ type: LOADING_DATA });
  dispatch({
    type: CANCEL_ORDERS,
    payload: { ids, transaction_number },
  });
};

//ProcessOrders
export const processOrders = (ids, transaction_number) => async (dispatch) => {
  dispatch({ type: LOADING_DATA });
  try {
    const res = await axios.put("/order/process", {
      merchant_order_ids: ids,
    });
    if (res.data.success) {
      dispatch({ type: PROCESS_ORDERS, payload: { ids, transaction_number } });
    }
  } catch (error) {
    console.error(error);
  }
};
