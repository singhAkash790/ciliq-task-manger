import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  alertProps: null,
};

const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    showAlert: (state, action) => {
      state.alertProps = action.payload;
    },
    closeAlert: (state) => {
      state.alertProps = null;
    },
  },
});

export const { showAlert, closeAlert } = alertSlice.actions;
export default alertSlice.reducer;
