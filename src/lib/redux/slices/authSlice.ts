import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
}

const getInitialToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token");
  }
  return null;
};

const initialState: AuthState = {
  token: getInitialToken(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", action.payload);
      }
    },
    logout: (state) => {
      state.token = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
      }
    },
  },
});

export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;
