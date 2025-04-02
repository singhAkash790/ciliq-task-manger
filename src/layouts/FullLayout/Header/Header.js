import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Box,
  Menu,
  MenuItem,
  Typography,
  Divider,
  Badge,
  ListItemIcon,
  Tooltip,
  styled,
} from "@mui/material";
import {
  Settings,
  Logout,
  Person,
  Help,
  LogoutOutlined,
} from "@mui/icons-material";
import userimg from "../../../assets/images/users/6.jpg";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from '../../../Features/Token/tokenSlice';



// Styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
  position: "fixed",
}));



const Header = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logoutUser()); // Dispatching the logout action
    navigate('/login'); // Redirecting to login page
  };

  const handleProfile = () => {
    handleClose();
    navigate("/profile");
  };

  const handleSettings = () => {
    handleClose();
    navigate("/settings");
  };

  return (
    <StyledAppBar sx={props.sx} className={props.customClass}>
      <Toolbar sx={{ justifyContent: "flex-end", gap: 2 }}>
        <Divider orientation="vertical" flexItem />
        {/* User Menu */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleMenu}
              size="large"
              sx={{ padding: 0.5 }}
              aria-controls="account-menu"
              aria-haspopup="true"
            >
              <Avatar
                src={userimg}
                alt="User"
                sx={{
                  width: 40,
                  height: 40,
                  border: "2px solid transparent",
                  transition: "border-color 0.2s",
                  "&:hover": {
                    borderColor: "primary.main",
                  },
                }}
              />
            </IconButton>
          </Tooltip>
          <Menu
            id="account-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            onClick={handleClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleProfile}>
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={handleSettings}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutOutlined fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;
