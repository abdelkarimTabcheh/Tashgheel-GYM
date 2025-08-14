import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
  SafeAreaView,
  Platform,
  Easing,
  ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';

// Assuming these custom components are in separate files or defined here
const { width } = Dimensions.get('window');
const LinearGradient = ({ colors, style, children, start, end }) => {
  return (
    <View style={[style, { backgroundColor: colors[0] }]}>{children}</View>
  );
};
const Icon = ({ name, size = 24, color = '#000' }) => {
  const icons = {
    'person-circle': '👤',
    barbell: '🏋️',
    resize: '📏',
    fitness: '💪',
    trophy: '🏆',
    stopwatch: '⏱️',
    restaurant: '🍽️',
    'trending-up': '📈',
    bulb: '💡',
    'plus-circle': '➕',
    'stats-chart': '📊',
  };
  return <Text style={{ fontSize: size, color }}>{icons[name] || '●'}</Text>;
};

// Reusable Stat Card Component
const StatCard = ({ title, value, unit, icon, color, onPress }) => (
  <TouchableOpacity
    style={[styles.statCard, { borderLeftColor: color }]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={styles.statCardContent}>
      <View style={styles.statHeader}>
        <Icon name={icon} size={24} color={color} />
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <View style={styles.statValue}>
        <Text style={styles.statNumber}>{value}</Text>
        <Text style={styles.statUnit}>{unit}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

// Reusable Quick Action Button Component
const QuickActionButton = ({ title, icon, color, onPress }) => (
  <TouchableOpacity
    style={styles.quickActionButtonWrapper}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <LinearGradient
      colors={[color, color]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.quickActionButton}
    >
      <View style={styles.quickActionContent}>
        <Icon name={icon} size={28} color="white" />
        <Text style={styles.quickActionText}>{title}</Text>
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

export default function HomeScreen({ navigation }) {
  const userProfile = useSelector(state => state.user.profile);
  const loading = useSelector(state => state.user.status === 'loading');

  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  const motivationalQuotes = [
    "Your body can do it. It's your mind you need to convince.",
    "The only bad workout is the one that didn't happen.",
    'Progress, not perfection.',
    'Champions train, losers complain.',
    "Believe you can and you're halfway there.",
    'Strength does not come from physical capacity. It comes from an indomitable will.',
  ];
  const [currentQuote] = useState(
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)],
  );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  if (loading || !userProfile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5856D6" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  const user = userProfile;

  const calculateBMI = (weight, height) => {
    if (!weight || !height || height === 0) return 'N/A';
    return (weight / (height / 100) ** 2).toFixed(1);
  };

  const getBMICategory = bmi => {
    const bmiValue = parseFloat(bmi);
    if (isNaN(bmiValue)) return { category: 'N/A', color: '#B0B0B0' };
    if (bmiValue < 18.5) return { category: 'Underweight', color: '#3B82F6' };
    if (bmiValue < 25) return { category: 'Normal', color: '#4ADE80' };
    if (bmiValue < 30) return { category: 'Overweight', color: '#FBBF24' };
    return { category: 'Obese', color: '#FF6B6B' };
  };

  const getProgressPercentage = () => {
    if (!user.weeklyGoal || user.weeklyGoal === 0) return 0;
    return Math.min((user.todaySteps / user.weeklyGoal) * 100, 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1C1C1E" />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <Animated.View
          style={[
            styles.header,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <LinearGradient
            colors={['#3A3A3C', '#2C2C2E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <View style={styles.headerContent}>
              <View>
                <Text style={styles.greeting}>Good Morning</Text>
                <Text style={styles.userName}>{user.name}! 👋</Text>
              </View>
              <TouchableOpacity
                style={styles.profileButton}
                onPress={() => navigation?.navigate('Profile')}
              >
                <Icon name="person-circle" size={40} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.progressSection}>
              <View style={styles.progressRing}>
                <Text style={styles.progressText}>
                  {user.todaySteps?.toLocaleString() || 0}
                </Text>
                <Text style={styles.progressLabel}>steps today</Text>
              </View>
              <View style={styles.progressInfo}>
                <Text style={styles.progressGoal}>
                  Goal: {user.weeklyGoal?.toLocaleString() || 0} steps
                </Text>
                <Text style={styles.streakText}>
                  🔥 {user.currentStreak || 0} day streak
                </Text>
                {user.longestStreak > 0 && (
                  <Text style={styles.bestStreakText}>
                    🏆 Best: {user.longestStreak} days
                  </Text>
                )}
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View
          style={[
            styles.statsSection,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={styles.sectionTitle}>Your Stats</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Weight"
              value={user.weight || 'N/A'}
              unit="kg"
              icon="barbell"
              color={getBMICategory(user.bmi).color}
              onPress={() => navigation?.navigate('Profile')}
            />
            <StatCard
              title="Height"
              value={user.height || 'N/A'}
              unit="cm"
              icon="resize"
              color={getBMICategory(user.bmi).color}
              onPress={() => navigation?.navigate('Profile')}
            />
            <StatCard
              title="BMI"
              value={calculateBMI(user.weight, user.height)}
              unit={getBMICategory(calculateBMI(user.weight, user.height)).category}
              icon="fitness"
              color={getBMICategory(calculateBMI(user.weight, user.height)).color}
              onPress={() => navigation?.navigate('Profile')}
            />
          </View>

          {/* 🔥 NEW: Streak Stats Row */}
          <View style={styles.statsGrid}>
            <StatCard
              title="Current Streak"
              value={user.currentStreak || 0}
              unit="days"
              icon="trending-up"
              color="#FF6B35"
              onPress={() => navigation?.navigate('Profile')}
            />
            <StatCard
              title="Best Streak"
              value={user.longestStreak || 0}
              unit="days"
              icon="trophy"
              color="#FFD700"
              onPress={() => navigation?.navigate('Profile')}
            />
            <StatCard
              title="Challenges"
              value={user.totalChallengesCompleted || 0}
              unit="done"
              icon="fitness"
              color="#4ADE80"
              onPress={() => navigation?.navigate('Challenges')}
            />
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.quickActionsSection,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <QuickActionButton
              title="Challenges"
              icon="trophy"
              color="#FF6B6B"
              onPress={() => navigation?.navigate('Challenges')}
            />
            <QuickActionButton
              title="Timer"
              icon="stopwatch"
              color="#5856D6"
              onPress={() => navigation?.navigate('Timer')}
            />
            <QuickActionButton
              title="Workouts"
              icon="barbell"
              color="#4ADE80"
              onPress={() => navigation?.navigate('Workouts')}
            />
            <QuickActionButton
              title="Leaderboard"
              icon="stats-chart"  // This should work
              color="#FBBF24"
              onPress={() => navigation?.navigate('StreakLeaderboard')}
            />
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.motivationSection,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.motivationCard}>
            <Icon name="bulb" size={32} color="#5856D6" />
            <Text style={styles.motivationText}>{currentQuote}</Text>
          </View>
        </Animated.View>
      </ScrollView>
      <TouchableOpacity
        style={styles.chatbotFab}
        onPress={() => navigation?.navigate('ChatBot')}
        activeOpacity={0.8}
      >
        <View style={styles.chatbotIconContainer}>
          <Text style={styles.chatbotIcon}>💬</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 80,
  },
  header: {
    marginBottom: 20,
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 20 : 30,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: '#B0B0B0',
    fontWeight: '500',
  },
  userName: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 4,
  },
  profileButton: {
    padding: 4,
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  progressRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 8,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  progressText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  progressLabel: {
    fontSize: 12,
    color: '#B0B0B0',
    marginTop: 2,
  },
  progressInfo: {
    flex: 1,
    paddingLeft: 20,
  },
  progressGoal: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 8,
  },
  streakText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  statsSection: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  statCard: {
    backgroundColor: '#3A3A3C',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    width: (width - 60) / 3,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statCardContent: {
    alignItems: 'center',
  },
  statHeader: {
    alignItems: 'center',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 12,
    color: '#B0B0B0',
    marginTop: 4,
    textAlign: 'center',
  },
  statValue: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statUnit: {
    fontSize: 10,
    color: '#B0B0B0',
    marginTop: 2,
  },
  quickActionsSection: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: -6,
  },
  quickActionButtonWrapper: {
    width: (width - 24 * 2 - 12) / 2,
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginHorizontal: 6,
  },
  quickActionButton: {
    padding: 20,
    alignItems: 'center',      // Centers content horizontally
    justifyContent: 'center',  // Centers content vertically
    height: 100,
  },
  quickActionContent: {
    alignItems: 'center',      // Centers horizontally
    justifyContent: 'center',  // Centers vertically  
    flex: 1,                   // Takes full available space
  },
  quickActionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  motivationSection: {
    paddingHorizontal: 24,
    marginBottom: 30,
  },
  motivationCard: {
    backgroundColor: '#3A3A3C',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  motivationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
  },
  loadingText: {
    color: '#B0B0B0',
    marginTop: 10,
    fontSize: 16,
  },
  chatbotFab: {
    position: 'absolute',
    bottom: 30,
    right: 24,
    zIndex: 99,
  },

  chatbotIconContainer: {
    backgroundColor: '#5856D6',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },

  chatbotIcon: {
    fontSize: 28,
    color: '#FFFFFF',
  },
});
