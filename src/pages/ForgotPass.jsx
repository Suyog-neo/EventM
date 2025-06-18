// import { Box, Typography, TextField, Button } from '@mui/material'


// function ForgotPass() {
//     return (
//         <Box sx={{
//             height: '83vh',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             backgroundColor: '#caf0f8'
//         }}>
//             <Box component='form'
//                 sx={{
//                     width: {
//                         xs: '100vw',
//                         md: '50vw',
//                         lg: '30vw'
//                     },
//                     mx: 'auto',
//                     mt: 5,
//                     p: 3,
//                     border: '1px solid #ccc',
//                     borderRadius: 2,
//                     boxShadow: 2,
//                     display: 'flex',
//                     flexDirection: 'column',
//                     gap: 2,
//                     backgroundColor: 'white',
//                     marginY: 4
//                 }}>
//                 <Typography sx={{ fontSize: '30px' }}> Forgot Password</Typography>
//                 <Typography>Enter your email address</Typography>
//                 <TextField id="outlined-basic" label="Email" variant="outlined" />
//                 <Button type="submit" variant="contained" fullWidth sx={{ height: "50px" }} >
//                     Continue
//                 </Button>

//             </Box>
//         </Box>
//     )

// }

// export default ForgotPass




import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';

function ForgotPass() {
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [resetData, setResetData] = useState({ password: '', confirmPassword: '' });

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // TODO: Send email to backend
    setEmailSubmitted(true);
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    if (resetData.password !== resetData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // TODO: Submit new password to backend
    console.log('Reset password data:', { email, ...resetData });
  };

  return (
    <Box sx={{
      height: '83vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#caf0f8'
    }}>
      <Box
        component="form"
        onSubmit={emailSubmitted ? handleResetSubmit : handleEmailSubmit}
        sx={{
          width: { xs: '100vw', md: '50vw', lg: '30vw' },
          mx: 'auto',
          mt: 5,
          p: 3,
          border: '1px solid #ccc',
          borderRadius: 2,
          boxShadow: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          backgroundColor: 'white',
          marginY: 4
        }}
      >
        <Typography sx={{ fontSize: '30px' }}>
          {emailSubmitted ? 'Reset Password' : 'Forgot Password'}
        </Typography>

        {!emailSubmitted ? (
          <>
            <Typography>Enter your email address</Typography>
            <TextField
              label="Email"
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" variant="contained" fullWidth sx={{ height: "50px" }}>
              Continue
            </Button>
          </>
        ) : (
          <>
            <Typography>Enter your new password</Typography>
            <TextField
              label="New Password"
              type="password"
              variant="outlined"
              value={resetData.password}
              onChange={(e) => setResetData({ ...resetData, password: e.target.value })}
              required
            />
            <TextField
              label="Confirm Password"
              type="password"
              variant="outlined"
              value={resetData.confirmPassword}
              onChange={(e) => setResetData({ ...resetData, confirmPassword: e.target.value })}
              required
            />
            <Button type="submit" variant="contained" fullWidth sx={{ height: "50px" }}>
              Submit
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
}

export default ForgotPass;
