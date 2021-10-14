import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";

import dataReducer from "./reducers/dataReducer";
import userReducer from "./reducers/userReducer";
import uiReducer from "./reducers/uiReducer";
import registerReducer from "./reducers/registerReducer";
import categoryReducer from "./reducers/categoryReducer";

const middleware = [thunk];

const persistConfig = {
  key: "root",
  storage,
  // whitelist: ["category", "registerSteps"],
  whitelist: ["category"],
};

const reducers = combineReducers({
  data: dataReducer,
  user: userReducer,
  UI: uiReducer,
  registerSteps: registerReducer,
  category: categoryReducer,
});

const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;
export const store = createStore(
  persistReducer(persistConfig, reducers),
  composeEnhancers(applyMiddleware(...middleware))
);

export const persistor = persistStore(store);
