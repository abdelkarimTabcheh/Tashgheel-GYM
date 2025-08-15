// src/components/CreateUser.jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Box,
  Alert,
  Grid,
  MenuItem,
} from '@mui/material';

const ACTIVITY_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const GOALS = ['Weight Loss', 'Muscle Gain', 'Endurance', 'Strength', 'General Fitness', 'Flexibility'];

export default function CreateUser({ open, onClose, onCreate }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    age: '',
    bio: '',
    avatarUrl: '',
    height: '',
    weight: '',
    goal: '',
    activityLevel: '',
    isAdmin: false,
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.email || !formData.password || !formData.name) {
      setError('Email, password and name are required');
      return;
    }

    // Convert numeric fields
    const submitData = {
      ...formData,
      age: formData.age ? Number(formData.age) : null,
      height: formData.height ? Number(formData.height) : null,
      weight: formData.weight ? Number(formData.weight) : null,
    };

    setError(null);
    onCreate(submitData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Create User</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                fullWidth
                inputProps={{ min: 1, max: 120 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Avatar URL"
                name="avatarUrl"
                value={formData.avatarUrl}
                onChange={handleChange}
                fullWidth
                placeholder="https://example.com/avatar.jpg"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Height (cm)"
                name="height"
                type="number"
                value={formData.height}
                onChange={handleChange}
                fullWidth
                inputProps={{ min: 50, max: 300 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Weight (kg)"
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleChange}
                fullWidth
                inputProps={{ min: 20, max: 500 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Goal"
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value="">None</MenuItem>
                {GOALS.map((goal) => (
                  <MenuItem key={goal} value={goal}>{goal}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Activity Level"
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value="">None</MenuItem>
                {ACTIVITY_LEVELS.map((level) => (
                  <MenuItem key={level} value={level}>{level}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isAdmin}
                    onChange={handleChange}
                    name="isAdmin"
                  />
                }
                label="Admin User"
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Create</Button>
      </DialogActions>
    </Dialog>
  );
}
