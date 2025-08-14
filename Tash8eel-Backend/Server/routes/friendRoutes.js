const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriends,
  getPendingRequests,
  searchUsers,
  getFriendLeaderboard
} = require('../controllers/friendController');

// Send friend request
router.post('/request', auth, sendFriendRequest);

// Accept friend request
router.post('/accept', auth, acceptFriendRequest);

// Reject friend request
router.post('/reject', auth, rejectFriendRequest);

// Get user's friends
router.get('/list', auth, getFriends);

// Get pending friend requests
router.get('/pending', auth, getPendingRequests);

// Search users for adding friends
router.get('/search', auth, searchUsers);

// Get friend leaderboard
router.get('/leaderboard', auth, getFriendLeaderboard);

module.exports = router;

