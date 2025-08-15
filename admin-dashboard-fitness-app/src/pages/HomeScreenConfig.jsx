// src/pages/HomeScreenConfig.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHomeConfig, updateHomeConfig } from '../redux/homeConfigSlice';
import { 
  Alert, 
  Box, 
  Button, 
  Typography, 
  TextField, 
  Paper, 
  CircularProgress,
  Grid,
  Card,
  CardContent,
  FormHelperText,
  Divider
} from '@mui/material';

export default function HomeScreenConfig() {
  const dispatch = useDispatch();
  const { config, loading, error } = useSelector((state) => state.homeConfig);
  const [form, setForm] = useState({
    featuredWorkouts: '',
    bannerText: '',
  });
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    dispatch(fetchHomeConfig());
  }, [dispatch]);

  useEffect(() => {
    if (config) {
      setForm({
        featuredWorkouts: config.featuredWorkouts || '',
        bannerText: config.bannerText || '',
      });
    }
  }, [config]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!form.bannerText.trim()) {
      errors.bannerText = 'Banner text is required';
    }
    
    if (form.bannerText.length > 100) {
      errors.bannerText = 'Banner text must be less than 100 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    dispatch(updateHomeConfig(form))
      .unwrap()
      .then(() => {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      })
      .catch((error) => {
        console.error('Failed to update home config:', error);
      });
  };

  const parseFeaturedWorkouts = () => {
    try {
      if (!form.featuredWorkouts.trim()) return [];
      return JSON.parse(form.featuredWorkouts);
    } catch {
      // If JSON parsing fails, try comma-separated
      return form.featuredWorkouts.split(',').map(w => w.trim()).filter(w => w);
    }
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
      <CircularProgress />
      <Typography variant="h6" ml={2}>Loading configuration...</Typography>
    </Box>
  );

  return (
    <Box p={{ xs: 1, md: 3 }}>
      <Typography variant="h4" fontWeight={700} mb={3} color="primary.main">
        Home Screen Configuration
      </Typography>
      
      <Grid container spacing={3}>
        {/* Configuration Form */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" mb={3}>Configuration Settings</Typography>
            
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>Configuration saved successfully!</Alert>}
            
            <form onSubmit={handleSubmit}>
              <TextField
                label="Banner Text"
                name="bannerText"
                value={form.bannerText}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                error={!!validationErrors.bannerText}
                helperText={validationErrors.bannerText || 'Text displayed at the top of the mobile app home screen'}
                placeholder="Welcome to Tash8eel! Start your fitness journey today."
              />
              
              <TextField
                label="Featured Workouts"
                name="featuredWorkouts"
                value={form.featuredWorkouts}
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
                margin="normal"
                helperText="Enter workout IDs as JSON array [1,2,3] or comma-separated: 1,2,3"
                placeholder='["workout1", "workout2", "workout3"] or workout1,workout2,workout3'
              />
              
              <Box mt={3}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  size="large"
                  sx={{ borderRadius: 2 }}
                >
                  Save Configuration
                </Button>
              </Box>
            </form>
          </Paper>
        </Grid>

        {/* Preview */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" mb={3}>Preview</Typography>
            
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Banner Text
                </Typography>
                <Typography variant="body1">
                  {form.bannerText || 'No banner text set'}
                </Typography>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Featured Workouts ({parseFeaturedWorkouts().length})
                </Typography>
                {parseFeaturedWorkouts().length > 0 ? (
                  <Box>
                    {parseFeaturedWorkouts().map((workout, index) => (
                      <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                        • {workout}
                      </Typography>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No featured workouts set
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
