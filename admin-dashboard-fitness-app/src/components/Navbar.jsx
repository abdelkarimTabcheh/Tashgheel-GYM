//components/Navbar.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice.js';

const AppNavbar = ({ onToggleSidebar }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            variant="outlined"
            color="primary"
            sx={{ display: { md: 'none' }, mr: 2 }}
            onClick={onToggleSidebar}
          >
            ☰
          </Button>
          <Typography variant="h6" color="primary" fontWeight={700}>
            Tash8eel Admin
          </Typography>
        </Box>
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" color="text.secondary" sx={{ mr: 2 }}>
              Signed in as: <strong>{user.name || user.email}</strong>
            </Typography>
            <Button variant="outlined" color="primary" onClick={() => dispatch(logout())}>
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default AppNavbar;
