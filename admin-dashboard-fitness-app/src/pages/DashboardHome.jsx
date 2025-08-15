// src/pages/DashboardHome.jsx (Enhanced)
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from '../redux/dashboardSlice';
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Chip,
  Divider
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardHome() {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector(state => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
    const interval = setInterval(() => {
      dispatch(fetchDashboardStats());
    }, 30000);
    return () => clearInterval(interval);
  }, [dispatch]);

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
      <CircularProgress />
      <Typography variant="h6" ml={2}>Loading dashboard...</Typography>
    </Box>
  );
  if (error) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
      <Alert severity="error">{error}</Alert>
    </Box>
  );

  return (
    <Box py={4} px={{ xs: 1, md: 3 }}>
      <Typography variant="h4" fontWeight={700} mb={4} color="primary.main">
        Dashboard Overview
      </Typography>
      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="primary">👥</Typography>
              <Typography variant="subtitle2" color="text.secondary">Total Users</Typography>
              <Typography variant="h5" color="primary.main">{stats?.totalUsers || 0}</Typography>
              <Chip label={`+${stats?.newUsersToday || 0} today`} color="success" size="small" sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="warning.main">💪</Typography>
              <Typography variant="subtitle2" color="text.secondary">Total Workouts</Typography>
              <Typography variant="h5" color="warning.main">{stats?.totalWorkouts || 0}</Typography>
              <Chip label={`in ${stats?.categories || 0} categories`} color="info" size="small" sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="success.main">📱</Typography>
              <Typography variant="subtitle2" color="text.secondary">Active Sessions</Typography>
              <Typography variant="h5" color="success.main">{stats?.activeSessions || 0}</Typography>
              <Chip label="Last 24h" color="default" size="small" sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="error.main">🔥</Typography>
              <Typography variant="subtitle2" color="text.secondary">Workouts Today</Typography>
              <Typography variant="h5" color="error.main">{stats?.workoutsToday || 0}</Typography>
              <Chip label="↗️ +12% vs yesterday" color="success" size="small" sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card elevation={2}>
            <CardHeader title={<Typography variant="h6">User Activity (Last 7 Days)</Typography>} />
            <Divider />
            <CardContent>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats?.userActivity || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="users" stroke="#1976d2" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardHeader title={<Typography variant="h6">Popular Workouts</Typography>} />
            <Divider />
            <CardContent>
              {stats?.popularWorkouts?.length ? stats.popularWorkouts.map((workout) => (
                <Box key={workout.id} display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography>{workout.name}</Typography>
                  <Chip label={workout.count} color="primary" size="small" />
                </Box>
              )) : <Typography color="text.secondary">No data</Typography>}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}