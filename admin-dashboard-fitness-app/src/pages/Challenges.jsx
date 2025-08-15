// src/pages/Challenges.jsx
import React, { useEffect, useState } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Tooltip, Snackbar, Alert, CircularProgress, Typography, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Chip, TextField, MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { getChallenges, addChallenge, editChallenge, removeChallenge } from '../redux/challengeSlice';
import { fetchWorkouts } from '../redux/workoutSlice';

const WorkoutDayRow = ({ index, value, onChange, workouts }) => {
  const handleChange = (field, fieldValue) => {
    onChange(index, { ...value, [field]: fieldValue });
  };
  return (
    <Box display="flex" gap={2} alignItems="center" mb={1}>
      <TextField
        label="Day"
        type="number"
        size="small"
        value={value.day}
        onChange={(e) => handleChange('day', Number(e.target.value))}
        inputProps={{ min: 1 }}
        sx={{ width: 100 }}
      />
      <TextField
        select
        label="Workout"
        size="small"
        value={value.workoutId || ''}
        onChange={(e) => handleChange('workoutId', e.target.value)}
        fullWidth
      >
        {workouts.map((w) => (
          <MenuItem key={w._id} value={w._id}>{w.name}</MenuItem>
        ))}
      </TextField>
    </Box>
  );
};

