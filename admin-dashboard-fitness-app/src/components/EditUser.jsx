//src/components/EditUser.jsx

import React, { useState, useEffect } from 'react';
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

export default function EditUser({ open, onClose, user, onSave }) {
  const [formData, setFormData] = useState({
    email: '',
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

  const [originalData, setOriginalData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      const userData = {
        email: user.email || '',
        name: user.name || '',
        age: user.age || '',
        bio: user.bio || '',
        avatarUrl: user.avatarUrl || '',
        height: user.height || '',
        weight: user.weight || '',
        goal: user.goal || '',
        activityLevel: user.activityLevel || '',
        isAdmin: user.isAdmin || false,
      };
      setFormData(userData);
      setOriginalData(userData);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const hasChanges = () => {
    return (
      formData.name !== originalData.name ||
      formData.age !== originalData.age ||
      formData.bio !== originalData.bio ||
      formData.avatarUrl !== originalData.avatarUrl ||
      formData.height !== originalData.height ||
      formData.weight !== originalData.weight ||
      formData.goal !== originalData.goal ||
      formData.activityLevel !== originalData.activityLevel ||
      formData.isAdmin !== originalData.isAdmin
    );
  };

  const handleSubmit = () => {
    if (!formData.email) {
      setError('Email is required');
      return;
    }

    if (!hasChanges()) {
      setError('No changes detected. Please modify at least one field.');
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
    onSave(submitData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
                disabled
                variant="outlined"
                sx={{
                  '& .MuiInputLabel-root': {
                    transform: 'translate(14px, -9px) scale(0.75)',
                    backgroundColor: 'white',
                    padding: '0 4px',
                  },
                  '& .MuiInputLabel-root.Mui-disabled': {
                    color: 'rgba(0, 0, 0, 0.6)',
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
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
        <Button onClick={handleSubmit} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
}