import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { AuthSession, CurrentUser } from "@/types/auth.types";

interface AuthState {
  accessToken: string | null;
  user: CurrentUser | null;
  initialized: boolean;
}

const initialState: AuthState = { accessToken: null, user: null, initialized: false };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<AuthSession>) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.initialized = true;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    setCurrentUser: (state, action: PayloadAction<CurrentUser>) => {
      state.user = action.payload;
      state.initialized = true;
    },
    clearSession: (state) => {
      state.accessToken = null;
      state.user = null;
      state.initialized = true;
    },
    setInitialized: (state) => {
      state.initialized = true;
    },
  },
});

export const { clearSession, setAccessToken, setCurrentUser, setInitialized, setSession } =
  authSlice.actions;
export default authSlice.reducer;
