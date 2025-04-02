import React, { useState } from "react";
import Papa from "papaparse";
import {
    Container,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Avatar,
    CircularProgress,
    TextField,
    IconButton,
    Button,
    Typography,
    Alert,
    Snackbar,
    Tooltip
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";

const GoogleSheetImport = () => {
    const [sheetLink, setSheetLink] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [data, setData] = useState(null);
    const [columns, setColumns] = useState([]);
    const [editingColumn, setEditingColumn] = useState(null);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'info'
    });

    // Updated requiredFields: only Title and Description are mandatory.
    const requiredFields = ['title', 'description', 'duedate'];

    // Helper functions
    const showNotification = (message, severity = "info") => {
        setNotification({ open: true, message, severity });
    };

    const handleNotificationClose = () => {
        setNotification(prev => ({ ...prev, open: false }));
    };

    const validateHeaders = (headers) => {
        // Convert headers to lowercase and remove special characters
        const normalizedHeaders = headers.map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
        // Convert required fields to same format for comparison
        const normalizedRequired = requiredFields.map(f => f.toLowerCase().replace(/[^a-z0-9]/g, ''));

        const missingFields = normalizedRequired.filter(f => !normalizedHeaders.includes(f));
        if (missingFields.length > 0) {
            throw new Error(`Missing required columns: ${missingFields.join(', ')}`);
        }
    };

    // Data transformation function (not removed, only modified in sendUpdatedDataToDB)
    // Extract Sheet ID from URL and generate CSV URL
    const getCsvUrl = (url) => {
        if (url.includes("spreadsheets/d/")) {
            const sheetId = url.match(/[-\w]{25,}/)?.[0];
            return sheetId ? `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv` : null;
        } else if (url.includes("drive.google.com/file/d/")) {
            const fileId = url.match(/\/d\/([-\w]{25,})/)?.[1];
            return fileId ? `https://drive.google.com/uc?export=download&id=${fileId}` : null;
        }
        return null;
    };

    const fetchSheetData = async (url) => {
        try {
            const response = await fetch(url);
            if (response.status === 403) throw new Error("Sheet not publicly accessible");
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

            const csvText = await response.text();
            if (/<html>/i.test(csvText)) throw new Error("Invalid CSV response");

            return new Promise((resolve, reject) => {
                Papa.parse(csvText, {
                    header: false,
                    complete: (results) => resolve(results.data),
                    error: reject
                });
            });
        } catch (error) {
            throw error;
        }
    };

    // Data import handler
    const normalizeHeader = (header) => header.toLowerCase().replace(/\s+/g, ""); // Convert to lowercase & remove spaces

    const handleImport = async () => {
        if (!sheetLink) return setError('Please enter a URL');

        const csvUrl = getCsvUrl(sheetLink);
        if (!csvUrl) return setError("Invalid Google Sheets URL");

        setLoading(true);
        setError('');

        try {
            const sheetData = await fetchSheetData(csvUrl);
            if (!sheetData?.length) throw new Error("No data found");

            // Normalize headers: lowercase + remove spaces
            const rawHeaders = sheetData[0].map(h => h.trim()).filter(Boolean);
            const headers = rawHeaders.map(normalizeHeader);

            validateHeaders(headers);

            // Transform each row using normalized headers
            const transformedData = sheetData.slice(1).map((row, idx) => {
                const rowData = headers.reduce((acc, header, i) => {
                    acc[header] = row[i] || "";
                    return acc;
                }, {});
                return {
                    id: `row-${idx}`,
                    isActive: 'active',
                    status: "on-going",
                    priority: rowData.priority || "Medium",
                    ...rowData
                };
            });

            setColumns(headers);
            setData(transformedData);
            setIsDataLoaded(true);
            showNotification("Data imported successfully!", "success");
        } catch (err) {
            console.error("Import error:", err);
            setError(err.message);
            showNotification(err.message, "error");
        } finally {
            setLoading(false);
        }
    };

    const sendUpdatedDataToDB = async () => {
        if (!data) return;

        try {
            setLoading(true);

            // Transforming data for backend using normalized headers
            const backendData = data.map(item => ({
                title: item.title,
                description: item.description,
                dueDate: item.duedate ? new Date(item.duedate).toISOString() : "",
                priority: item.priority || "Medium",
                status: item.status || "Pending"
            }));

            console.log("Transformed backendData:", backendData);

            const response = await axios.post("http://localhost:5000/api/tasks/bulk-import", backendData);
            console.log("Backend response:", response);

            setData(backendData);
            showNotification("Data saved with backend-generated IDs!", "success");
        } catch (error) {
            const errorMessage = error.response?.data?.error?.message || error.message;
            console.error("Save error:", error);
            showNotification(`Save failed: ${errorMessage}`, "error");
        } finally {
            setLoading(false);
        }
    };

    // Column editing handlers (unchanged)
    const handleHeaderChange = (event, index) => {
        const currentHeader = columns[index];
        if (requiredFields.includes(currentHeader)) {
            showNotification("Cannot rename required fields", "error");
            return;
        }

        const newHeader = event.target.value.trim();
        if (!newHeader) {
            showNotification("Column name required", "error");
            return;
        }
        if (columns.some((h, i) => i !== index && h === newHeader)) {
            showNotification("Column names must be unique", "error");
            return;
        }

        const newColumns = [...columns];
        newColumns[index] = newHeader;
        setColumns(newColumns);

        setData(prevData => prevData.map(row => {
            const updatedRow = { ...row };
            updatedRow[newHeader] = updatedRow[currentHeader];
            delete updatedRow[currentHeader];
            return updatedRow;
        }));
    };

    return (
        <Container sx={{ mt: 4, width: "85%" }}>
            <Box mb={4}>
                <Typography variant="h6" mb={2}>Google Sheets Importer</Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                    {/* Updated note to reflect required fields */}
                    Note: Sheet must contain these columns: {requiredFields.join(', ')}
                </Alert>
                <Box display="flex" gap={2} alignItems="center">
                    <TextField
                        fullWidth
                        label="Google Sheets URL"
                        value={sheetLink}
                        onChange={(e) => setSheetLink(e.target.value)}
                        error={!!error}
                        helperText={error || "Paste your Google Sheets URL here"}
                        placeholder="https://docs.google.com/spreadsheets/d/..."
                    />
                    <Button
                        variant="contained"
                        onClick={handleImport}
                        disabled={loading || !sheetLink}
                        sx={{ height: 56 }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Import'}
                    </Button>
                </Box>
            </Box>

            {isDataLoaded && (
                <>
                    <Typography variant="h6" mb={2}>Preview Data</Typography>
                    <TableContainer component={Paper} sx={{ mb: 3 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    {columns.map((col, index) => (
                                        <TableCell key={index} sx={{ minWidth: 150 }}>
                                            <Box display="flex" alignItems="center">
                                                <Typography noWrap sx={{ flex: 1, fontWeight: requiredFields.includes(col) ? 'bold' : 'normal' }}>
                                                    {col}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map((row) => (
                                    <TableRow key={row.id}>
                                        {columns.map((col, colIndex) => (
                                            <TableCell key={colIndex} sx={{
                                                minWidth: "120px",
                                                maxWidth: "350px",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                                padding: "8px"
                                            }}>
                                                <Tooltip title={row[col]} placement="top">
                                                    <span>
                                                        {col === 'Due Date'
                                                            ? new Date(row[col]).toLocaleDateString()
                                                            : row[col]}
                                                    </span>
                                                </Tooltip>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box display="flex" justifyContent="flex-end">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={sendUpdatedDataToDB}
                            disabled={loading}
                            sx={{ minWidth: 120 }}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Save to Database'}
                        </Button>
                    </Box>
                </>
            )}

            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={handleNotificationClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={notification.severity} onClose={handleNotificationClose} sx={{ width: '100%' }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default GoogleSheetImport;
