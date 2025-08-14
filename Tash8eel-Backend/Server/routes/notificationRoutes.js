const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteNotification
} = require('../controllers/notificationController');

// Get user's notifications
router.get('/', auth, getNotifications);

// Mark notification as read
router.put('/:notificationId/read', auth, markAsRead);

// Mark all notifications as read
router.put('/read-all', auth, markAllAsRead);

// Get unread notification count
router.get('/unread-count', auth, getUnreadCount);

// Delete notification
router.delete('/:notificationId', auth, deleteNotification);

module.exports = router;

