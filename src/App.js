import React, { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import AlertComponent from "./components/Alerter";
import Themeroutes from "./routes/Router";
import ConfirmationDialog from "./components/ConfirmationDialog";

// Loading component
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
);



const App = () => {
  const routing = useRoutes(Themeroutes);

  return (
    <>
      <AlertComponent />
      <ConfirmationDialog />
      <Suspense fallback={<Loading />}>{routing}</Suspense>
    </>
  );
};

export default App;
