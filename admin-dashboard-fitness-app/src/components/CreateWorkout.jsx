import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box, Alert, Chip, Autocomplete, Typography
} from '@mui/material';

export default function CreateWorkout({ open, onClose, onCreate }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    tips: '',
    targetMuscles: [],
    duration: '',
    animationUrl: '',
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTargetMusclesChange = (event, newValue) => {
    setFormData(prev => ({ ...prev, targetMuscles: newValue }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) return setError('Workout name is required');
    if (!formData.category.trim()) return setError('Category is required');
    if (!formData.description.trim()) return setError('Description is required');
    if (!formData.animationUrl.trim()) return setError('Animation URL is required');

    setError(null);

    // Convert duration to string (to match schema)
    const workoutData = {
      ...formData,
      duration: formData.duration ? formData.duration.toString() : '',
    };

    onCreate(workoutData);

    // Reset form
    setFormData({
      name: '',
      category: '',
      description: '',
      tips: '',
      targetMuscles: [],
      duration: '',
      animationUrl: '',
    });
  };

  const handleClose = () => {
    setError(null);
    setFormData({
      name: '',
      category: '',
      description: '',
      tips: '',
      targetMuscles: [],
      duration: '',
      animationUrl: '',
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Create New Workout</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Workout Name" name="name" value={formData.name} onChange={handleChange} fullWidth required />
          <TextField label="Category" name="category" value={formData.category} onChange={handleChange} fullWidth required />
          <TextField label="Description" name="description" value={formData.description} onChange={handleChange} fullWidth multiline rows={3} required />
          <TextField label="Tips" name="tips" value={formData.tips} onChange={handleChange} fullWidth />
          <TextField label="Duration (minutes)" name="duration" type="number" value={formData.duration} onChange={handleChange} inputProps={{ min: 1 }} />
          <TextField label="Animation URL" name="animationUrl" value={formData.animationUrl} onChange={handleChange} fullWidth required />

          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={formData.targetMuscles}
            onChange={handleTargetMusclesChange}
            renderTags={(value, getTagProps) => value.map((option, index) => <Chip label={option} {...getTagProps({ index })} key={option} />)}
            renderInput={(params) => <TextField {...params} label="Target Muscles" placeholder="Add muscles" />}
          />

          {formData.targetMuscles.length > 0 && (
            <Typography variant="body2" color="text.secondary">
              Selected {formData.targetMuscles.length} target muscle(s)
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Create Workout</Button>
      </DialogActions>
    </Dialog>
  );
}
