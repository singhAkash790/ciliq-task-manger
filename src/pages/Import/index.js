import React, { useState } from 'react';
import GoogleSheetImport from '../../components/GoogleSheetImport';
import FileUploadImport from '../../components/FileUploadImport';
import { Box, Typography, Tabs, Tab, Container, Paper } from '@mui/material';

// ErrorBoundary Component to catch and display errors from its children.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log error details to an error reporting service here.
    this.setState({ errorInfo });
    console.error("Error caught in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            p: 2,
            border: '1px solid red',
            borderRadius: '4px',
            backgroundColor: '#ffe6e6',
            mt: 2,
          }}
        >
          <Typography variant="h6" color="error">
            Something went wrong.
          </Typography>
          <Typography variant="body1" color="error">
            {this.state.error && this.state.error.toString()}
          </Typography>
          <Typography variant="body2" color="error">
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </Typography>
        </Box>
      );
    }
    return this.props.children;
  }
}

const ImportData = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Import Data
        </Typography>

        <Paper elevation={2} sx={{ mb: 3 }}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            centered
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Import via Google Sheets" />
            <Tab label="Import via File Upload" />
          </Tabs>
        </Paper>

        <Box mt={3}>
          {selectedTab === 0 && (
            <ErrorBoundary>
              <GoogleSheetImport />
            </ErrorBoundary>
          )}
          {selectedTab === 1 && (
            <ErrorBoundary>
              <FileUploadImport />
            </ErrorBoundary>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default ImportData;
