import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Helper function to safely get items from localStorage
const getLocalStorageItem = (key) => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error("Error accessing localStorage:", error);
    return null;
  }
};

export const verifyToken = createAsyncThunk(
  "token/verifyToken",
  async (token, thunkAPI) => {
    try {
      const response = await axios.get("/api/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);



const tokenSlice = createSlice({
  name: "token",
  initialState: {
    accessToken: getLocalStorageItem("accessToken"),
    refreshToken: getLocalStorageItem("refreshToken"),
    isAuthenticated: !!getLocalStorageItem("accessToken"), // Set based on token presence
    loading: false,
    error: null,
  },
  reducers: {
    setTokens: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = !!action.payload.accessToken;

      // Safely set to localStorage
      try {
        if (action.payload.accessToken) {
          localStorage.setItem("accessToken", action.payload.accessToken);
        }
        if (action.payload.refreshToken) {
          localStorage.setItem("refreshToken", action.payload.refreshToken);
        }
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
    },
    logoutUser: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
    clearTokens: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      try {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      } catch (error) {
        console.error("Error clearing localStorage:", error);
      }
    },
    setAuthStatus: (state, action) => {
      state.isAuthenticated = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyToken.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
        state.accessToken = null;
        state.refreshToken = null;
        try {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        } catch (error) {
          console.error("Error clearing localStorage:", error);
        }
      })

  },
});

export const { setTokens, clearTokens, setAuthStatus, logoutUser } = tokenSlice.actions;
export default tokenSlice.reducer;