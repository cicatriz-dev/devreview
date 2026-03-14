import { configureStore } from "@reduxjs/toolkit";
import rulesReducer from "./slices/rulesSlice";
import historyReducer from "./slices/historySlice";
import adrsReducer from "./slices/adrsSlice";

export const store = configureStore({
  reducer: {
    rules: rulesReducer,
    history: historyReducer,
    adrs: adrsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
