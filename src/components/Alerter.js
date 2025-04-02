import React, { useEffect, useState } from "react";
import { Alert, AlertTitle } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { closeAlert } from "../Features/alerter/alertSlice";

const AlertComponent = () => {
  const dispatch = useDispatch();
  const alertProps = useSelector((state) => state.alert.alertProps);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (alertProps) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        dispatch(closeAlert());
      }, alertProps.autoHideDuration || 5000);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [alertProps, dispatch]);

  if (!isVisible || !alertProps) return null;

  const { top, right, bottom, left } = alertProps.position || {};

  return (
    <div
      style={{
        position: "fixed",
        top: top ?? "20px",
        right: right ?? "20px",
        bottom: bottom ?? "auto",
        left: left ?? "auto",
        zIndex: 99999999,
        width: "calc(100% - 40px)",
        maxWidth: "400px",
        margin: "10px",
      }}
    >
      <Alert
        severity={alertProps.status}
        onClose={() => {
          setIsVisible(false);
          dispatch(closeAlert());
        }}
      >
        <AlertTitle>
          {alertProps.status.charAt(0).toUpperCase() +
            alertProps.status.slice(1)}
        </AlertTitle>
        {alertProps.message}
      </Alert>
    </div>
  );
};

export default AlertComponent;
