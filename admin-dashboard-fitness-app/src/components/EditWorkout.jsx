    // src/components/EditWorkout.jsx
    import React, { useState, useEffect } from 'react';
    import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
    Box, Alert, Chip, Autocomplete, Typography
    } from '@mui/material';

    export default function EditWorkout({ open, onClose, workout, onSave }) {
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

    // Populate form whenever workout changes
    useEffect(() => {
        if (!workout) return;

        setFormData({
        name: workout.name || '',
        category: workout.category || '',
        description: workout.description || '',
        tips: workout.tips || '',
        targetMuscles: workout.targetMuscles || [],
        duration: workout.duration || '',
        animationUrl: workout.animationUrl || '',
        });
    }, [workout]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTargetMusclesChange = (event, newValue) => {
        setFormData(prev => ({ ...prev, targetMuscles: newValue }));
    };

    const handleSubmit = () => {
        if (!formData.name.trim()) {
        setError('Workout name is required');
        return;
        }
        if (!formData.category.trim()) {
        setError('Category is required');
        return;
        }
        if (!formData.description.trim()) {
        setError('Description is required');
        return;
        }
        if (!formData.animationUrl.trim()) {
        setError('Animation URL is required');
        return;
        }

        setError(null);
        onSave(formData);
    };

    const handleClose = () => {
        setError(null);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Edit Workout</DialogTitle>
        <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
                label="Workout Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
            />

            <TextField
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                fullWidth
                required
            />

            <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                required
            />

            <TextField
                label="Tips"
                name="tips"
                value={formData.tips}
                onChange={handleChange}
                fullWidth
            />

            <TextField
                label="Duration (minutes)"
                name="duration"
                type="text"
                value={formData.duration}
                onChange={handleChange}
            />

            <TextField
                label="Animation URL"
                name="animationUrl"
                value={formData.animationUrl}
                onChange={handleChange}
                fullWidth
                required
            />

            <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={formData.targetMuscles}
                onChange={handleTargetMusclesChange}
                renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                    <Chip label={option} {...getTagProps({ index })} key={option} />
                ))
                }
                renderInput={(params) => (
                <TextField
                    {...params}
                    label="Target Muscles"
                    placeholder="Add muscles"
                />
                )}
            />
            </Box>
        </DialogContent>

        <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">Save Changes</Button>
        </DialogActions>
        </Dialog>
    );
    }
