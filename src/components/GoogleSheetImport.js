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
    CircularProgress,
    TextField,
    Button,
    Typography,
    Alert,
    Tooltip
} from "@mui/material";
import { useAddDataMutation } from "../Features/API/apiSlice";
import { useDispatch } from "react-redux";
import { showAlert } from "../Features/alerter/alertSlice";

const GoogleSheetImport = () => {
    const dispatch = useDispatch();
    const [sheetLink, setSheetLink] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [data, setData] = useState(null);
    const [columns, setColumns] = useState([]);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    // Updated requiredFields: only Title and Description are mandatory.
    const requiredFields = ["title", "description", "duedate"];

    // RTK Query mutation hook for bulk import.
    const [bulkImport, { isLoading: isSaving }] = useAddDataMutation();

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

    const validateHeaders = (headers) => {
        // Convert headers to lowercase and remove special characters
        const normalizedHeaders = headers.map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ""));
        // Convert required fields to same format for comparison
        const normalizedRequired = requiredFields.map(f => f.toLowerCase().replace(/[^a-z0-9]/g, ""));

        const missingFields = normalizedRequired.filter(f => !normalizedHeaders.includes(f));
        if (missingFields.length > 0) {
            throw new Error(`Missing required columns: ${missingFields.join(", ")}`);
        }
    };

    // Extract Sheet ID from URL and generate CSV URL.
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

    // Normalize header: lowercase & remove spaces.
    const normalizeHeader = (header) => header.toLowerCase().replace(/\s+/g, "");

    const handleImport = async () => {
        if (!sheetLink) {
            setError("Please enter a URL");
            return;
        }

        const csvUrl = getCsvUrl(sheetLink);
        if (!csvUrl) {
            setError("Invalid Google Sheets URL");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const sheetData = await fetchSheetData(csvUrl);
            if (!sheetData?.length) throw new Error("No data found");

            // Normalize headers: lowercase + remove spaces.
            const rawHeaders = sheetData[0].map(h => h.trim()).filter(Boolean);
            const headers = rawHeaders.map(normalizeHeader);

            validateHeaders(headers);

            // Transform each row using normalized headers.
            const transformedData = sheetData.slice(1).map((row, idx) => {
                const rowData = headers.reduce((acc, header, i) => {
                    acc[header] = row[i] || "";
                    return acc;
                }, {});
                return {
                    id: `row-${idx}`,
                    isActive: "active",
                    status: "on-going",
                    priority: rowData.priority || "Medium",
                    ...rowData
                };
            });

            setColumns(headers);
            setData(transformedData);
            setIsDataLoaded(true);
            triggerAlert("Data imported successfully!", "success");
        } catch (err) {
            console.error("Import error:", err);
            setError(err.message);
            triggerAlert(err.message, "error");
        } finally {
            setLoading(false);
        }
    };

    const sendUpdatedDataToDB = async () => {
        if (!data) return;

        try {
            setLoading(true);

            // Transform data for the backend.
            const backendData = data.map(item => ({
                title: item.title,
                description: item.description,
                dueDate: item.duedate ? new Date(item.duedate).toISOString() : "",
                priority: item.priority || "Medium",
                status: item.status || "Pending"
            }));

            console.log("Transformed backendData:", backendData);

            // Use RTK Query mutation for bulk import.
            await bulkImport({
                url: "tasks/bulk-import",
                body: backendData
            }).unwrap();

            setData(backendData);
            triggerAlert("Data saved with backend-generated IDs!", "success");
        } catch (error) {
            const errorMessage =
                (error?.data && error.data.error && error.data.error.message) ||
                error.message ||
                "Unknown error";
            console.error("Save error:", error);
            triggerAlert(`Save failed: ${errorMessage}`, "error");
        } finally {
            setLoading(false);
        }
    };

    const handleHeaderChange = (event, index) => {
        const currentHeader = columns[index];
        if (requiredFields.includes(currentHeader)) {
            triggerAlert("Cannot rename required fields", "error");
            return;
        }

        const newHeader = event.target.value.trim();
        if (!newHeader) {
            triggerAlert("Column name required", "error");
            return;
        }
        if (columns.some((h, i) => i !== index && h === newHeader)) {
            triggerAlert("Column names must be unique", "error");
            return;
        }

        const newColumns = [...columns];
        newColumns[index] = newHeader;
        setColumns(newColumns);

        setData(prevData =>
            prevData.map(row => {
                const updatedRow = { ...row };
                updatedRow[newHeader] = updatedRow[currentHeader];
                delete updatedRow[currentHeader];
                return updatedRow;
            })
        );
    };

    return (
        <Container sx={{ mt: 4, width: "85%" }}>
            <Box mb={4}>
                <Typography variant="h6" mb={2}>
                    Google Sheets Importer
                </Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                    Note: Sheet must contain these columns: {requiredFields.join(", ")}
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
                        {loading ? <CircularProgress size={24} /> : "Import"}
                    </Button>
                </Box>
            </Box>

            {isDataLoaded && (
                <>
                    <Typography variant="h6" mb={2}>
                        Preview Data
                    </Typography>
                    <TableContainer component={Paper} sx={{ mb: 3 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    {columns.map((col, index) => (
                                        <TableCell key={index} sx={{ minWidth: 150 }}>
                                            <Box display="flex" alignItems="center">
                                                <Typography
                                                    noWrap
                                                    sx={{
                                                        flex: 1,
                                                        fontWeight: requiredFields.includes(col)
                                                            ? "bold"
                                                            : "normal"
                                                    }}
                                                >
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
                                            <TableCell
                                                key={colIndex}
                                                sx={{
                                                    minWidth: "120px",
                                                    maxWidth: "350px",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                    padding: "8px"
                                                }}
                                            >
                                                <Tooltip title={row[col]} placement="top">
                                                    <span>
                                                        {col === "duedate"
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
                            disabled={loading || isSaving}
                            sx={{ minWidth: 120 }}
                        >
                            {loading || isSaving ? (
                                <CircularProgress size={24} />
                            ) : (
                                "Save to Database"
                            )}
                        </Button>
                    </Box>
                </>
            )}
        </Container>
    );
};

export default GoogleSheetImport;
