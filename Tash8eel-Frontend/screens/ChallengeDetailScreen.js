// screens/ChallengeDetailScreen.js
import React, { useEffect, useMemo } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchChallengeDetail,
  startChallenge
} from '../app/features/challengesSlice';
import { colors } from '../theme/colors';
import Header from '../components/Header';
import DayCard from '../components/DayCard';
import ProgressBar from '../components/ProgressBar';

export default function ChallengeDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const dispatch = useDispatch();

  // All hooks up top, before any return:
  const { detail, progress, status } = useSelector(s => s.challenges);
  const userId = useSelector(s => s.user.profile?._id);
  const currentStreak = useSelector(s => s.user.profile?.currentStreak || 0);
  const loading = status === 'loading';

  // compute days *as a hook* so it always runs, even during the loading state
  const days = useMemo(() => {
    if (!detail?.workouts) return [];
    return Array.from(new Set(detail.workouts.map(w => w.day)))
      .sort((a, b) => a - b);
  }, [detail]);

  useEffect(() => {
    if (userId) {
      dispatch(fetchChallengeDetail({ id, userId }));
    }
  }, [dispatch, id, userId]);

  // Early return for loading / stale data
  if (loading || !detail || detail._id !== id) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={colors.accent} />
      </SafeAreaView>
    );
  }

  const doneCount = progress?.completedDays.length || 0;

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Challenge Detail" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{detail.title}</Text>
        <Text style={styles.description}>{detail.description}</Text>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <ProgressBar
            progress={doneCount / detail.durationDays}
            barColor={colors.primary}
          />
          <Text style={styles.progressText}>
            {doneCount}/{detail.durationDays} days completed
          </Text>
        </View>

        {/* Streak Display */}
        {progress && currentStreak > 0 && (
          <View style={styles.streakDisplay}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <Text style={styles.streakText}>
              {currentStreak} day streak!
            </Text>
          </View>
        )}

        {!progress && (
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => dispatch(startChallenge({ id, userId }))}
          >
            <Text style={styles.startText}>Start Challenge</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.sectionTitle}>Days</Text>
        {days.map(day => (
          <DayCard
            key={day}
            day={day}
            done={progress?.completedDays.includes(day)}
            currentStreak={currentStreak}
            showStreak={progress?.completedDays.includes(day)} // Only show streak on completed days
            onPress={() =>
              navigation.navigate('DayDetail', { challengeId: id, day })
            }
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background
  },
  content: { padding: 24 },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16
  },
  progressSection: {
    marginBottom: 20,
  },
  progressText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  streakDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 165, 0, 0.1)',
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 165, 0, 0.3)',
  },
  streakEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  streakText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF6B35',
  },
  startButton: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16
  },
  startText: { color: '#FFF', fontWeight: '600', fontSize: 16 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12
  }
});