import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { store } from './redux/store';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

// Pages
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import UserDashboard from './pages/user/UserDashboard.jsx';
import EventList from './pages/user/EventList.jsx';
import EventBookings from './pages/user/EventBookings.jsx';
import ManageEvents from './pages/admin/ManageEvents.jsx';
import ViewBookings from './pages/admin/ViewBookings.jsx';
import UpcomingEvents from './pages/user/UpcomingEvents.jsx';
import ForgotPass from './pages/ForgotPass.jsx';

// Components
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer';

const theme = createTheme();

function AppLayout() {
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  const location = useLocation();

  // Hide Navbar and Footer on these routes
  const hideNavbarPaths = ['/login', '/home', '/signup'];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);
  const shouldShowFooter = !hideNavbarPaths.includes(location.pathname);

  const appBackgroundStyle = {
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#caf0f8',

  };

  return (
    <Box sx={appBackgroundStyle}>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        {/* Default route goes to /home */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Public Routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
         <Route path="/forgotpassword" element={<ForgotPass/>} />

        {/* Protected Routes */}
        {isAuthenticated ? (
          role === 'admin' ? (
            <>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/manage-events" element={<ManageEvents />} />
              <Route path="/admin/bookings" element={<ViewBookings />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </>
            ) : ( 
            <>
              <Route path="/user" element={<UserDashboard />} />
              <Route path="/user/events" element={<EventList />} />
              <Route path="/user/bookings" element={<EventBookings />} />
              <Route path="/user/upcoming-events" element={<UpcomingEvents />} />
              <Route path="*" element={<Navigate to="/user" replace />} />
            </>
          )
        ) : ( 
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
      {shouldShowFooter && <Footer />}
    </Box>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppLayout />
        </Router>
      </ThemeProvider>
    </Provider>
  );
}
