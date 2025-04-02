import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Container, Paper, Button, CircularProgress } from '@mui/material';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ExportData = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // Mock data fetch function - replace with actual API call
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Replace this with actual data fetching logic
      const mockData = [
        { id: 1, name: 'Item 1', value: 100 },
        { id: 2, name: 'Item 2', value: 200 },
        { id: 3, name: 'Item 3', value: 300 },
      ];
      return mockData;
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      const data = await fetchData();

      if (format === 'excel') {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, 'exported-data.xlsx');
      } else if (format === 'csv') {
        const csvContent = [
          Object.keys(data[0]).join(','),
          ...data.map(item => Object.values(item).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'exported-data.csv');
      }
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Export Data
        </Typography>

        <Paper elevation={2} sx={{ mb: 3 }}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            centered
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Export as Excel" />
            <Tab label="Export as CSV" />
          </Tabs>
        </Paper>

        <Box mt={3} sx={{ textAlign: 'center' }}>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          {selectedTab === 0 && (
            <Box>
              <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
                Export your data in Microsoft Excel format (.xlsx)
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleExport('excel')}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Export to Excel'}
              </Button>
            </Box>
          )}

          {selectedTab === 1 && (
            <Box>
              <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
                Export your data in CSV format (.csv)
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleExport('csv')}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Export to CSV'}
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default ExportData;