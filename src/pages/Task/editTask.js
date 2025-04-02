import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Divider,
  CircularProgress,
  Box,
  MenuItem
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

// Dropdown Options
const statusOptions = ["Pending", "In Progress", "Completed"];
const priorityOptions = ["Low", "Medium", "High"];

// Validation Schema
const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string(),
  dueDate: Yup.date().required("Due date is required"),
  status: Yup.string().required("Status is required"),
  priority: Yup.string().required("Priority is required"),
});

const EditTask = () => {
  const { id } = useParams();
  const [taskData, setTaskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tasks/${id}`);
        // Format the date for the date input field
        const formattedData = {
          ...response.data,
          dueDate: response.data.dueDate.split('T')[0] // Extract YYYY-MM-DD from ISO string
        };
        setTaskData(formattedData);
        console.log(formattedData)
      } catch (error) {
        console.error("Error fetching task:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Format the date to ISO string
      const formattedValues = {
        ...values,
        dueDate: new Date(values.dueDate).toISOString()
      };

      await axios.put(`http://localhost:5000/api/tasks/${id}`, formattedValues);
      navigate("/tasks"); // Redirect after successful update
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!taskData) {
    return (
      <Container maxWidth="md">
        <Typography variant="h6" sx={{ mt: 4 }}>Task not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Task: {taskData.title}
        </Typography>

        <Formik
          initialValues={taskData}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>Task Details</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name="title"
                      label="Title"
                      fullWidth
                      variant="outlined"
                    />
                    <ErrorMessage name="title" component="div" style={{ color: "red" }} />
                  </Grid>

                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name="description"
                      label="Description"
                      fullWidth
                      multiline
                      rows={3}
                      variant="outlined"
                    />
                    <ErrorMessage name="description" component="div" style={{ color: "red" }} />
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 4 }} />

              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>Status & Priority</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      select
                      name="status"
                      label="Status"
                      fullWidth
                      variant="outlined"
                    >
                      {statusOptions.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Field>
                    <ErrorMessage name="status" component="div" style={{ color: "red" }} />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      select
                      name="priority"
                      label="Priority"
                      fullWidth
                      variant="outlined"
                    >
                      {priorityOptions.map((priority) => (
                        <MenuItem key={priority} value={priority}>
                          {priority}
                        </MenuItem>
                      ))}
                    </Field>
                    <ErrorMessage name="priority" component="div" style={{ color: "red" }} />
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 4 }} />

              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>Due Date</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name="dueDate"
                      label="Due Date"
                      type="date"
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                    />
                    <ErrorMessage name="dueDate" component="div" style={{ color: "red" }} />
                  </Grid>
                </Grid>
              </Box>

              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                size="large"
                fullWidth
                sx={{ mt: 2 }}
              >
                {isSubmitting ? <CircularProgress size={24} /> : "Save Changes"}
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default EditTask;