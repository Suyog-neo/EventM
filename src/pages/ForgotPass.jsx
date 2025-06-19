import { useState } from 'react';
import { Box, Typography, TextField, Button, Snackbar, Alert } from '@mui/material';
import { forgotPassword, resetPassword } from '../apis/auth';
import { useNavigate } from 'react-router-dom';

function ForgotPass() {
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const [resetData, setResetData] = useState({
    otp: '',
    password: '',
    confirmPassword: '',
  });

  const [resetErrors, setResetErrors] = useState({
    otp: '',
    password: '',
    confirmPassword: '',
  });

  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');

    if (!email) {
      setEmailError('Please enter email');
      return;
    }

    try {
      const res = await forgotPassword({ email });
      console.log(res.data);
      setEmailSubmitted(true);
      setSnack({ open: true, message: res.data.message , severity: 'success' });

    } catch (error) {
      console.log(error.message);
      setEmailError('Failed to send OTP. Please check your email.');
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    let errors = { otp: '', password: '', confirmPassword: '' };
    let hasError = false;

    if (!resetData.otp) {
      errors.otp = 'OTP is required';
      hasError = true;
    }

    if (!resetData.password) {
      errors.password = 'Please enter password';
      hasError = true;
    }

    if (!resetData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
      hasError = true;
    }

    if (resetData.password !== resetData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      hasError = true;
    }

    setResetErrors(errors);
    if (hasError) return;

    try {
      const res = await resetPassword({
        email,
        otp: resetData.otp,
        password: resetData.password,
      });
      console.log(res.data);
      setSnack({ open: true, message: 'Password reset successful!', severity: 'success' });

      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      console.error(err);
      setSnack({ open: true, message: 'Error resetting password. Try again.', severity: 'error' });
    }
  };

  return (
    <>
      <Box
        sx={{
          height: {xs:'80vh',lg:'83vh'},
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#caf0f8',
          padding:1
        }}
      >
        <Box
          component="form"
          onSubmit={emailSubmitted ? handleResetSubmit : handleEmailSubmit}
          sx={{
            width: { xs: '100vw', md: '50vw', lg: '30vw' },
            mx: 'auto',
            mt: 5,
            p: {xs:2 ,lg:3},
            border: '1px solid #ccc',
            borderRadius: 2,
            boxShadow: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            backgroundColor: 'white',
            marginY: 4,
          }}
        >
          <Typography sx={{ fontSize: {xs:'25px',lg:'30px'} }}>
            {emailSubmitted ? 'Reset Password' : 'Forgot Password'}
          </Typography>

          {!emailSubmitted ? (
            <>
              <Typography>Enter your email address</Typography>
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!emailError}
                helperText={emailError}
                autoComplete="email"
              />
              <Button type="submit" variant="contained" fullWidth sx={{ height: '50px' }}>
                Continue
              </Button>
            </>
          ) : (
            <>
              <Typography>Enter the OTP and your new password</Typography>
              <TextField
                label="Enter OTP"
                type="text"
                variant="outlined"
                value={resetData.otp}
                onChange={(e) => setResetData({ ...resetData, otp: e.target.value })}
                error={!!resetErrors.otp}
                helperText={resetErrors.otp}
              />
              <TextField
                label="New Password"
                type="password"
                variant="outlined"
                value={resetData.password}
                onChange={(e) => setResetData({ ...resetData, password: e.target.value })}
                error={!!resetErrors.password}
                helperText={resetErrors.password}
                autoComplete="new-password"

              />
              <TextField
                label="Confirm Password"
                type="password"
                variant="outlined"
                value={resetData.confirmPassword}
                onChange={(e) => setResetData({ ...resetData, confirmPassword: e.target.value })}
                error={!!resetErrors.confirmPassword}
                helperText={resetErrors.confirmPassword}
                autoComplete="new-password"
              />
              <Button type="submit" variant="contained" fullWidth sx={{ height: '50px' }}>
                Submit
              </Button>
            </>
          )}
        </Box>
      </Box>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnack({ ...snack, open: false })}
          severity={snack.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default ForgotPass;
