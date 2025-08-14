import axios from 'axios';
import { API_BASE_URL_JO } from '../config';

// Create axios instance with auth header
const createAuthInstance = (token) => {
  return axios.create({
    baseURL: API_BASE_URL_JO,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

// Send friend request
export const sendFriendRequest = async (recipientId, token) => {
  try {
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const api = createAuthInstance(token);
    const response = await api.post('/api/friends/request', { recipientId });
    return response.data;
  } catch (error) {
    console.error('Friend request error:', error);
    if (error.response?.data) {
      throw error.response.data;
    } else if (error.message) {
      throw { message: error.message };
    } else {
      throw { message: 'Failed to send friend request' };
    }
  }
};

// Accept friend request
export const acceptFriendRequest = async (friendRequestId, token) => {
  try {
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const api = createAuthInstance(token);
    const response = await api.post('/api/friends/accept', { friendRequestId });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to accept friend request' };
  }
};

// Reject friend request
export const rejectFriendRequest = async (friendRequestId, token) => {
  try {
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const api = createAuthInstance(token);
    const response = await api.post('/api/friends/reject', { friendRequestId });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to reject friend request' };
  }
};

// Get user's friends
export const getFriends = async (token) => {
  try {
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const api = createAuthInstance(token);
    const response = await api.get('/api/friends/list');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch friends' };
  }
};

// Get pending friend requests
export const getPendingRequests = async (token) => {
  try {
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const api = createAuthInstance(token);
    const response = await api.get('/api/friends/pending');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch pending requests' };
  }
};

// Search users
export const searchUsers = async (query, token) => {
  try {
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const api = createAuthInstance(token);
    const response = await api.get(`/api/friends/search?query=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error('Search users error:', error);
    if (error.response?.data) {
      throw error.response.data;
    } else if (error.message) {
      throw { message: error.message };
    } else {
      throw { message: 'Failed to search users' };
    }
  }
};

// Get friend leaderboard
export const getFriendLeaderboard = async (limit = 50, token) => {
  try {
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const api = createAuthInstance(token);
    const response = await api.get(`/api/friends/leaderboard?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Friend leaderboard error:', error);
    if (error.response?.data) {
      throw error.response.data;
    } else if (error.message) {
      throw { message: error.message };
    } else {
      throw { message: 'Failed to fetch friend leaderboard' };
    }
  }
};

