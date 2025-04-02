import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  IconButton,
  TextField,
  CircularProgress,
  Pagination,
} from "@mui/material";
import { Add, Edit, Delete, CheckCircle } from "@mui/icons-material";
import { useGetDataQuery, useEditDataMutation, useDeleteDataMutation } from "../../Features/API/apiSlice";
import { useDispatch } from "react-redux";
import { showAlert } from "../../Features/alerter/alertSlice";

const TaskList = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "taskId", direction: "asc" });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalTasks: 0,
  });

  // Build query string with current params. Adjust parameter names to match your backend API.
  const queryString = `tasks?page=${pagination.page}&limit=${pagination.limit}&sortBy=${sortConfig.key}&sortOrder=${sortConfig.direction}&search=${searchQuery}`;

  // Using RTK Query to fetch tasks.
  const {
    data: responseData,
    error,
    isLoading,
    refetch,
  } = useGetDataQuery(queryString);

  // When responseData updates, update pagination and tasks.
  const tasks = responseData?.tasks || [];
  useEffect(() => {
    if (responseData) {
      setPagination((prev) => ({
        ...prev,
        totalPages: responseData.totalPages,
        totalTasks: responseData.totalTasks,
      }));
    }
  }, [responseData]);

  // Dispatch alert if query error occurs
  useEffect(() => {
    if (error) {
      dispatch(
        showAlert({
          message: error.error || "Error fetching tasks.",
          status: "error",
          position: { top: "20px", right: "20px" },
          autoHideDuration: 5000,
        })
      );
    }
  }, [error, dispatch]);

  const [editTask] = useEditDataMutation();
  const [deleteTaskMutation] = useDeleteDataMutation();

  const handlePageChange = (event, value) => {
    setPagination((prev) => ({ ...prev, page: value }));
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const markAsCompleted = async (id) => {
    try {
      // Adjust the URL or body as required by your API.
      await editTask({
        url: `tasks/${id}/complete`,
        body: { status: "Completed" },
      }).unwrap();
      // Optionally refetch tasks after a successful update.
      refetch();
    } catch (err) {
      // Error handling is automatically done by the mutation's onQueryStarted,
      // but you can also dispatch an alert manually here if needed.
      dispatch(
        showAlert({
          message: err.message || "Error marking task as complete.",
          status: "error",
          position: { top: "20px", right: "20px" },
          autoHideDuration: 5000,
        })
      );
    }
  };

  const deleteTask = async (id) => {
    try {
      await deleteTaskMutation({ url: `tasks/${id}` }).unwrap();
      refetch();
    } catch (err) {
      dispatch(
        showAlert({
          message: err.message || "Error deleting task.",
          status: "error",
          position: { top: "20px", right: "20px" },
          autoHideDuration: 5000,
        })
      );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "error.main";
      case "medium":
        return "warning.main";
      case "low":
        return "success.main";
      default:
        return "text.primary";
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "text.secondary";
      case "in progress":
        return "info.main";
      case "completed":
        return "success.main";
      default:
        return "text.primary";
    }
  };

  if (isLoading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Task Management
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            component={Link}
            to="/add-task"
          >
            Add New Task
          </Button>
          <TextField
            label="Search Tasks"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={handleSearch}
            sx={{ width: 300 }}
          />
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  onClick={() => handleSort("taskId")}
                  sx={{ cursor: "pointer" }}
                >
                  Task ID{" "}
                  {sortConfig.key === "taskId" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </TableCell>
                <TableCell
                  onClick={() => handleSort("title")}
                  sx={{ cursor: "pointer" }}
                >
                  Title{" "}
                  {sortConfig.key === "title" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </TableCell>
                <TableCell>Description</TableCell>
                <TableCell
                  onClick={() => handleSort("dueDate")}
                  sx={{ cursor: "pointer" }}
                >
                  Due Date{" "}
                  {sortConfig.key === "dueDate" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </TableCell>
                <TableCell
                  onClick={() => handleSort("priority")}
                  sx={{ cursor: "pointer" }}
                >
                  Priority{" "}
                  {sortConfig.key === "priority" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </TableCell>
                <TableCell
                  onClick={() => handleSort("status")}
                  sx={{ cursor: "pointer" }}
                >
                  Status{" "}
                  {sortConfig.key === "status" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task._id}>
                  <TableCell>{task.taskId}</TableCell>
                  <TableCell>{task.title}</TableCell>
                  <TableCell
                    sx={{
                      maxWidth: 200,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {task.description || "-"}
                  </TableCell>
                  <TableCell>{formatDate(task.dueDate)}</TableCell>
                  <TableCell>
                    <Typography color={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color={getStatusColor(task.status)}>
                      {task.status}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {task.status.toLowerCase() !== "completed" && (
                        <IconButton
                          color="success"
                          onClick={() => markAsCompleted(task._id)}
                        >
                          <CheckCircle />
                        </IconButton>
                      )}
                      <IconButton
                        color="primary"
                        component={Link}
                        to={`/edit-task/${task._id}`}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => deleteTask(task._id)}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination
          count={pagination.totalPages}
          page={pagination.page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Container>
  );
};

export default TaskList;
