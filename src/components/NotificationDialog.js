import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAlert } from "../context/AlertContext";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
  IconButton,
  Box,
  Chip,
  styled,
} from "@mui/material";
import {
  Close as CloseIcon,
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UnreadIcon,
} from "@mui/icons-material";
import { API_BASE_URL } from "../Utils/ApiPath";

// Styled components
const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    maxWidth: 500,
    width: "100%",
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const EmptyState = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(4),
  height: 300,
  color: theme.palette.text.secondary,
}));

const LoadingState = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(4),
  height: 300,
}));

const NotificationDialog = () => {
  const { isNotificationDialogOpen, toggleNotificationDialog } = useAlert();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isNotificationDialogOpen) {
      console.log("Fetching notifications...");
      axios
        .get(`${API_BASE_URL}/notifications`)
        .then((response) => {
          // Only show top 5 notifications
          setNotifications(response.data.notifications.slice(0, 5));
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching notifications:", error);
          setLoading(false);
        });
    }
  }, [isNotificationDialogOpen]);

  const handleManageNotifications = () => {
    navigate("/notifications");
    toggleNotificationDialog();
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return {
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    };
  };

  const getActionColor = (actionType) => {
    switch (actionType.toLowerCase()) {
      case "delete":
        return "error";
      case "create":
        return "success";
      case "update":
        return "info";
      default:
        return "default";
    }
  };

  return (
    <StyledDialog
      open={isNotificationDialogOpen}
      onClose={toggleNotificationDialog}
      aria-labelledby="notification-dialog-title"
    >
      <DialogTitle id="notification-dialog-title">
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <NotificationsIcon />
            <Typography variant="h6">Notifications</Typography>
          </Box>
          <IconButton
            edge="end"
            color="inherit"
            onClick={toggleNotificationDialog}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <LoadingState>
            <CircularProgress />
          </LoadingState>
        ) : notifications.length > 0 ? (
          <List sx={{ py: 0 }}>
            {notifications.map((notification) => {
              const { time, date } = formatTime(notification.createdAt);
              return (
                <StyledListItem key={notification._id}>
                  <ListItemText
                    primary={
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Box display="flex" alignItems="center" gap={1}>
                          {notification.isRead ? (
                            <CheckCircleIcon
                              sx={{ fontSize: 16, color: "success.main" }}
                            />
                          ) : (
                            <UnreadIcon
                              sx={{ fontSize: 16, color: "primary.main" }}
                            />
                          )}
                          <Typography variant="subtitle2">
                            {notification.collection}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Chip
                            label={notification.actionType}
                            size="small"
                            color={getActionColor(notification.actionType)}
                            sx={{ textTransform: "capitalize" }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {time}
                          </Typography>
                        </Box>
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {notification.message}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          {date}
                        </Typography>
                      </Box>
                    }
                  />
                </StyledListItem>
              );
            })}
          </List>
        ) : (
          <EmptyState>
            <NotificationsIcon sx={{ fontSize: 40, mb: 2 }} />
            <Typography variant="body1">No notifications</Typography>
          </EmptyState>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
        <Button
          variant="outlined"
          onClick={handleManageNotifications}
          sx={{ flex: 1, mr: 1 }}
        >
          Manage Notifications
        </Button>
        <Button
          variant="contained"
          onClick={toggleNotificationDialog}
          sx={{ flex: 1, ml: 1 }}
        >
          Close
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default NotificationDialog;
