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
  Pagination
} from "@mui/material";
import { Add, Edit, Delete, CheckCircle } from "@mui/icons-material";
import axios from "axios";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "taskId", direction: "asc" });
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalTasks: 0
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/tasks", {
          params: {
            page: pagination.page,
            limit: pagination.limit,
            sortBy: sortConfig.key,
            sortOrder: sortConfig.direction,
            search: searchQuery
          }
        });

        setTasks(response.data.tasks);
        setPagination(prev => ({
          ...prev,
          totalPages: response.data.totalPages,
          totalTasks: response.data.totalTasks
        }));
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [pagination.page, pagination.limit, sortConfig, searchQuery]);

  const handlePageChange = (event, value) => {
    setPagination(prev => ({ ...prev, page: value }));
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === "asc"
      ? "desc"
      : "asc";
    setSortConfig({ key, direction });
    setPagination(prev => ({ ...prev, page: 1 }));
  };



  const markAsCompleted = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/tasks/${id}/complete`);
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task._id === id ? { ...task, status: "Completed" } : task
        )
      );
    } catch (error) {
      console.error("Error marking task as complete:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      setTasks(prevTasks => prevTasks.filter(task => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };



  const sortedTasks = [...tasks].sort((a, b) => {
    // Handle numeric sorting for taskId
    if (sortConfig.key === "taskId") {
      return sortConfig.direction === "asc"
        ? a.taskId - b.taskId
        : b.taskId - a.taskId;
    }

    // Handle date sorting
    if (sortConfig.key === "dueDate") {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      return sortConfig.direction === "asc"
        ? dateA - dateB
        : dateB - dateA;
    }

    // Default string sorting
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const filteredTasks = sortedTasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery) ||
    task.description.toLowerCase().includes(searchQuery)
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
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

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
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
                <TableCell onClick={() => handleSort("taskId")} sx={{ cursor: 'pointer' }}>
                  Task ID {sortConfig.key === "taskId" && (
                    sortConfig.direction === "asc" ? "↑" : "↓"
                  )}
                </TableCell>
                <TableCell onClick={() => handleSort("title")} sx={{ cursor: 'pointer' }}>
                  Title {sortConfig.key === "title" && (
                    sortConfig.direction === "asc" ? "↑" : "↓"
                  )}
                </TableCell>
                <TableCell>Description</TableCell>
                <TableCell onClick={() => handleSort("dueDate")} sx={{ cursor: 'pointer' }}>
                  Due Date {sortConfig.key === "dueDate" && (
                    sortConfig.direction === "asc" ? "↑" : "↓"
                  )}
                </TableCell>
                <TableCell onClick={() => handleSort("priority")} sx={{ cursor: 'pointer' }}>
                  Priority {sortConfig.key === "priority" && (
                    sortConfig.direction === "asc" ? "↑" : "↓"
                  )}
                </TableCell>
                <TableCell onClick={() => handleSort("status")} sx={{ cursor: 'pointer' }}>
                  Status {sortConfig.key === "status" && (
                    sortConfig.direction === "asc" ? "↑" : "↓"
                  )}
                </TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTasks.map((task, index) => (
                <TableRow key={task._id}>
                  <TableCell>{task.taskId}</TableCell>
                  <TableCell>{task.title}</TableCell>
                  <TableCell sx={{
                    maxWidth: 200,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {task.description || '-'}
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
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={pagination.totalPages}
          page={pagination.page}
          onChange={handlePageChange}
          color="primary"
          // showFirstButton
          // showLastButton
        />
      </Box>
    </Container>
  );
};

export default TaskList;