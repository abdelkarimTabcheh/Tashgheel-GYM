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
import { colors } from '../theme/colors';
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

const NotificationScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
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
    try {
      await acceptFriendRequest(notification.relatedData.friendRequestId, authToken);
      await handleMarkAsRead(notification._id);
      
      // Remove the notification from the list
      setNotifications(prev => 
        prev.filter(n => n._id !== notification._id)
      );
      
      // Refresh unread count
      fetchUnreadCount();
      setRefreshTrigger(prev => prev + 1);
      
      Alert.alert('Success', 'Friend request accepted!');
    } catch (error) {
      console.error('Error accepting friend request:', error);
      Alert.alert('Error', error.message || 'Failed to accept friend request');
    }
  };

  const handleRejectFriendRequest = async (notification) => {
    try {
      await rejectFriendRequest(notification.relatedData.friendRequestId, authToken);
      await handleMarkAsRead(notification._id);
      
      // Remove the notification from the list
      setNotifications(prev => 
        prev.filter(n => n._id !== notification._id)
      );
      
      // Refresh unread count
      fetchUnreadCount();
      setRefreshTrigger(prev => prev + 1);
      
      Alert.alert('Success', 'Friend request rejected');
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      Alert.alert('Error', error.message || 'Failed to reject friend request');
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
      case 'friend_request': return '#2196F3';
      case 'friend_accepted': return '#4CAF50';
      case 'friend_rejected': return '#F44336';
      default: return colors.primary;
    }
  };

  const NotificationItem = ({ notification }) => {
    const isUnread = !notification.isRead;
    
    return (
      <TouchableOpacity
        style={[
          styles.notificationItem,
          isUnread && styles.unreadNotification
        ]}
        onPress={() => handleMarkAsRead(notification._id)}
      >
        <View style={styles.notificationHeader}>
          <View style={styles.notificationIcon}>
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

        {notification.type === 'friend_request' && (
          <View style={styles.friendRequestActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.acceptButton]}
              onPress={() => handleAcceptFriendRequest(notification)}
            >
              <Text style={styles.actionButtonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              onPress={() => handleRejectFriendRequest(notification)}
            >
              <Text style={styles.actionButtonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Header title="Notifications" onBackPress={() => navigation.goBack()} />
        <ActivityIndicator size="large" color={colors.primary} />
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
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  unreadBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  unreadBannerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  markAllReadText: {
    color: '#fff',
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
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    color: colors.text,
    marginBottom: 6,
  },
  notificationMessage: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 10,
    lineHeight: 22,
  },
  notificationTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    padding: 60,
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default NotificationScreen;

