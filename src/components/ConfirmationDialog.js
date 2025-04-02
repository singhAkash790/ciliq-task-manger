import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { closeConfirmDialog } from "../Features/DialogBox/dialogSlice";

const ConfirmationDialog = () => {
  const dispatch = useDispatch();
  const confirmDialogProps = useSelector(
    (state) => state.dialog.confirmDialogProps
  );

  if (!confirmDialogProps) return null;

  const { title, message, onConfirm, onCancel } = confirmDialogProps;

  return (
    <Dialog open={!!confirmDialogProps}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{message}</DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            onConfirm();
            dispatch(closeConfirmDialog());
          }}
        >
          Confirm
        </Button>
        <Button
          onClick={() => {
            if (onCancel) onCancel();
            dispatch(closeConfirmDialog());
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
