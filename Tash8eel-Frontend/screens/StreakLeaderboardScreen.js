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

  // Debug function to check authentication status
  const debugAuth = () => {
    console.log('=== DEBUG AUTH ===');
    console.log('Auth token exists:', !!authToken);
    console.log('Current user ID:', currentUserId);
    console.log('Token length:', authToken ? authToken.length : 0);
    console.log('==================');
  };

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
      Alert.alert('Success', 'Friend request sent successfully!');
      // Update search results to show updated status
      setSearchResults(prev => 
        prev.map(user => 
          user._id === userId 
            ? { ...user, friendStatus: 'pending' }
            : user
        )
      );
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
        <TouchableOpacity 
          style={styles.debugButton}
          onPress={debugAuth}
        >
          <Text style={styles.debugButtonText}>🐛</Text>
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
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 8,
  },
  searchButton: {
    padding: 8,
    marginLeft: 8,
  },
  searchButtonText: {
    fontSize: 20,
  },
  debugButton: {
    padding: 8,
    marginLeft: 4,
    backgroundColor: '#FF6B35',
    borderRadius: 8,
  },
  debugButtonText: {
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  currentUserItem: {
    borderWidth: 2,
    borderColor: '#FF6B35',
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
  },
  rankText: {
    fontSize: 18,
    fontWeight: '700',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  friendButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 8,
  },
  addFriendButton: {
    backgroundColor: colors.primary,
  },
  pendingButton: {
    backgroundColor: '#FFA500',
  },
  friendsButton: {
    backgroundColor: '#4CAF50',
  },
  rejectedButton: {
    backgroundColor: '#F44336',
  },
  friendButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '80%',
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
    color: colors.text,
    padding: 16,
    marginHorizontal: 20,
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 16,
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.card,
  },
  searchAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  searchUserInfo: {
    flex: 1,
  },
  searchUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  searchUserEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
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
