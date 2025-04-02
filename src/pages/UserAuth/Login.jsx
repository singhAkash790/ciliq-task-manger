import React, { useState } from "react";
import {
  TextField,
  Button as ThemeButton,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAddDataMutation } from "../../Features/API/apiSlice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setTokens } from "../../Features/Token/tokenSlice";
import { showAlert } from "../../Features/alerter/alertSlice";
import image01 from "../../assets/images/image01.webp";
import "./index.css";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addData] = useAddDataMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Yup validation schema for login
  const loginValidationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    pwd: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
  });

  // Formik for login
  const loginFormik = useFormik({
    initialValues: {
      email: "",
      pwd: "",
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setIsLoading(true);
      try {
        const response = await addData({
          url: "auth/login", // Replace with your actual endpoint
          body: values,
          reqName: "Login",
          customMessages: {
            success: "Login Successful",
            error: "Login Failed",
          },
        }).unwrap();

        if (response) {
          dispatch(setTokens(response)); // Store token in Redux
          navigate("/"); // Redirect to home page
        }
      } catch (err) {
        let errorMessage = "Login failed";
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
              errorMessage = err.response.data?.message || "Login failed";
          }
        }
        dispatch(showAlert({ message: errorMessage, status: "error" }));
      } finally {
        setSubmitting(false);
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="login-container">
      {/* left Section - Illustration */}
      <div className="login-left-section">
        <img src={image01} alt="Login illustration" />
      </div>

      {/* Right Section - Dynamic Login Form */}
      <div className="login-right-section">
        <h2 className="login-title">Sign In</h2>
        <form onSubmit={loginFormik.handleSubmit} className="login-form">
          <TextField
            fullWidth
            label="Email"
            name="email"
            variant="outlined"
            margin="normal"
            value={loginFormik.values.email}
            onChange={loginFormik.handleChange}
            onBlur={loginFormik.handleBlur}
            error={
              loginFormik.touched.email && Boolean(loginFormik.errors.email)
            }
            helperText={loginFormik.touched.email && loginFormik.errors.email}
          />
          <TextField
            fullWidth
            label="Password"
            name="pwd"
            variant="outlined"
            margin="normal"
            type={showPassword ? "text" : "pwd"}
            value={loginFormik.values.pwd}
            onChange={loginFormik.handleChange}
            onBlur={loginFormik.handleBlur}
            error={
              loginFormik.touched.pwd &&
              Boolean(loginFormik.errors.pwd)
            }
            helperText={
              loginFormik.touched.pwd && loginFormik.errors.pwd
            }
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
            <ThemeButton
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign In"
              )}
            </ThemeButton>
          </div>
          <Link to="/register" className="nav_btn">
            Create a new account
          </Link>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
