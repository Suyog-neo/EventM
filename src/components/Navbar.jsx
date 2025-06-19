import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Tooltip,
  Button,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Modal,
  Paper,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, role, user } = useSelector((state) => state.auth);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const isProfileMenuOpen = Boolean(profileMenuAnchorEl);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleProfileMenuClose();
    setProfileModalOpen(true);
  };

  const handleModalClose = () => {
    setProfileModalOpen(false);
  };

  const userActions = [
    { label: "View Events", path: "/user/events" },
    { label: "My Bookings", path: "/user/bookings" },
  ];

  const adminActions = [
    { label: "Create Event", path: "/admin/create-event" },
    { label: "Manage Events", path: "/admin/manage-events" },
    { label: "View Bookings", path: "/admin/bookings" },
  ];

  const actions = role === "admin" ? adminActions : userActions;

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    )
      return;
    setDrawerOpen(open);
  };

  const token = useSelector((state) => state.auth.role);
  console.log(token)

  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {actions.map((action) => (
          <ListItem
            button
            key={action.label}
            onClick={() => navigate(action.path)}
          >
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary={action.label} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#0077b6" }}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 1,
            width: "100%",
            color: "#fff",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              onClick={toggleDrawer(true)}
              sx={{ display: { xs: "block", sm: "none" }, color: "#fff" }}
            >
              <MenuIcon />
            </IconButton>

            <img
              src="/public/virtual-event.png"
              alt="Eventsy Logo"
              style={{ width: 32, height: 32 }}
            />

            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#fff" }}>
              EventSy
            </Typography>
          </Box>

          <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
            {drawerContent}
          </Drawer>

          {isAuthenticated && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 2 }}>
                {actions.map((action) => (
                  <Button
                    key={action.label}
                    onClick={() => navigate(action.path)}
                    sx={{ color: "#fff", fontWeight: "bold" }}
                  >
                    {action.label}
                  </Button>
                ))}
              </Box>

              {/* Avatar + Name + Dropdown */}
              <Box
                onClick={handleProfileMenuOpen}
                sx={{

                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  cursor: 'pointer',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                }}
              >
                <AccountCircleIcon sx={{ fontSize: 28, color: '#fff' }} />
                <Typography sx={{ fontSize: '0.95rem', color: '#fff' }}>
                  {user?.name || 'John Doe'}
                </Typography>
                <ArrowDropDownIcon sx={{ color: '#fff' }} />
              </Box>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={profileMenuAnchorEl}
        open={isProfileMenuOpen}
        onClose={handleProfileMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
        <MenuItem onClick={handleProfileClick}>
          <AccountCircleIcon fontSize="small" sx={{ mr: 1 }} />
          Profile
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleProfileMenuClose();
            handleLogout();
          }}
        >
          <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>

      {/* Profile Modal */}
      <Modal open={profileModalOpen} onClose={handleModalClose}>
        <Box
          component={Paper}
          sx={{

            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '95vw', lg: '35vw' },
            height: { xs: '35vh', lg: '30vh' },

            p: 3,
            borderRadius: 2,
            boxShadow: 24,
            outline: 'none'
          }}
        >
          <Typography variant="h5" gutterBottom>
            Profile Info
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Typography variant="body1" sx={{ fontSize: '20px' }}><strong>Name:</strong> {user?.name || 'John Doe'}</Typography>
          <Typography variant="body1" sx={{ fontSize: '20px' }}><strong>Email:</strong> {user?.email || 'johndoe@example.com'}</Typography>
          <Typography variant="body1" sx={{ fontSize: '20px' }}><strong>Role:</strong> {role || 'User'}</Typography>
          <Typography variant="body1" sx={{ fontSize: '20px' }}><strong>Member Since:</strong> {user?.created_at || '2024-01-01'}</Typography>
          <Box sx={{ display: 'flex', justifyContent: "flex-end", mt: '10px', }} >
            <Button variant="contained" sx={{ height: '4.5vh', width: '8vw' }}
              onClick={handleModalClose}>
              Close
            </Button>
          </Box>

        </Box>
      </Modal>
    </>
  );
}
