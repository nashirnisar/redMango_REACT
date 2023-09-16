// Import the configureStore function from Redux Toolkit
import { configureStore } from "@reduxjs/toolkit";
// Import the menuItemReducer from the menuItemSlice file
import { menuItemReducer } from "./menuItemSlice";
import { shoppingCartReducer } from "./shoppingCartSlice";
import { userAuthReducer } from "./userAuthSlice";
import {
  menuItemApi,
  shoppingCartApi,
  authApi,
  paymentApi,
  orderApi,
} from "../../Api"; // Import the menuItemApi configuration

// Configure the Redux store
const store = configureStore({
  reducer: {
    menuItemStore: menuItemReducer, // Set up the menuItemReducer as part of the store's reducers
    shoppingCartStore: shoppingCartReducer,
    userAuthStore: userAuthReducer,
    [menuItemApi.reducerPath]: menuItemApi.reducer, // Add the API reducer under its specific key
    [shoppingCartApi.reducerPath]: shoppingCartApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(menuItemApi.middleware)
      .concat(shoppingCartApi.middleware)
      .concat(authApi.middleware) // Add the API middleware
      .concat(paymentApi.middleware)
      .concat(orderApi.middleware),
});

// Define a type for the RootState based on the store's state type
export type RootState = ReturnType<typeof store.getState>;

// Export the configured Redux store
export default store;
