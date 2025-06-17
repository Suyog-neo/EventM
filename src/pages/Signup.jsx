import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Fade,
  Link,
  Snackbar,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { register, OtpVerify } from '../apis/auth';

export default function Signup() {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    otp: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [otpSent, setOtpSent] = useState(false);

  const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
        if (!value.trim()) return 'First name is required';
        if (value.length < 2) return 'First name must be at least 2 characters';
        if (!/^[a-zA-Z\s]*$/.test(value)) return 'First name should only contain letters';
        return '';
      case 'lastName':
        if (!value.trim()) return 'Last name is required';
        if (value.length < 2) return 'Last name must be at least 2 characters';
        if (!/^[a-zA-Z\s]*$/.test(value)) return 'Last name should only contain letters';
        return '';
      case 'phoneNumber':
        if (!value.trim()) return 'Phone number is required';
        if (!/^[0-9]{10}$/.test(value)) return 'Please enter a valid 10-digit phone number';
        return '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return '';
      case 'otp':
        if (!value) return 'OTP is required';
        if (!/^[0-9]{6}$/.test(value)) return 'OTP must be 6 digits';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
    const error = validateField(name, value);
    setFieldErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleSendOTP = async () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'password', 'phoneNumber'];
    const errors = {};

    requiredFields.forEach((field) => {
      const error = validateField(field, credentials[field]);
      if (error) errors[field] = error;
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      const response = await register({
        first_name: credentials.firstName,
        last_name: credentials.lastName,
        email: credentials.email,
        password: credentials.password,
        phone_number: credentials.phoneNumber
      });

      if (response.data.msg === 'OTP sent to email') {
        setOtpSent(true);
        setSnackbar({ open: true, message: 'OTP sent to your email!', severity: 'success' });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to send OTP. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleVerifyOTP = async () => {
    const otpError = validateField('otp', credentials.otp);
    if (otpError) {
      setFieldErrors({ otp: otpError });
      return;
    }

    try {
      const response = await OtpVerify({
        email: credentials.email,
        otp_code: credentials.otp,
        first_name: credentials.firstName,
        last_name: credentials.lastName,
        phone_number: credentials.phoneNumber,
        password: credentials.password
      });

      const message = response.data.msg || 'User registered successfully!';
      setSnackbar({ open: true, message, severity: 'success' });

      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Invalid OTP. Please try again.',
        severity: 'error'
      });
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: 2,
        backgroundImage:
          'url("https://static.vecteezy.com/system/resources/previews/050/897/969/non_2x/futuristic-dark-gray-wave-abstract-3d-background-with-realistic-gradient-color-on-background-vector.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          bgcolor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 0,
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: 450,
          borderRadius: 3,
          overflow: 'hidden',
          backgroundColor: '#ffffffee',
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: 200,
            backgroundImage:
              'url("https://www.shutterstock.com/image-photo/woman-holding-smartphone-buying-movie-600nw-2156185629.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <Paper elevation={0} sx={{ p: 4, backgroundColor: '#ffffffee' }}>
          <Typography variant="h5" mb={1} textAlign="center" color="primary">
            Join Us Today
          </Typography>
          <Typography variant="body2" textAlign="center" mb={3} color="text.secondary">
            Fill in the details to create your account
          </Typography>

          <Fade in timeout={500}>
            <div>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={credentials.firstName}
                  onChange={handleChange}
                  error={!!fieldErrors.firstName}
                  helperText={fieldErrors.firstName}
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={credentials.lastName}
                  onChange={handleChange}
                  error={!!fieldErrors.lastName}
                  helperText={fieldErrors.lastName}
                />
              </Box>
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={credentials.phoneNumber}
                onChange={handleChange}
                margin="normal"
                error={!!fieldErrors.phoneNumber}
                helperText={fieldErrors.phoneNumber}
                inputProps={{ maxLength: 10, inputMode: 'numeric', pattern: '[0-9]*' }}
              />
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={credentials.password}
                onChange={handleChange}
                margin="normal"
                error={!!fieldErrors.password}
                helperText={fieldErrors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 2 }}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={credentials.email}
                  onChange={handleChange}
                  error={!!fieldErrors.email}
                  helperText={fieldErrors.email}
                  disabled={otpSent}
                />
                <Button
                  variant="contained"
                  onClick={handleSendOTP}
                  sx={{ whiteSpace: 'nowrap' }}
                  disabled={otpSent}
                >
                  Send OTP
                </Button>
              </Box>

              {otpSent && (
                <>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 2 }}>
                    <TextField
                      fullWidth
                      label="Enter OTP"
                      name="otp"
                      value={credentials.otp}
                      onChange={handleChange}
                      error={!!fieldErrors.otp}
                      helperText={fieldErrors.otp}
                    />
                    <Button
                      variant="outlined"
                      onClick={handleVerifyOTP}
                      sx={{ whiteSpace: 'nowrap' }}
                    >
                      Verify
                    </Button>
                  </Box>
                </>
              )}

              <Typography mt={3} textAlign="center">
                Already have an account?{' '}
                <Link href="/login" underline="hover">
                  Login
                </Link>
              </Typography>
            </div>
          </Fade>
        </Paper>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
