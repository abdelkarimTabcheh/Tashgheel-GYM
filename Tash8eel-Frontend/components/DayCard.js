import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

const DayCard = ({ day, done, onPress, currentStreak = 0, showStreak = false, isToday = false }) => {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        done && styles.cardDone,
        isToday && styles.cardToday
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <Text style={[styles.dayText, done && styles.dayTextDone]}>
          Day {day}
        </Text>

        {/* Today indicator */}
        {isToday && !done && (
          <View style={styles.todayBadge}>
            <Text style={styles.todayText}>TODAY</Text>
          </View>
        )}

        {/* Streak Display */}
        {showStreak && currentStreak > 0 && (
          <View style={styles.streakContainer}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <Text style={[styles.streakText, done && styles.streakTextDone]}>
              {currentStreak}
            </Text>
          </View>
        )}

        {/* Completion Checkmark */}
        {done && (
          <Ionicons
            name="checkmark-circle"
            size={24}
            color={colors.textOnPrimary}
            style={styles.checkIcon}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  cardDone: {
    backgroundColor: colors.primary,
  },
  cardToday: {
    borderColor: '#FF6B35',
    borderWidth: 2,
  },
  content: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  dayText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  dayTextDone: {
    color: colors.textOnPrimary,
  },
  todayBadge: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 8,
  },
  todayText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 165, 0, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 4,
  },
  streakEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B35',
  },
  streakTextDone: {
    color: colors.textOnPrimary,
  },
  checkIcon: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
});

export default DayCard;