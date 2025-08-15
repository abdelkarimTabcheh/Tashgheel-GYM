import React, { useEffect, useState } from 'react';
import {
  SafeAreaView, ScrollView,
  Text,
  View,
  Image,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_BASE_URL_JO } from '../config';
import Header from '../components/Header';
import { sendFriendRequest, searchUsers, getFriendLeaderboard } from '../services/friendService';

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

const StreakLeaderboardScreen = ({ navigation }) => {
  const [allUsersLeaderboard, setAllUsersLeaderboard] = useState([]);
  const [friendsLeaderboard, setFriendsLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'friends'
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const currentUserId = useSelector(s => s.user.profile?._id);
  const authToken = useSelector(s => s.auth.token);

  const fetchAllUsersLeaderboard = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL_JO}/users/leaderboard?limit=50`);
      setAllUsersLeaderboard(response.data.leaderboard || []);
    } catch (error) {
      console.error('Error fetching all users leaderboard:', error);
    }
  };

  const fetchFriendsLeaderboard = async () => {
    try {
      const response = await getFriendLeaderboard(50, authToken);
      setFriendsLeaderboard(response.leaderboard || []);
    } catch (error) {
      console.error('Error fetching friends leaderboard:', error);
    }
  };

  const fetchLeaderboards = async () => {
    setLoading(true);
    await Promise.all([
      fetchAllUsersLeaderboard(),
      fetchFriendsLeaderboard()
    ]);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    if (authToken) {
      fetchLeaderboards();
    }
  }, [authToken]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchLeaderboards();
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const response = await searchUsers(query, authToken);
      setSearchResults(response.users || []);
    } catch (error) {
      console.error('Error searching users:', error);
      Alert.alert('Error', 'Failed to search users');
    } finally {
      setSearching(false);
    }
  };

  const handleSendFriendRequest = async (userId) => {
    try {
      console.log('Sending friend request to user:', userId);
      console.log('Auth token exists:', !!authToken);
      console.log('Current user ID:', currentUserId);
      
      if (!authToken) {
        Alert.alert('Error', 'You are not authenticated. Please log in again.');
        return;
      }
      
      const result = await sendFriendRequest(userId, authToken);
      console.log('Friend request result:', result);
      
      // Update search results to show updated status
      setSearchResults(prev => 
        prev.map(user => 
          user._id === userId 
            ? { ...user, friendStatus: 'pending' }
            : user
        )
      );
      
      // Update all users leaderboard to show updated status
      setAllUsersLeaderboard(prev => 
        prev.map(user => 
          user._id === userId 
            ? { ...user, friendStatus: 'pending' }
            : user
        )
      );
      
      // Trigger notification badge refresh
      setRefreshTrigger(prev => prev + 1);
      
      Alert.alert('Success', 'Friend request sent successfully!');
    } catch (error) {
      console.error('Error sending friend request:', error);
      const errorMessage = error.message || 'Failed to send friend request';
      Alert.alert('Error', errorMessage);
    }
  };

  const getRankEmoji = (index) => {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `#${index + 1}`;
    }
  };

  const getFriendButtonIcon = (friendStatus) => {
    switch (friendStatus) {
      case 'pending': return '📤'; // Sent icon
      case 'accepted': return null; // No button for existing friends
      case 'rejected': return '❌';
      default: return '➕'; // Add friend icon (Facebook-style plus)
    }
  };

  const getFriendButtonStyle = (friendStatus) => {
    switch (friendStatus) {
      case 'pending': return [styles.friendIconButton, styles.pendingIconButton];
      case 'accepted': return null; // No button for existing friends
      case 'rejected': return [styles.friendIconButton, styles.rejectedIconButton];
      default: return [styles.friendIconButton, styles.addFriendIconButton];
    }
  };

  const LeaderboardItem = ({ user, index, showAddFriend = false }) => {
    const isCurrentUser = user._id === currentUserId;
    // Hide button for current user, friends (accepted status), or when showAddFriend is false
    const shouldShowButton = showAddFriend && !isCurrentUser && user.friendStatus !== 'accepted' && user.friendStatus !== 'friends';
    
    return (
      <View style={[styles.leaderboardItem, isCurrentUser && styles.currentUserItem]}>
        <View style={styles.rankContainer}>
          <Text style={styles.rankText}>{getRankEmoji(index)}</Text>
        </View>
        
        <Image
          source={
            user.avatarUrl 
              ? { uri: `${API_BASE_URL_JO}${user.avatarUrl}` }
              : require('../assets/images/default-user.png')
          }
          style={styles.avatar}
        />
        
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {user.name || 'Anonymous'} {isCurrentUser && '(You)'}
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statEmoji}>🔥</Text>
              <Text style={styles.statValue}>{user.currentStreak}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statEmoji}>🏆</Text>
              <Text style={styles.statValue}>{user.longestStreak}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statEmoji}>✅</Text>
              <Text style={styles.statValue}>{user.totalChallengesCompleted}</Text>
            </View>
          </View>
        </View>

        {shouldShowButton && (
          <TouchableOpacity
            style={getFriendButtonStyle(user.friendStatus)}
            onPress={() => handleSendFriendRequest(user._id)}
            disabled={user.friendStatus === 'pending'}
          >
            <Text style={styles.friendIconText}>
              {getFriendButtonIcon(user.friendStatus)}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const SearchResultItem = ({ user }) => {
    const isCurrentUser = user._id === currentUserId;
    // Hide button for current user and friends (accepted status or 'friends' status)
    const shouldShowButton = !isCurrentUser && user.friendStatus !== 'accepted' && user.friendStatus !== 'friends';
    
    return (
      <View style={styles.searchResultItem}>
        <Image
          source={
            user.avatarUrl 
              ? { uri: `${API_BASE_URL_JO}${user.avatarUrl}` }
              : require('../assets/images/default-user.png')
          }
          style={styles.searchAvatar}
        />
        
        <View style={styles.searchUserInfo}>
          <Text style={styles.searchUserName}>
            {user.name || 'Anonymous'} {isCurrentUser && '(You)'}
          </Text>
          <Text style={styles.searchUserEmail}>{user.email}</Text>
        </View>

        {shouldShowButton && (
          <TouchableOpacity
            style={getFriendButtonStyle(user.friendStatus)}
            onPress={() => handleSendFriendRequest(user._id)}
            disabled={user.friendStatus === 'pending'}
          >
            <Text style={styles.friendIconText}>
              {getFriendButtonIcon(user.friendStatus)}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const currentLeaderboard = activeTab === 'all' ? allUsersLeaderboard : friendsLeaderboard;

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Header title="Leaderboard" onBackPress={() => navigation.goBack()} />
        <ActivityIndicator size="large" color={darkColors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Streak Leaderboard" 
        onBackPress={() => navigation.goBack()}
        showNotificationIcon={true}
        onNotificationPress={() => navigation.navigate('Notifications')}
        refreshTrigger={refreshTrigger}
      />
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users to add friends..."
          placeholderTextColor={darkColors.textMuted}
          value={searchQuery}
          onChangeText={handleSearch}
          onFocus={() => setShowSearchModal(true)}
        />
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={() => setShowSearchModal(true)}
        >
          <Text style={styles.searchButtonText}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            All Users ({allUsersLeaderboard.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'friends' && styles.activeTab]}
          onPress={() => setActiveTab('friends')}
        >
          <Text style={[styles.tabText, activeTab === 'friends' && styles.activeTabText]}>
            Friends ({friendsLeaderboard.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={darkColors.primary}
            colors={[darkColors.primary]}
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            🔥 {activeTab === 'all' ? 'Top Streakers' : 'Friends Leaderboard'}
          </Text>
          <Text style={styles.subtitle}>
            {activeTab === 'all' ? 'Keep the fire burning!' : 'Compete with your friends!'}
          </Text>
        </View>

        {currentLeaderboard.map((user, index) => (
          <LeaderboardItem 
            key={user._id} 
            user={user} 
            index={index}
            showAddFriend={activeTab === 'all'}
          />
        ))}

        {currentLeaderboard.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {activeTab === 'all' ? 'No streaks yet!' : 'No friends yet!'}
            </Text>
            <Text style={styles.emptySubtext}>
              {activeTab === 'all' 
                ? 'Complete your first challenge to appear here'
                : 'Add some friends to see their streaks here'
              }
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Search Modal */}
      <Modal
        visible={showSearchModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSearchModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Search Users</Text>
              <TouchableOpacity onPress={() => setShowSearchModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalSearchInput}
              placeholder="Search by name or email..."
              placeholderTextColor={darkColors.textMuted}
              value={searchQuery}
              onChangeText={handleSearch}
              autoFocus
            />

            {searching && (
              <View style={styles.searchingContainer}>
                <ActivityIndicator size="small" color={darkColors.primary} />
                <Text style={styles.searchingText}>Searching...</Text>
              </View>
            )}

            <FlatList
              data={searchResults}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => <SearchResultItem user={item} />}
              style={styles.searchResultsList}
              showsVerticalScrollIndicator={false}
            />

            {searchResults.length === 0 && searchQuery.length >= 2 && !searching && (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>No users found</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
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
  searchContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: darkColors.card,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: darkColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: darkColors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: darkColors.text,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  searchButton: {
    padding: 8,
    marginLeft: 8,
    backgroundColor: darkColors.primary,
    borderRadius: 8,
  },
  searchButtonText: {
    fontSize: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: darkColors.surface,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: darkColors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: darkColors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: darkColors.textSecondary,
  },
  activeTabText: {
    color: darkColors.text,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: darkColors.primary,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    shadowColor: darkColors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: darkColors.text,
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: darkColors.card,
    marginHorizontal: 20,
    marginVertical: 6,
    padding: 16,
    borderRadius: 16,
    shadowColor: darkColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: darkColors.border,
  },
  currentUserItem: {
    borderWidth: 2,
    borderColor: darkColors.primary,
    backgroundColor: darkColors.cardHighlight,
    shadowColor: darkColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: 18,
    fontWeight: '700',
    color: darkColors.text,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginHorizontal: 12,
    borderWidth: 2,
    borderColor: darkColors.border,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: darkColors.text,
    marginBottom: 6,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: darkColors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    flex: 1,
    borderWidth: 1,
    borderColor: darkColors.border,
  },
  statEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: darkColors.text,
  },
  // Friend icon button styles
  friendIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: darkColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  addFriendIconButton: {
    backgroundColor: darkColors.primary,
  },
  pendingIconButton: {
    backgroundColor: darkColors.warning,
  },
  rejectedIconButton: {
    backgroundColor: darkColors.error,
  },
  friendIconText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: darkColors.card,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    shadowColor: darkColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: darkColors.border,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: darkColors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: darkColors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: darkColors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: darkColors.modalBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '80%',
    shadowColor: darkColors.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: darkColors.border,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: darkColors.text,
  },
  closeButton: {
    fontSize: 24,
    color: darkColors.textSecondary,
    padding: 4,
  },
  modalSearchInput: {
    fontSize: 16,
    color: darkColors.text,
    padding: 12,
    marginHorizontal: 20,
    backgroundColor: darkColors.inputBackground,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: darkColors.border,
  },
  searchingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  searchingText: {
    marginLeft: 8,
    color: darkColors.textSecondary,
  },
  searchResultsList: {
    maxHeight: 400,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: darkColors.border,
    backgroundColor: darkColors.card,
    marginHorizontal: 20,
    marginVertical: 2,
    borderRadius: 12,
  },
  searchAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: darkColors.border,
  },
  searchUserInfo: {
    flex: 1,
  },
  searchUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: darkColors.text,
    marginBottom: 2,
  },
  searchUserEmail: {
    fontSize: 13,
    color: darkColors.textSecondary,
    lineHeight: 16,
  },
  noResultsContainer: {
    padding: 40,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: darkColors.textSecondary,
  },
});

export default StreakLeaderboardScreen;