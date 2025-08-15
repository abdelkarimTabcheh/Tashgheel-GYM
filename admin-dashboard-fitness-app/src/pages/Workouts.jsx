import React, { useEffect, useState } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Tooltip, Snackbar, Alert, CircularProgress, Typography, Button, Chip, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWorkouts, addWorkout, editWorkout, deleteWorkout } from '../redux/workoutSlice';
import CreateWorkout from '../components/CreateWorkout';
import EditWorkout from '../components/EditWorkout';

export default function Workouts() {
  const dispatch = useDispatch();
  const { list: workouts, status, error } = useSelector(state => state.workouts);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [workoutToEdit, setWorkoutToEdit] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [dense, setDense] = useState(false);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchWorkouts());
  }, [dispatch, status]);

  // --- CREATE ---
  const handleCreateSave = (data) => {
    dispatch(addWorkout(data))
      .unwrap()
      .then(() => {
        setSnackbar({ open: true, message: 'Workout created successfully', severity: 'success' });
        setCreateDialogOpen(false);
      })
      .catch(() => setSnackbar({ open: true, message: 'Failed to create workout', severity: 'error' }));
  };

  // --- EDIT ---
  const handleEditSave = (data) => {
    if (!workoutToEdit) return;
    dispatch(editWorkout({ id: workoutToEdit._id, workout: data }))
      .unwrap()
      .then(() => {
        setSnackbar({ open: true, message: 'Workout updated successfully', severity: 'success' });
        setEditDialogOpen(false);
        setWorkoutToEdit(null);
      })
      .catch(() => setSnackbar({ open: true, message: 'Failed to update workout', severity: 'error' }));
  };

  // --- DELETE ---
  const handleDeleteConfirm = () => {
    if (!workoutToDelete) return;
    dispatch(deleteWorkout(workoutToDelete))
      .unwrap()
      .then(() => {
        setSnackbar({ open: true, message: 'Workout deleted successfully', severity: 'success' });
        setDeleteConfirmOpen(false);
        setWorkoutToDelete(null);
      })
      .catch(() => setSnackbar({ open: true, message: 'Failed to delete workout', severity: 'error' }));
  };

  const handleSnackbarClose = () => setSnackbar(prev => ({ ...prev, open: false }));

  if (status === 'loading') return (
    <Box textAlign="center" mt={5}>
      <CircularProgress />
      <Typography variant="h6" mt={2}>Loading workouts...</Typography>
    </Box>
  );

  if (status === 'failed') return (
    <Box textAlign="center" mt={5}>
      <Alert severity="error">Error loading workouts: {error}</Alert>
    </Box>
  );

  return (
    <Box p={{ xs: 1, md: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h4" fontWeight={700}>Workouts Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{ borderRadius: 2 }}
        >
          Create Workout
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
      {workouts.length === 0 ? (
        <Typography>No workouts found.</Typography>
      ) : (
        <TableContainer component={Paper} elevation={2}>
          <Table size={dense ? 'small' : 'medium'}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Difficulty</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Exercises</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workouts.map((w) => (
                <TableRow key={w._id} hover tabIndex={-1}>
                  <TableCell>{w.name}</TableCell>
                  <TableCell>{w.description || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={w.difficulty || 'Medium'}
                      color={w.difficulty === 'Easy' ? 'success' : w.difficulty === 'Hard' ? 'error' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{w.duration || '-'}</TableCell>
                  <TableCell>{w.exercises?.length || 0}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton color="primary" onClick={() => { setWorkoutToEdit(w); setEditDialogOpen(true); }} aria-label="edit workout">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => { setWorkoutToDelete(w._id); setDeleteConfirmOpen(true); }} aria-label="delete workout">
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
      <CreateWorkout open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} onCreate={handleCreateSave} />
      <EditWorkout open={editDialogOpen} workout={workoutToEdit} onClose={() => setEditDialogOpen(false)} onSave={handleEditSave} />
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
            Are you sure you want to delete this workout? This action cannot be undone.
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
