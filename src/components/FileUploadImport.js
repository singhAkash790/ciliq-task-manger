import React, { useState } from 'react';
import {
    Button,
    Box,
    Typography,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Container,
    TextField,
    Paper,
    TableContainer,
    Alert
} from '@mui/material';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { showAlert } from '../Features/alerter/alertSlice';

const FileUploadImport = () => {
    const dispatch = useDispatch();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [importedData, setImportedData] = useState([]);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [fileName, setFileName] = useState('');

    const requiredFields = ['title', 'description', 'duedate'];

    // Helper to dispatch alerts via the alerter slice.
    const triggerAlert = (message, severity = "info") => {
        dispatch(
            showAlert({
                message,
                status: severity,
                position: { top: "20px", right: "20px" },
                autoHideDuration: 6000
            })
        );
    };

    const normalizeKey = (key) => {
        return key.toLowerCase().replace(/[^a-z0-9]/g, '');
    };

    const validateRow = (row, index) => {
        const errors = [];
        requiredFields.forEach(field => {
            const normalizedField = normalizeKey(field);
            const matchingKey = Object.keys(row).find(key => normalizeKey(key) === normalizedField);
            if (!matchingKey || !row[matchingKey]) {
                errors.push(`Missing ${field}`);
            }
        });
        if (errors.length > 0) {
            throw new Error(`Row ${index + 1}: ${errors.join('; ')}`);
        }
    };

    const transformToBackendFormat = (frontendData) => {
        return frontendData.map(item => {
            // Find the correct keys in the original data that match our required fields
            const titleKey = Object.keys(item).find(key => normalizeKey(key) === 'title');
            const descKey = Object.keys(item).find(key => normalizeKey(key) === 'description');
            const dateKey = Object.keys(item).find(key => normalizeKey(key) === 'duedate');
            return {
                title: item[titleKey] || '',
                description: item[descKey] || '',
                dueDate: item[dateKey] ? formatDate(item[dateKey]) : new Date().toISOString().split('T')[0],
                priority: item.priority
                    ? item.priority.charAt(0).toUpperCase() + item.priority.slice(1).toLowerCase()
                    : 'Medium',
                status: item.status || 'Pending'
            };
        }).filter(item => item.title); // Remove items with empty titles
    };

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return new Date().toISOString().split('T')[0]; // Return today if invalid
            }
            return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        } catch {
            return new Date().toISOString().split('T')[0];
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const validTypes = [
                'text/csv',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            ];
            if (
                !validTypes.includes(selectedFile.type) &&
                !selectedFile.name.match(/\.(csv|xlsx|xls)$/i)
            ) {
                setError('Please upload a valid CSV or Excel file');
                return;
            }
            setError('');
            setFile(selectedFile);
            setFileName(selectedFile.name);
            setImportedData([]);
            setIsDataLoaded(false);
        }
    };

    const processExcelFile = async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                    const jsonData = XLSX.utils.sheet_to_json(firstSheet, { defval: '' });
                    resolve(jsonData);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = (error) => reject(error);
            reader.readAsArrayBuffer(file);
        });
    };

    const processCSVFile = async (file) => {
        return new Promise((resolve, reject) => {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => resolve(results.data),
                error: (error) => reject(error)
            });
        });
    };

    const handleImport = async () => {
        if (!file) {
            setError('Please select a file first');
            return;
        }
        setLoading(true);
        setError('');
        try {
            let rawData;
            if (file.name.match(/\.xlsx?$/i)) {
                rawData = await processExcelFile(file);
            } else {
                rawData = await processCSVFile(file);
            }
            // Validate each row
            rawData.forEach((row, index) => validateRow(row, index));
            // Transform to backend format
            const processedData = transformToBackendFormat(rawData);
            setImportedData(processedData);
            setIsDataLoaded(true);
            triggerAlert(`Successfully imported ${processedData.length} records`, 'success');
        } catch (error) {
            console.error('Import error:', error);
            setError(error.message);
            triggerAlert(`Import failed: ${error.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveData = async () => {
        if (!importedData.length) return;
        try {
            setLoading(true);
            // Final validation before sending
            const validData = importedData.filter(item => {
                return item.title && item.dueDate && item.priority;
            });
            if (validData.length !== importedData.length) {
                throw new Error('Some data failed validation and was removed');
            }
            const response = await axios.post(
                "http://localhost:5000/api/tasks/bulk-import",
                validData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            triggerAlert(`Successfully saved ${validData.length} tasks`, 'success');
            // Update with any IDs returned from backend
            if (response.data && Array.isArray(response.data)) {
                setImportedData(prev => prev.map((item, index) => ({
                    ...item,
                    taskId: response.data[index]?.taskId || 'Not assigned'
                })));
            }
        } catch (error) {
            console.error('Save error:', error);
            const errorMsg =
                error.response?.data?.details?.join(', ') ||
                error.response?.data?.error ||
                error.message;
            triggerAlert(`Save failed: ${errorMsg}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const columns = importedData.length > 0
        ? Object.keys(importedData[0]).filter(key => key !== 'id')
        : [];

    return (
        <Container sx={{ mt: 4, width: "85%" }}>
            <Box mb={4}>
                <Typography variant="h6" mb={2}>Import Tasks from File</Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                    Required fields: {requiredFields.join(', ')}
                </Alert>
                <Box display="flex" gap={2} alignItems="center" mb={2}>
                    <TextField
                        fullWidth
                        label="Selected File"
                        value={fileName}
                        InputProps={{ readOnly: true }}
                        error={!!error}
                        helperText={error || "Choose a CSV or Excel file"}
                    />
                    <Button variant="contained" component="label" sx={{ height: 56 }}>
                        Browse
                        <input
                            type="file"
                            accept=".csv,.xlsx,.xls"
                            hidden
                            onChange={handleFileChange}
                        />
                    </Button>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleImport}
                    disabled={loading || !file}
                    sx={{ height: 56, mr: 2 }}
                >
                    {loading ? <CircularProgress size={24} /> : 'Import Data'}
                </Button>
            </Box>

            {isDataLoaded && (
                <>
                    <Typography variant="h6" mb={2}>Preview ({importedData.length} records)</Typography>
                    <TableContainer component={Paper} sx={{ mb: 3, maxHeight: 500, overflow: 'auto' }}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    {columns.map((column, index) => (
                                        <TableCell
                                            key={index}
                                            sx={{ fontWeight: 'bold', bgcolor: 'background.paper' }}
                                        >
                                            {column}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {importedData.slice(0, 50).map((row, index) => (
                                    <TableRow key={index}>
                                        {columns.map((column, colIndex) => (
                                            <TableCell
                                                key={colIndex}
                                                sx={{
                                                    maxWidth: 200,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {column === 'dueDate'
                                                    ? new Date(row[column]).toLocaleDateString()
                                                    : row[column]}
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
                            color="success"
                            onClick={handleSaveData}
                            disabled={loading || !importedData.length}
                            sx={{ minWidth: 150 }}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Save to Database'}
                        </Button>
                    </Box>
                </>
            )}
        </Container>
    );
};

export default FileUploadImport;
