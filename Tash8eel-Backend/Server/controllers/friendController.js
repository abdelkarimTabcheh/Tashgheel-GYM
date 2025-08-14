const Friend = require('../models/Friend');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Send friend request
const sendFriendRequest = async (req, res) => {
  try {
    const { recipientId } = req.body;
    const requesterId = req.user.id;

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent self-friend request
    if (requesterId === recipientId) {
      return res.status(400).json({ message: 'Cannot send friend request to yourself' });
    }

    // Check if friend relationship already exists
    const existingFriend = await Friend.findOne({
      $or: [
        { requester: requesterId, recipient: recipientId },
        { requester: recipientId, recipient: requesterId }
      ]
    });

    if (existingFriend) {
      if (existingFriend.status === 'pending') {
        return res.status(400).json({ message: 'Friend request already pending' });
      } else if (existingFriend.status === 'accepted') {
        return res.status(400).json({ message: 'Already friends' });
      }
    }

    // Create new friend request
    const friendRequest = new Friend({
      requester: requesterId,
      recipient: recipientId,
      status: 'pending'
    });

    await friendRequest.save();

    // Create notification
    const notification = new Notification({
      recipient: recipientId,
      sender: requesterId,
      type: 'friend_request',
      title: 'New Friend Request',
      message: `${req.user.name || 'Someone'} sent you a friend request`,
      relatedData: { friendRequestId: friendRequest._id }
    });

    await notification.save();

    res.status(201).json({
      message: 'Friend request sent successfully',
      friendRequest
    });

  } catch (error) {
    console.error('Error sending friend request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Accept friend request
const acceptFriendRequest = async (req, res) => {
  try {
    const { friendRequestId } = req.body;
    const userId = req.user.id;

    const friendRequest = await Friend.findById(friendRequestId);
    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    if (friendRequest.recipient.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to accept this request' });
    }

    if (friendRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Friend request is not pending' });
    }

    // Update friend request status
    friendRequest.status = 'accepted';
    await friendRequest.save();

    // Create notification for requester
    const notification = new Notification({
      recipient: friendRequest.requester,
      sender: userId,
      type: 'friend_accepted',
      title: 'Friend Request Accepted',
      message: `${req.user.name || 'Someone'} accepted your friend request`,
      relatedData: { friendRequestId: friendRequest._id }
    });

    await notification.save();

    res.json({
      message: 'Friend request accepted successfully',
      friendRequest
    });

  } catch (error) {
    console.error('Error accepting friend request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Reject friend request
const rejectFriendRequest = async (req, res) => {
  try {
    const { friendRequestId } = req.body;
    const userId = req.user.id;

    const friendRequest = await Friend.findById(friendRequestId);
    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    if (friendRequest.recipient.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to reject this request' });
    }

    if (friendRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Friend request is not pending' });
    }

    // Update friend request status
    friendRequest.status = 'rejected';
    await friendRequest.save();

    // Create notification for requester
    const notification = new Notification({
      recipient: friendRequest.requester,
      sender: userId,
      type: 'friend_rejected',
      title: 'Friend Request Rejected',
      message: `${req.user.name || 'Someone'} rejected your friend request`,
      relatedData: { friendRequestId: friendRequest._id }
    });

    await notification.save();

    res.json({
      message: 'Friend request rejected successfully',
      friendRequest
    });

  } catch (error) {
    console.error('Error rejecting friend request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user's friends
const getFriends = async (req, res) => {
  try {
    const userId = req.user.id;

    const friends = await Friend.find({
      $or: [{ requester: userId }, { recipient: userId }],
      status: 'accepted'
    }).populate('requester', 'name avatarUrl currentStreak longestStreak totalChallengesCompleted')
      .populate('recipient', 'name avatarUrl currentStreak longestStreak totalChallengesCompleted');

    const friendsList = friends.map(friend => {
      const friendUser = friend.requester._id.toString() === userId 
        ? friend.recipient 
        : friend.requester;
      return friendUser;
    });

    res.json({
      message: 'Friends fetched successfully',
      friends: friendsList
    });

  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get pending friend requests
const getPendingRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const pendingRequests = await Friend.find({
      recipient: userId,
      status: 'pending'
    }).populate('requester', 'name avatarUrl');

    res.json({
      message: 'Pending requests fetched successfully',
      pendingRequests
    });

  } catch (error) {
    console.error('Error fetching pending requests:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Search users (for adding friends)
const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const userId = req.user.id;

    if (!query || query.length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters' });
    }

    // Find users by name or email
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ],
      _id: { $ne: userId } // Exclude current user
    }).select('name email avatarUrl currentStreak longestStreak totalChallengesCompleted')
      .limit(20);

    // Get friend status for each user
    const usersWithFriendStatus = await Promise.all(
      users.map(async (user) => {
        const friendRelation = await Friend.findOne({
          $or: [
            { requester: userId, recipient: user._id },
            { requester: user._id, recipient: userId }
          ]
        });

        return {
          ...user.toObject(),
          friendStatus: friendRelation ? friendRelation.status : 'none'
        };
      })
    );

    res.json({
      message: 'Users found successfully',
      users: usersWithFriendStatus
    });

  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get friend leaderboard (friends only)
const getFriendLeaderboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 50;

    // Get user's friends
    const friends = await Friend.find({
      $or: [{ requester: userId }, { recipient: userId }],
      status: 'accepted'
    });

    const friendIds = friends.map(friend => 
      friend.requester.toString() === userId 
        ? friend.recipient 
        : friend.requester
    );

    // Get friends' leaderboard data
    const friendLeaderboard = await User.find({
      _id: { $in: friendIds }
    })
    .select('name avatarUrl currentStreak longestStreak totalChallengesCompleted')
    .sort({ currentStreak: -1, longestStreak: -1 })
    .limit(limit);

    res.json({
      message: 'Friend leaderboard fetched successfully',
      leaderboard: friendLeaderboard
    });

  } catch (error) {
    console.error('Error fetching friend leaderboard:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriends,
  getPendingRequests,
  searchUsers,
  getFriendLeaderboard
};

