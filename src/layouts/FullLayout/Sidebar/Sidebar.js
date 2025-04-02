import React from "react";
import { useLocation } from "react-router";
import { Link, NavLink } from "react-router-dom";
import {
  Box,
  Drawer,
  useMediaQuery,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from "@mui/material";
import { SidebarWidth } from "../../../assets/global/Theme-variable";
import LogoIcon from "../Logo/LogoIcon";
import Menuitems from "./data";
import "./index.css";

const Sidebar = (props) => {
  const [open, setOpen] = React.useState(true);
  const { pathname } = useLocation();
  const pathDirect = pathname;
  const theme = useTheme(); // Access the current theme

  const handleClick = (index) => {
    if (open === index) {
      setOpen((prevopen) => !prevopen);
    } else {
      setOpen(index);
    }
  };

  const SidebarContent = (
    <Box sx={{ p: 3, height: "calc(100vh - 40px)" }}>
      <Link to="/">
        <Box sx={{ display: "flex", alignItems: "center" }} className="_logo">
          <LogoIcon />
        </Box>
      </Link>

      <Box>
        <List sx={{ mt: 4 }}>
          {Menuitems.map((item, index) => (
            <List component="li" disablePadding key={item.title}>
              <ListItem
                onClick={() => handleClick(index)}
                button
                component={NavLink}
                to={item.href}
                selected={pathDirect === item.href}
                sx={{
                  mb: 1,
                  backgroundColor:
                    pathDirect === item.href
                      ? (theme) => theme.palette.primary.main
                      : "transparent", // Highlight active link
                  ...(pathDirect === item.href && {
                    color: "white", // Text color for active link
                  }),
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? theme.palette.primary.dark
                        : theme.palette.primary.light,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    ...(pathDirect === item.href && {
                      color: "white", // Icon color for active link
                    }),
                    color: (theme) => theme.palette.text.primary, // Icon color based on theme
                  }}
                >
                  <item.icon width="20" height="20" />
                </ListItemIcon>
                <ListItemText
                  sx={{
                    color: (theme) => theme.palette.text.primary, // Text color based on theme
                  }}
                >
                  {item.title}
                </ListItemText>
              </ListItem>
            </List>
          ))}
        </List>
      </Box>
    </Box>
  );


  return (
    <Drawer
      anchor="left"
      open={props.isSidebarOpen}
      variant="persistent"
      PaperProps={{
        sx: {
          width: SidebarWidth,
          backgroundColor: theme.palette.background.paper, // Sidebar background color
        },
      }}
    >
      {SidebarContent}
    </Drawer>
  );
};

export default Sidebar;
