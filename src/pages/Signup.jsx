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

export default function Signup() {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    otp: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleSendOTP = () => {
    const { email } = credentials;
    if (!email) {
      setFieldErrors({ email: 'Email is required to send OTP' });
      return;
    }
    // Here you would typically make an API call to send OTP
    // For now, we'll simulate it
    setOtpSent(true);
    setSnackbar({ open: true, message: 'OTP sent to your email!', severity: 'success' });
  };

  const handleVerifyOTP = () => {
    const { otp } = credentials;
    if (!otp) {
      setFieldErrors({ otp: 'Please enter the OTP' });
      return;
    }
    // Here you would typically verify the OTP with your backend
    // For now, we'll simulate it with any 6-digit number
    if (otp.length === 6) {
      setOtpVerified(true);
      setSnackbar({ open: true, message: 'OTP verified successfully!', severity: 'success' });
    } else {
      setSnackbar({ open: true, message: 'Invalid OTP. Please try again.', severity: 'error' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password, otp } = credentials;
    const errors = {};

    if (!firstName) errors.firstName = 'First name is required';
    if (!lastName) errors.lastName = 'Last name is required';
    if (!email) errors.email = 'Email is required';
    if (!password) errors.password = 'Password is required';
    if (!otpVerified) {
      setSnackbar({ open: true, message: 'Please verify your email with OTP first.', severity: 'error' });
      return;
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    // Here you would typically make an API call to create the account
    setSnackbar({ open: true, message: 'Account created successfully! You can now log in.', severity: 'success' });
    setTimeout(() => navigate('/login'), 2000);
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
        backgroundRepeat: 'no-repeat',
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
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
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

        <Paper
          elevation={0}
          sx={{
            width: '100%',
            p: 4,
            backgroundColor: '#ffffffee',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h5" mb={1} textAlign="center" color="primary">
            Join Us Today
          </Typography>
          <Typography variant="body2" textAlign="center" mb={3} color="text.secondary">
            Fill in the details to create your account
          </Typography>

          <form onSubmit={handleSubmit}>
            <Fade in timeout={500}>
              <div>
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={credentials.firstName}
                    onChange={handleChange}
                    variant="outlined"
                    error={!!fieldErrors.firstName}
                    helperText={fieldErrors.firstName}
                  />
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={credentials.lastName}
                    onChange={handleChange}
                    variant="outlined"
                    error={!!fieldErrors.lastName}
                    helperText={fieldErrors.lastName}
                  />
                </Box>
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
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
                    variant="outlined"
                    error={!!fieldErrors.email}
                    helperText={fieldErrors.email}
                    disabled={otpSent}
                  />
                  <Typography
                    onClick={handleSendOTP}
                    sx={{
                      color: '#0288d1',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      opacity: otpSent ? 0.5 : 1,
                      pointerEvents: otpSent ? 'none' : 'auto',
                      '&:hover': {
                        color: '#01579b',
                      },
                    }}
                  >
                    Send OTP
                  </Typography>
                </Box>
                {otpSent && (
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 2 }}>
                    <TextField
                      fullWidth
                      label="Enter OTP"
                      name="otp"
                      value={credentials.otp}
                      onChange={handleChange}
                      variant="outlined"
                      error={!!fieldErrors.otp}
                      helperText={fieldErrors.otp}
                      disabled={otpVerified}
                      inputProps={{ maxLength: 6 }}
                    />
                    <Typography
                      onClick={handleVerifyOTP}
                      sx={{
                        color: '#0288d1',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        opacity: otpVerified ? 0.5 : 1,
                        pointerEvents: otpVerified ? 'none' : 'auto',
                        '&:hover': {
                          color: '#01579b',
                        },
                      }}
                    >
                      Verify OTP
                    </Typography>
                  </Box>
                )}
              </div>
            </Fade>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                py: 1.2,
                fontWeight: 'bold',
                fontSize: '1rem',
                backgroundColor: '#0288d1',
              }}
            >
              Create Account
            </Button>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/login')}
                  sx={{
                    color: '#0288d1',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Login
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
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