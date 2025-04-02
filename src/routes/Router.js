import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

// Direct imports
import Login from "../pages/UserAuth/Login";
import Register from "../pages/UserAuth/Register";
import Task from "../pages/Task/index";
import AddTask from "../pages/Task/AddTask";
import EditPackage from "../pages/Task/editTask";
import Import from "../pages/Import/index";
import AccessDenied from "../pages/AccessDenied";
import FullLayout from "../layouts/FullLayout/FullLayout";
import ExportData from "../pages/Export";

function PrivateRoute() {
  const isAuthenticated = useSelector((state) => state.token?.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

function PublicRoute() {
  const isAuthenticated = useSelector((state) => state.token?.isAuthenticated);

  // If authenticated, redirect to home page
  if (isAuthenticated) {
    return <Navigate to="/tasks" replace />;
  }
  return <Outlet />;
}



// Routing Configuration
const ThemeRoutes = [
  // Public Routes - Routes accessible to unauthenticated users
  {
    path: "/",
    element: <PublicRoute />,
    children: [
      { path: "/", element: <Navigate to="/login" /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
  // Private Routes - Routes accessible to authenticated users
  {
    path: "/",
    element: <PrivateRoute />,
    children: [
      {
        path: "/",
        element: <FullLayout />,
        children: [
          { path: "tasks", element: <Task /> },
          { path: "add-task", element: <AddTask /> },
          { path: "edit-task/:id", element: <EditPackage /> },
          { path: "import-data", element: <Import /> },
          { path: "export-data", element: <ExportData /> },
        ],
      },
    ],
  },
  // Access Denied Route
  { path: "access-denied", element: <AccessDenied /> },
];

export default ThemeRoutes;
