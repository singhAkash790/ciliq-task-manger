import React, { useState } from "react";
import { styled, useMediaQuery, Container, Box, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import Sidebar from "./Sidebar/Sidebar";
import Footer from "./Footer/Footer";

const SIDEBAR_WIDTH = 265;
const TOPBAR_HEIGHT = 64;

const MainWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  minHeight: "100vh",
  overflow: "hidden",
  width: "100%",
  backgroundColor: theme.palette.background.default, // Changes based on theme (light/dark)
}));

const PageWrapper = styled("div")(({ theme, open }) => ({
  display: "flex",
  flex: "1 1 auto",
  overflow: "hidden",
  backgroundColor: theme.palette.background.default, // Dynamic background color
  paddingTop: TOPBAR_HEIGHT,
  [theme.breakpoints.up("lg")]: {
    marginLeft: open ? SIDEBAR_WIDTH : 0,
  },
  transition: theme.transitions.create(["margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  minHeight: `calc(100vh - ${TOPBAR_HEIGHT}px)`,
  width: "100%",
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper, // Card background, etc.
  color: theme.palette.text.primary, // Text color based on theme
}));

const FullLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const theme = useTheme();
  const lgUp = useMediaQuery(theme.breakpoints.up("lg"));

  const handleSidebarToggle = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleMobileSidebarToggle = () => {
    setMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <MainWrapper>
      <Header
        sx={{
          position: "fixed",
          width: "100%",
          height: TOPBAR_HEIGHT,
          zIndex: theme.zIndex.appBar,
          backgroundColor: theme.palette.background.paper, // Adjusts based on theme
          display: "flex",
          justifyContent: "flex-end",
          boxShadow: theme.shadows[1],
          [theme.breakpoints.up("lg")]: {
            width: isSidebarOpen ? `calc(100% - ${SIDEBAR_WIDTH}px)` : "100%",
            marginLeft: isSidebarOpen ? SIDEBAR_WIDTH : 0,
          },
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
        toggleSidebar={handleSidebarToggle}
        toggleMobileSidebar={handleMobileSidebarToggle}
      />

      <Sidebar
        isSidebarOpen={isSidebarOpen}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onSidebarClose={() => setMobileSidebarOpen(false)}
        drawerWidth={SIDEBAR_WIDTH}
      />

      <PageWrapper open={isSidebarOpen && lgUp}>
        <ContentWrapper>
          <Outlet />
        </ContentWrapper>
        {/* <Footer /> */}
      </PageWrapper>
    </MainWrapper>
  );
};

export default FullLayout;
