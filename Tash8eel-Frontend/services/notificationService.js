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

// Get user's notifications
export const getNotifications = async (limit = 20, page = 1, token) => {
  try {
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const api = createAuthInstance(token);
    const response = await api.get(`/api/notifications?limit=${limit}&page=${page}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch notifications' };
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId, token) => {
  try {
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const api = createAuthInstance(token);
    const response = await api.put(`/api/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to mark notification as read' };
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (token) => {
  try {
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const api = createAuthInstance(token);
    const response = await api.put('/api/notifications/read-all');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to mark all notifications as read' };
  }
};

// Get unread notification count
export const getUnreadNotificationCount = async (token) => {
  try {
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const api = createAuthInstance(token);
    const response = await api.get('/api/notifications/unread-count');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch unread count' };
  }
};

// Delete notification
export const deleteNotification = async (notificationId, token) => {
  try {
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const api = createAuthInstance(token);
    const response = await api.delete(`/api/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete notification' };
  }
};

