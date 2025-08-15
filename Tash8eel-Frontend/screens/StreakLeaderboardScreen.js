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
import { colors } from '../theme/colors';
import Header from '../components/Header';
import { sendFriendRequest, searchUsers, getFriendLeaderboard } from '../services/friendService';

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

  const getFriendButtonText = (friendStatus) => {
    switch (friendStatus) {
      case 'pending': return 'Request Sent';
      case 'accepted': return 'Friends';
      case 'rejected': return 'Request Rejected';
      default: return 'Add Friend';
    }
  };

  const getFriendButtonStyle = (friendStatus) => {
    switch (friendStatus) {
      case 'pending': return styles.pendingButton;
      case 'accepted': return styles.friendsButton;
      case 'rejected': return styles.rejectedButton;
      default: return styles.addFriendButton;
    }
  };

  const LeaderboardItem = ({ user, index, showAddFriend = false }) => {
    const isCurrentUser = user._id === currentUserId;
    
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

        {showAddFriend && !isCurrentUser && (
          <TouchableOpacity
            style={[
              styles.friendButton,
              getFriendButtonStyle(user.friendStatus)
            ]}
            onPress={() => handleSendFriendRequest(user._id)}
            disabled={user.friendStatus === 'pending' || user.friendStatus === 'accepted'}
          >
            <Text style={styles.friendButtonText}>
              {getFriendButtonText(user.friendStatus)}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const SearchResultItem = ({ user }) => {
    const isCurrentUser = user._id === currentUserId;
    
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

        {!isCurrentUser && (
          <TouchableOpacity
            style={[
              styles.friendButton,
              getFriendButtonStyle(user.friendStatus)
            ]}
            onPress={() => handleSendFriendRequest(user._id)}
            disabled={user.friendStatus === 'pending' || user.friendStatus === 'accepted'}
          >
            <Text style={styles.friendButtonText}>
              {getFriendButtonText(user.friendStatus)}
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
        <ActivityIndicator size="large" color={colors.primary} />
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
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
              value={searchQuery}
              onChangeText={handleSearch}
              autoFocus
            />

            {searching && (
              <View style={styles.searchingContainer}>
                <ActivityIndicator size="small" color={colors.primary} />
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
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  searchButton: {
    padding: 8,
    marginLeft: 8,
    backgroundColor: '#667eea',
    borderRadius: 8,
  },
  searchButtonText: {
    fontSize: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#667eea',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#667eea',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
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
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 6,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  currentUserItem: {
    borderWidth: 2,
    borderColor: '#667eea',
    backgroundColor: '#f8f9ff',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
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
    color: '#333',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginHorizontal: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
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
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    flex: 1,
  },
  statEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  friendButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
    minWidth: 80,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  addFriendButton: {
    backgroundColor: '#667eea',
  },
  pendingButton: {
    backgroundColor: '#ff9500',
  },
  friendsButton: {
    backgroundColor: '#34c759',
  },
  rejectedButton: {
    backgroundColor: '#ff3b30',
  },
  friendButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
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
    color: colors.text,
  },
  closeButton: {
    fontSize: 24,
    color: colors.textSecondary,
    padding: 4,
  },
  modalSearchInput: {
    fontSize: 16,
    color: '#333',
    padding: 12,
    marginHorizontal: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  searchingText: {
    marginLeft: 8,
    color: colors.textSecondary,
  },
  searchResultsList: {
    maxHeight: 400,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
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
    borderColor: '#e0e0e0',
  },
  searchUserInfo: {
    flex: 1,
  },
  searchUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  searchUserEmail: {
    fontSize: 13,
    color: '#666',
    lineHeight: 16,
  },
  noResultsContainer: {
    padding: 40,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});

export default StreakLeaderboardScreen;
