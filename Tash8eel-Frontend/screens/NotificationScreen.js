import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Image,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import { useSelector } from 'react-redux';
import { API_BASE_URL_JO } from '../config';
import Header from '../components/Header';
import { 
  getNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  getUnreadNotificationCount 
} from '../services/notificationService';
import { 
  acceptFriendRequest, 
  rejectFriendRequest 
} from '../services/friendService';

// Dark mode colors
const darkColors = {
  background: '#000000',
  surface: '#1a1a1a',
  card: '#2a2a2a',
  primary: '#667eea',
  primaryDark: '#5a6fd8',
  text: '#ffffff',
  textSecondary: '#b0b0b0',
  textMuted: '#666666',
  border: '#333333',
  success: '#34c759',
  warning: '#ff9500',
  error: '#ff3b30',
  shadow: 'rgba(0, 0, 0, 0.8)',
  overlay: 'rgba(0, 0, 0, 0.7)',
  accent: '#667eea',
  cardHighlight: '#333333',
  inputBackground: '#2a2a2a',
  modalBackground: '#1a1a1a',
};

const NotificationScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [processingRequests, setProcessingRequests] = useState(new Set());
  const currentUserId = useSelector(s => s.user.profile?._id);
  const authToken = useSelector(s => s.auth.token);

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications(50, 1, authToken);
      setNotifications(response.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await getUnreadNotificationCount(authToken);
      setUnreadCount(response.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [authToken]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
    fetchUnreadCount();
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId, authToken);
      setNotifications(prev => 
        prev.map(notification => 
          notification._id === notificationId 
            ? { ...notification, isRead: true }
            : notification
        )
      );
      fetchUnreadCount();
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead(authToken);
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      setUnreadCount(0);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleAcceptFriendRequest = async (notification) => {
    const notificationId = notification._id;
    
    // Add to processing set to disable buttons
    setProcessingRequests(prev => new Set(prev).add(notificationId));
    
    try {
      console.log('Accepting friend request:', notification.relatedData.friendRequestId);
      
      await acceptFriendRequest(notification.relatedData.friendRequestId, authToken);
      
      // Mark as read
      await handleMarkAsRead(notification._id);
      
      // Immediately remove the notification from the list
      setNotifications(prev => {
        const updated = prev.filter(n => n._id !== notificationId);
        console.log('Notifications after accept:', updated.length);
        return updated;
      });
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
      setRefreshTrigger(prev => prev + 1);
      
      Alert.alert('Success', 'Friend request accepted!');
    } catch (error) {
      console.error('Error accepting friend request:', error);
      Alert.alert('Error', error.message || 'Failed to accept friend request');
    } finally {
      // Remove from processing set
      setProcessingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
    }
  };

  const handleRejectFriendRequest = async (notification) => {
    const notificationId = notification._id;
    
    // Add to processing set to disable buttons
    setProcessingRequests(prev => new Set(prev).add(notificationId));
    
    try {
      console.log('Rejecting friend request:', notification.relatedData.friendRequestId);
      
      await rejectFriendRequest(notification.relatedData.friendRequestId, authToken);
      
      // Mark as read
      await handleMarkAsRead(notification._id);
      
      // Immediately remove the notification from the list
      setNotifications(prev => {
        const updated = prev.filter(n => n._id !== notificationId);
        console.log('Notifications after reject:', updated.length);
        return updated;
      });
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
      setRefreshTrigger(prev => prev + 1);
      
      Alert.alert('Success', 'Friend request rejected');
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      Alert.alert('Error', error.message || 'Failed to reject friend request');
    } finally {
      // Remove from processing set
      setProcessingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'friend_request': return '👥';
      case 'friend_accepted': return '✅';
      case 'friend_rejected': return '❌';
      default: return '🔔';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'friend_request': return darkColors.primary;
      case 'friend_accepted': return darkColors.success;
      case 'friend_rejected': return darkColors.error;
      default: return darkColors.primary;
    }
  };

  const NotificationItem = ({ notification }) => {
    const isUnread = !notification.isRead;
    const isProcessing = processingRequests.has(notification._id);
    
    return (
      <TouchableOpacity
        style={[
          styles.notificationItem,
          isUnread && styles.unreadNotification
        ]}
        onPress={() => handleMarkAsRead(notification._id)}
        activeOpacity={0.7}
      >
        <View style={styles.notificationHeader}>
          <View style={[
            styles.notificationIcon,
            { backgroundColor: getNotificationColor(notification.type) + '30' }
          ]}>
            <Text style={styles.iconText}>
              {getNotificationIcon(notification.type)}
            </Text>
          </View>
          
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>
              {notification.title}
            </Text>
            <Text style={styles.notificationMessage}>
              {notification.message}
            </Text>
            <Text style={styles.notificationTime}>
              {new Date(notification.createdAt).toLocaleDateString()} • {new Date(notification.createdAt).toLocaleTimeString()}
            </Text>
          </View>

          {isUnread && <View style={styles.unreadDot} />}
        </View>

        {notification.type === 'friend_request' && !isProcessing && (
          <View style={styles.friendRequestActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.acceptButton]}
              onPress={() => handleAcceptFriendRequest(notification)}
              disabled={isProcessing}
            >
              <Text style={styles.actionButtonText}>✅ Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              onPress={() => handleRejectFriendRequest(notification)}
              disabled={isProcessing}
            >
              <Text style={styles.actionButtonText}>❌ Reject</Text>
            </TouchableOpacity>
          </View>
        )}

        {notification.type === 'friend_request' && isProcessing && (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="small" color={darkColors.primary} />
            <Text style={styles.processingText}>Processing...</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Header title="Notifications" onBackPress={() => navigation.goBack()} />
        <ActivityIndicator size="large" color={darkColors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Notifications" onBackPress={() => navigation.goBack()} refreshTrigger={refreshTrigger} />
      
      {unreadCount > 0 && (
        <View style={styles.unreadBanner}>
          <Text style={styles.unreadBannerText}>
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </Text>
          <TouchableOpacity onPress={handleMarkAllAsRead}>
            <Text style={styles.markAllReadText}>Mark all read</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <NotificationItem notification={item} />}
        style={styles.notificationsList}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={darkColors.primary}
            colors={[darkColors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyText}>No notifications yet</Text>
            <Text style={styles.emptySubtext}>
              You'll see friend requests and other updates here
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkColors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: darkColors.background,
  },
  unreadBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: darkColors.primary,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    shadowColor: darkColors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  unreadBannerText: {
    color: darkColors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  markAllReadText: {
    color: darkColors.text,
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  notificationsList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  notificationItem: {
    backgroundColor: darkColors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: darkColors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: darkColors.border,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: darkColors.primary,
    backgroundColor: darkColors.cardHighlight,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: darkColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: darkColors.border,
  },
  iconText: {
    fontSize: 24,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: darkColors.text,
    marginBottom: 6,
  },
  notificationMessage: {
    fontSize: 16,
    color: darkColors.textSecondary,
    marginBottom: 10,
    lineHeight: 22,
  },
  notificationTime: {
    fontSize: 12,
    color: darkColors.textMuted,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: darkColors.primary,
    marginLeft: 8,
    marginTop: 4,
  },
  friendRequestActions: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: darkColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  acceptButton: {
    backgroundColor: darkColors.success,
  },
  rejectButton: {
    backgroundColor: darkColors.error,
  },
  actionButtonText: {
    color: darkColors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    padding: 12,
    backgroundColor: darkColors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: darkColors.border,
  },
  processingText: {
    marginLeft: 8,
    color: darkColors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    padding: 60,
    backgroundColor: darkColors.card,
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 20,
    shadowColor: darkColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: darkColors.border,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    color: darkColors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 16,
    color: darkColors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default NotificationScreen;