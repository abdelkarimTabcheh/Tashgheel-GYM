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
} from 'react-native';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_BASE_URL_JO } from '../config';
import { colors } from '../theme/colors';
import Header from '../components/Header';

const StreakLeaderboardScreen = ({ navigation }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const currentUserId = useSelector(s => s.user.profile?._id);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL_JO}/users/leaderboard?limit=50`);
      setLeaderboard(response.data.leaderboard || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchLeaderboard();
  };

  const getRankEmoji = (index) => {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `#${index + 1}`;
    }
  };

  const LeaderboardItem = ({ user, index }) => {
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
      </View>
    );
  };

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
      <Header title="Streak Leaderboard" onBackPress={() => navigation.goBack()} />
      
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>🔥 Top Streakers</Text>
          <Text style={styles.subtitle}>Keep the fire burning!</Text>
        </View>

        {leaderboard.map((user, index) => (
          <LeaderboardItem key={user._id} user={user} index={index} />
        ))}

        {leaderboard.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No streaks yet!</Text>
            <Text style={styles.emptySubtext}>Complete your first challenge to appear here</Text>
          </View>
        )}
      </ScrollView>
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
});

export default StreakLeaderboardScreen;
