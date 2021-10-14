import {
  SET_PRODUCTS,
  GENERATE_PRODUCT_CODE,
  LOADING_DATA,
  SET_PROMOS,
  ADD_PRODUCT,
  EDIT_PRODUCT,
  ADD_PROMO,
  EDIT_PROMO,
  SET_CUSTOMERS,
  BAN_CUSTOMERS,
  SET_ORDERS,
  CANCEL_ORDERS,
  DELETE_PROMOS,
  DELETE_PRODUCTS,
  PROCESS_ORDERS,
} from "../types";
const initialState = {
  // path: "dashboard",
  products: [],
  productCode: "",
  promos: [],
  customers: [],
  orders: [],
  orderDetails: [],
  loading: false,
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true,
      };
    case SET_PRODUCTS:
      return {
        ...state,
        products: action.payload,
        loading: false,
      };
    case GENERATE_PRODUCT_CODE:
      return {
        ...state,
        productCode: action.payload,
        loading: false,
      };
    case ADD_PRODUCT:
      return {
        ...state,
        products: [
          ...state.products,
          {
            ...action.payload,
            id: state.productCode
              ? state.productCode.split("-")[1]
              : "LETSPC-XXX",
            product_code: state.productCode ? state.productCode : "LETSPC-XXX",
          },
        ],
        loading: false,
      };
    case EDIT_PRODUCT:
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.payload.id
            ? { ...product, ...action.payload }
            : product
        ),
        loading: false,
      };
    case DELETE_PRODUCTS:
      return {
        ...state,
        products: state.products.filter(
          (product) => !action.payload.includes(product.id)
        ),
        loading: false,
      };
    case SET_PROMOS:
      return {
        ...state,
        promos: action.payload || [],
        loading: false,
      };
    case ADD_PROMO:
      return {
        ...state,
        promos: [action.payload, ...state.promos],
        loading: false,
      };
    case EDIT_PROMO:
      return {
        ...state,
        promos: state.products.map((promo) =>
          promo.id === action.payload.id
            ? { ...promo, ...action.payload }
            : promo
        ),
        loading: false,
      };
    case DELETE_PROMOS:
      return {
        ...state,
        promos: state.promos.filter(
          (promo) => !action.payload.includes(promo.id)
        ),
        loading: false,
      };
    case SET_CUSTOMERS:
      return {
        ...state,
        customers: action.payload,
        loading: false,
      };
    case BAN_CUSTOMERS:
      return {
        ...state,
        customers: state.customers.map((customer) =>
          action.payload.map((num) =>
            customer.phone_number === num
              ? { ...customer, status: "ban" }
              : customer
          )
        ),
        loading: false,
      };
    case SET_ORDERS:
      const orderDetails = action.payload.data?.reduce((accu, order) => {
        const product = action.payload.products.find(
          (prod) => prod.id === order.product_id
        );
        const orderFindIndex = accu.findIndex(
          (ord) => ord.transaction_number === order.transaction_number
        );
        if (orderFindIndex !== -1) {
          accu[orderFindIndex] = {
            ...accu[orderFindIndex],
            order_id: [...accu[orderFindIndex].order_id, order.id],
            total_order_amount:
              parseFloat(accu[orderFindIndex].total_order_amount) +
              parseFloat(order.total_order_amount),
            products: [
              ...accu[orderFindIndex].products,
              {
                product_code: product?.product_code,
                product_name: product?.product_name,
                price: order.order_amount,
                quantity: order.quantity,
                total_order_amount: order.total_order_amount,
              },
            ],
          };
        } else {
          accu.push({
            transaction_number: order.transaction_number,
            order_id: [order.id],
            customer_id: order.id,
            created_at: order.created_at,
            customer_name: order.customer_name,
            merchant_id: order.merchant_id,
            status: order.status,
            total_order_amount: order.total_order_amount,
            products: [
              {
                product_code: product?.product_code,
                product_name: product?.product_name,
                price: order.order_amount,
                quantity: order.quantity,
                total_order_amount: order.total_order_amount,
              },
            ],
          });
        }
        return accu;
      }, []);
      return {
        ...state,
        orders: action.payload.data || [],
        orderDetails: orderDetails,
        loading: false,
      };
    case CANCEL_ORDERS:
      return {
        ...state,
        // orders: cancelledOrder,
        orderDetails: state.orderDetails.map((order) =>
          order.transaction_number === action.payload.transaction_number
            ? { ...order, status: "cancelled_by_merchant" }
            : order
        ),
        loading: false,
      };
    case PROCESS_ORDERS:
      return {
        ...state,
        orders: state.orders.map((order) =>
          action.payload.ids.map((id) =>
            order.id === id ? { ...order, status: "processed" } : order
          )
        ),
        orderDetails: state.orderDetails.map((order) =>
          order.transaction_number === action.payload.transaction_number
            ? { ...order, status: "processed" }
            : order
        ),
        loading: false,
      };
    default:
      return state;
  }
};

export default dataReducer;
