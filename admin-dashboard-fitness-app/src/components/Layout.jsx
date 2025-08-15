// src/components/Layout.jsx
import React from 'react';
import {
  Box,
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  IconButton,
  Button
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleIcon from '@mui/icons-material/People';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SportsGymnasticsIcon from '@mui/icons-material/SportsGymnastics';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;
const logo = (
  <Box sx={{ display: 'flex', alignItems: 'center', p: 2, mb: 2 }}>
    <Box
      component="div"
      sx={{ 
        width: 36, 
        height: 36, 
        mr: 1,
        borderRadius: '8px',
        bgcolor: 'primary.main',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '18px',
        fontWeight: 'bold'
      }}
    >
      D
    </Box>
    <Typography variant="h6" fontWeight={700} color="primary">
      Dashboard
    </Typography>
  </Box>
);

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const drawer = (
    <div>
      <Toolbar />
      {logo}
      <List>
        <ListItem key="Dashboard" disablePadding>
          <ListItemButton onClick={() => navigate('/dashboard')} sx={{ '&:hover': { bgcolor: 'primary.50' } }}>
            <ListItemIcon><DashboardIcon color="primary" /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        <ListItem key="Users" disablePadding>
          <ListItemButton onClick={() => navigate('/users')} sx={{ '&:hover': { bgcolor: 'primary.50' } }}>
            <ListItemIcon><PeopleIcon color="primary" /></ListItemIcon>
            <ListItemText primary="Users" />
          </ListItemButton>
        </ListItem>
        <ListItem key="Workouts" disablePadding>
          <ListItemButton onClick={() => navigate('/workouts')} sx={{ '&:hover': { bgcolor: 'primary.50' } }}>
            <ListItemIcon><SportsGymnasticsIcon color="primary" /></ListItemIcon>
            <ListItemText primary="Workouts" />
          </ListItemButton>
        </ListItem>
        <ListItem key="Challenges" disablePadding>
          <ListItemButton onClick={() => navigate('/challenges')} sx={{ '&:hover': { bgcolor: 'primary.50' } }}>
            <ListItemIcon><EmojiEventsIcon color="primary" /></ListItemIcon>
            <ListItemText primary="Challenges" />
          </ListItemButton>
        </ListItem>
        <ListItem key="Home Config" disablePadding>
          <ListItemButton onClick={() => navigate('/home-config')} sx={{ '&:hover': { bgcolor: 'primary.50' } }}>
            <ListItemIcon><HomeIcon color="primary" /></ListItemIcon>
            <ListItemText primary="Home Config" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: 'background.paper', color: 'primary.main', boxShadow: 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="primary"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700 }}>
              Admin Dashboard
            </Typography>
          </Box>
          <Button
            color="primary"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      {/* Responsive Drawer for Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        {drawer}
      </Drawer>
      {/* Permanent Drawer for Desktop */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
        open
      >
        {drawer}
      </Drawer>
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          bgcolor: 'background.default',
          minHeight: '100vh',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}