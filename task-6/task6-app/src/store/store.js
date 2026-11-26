import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import requestsReducer from "./slices/requestsSlice";
import requestsUiReducer from "./slices/requestsUiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    requests: requestsReducer,
    requestsUi: requestsUiReducer,
  },
});