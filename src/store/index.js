import { configureStore } from "@reduxjs/toolkit";
import alertReducer from "../Features/alerter/alertSlice";
import dialogReducer from "../Features/DialogBox/dialogSlice";
import { apiSlice } from "../Features/API/apiSlice";
import tokenReducer from "../Features/Token/tokenSlice";
import profileReducer from "../Features/User/userSlice";

export const store = configureStore({
  reducer: {
    alert: alertReducer,
    dialog: dialogReducer,
    token: tokenReducer,
    profile: profileReducer,
    [apiSlice.reducerPath]: apiSlice.reducer, // Attach the API service reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware), // Add RTK Query middleware
});
