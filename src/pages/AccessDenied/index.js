import React from "react";
import { Container, Typography } from "@mui/material";

const AccessDenied = () => {
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center">
        Access Denied
      </Typography>
      <Typography variant="body1" align="center">
        You do not have the necessary permissions to access this page.
      </Typography>
    </Container>
  );
};

export default AccessDenied;
