import React, { useState } from 'react';
import GoogleSheetImport from '../../components/GoogleSheetImport'; // Google Sheets Import Component
import FileUploadImport from '../../components/FileUploadImport'; // File Upload Import Component
import { Box, Typography, Tabs, Tab, Container, Paper } from '@mui/material';

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
          {selectedTab === 0 && <GoogleSheetImport />}
          {selectedTab === 1 && <FileUploadImport />}
        </Box>
      </Box>
    </Container>
  );
};

export default ImportData;