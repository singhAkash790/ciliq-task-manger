import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  confirmDialogProps: null,
  isNotificationDialogOpen: false,
};

const dialogSlice = createSlice({
  name: "dialog",
  initialState,
  reducers: {
    showConfirmDialog: (state, action) => {
      state.confirmDialogProps = action.payload;
    },
    closeConfirmDialog: (state) => {
      state.confirmDialogProps = null;
    },
    toggleNotificationDialog: (state) => {
      state.isNotificationDialogOpen = !state.isNotificationDialogOpen;
    },
  },
});

export const {
  showConfirmDialog,
  closeConfirmDialog,
  toggleNotificationDialog,
} = dialogSlice.actions;
export default dialogSlice.reducer;