const ChallengeDialog = ({ open, onClose, onSave, initialData, workouts }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    durationDays: 7,
    workouts: [], // [{ day, workoutId }]
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        durationDays: initialData.durationDays || 7,
        workouts: initialData.workouts?.map(w => ({ day: w.day, workoutId: w.workoutId })) || [],
      });
    } else {
      setForm({ title: '', description: '', durationDays: 7, workouts: [] });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'durationDays' ? Number(value) : value }));
  };
  const handleWorkoutChange = (index, value) => {
    setForm((prev) => {
      const next = [...prev.workouts];
      next[index] = value;
      return { ...prev, workouts: next };
    });
  };
  const addWorkoutDay = () => setForm(prev => ({ ...prev, workouts: [...prev.workouts, { day: prev.workouts.length + 1, workoutId: '' }] }));
  const removeWorkoutDay = (index) => setForm(prev => ({ ...prev, workouts: prev.workouts.filter((_, i) => i !== index) }));

  const handleSubmit = () => {
    if (!form.title.trim()) return setError('Title is required');
    if (!form.durationDays || form.durationDays <= 0) return setError('Duration (days) must be > 0');
    for (const w of form.workouts) {
      if (!w.day || !w.workoutId) return setError('Each workout entry must have a day and a workout');
      if (w.day < 1 || w.day > form.durationDays) return setError('Each day must be between 1 and the challenge duration');
    }
    const seenDays = new Set();
    for (const w of form.workouts) {
      if (seenDays.has(w.day)) return setError('Each day must be unique. Duplicate day found.');
      seenDays.add(w.day);
    }
    setError(null);
    onSave(form);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{initialData ? 'Edit Challenge' : 'Create Challenge'}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>Configure challenge details and assign workouts for days.</DialogContentText>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TextField label="Title" name="title" value={form.title} onChange={handleChange} fullWidth required sx={{ mb: 2 }} />
        <TextField label="Description" name="description" value={form.description} onChange={handleChange} fullWidth multiline rows={3} sx={{ mb: 2 }} />
        <TextField label="Duration (days)" name="durationDays" type="number" value={form.durationDays} onChange={handleChange} inputProps={{ min: 1 }} sx={{ mb: 2, width: 200 }} />
        <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 1, mb: 1 }}>Workouts by Day</Typography>
        {form.workouts.map((item, idx) => (
          <Box key={idx} display="flex" alignItems="center" gap={1}>
            <WorkoutDayRow index={idx} value={item} onChange={handleWorkoutChange} workouts={workouts} />
            <Button onClick={() => removeWorkoutDay(idx)} color="error">Remove</Button>
          </Box>
        ))}
        <Box mt={1}>
          <Button startIcon={<AddIcon />} onClick={addWorkoutDay}>Add Day</Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default function Challenges() {
  const dispatch = useDispatch();
  const { list: challenges, status, error } = useSelector(state => state.challenges);
  const workoutsState = useSelector(state => state.workouts);
  const workouts = workoutsState.list || [];

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [challengeToEdit, setChallengeToEdit] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [challengeToDelete, setChallengeToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [dense, setDense] = useState(false);

  useEffect(() => {
    if (status === 'idle') dispatch(getChallenges());
    if (workoutsState.status === 'idle') dispatch(fetchWorkouts());
  }, [dispatch, status, workoutsState.status]);

  const handleCreateSave = (data) => {
    console.log('Creating challenge with data:', data);
    dispatch(addChallenge(data))
      .unwrap()
      .then((result) => {
        console.log('Challenge created successfully:', result);
        setSnackbar({ open: true, message: 'Challenge created successfully', severity: 'success' });
        setCreateDialogOpen(false);
      })
      .catch((error) => {
        console.error('Failed to create challenge:', error);
        setSnackbar({ open: true, message: `Failed to create challenge: ${error}`, severity: 'error' });
      });
  };

  const handleEditSave = (data) => {
    if (!challengeToEdit) return;
    console.log('Updating challenge with data:', data);
    dispatch(editChallenge({ id: challengeToEdit._id, challenge: data }))
      .unwrap()
      .then((result) => {
        console.log('Challenge updated successfully:', result);
        setSnackbar({ open: true, message: 'Challenge updated successfully', severity: 'success' });
        setEditDialogOpen(false);
        setChallengeToEdit(null);
      })
      .catch((error) => {
        console.error('Failed to update challenge:', error);
        setSnackbar({ open: true, message: `Failed to update challenge: ${error}`, severity: 'error' });
      });
  };

  const handleDeleteConfirm = () => {
    if (!challengeToDelete) return;
    dispatch(removeChallenge(challengeToDelete))
      .unwrap()
      .then(() => {
        setSnackbar({ open: true, message: 'Challenge deleted successfully', severity: 'success' });
        setDeleteConfirmOpen(false);
        setChallengeToDelete(null);
      })
      .catch(() => setSnackbar({ open: true, message: 'Failed to delete challenge', severity: 'error' }));
  };

  const handleSnackbarClose = () => setSnackbar(prev => ({ ...prev, open: false }));

  if (status === 'loading') return (
    <Box textAlign="center" mt={5}>
      <CircularProgress />
      <Typography variant="h6" mt={2}>Loading challenges...</Typography>
    </Box>
  );
  if (status === 'failed') return (
    <Box textAlign="center" mt={5}>
      <Alert severity="error">Error loading challenges: {error}</Alert>
    </Box>
  );

  return (
    <Box p={{ xs: 1, md: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h4" fontWeight={700}>Challenges Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{ borderRadius: 2 }}
        >
          Create Challenge
        </Button>
      </Box>
      <Box mb={2} display="flex" alignItems="center" gap={2}>
        <Typography variant="body2">Dense Table</Typography>
        <Button
          variant={dense ? 'contained' : 'outlined'}
          size="small"
          onClick={() => setDense((d) => !d)}
        >
          {dense ? 'On' : 'Off'}
        </Button>
      </Box>
      {challenges.length === 0 ? (
        <Typography>No challenges found.</Typography>
      ) : (
        <TableContainer component={Paper} elevation={2}>
          <Table size={dense ? 'small' : 'medium'}>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Duration (days)</TableCell>
                <TableCell>Workouts</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {challenges.map((c) => (
                <TableRow key={c._id} hover tabIndex={-1}>
                  <TableCell>{c.title}</TableCell>
                  <TableCell>{c.durationDays}</TableCell>
                  <TableCell>
                    {c.workouts?.length ? c.workouts.map((w, idx) => (
                      <Chip key={idx} label={`Day ${w.day}`} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                    )) : <Typography variant="body2" color="text.secondary">No workouts</Typography>}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton color="primary" onClick={() => { setChallengeToEdit(c); setEditDialogOpen(true); }} aria-label="edit challenge">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => { setChallengeToDelete(c._id); setDeleteConfirmOpen(true); }} aria-label="delete challenge">
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {/* Modals */}
      <ChallengeDialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} onSave={handleCreateSave} workouts={workouts} />
      <ChallengeDialog open={editDialogOpen} initialData={challengeToEdit} onClose={() => setEditDialogOpen(false)} onSave={handleEditSave} workouts={workouts} />
      {/* Delete confirmation */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this challenge? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
