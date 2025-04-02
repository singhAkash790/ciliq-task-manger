import React, { useState } from "react";
import { useFormik, FormikProvider } from "formik";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import * as Yup from "yup";
import { useAddDataMutation } from "../../Features/API/apiSlice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setTokens } from "../../Features/Token/tokenSlice";
import { showAlert } from "../../Features/alerter/alertSlice";
import image01 from "../../assets/images/image01.webp";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import "./index.css";

const SignUpPage = () => {
  const [addData] = useAddDataMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Form validation schema
  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    pwd: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: { username: "", email: "", pwd: "" },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setIsLoading(true);
      try {
        const response = await addData({
          url: "auth/register", // Replace with your actual endpoint
          body: values,
          reqName: "Login",
          customMessages: {
            success: "Registration Successful",
            error: "Registration Failed",
          },
        }).unwrap();
        if (response) {
          dispatch(setTokens(response));
          navigate("/");
        }
      } catch (err) {
        let errorMessage = "Sign Up failed";
        if (err.response) {
          switch (err.response.status) {
            case 401:
              errorMessage = "Invalid email or pwd";
              break;
            case 404:
              errorMessage = "Account not found";
              break;
            case 403:
              errorMessage = "Account is locked. Please contact support";
              break;
            default:
              errorMessage =
                err.response.data?.message || "Account creation failed";
          }
        }
        dispatch(showAlert({ message: errorMessage, status: "error" }));
        console.error("Error in registration:", err);
      } finally {
        setSubmitting(false);
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="login-container">
      <div className="login-left-section">
        <img src={image01} alt="Illustration" />
      </div>
      {/* Right Section - Registration Form */}
      <div className="login-right-section">
        <h2 className="login-title">Sign Up</h2>
        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit} className="login-form">
            <TextField
              fullWidth
              id="username"
              name="username"
              label="Username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
              margin="normal"
            />
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Password"
              name="pwd"
              variant="outlined"
              margin="normal"
              type={showPassword ? "text" : "pwd"}
              value={formik.values.pwd}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.pwd && Boolean(formik.errors.pwd)}
              helperText={formik.touched.pwd && formik.errors.pwd}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <div className="login-button-container">
              <Button
                variant="contained"
                type="submit"
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Sign Up"}
              </Button>
            </div>
            <Link to="/sign-in" className="nav_btn">
              Already have an account? Sign In
            </Link>
          </form>
        </FormikProvider>
      </div>
    </div>
  );
};

export default SignUpPage;
