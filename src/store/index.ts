import { configureStore } from "@reduxjs/toolkit";

import { baseApi } from "./api/base-api";
import authReducer from "./slices/auth.slice";
import uiReducer from "./slices/ui.slice";

export const makeStore = () =>
  configureStore({
    reducer: { [baseApi.reducerPath]: baseApi.reducer, auth: authReducer, ui: uiReducer },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
