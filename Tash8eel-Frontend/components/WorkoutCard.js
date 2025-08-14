import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');
// Calculate card size for a clean two-column grid with consistent spacing.
const CARD_SIZE = (width - 48) / 2;

export default function WorkoutCard({ workout, onPress }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.lottieContainer}>
        <LottieView
          source={{ uri: workout.animationUrl }}
          autoPlay
          loop
          style={styles.anim}
        />
      </View>
      <Text numberOfLines={2} style={styles.title}>
        {workout.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_SIZE,
    padding: 12,
    marginHorizontal: 8, // Adjust horizontal margin to control spacing between cards
    marginBottom: 16, // Consistent vertical spacing between rows
    backgroundColor: colors.card,
    borderRadius: 16, // Larger border radius for a modern look
    alignItems: 'center',
    shadowColor: colors.shadow, // Consistent shadow color
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  lottieContainer: {
    width: '100%', // Ensure the container takes up the full width of the card
    height: CARD_SIZE * 0.5,
    marginBottom: 8,
  },
  anim: {
    flex: 1, // Make Lottie fill its container
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: colors.text, // Use theme color for text
  },
});
