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
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../apis/auth'



export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = credentials;
    const errors = {};

    if (!email) errors.email = 'email is required';
    if (!password) errors.password = 'Password is required';

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;


    try {
      const res = await loginUser(credentials)
      console.log("res", res.data)

      if (res.status === 200) {
        dispatch(login({ email, role: 'admin', refresh: res.data.refresh, access: res.data.access }));
        setSnackbar({ open: true, message: 'Login successful!', severity: 'success' });
        setTimeout(() => navigate('/admin'), 2000);
      } else {
        setSnackbar({ open: true, message: 'Invalid email or password.', severity: 'error' });
      }
    } catch (error) {
      console.log("Request setup error:", error.message);
    }

  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding:{ xs:0, lg:2},
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
            p: {xs:2 ,md:4,lg:4},
            backgroundColor: '#ffffffee',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h5" mb={1} textAlign="center" color="primary">
            Welcome Back
          </Typography>
          <Typography variant="body2" textAlign="center" mb={3} color="text.secondary">
            Please enter your credentials to continue
          </Typography>

          <form onSubmit={handleSubmit}>
            <Fade in timeout={500}>
              <div>
                <TextField
                  fullWidth
                  label="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                  error={!!fieldErrors.email}
                  helperText={fieldErrors.email}
                />
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
              Login
            </Button>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/signup')}
                  sx={{
                    color: '#0288d1',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Sign up
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
