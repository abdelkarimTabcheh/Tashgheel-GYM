import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, SafeAreaView } from 'react-native';
import { useSelector } from 'react-redux';
import { colors } from '../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getUnreadNotificationCount } from '../services/notificationService';

/**
 * A reusable header component for the application.
 *
 * @param {string} title The title to display in the header.
 * @param {function} onBackPress An optional function to handle a back button press.
 * @param {function} onNotificationPress An optional function to handle notification button press.
 * @param {boolean} showNotificationIcon Whether to show the notification icon.
 */
export default function Header({ title, onBackPress, onNotificationPress, showNotificationIcon = false }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const token = useSelector(state => state.auth.token);

  useEffect(() => {
    if (showNotificationIcon && token) {
      fetchUnreadCount();
    }
  }, [showNotificationIcon, token]);

  const fetchUnreadCount = async () => {
    try {
      const response = await getUnreadNotificationCount(token);
      setUnreadCount(response.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };
  return (
    <SafeAreaView style={styles.headerContainer}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface} />
      <View style={styles.header}>
        {/* Conditionally render the back button */}
        {onBackPress ? (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
        ) : (
          // Placeholder to keep the title centered when there's no back button
          <View style={styles.backButtonPlaceholder} />
        )}
        <Text style={styles.title}>{title}</Text>
        {/* Notification icon or placeholder */}
        {showNotificationIcon ? (
          <TouchableOpacity onPress={onNotificationPress} style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color={colors.text} />
            {unreadCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.backButtonPlaceholder} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: colors.surface,
    elevation: 4, // Subtle shadow for Android
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    // Added a small amount of paddingTop to move the header content down
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  backButton: {
    paddingRight: 16,
  },
  backButtonPlaceholder: {
    width: 24, // This width matches the back button icon size to keep the title centered
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    flex: 1, // Ensures the title takes up the available space
    textAlign: 'center',
  },
  notificationButton: {
    paddingLeft: 16,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});
