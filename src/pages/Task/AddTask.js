import React from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Divider,
  MenuItem,
  CircularProgress,
  Box,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
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

const AddTask = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Format the date to ISO string
      const formattedValues = {
        ...values,
        dueDate: new Date(values.dueDate).toISOString()
      };

      const response = await axios.post("http://localhost:5000/api/tasks", formattedValues);
      console.log("Task created:", response.data);
      navigate("/tasks"); // Redirect after adding task
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add New Task
        </Typography>

        <Formik
          initialValues={{
            title: "",
            description: "",
            dueDate: "",
            status: "Pending",
            priority: "Medium",
          }}
          validationSchema={validationSchema}
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
                {isSubmitting ? <CircularProgress size={24} /> : "Add Task"}
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default AddTask;