import {
  SET_CATEGORY,
  ADD_CATEGORY,
  DELETE_CATEGORY,
  SELECT_CATEGORY,
} from "../types";
const INITIAL_DATA_STORE = [
  {
    item: "Automotive",
    created_at: "2020-12-08T22:37:07.643Z",
    selected: false,
    default: true,
  },
  {
    item: "Baby & Todler",
    created_at: "2020-12-08T22:37:21.887Z",
    selected: false,
    default: true,
  },
  {
    item: "Clothing & Shoes",
    created_at: "2020-12-08T22:37:32.959Z",
    selected: false,
    default: true,
  },
  {
    item: "Computers",
    created_at: "2020-12-08T22:37:43.632Z",
    selected: false,
    default: true,
  },
  {
    item: "Electronics",
    created_at: "2020-12-08T22:37:47.975Z",
    selected: false,
    default: true,
  },
  {
    item: "Health & Beauty",
    created_at: "2020-12-08T22:37:57.440Z",
    selected: false,
    default: true,
  },
  {
    item: "Women's Fashion",
    created_at: "2020-12-08T22:38:00.856Z",
    selected: false,
    default: true,
  },
  {
    item: "Men's Fashion",
    created_at: "2020-12-08T22:38:05.960Z",
    selected: false,
    default: true,
  },
];
const INITIAL_DATA_PRODUCT = [
  {
    item: "Beverages",
    created_at: "2020-12-08T22:37:07.643Z",
    selected: true,
    default: true,
  },
  {
    item: "Bread/Bakery",
    created_at: "2020-12-08T22:37:21.887Z",
    selected: true,
    default: true,
  },
  {
    item: "Canned/Jarred Goods",
    created_at: "2020-12-08T22:37:32.959Z",
    selected: true,
    default: true,
  },
  {
    item: "Dairy",
    created_at: "2020-12-08T22:37:43.632Z",
    selected: true,
    default: true,
  },
  {
    item: "Dry/Baking Goods",
    created_at: "2020-12-08T22:37:47.975Z",
    selected: true,
    default: true,
  },
  {
    item: "Frozen Foods",
    created_at: "2020-12-08T22:37:57.440Z",
    selected: true,
    default: true,
  },
  {
    item: "Meat",
    created_at: "2020-12-08T22:38:00.856Z",
    selected: true,
    default: true,
  },
  {
    item: "Produce",
    created_at: "2020-12-08T22:38:05.960Z",
    selected: true,
    default: true,
  },
  {
    item: "Cleaners",
    created_at: "2020-12-08T22:38:05.970Z",
    selected: true,
    default: true,
  },
  {
    item: "Paper Goods",
    created_at: "2020-12-08T22:38:05.980Z",
    selected: true,
    default: true,
  },
  {
    item: "Personal Care",
    created_at: "2020-12-08T22:38:05.990Z",
    selected: true,
    default: true,
  },
  {
    item: "Other",
    created_at: "2020-12-08T22:38:05.995Z",
    selected: true,
    default: true,
  },
];
const initialState = {
  productCategories: INITIAL_DATA_PRODUCT,
  storeCategories: INITIAL_DATA_STORE,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_CATEGORY:
      const storeCatIsExist = state.storeCategories?.find(
        ({ item }) => item === action.payload.item
      );
      let newStoreCategory;
      if (storeCatIsExist) {
        newStoreCategory = state.storeCategories.map((cat) =>
          action.payload.item.toLowerCase().trim() ===
          cat.item.toLowerCase().trim()
            ? {
                ...action.payload,
                selected: true,
                created_at: new Date().toISOString(),
              }
            : cat
        );
      } else {
        newStoreCategory = [
          {
            ...action.payload,
            created_at: new Date().toISOString(),
            selected: true,
          },
          ...state.storeCategories,
        ];
      }
      return {
        ...state,
        storeCategories: newStoreCategory,
      };
    case SELECT_CATEGORY:
      return {
        ...state,
        [action.payload.type]: state[action.payload.type].map((cat) =>
          cat.created_at === action.payload.item.created_at
            ? { ...cat, selected: !action.payload.item.selected }
            : action.payload.type === "productCategories"
            ? { ...cat }
            : { ...cat, selected: false }
        ),
      };
    case ADD_CATEGORY:
      const tempCategory = state[action.payload.type].filter(
        (cat) =>
          cat.item.toLowerCase() !==
          action.payload.category.item.toLowerCase().trim()
      );
      return {
        ...state,
        [action.payload.type]: [
          { ...action.payload.category, default: false },
          ...tempCategory,
        ],
      };
    case DELETE_CATEGORY: {
      const newCategory = state[action.payload.type].filter(
        (cat) => cat.item !== action.payload.item
      );
      return {
        ...state,
        [action.payload.type]: newCategory,
      };
    }
    default:
      return state;
  }
}
