import React, { useEffect } from "react";
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
  MenuItem,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useGetDataQuery, useEditDataMutation } from "../../Features/API/apiSlice";
import { showAlert } from "../../Features/alerter/alertSlice";

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
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Use RTK Query to fetch task data by id.
  const {
    data: taskData,
    error: fetchError,
    isLoading,
  } = useGetDataQuery(`tasks/${id}`);

  // Mutation hook to edit task
  const [editTask, { isLoading: isSubmitting }] = useEditDataMutation();

  // Alert for fetch error, if any.
  useEffect(() => {
    if (fetchError) {
      dispatch(
        showAlert({
          message: fetchError.error || "Error fetching task.",
          status: "error",
          position: { top: "20px", right: "20px" },
          autoHideDuration: 5000,
        })
      );
    }
  }, [fetchError, dispatch]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!taskData) {
    return (
      <Container maxWidth="md">
        <Typography variant="h6" sx={{ mt: 4 }}>
          Task not found
        </Typography>
      </Container>
    );
  }

  // Format dueDate for input (YYYY-MM-DD)
  const formattedTaskData = {
    ...taskData,
    dueDate: taskData.dueDate.split("T")[0],
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Convert dueDate to ISO string for the API call.
      const formattedValues = {
        ...values,
        dueDate: new Date(values.dueDate).toISOString(),
      };

      // Update the task using RTK Query mutation.
      await editTask({
        url: `tasks/${id}`,
        body: formattedValues,
      }).unwrap();

      navigate("/tasks"); // Redirect after successful update.
    } catch (error) {
      // Additional error handling can be done here if required.
      dispatch(
        showAlert({
          message: error.message || "Error updating task.",
          status: "error",
          position: { top: "20px", right: "20px" },
          autoHideDuration: 5000,
        })
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Task: {taskData.title}
        </Typography>

        <Formik
          initialValues={formattedTaskData}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Task Details
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name="title"
                      label="Title"
                      fullWidth
                      variant="outlined"
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      style={{ color: "red" }}
                    />
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
                    <ErrorMessage
                      name="description"
                      component="div"
                      style={{ color: "red" }}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 4 }} />

              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Status & Priority
                </Typography>
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
                    <ErrorMessage
                      name="status"
                      component="div"
                      style={{ color: "red" }}
                    />
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
                    <ErrorMessage
                      name="priority"
                      component="div"
                      style={{ color: "red" }}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 4 }} />

              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Due Date
                </Typography>
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
                    <ErrorMessage
                      name="dueDate"
                      component="div"
                      style={{ color: "red" }}
                    />
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
                {isSubmitting ? (
                  <CircularProgress size={24} />
                ) : (
                  "Save Changes"
                )}
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default EditTask;
