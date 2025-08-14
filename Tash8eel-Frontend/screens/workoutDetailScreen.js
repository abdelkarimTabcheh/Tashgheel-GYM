//workoutDetailScreen

import React from 'react'
import { ScrollView, Text, View,StyleSheet } from 'react-native'
import LottieView from 'lottie-react-native'

export default function WorkoutDetailScreen({ route }) {
  const { workout } = route.params
  const animationUrl = workout.animationUrl

  return (
    <View style={styles.rootContainer}>
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <Text style={styles.title}>{workout.name}</Text>

        <View style={styles.animationContainer}>
          {animationUrl
            ? <LottieView
                source={{ uri: animationUrl }}
                autoPlay
                loop
                style={styles.animation}
              />
            : <View style={styles.noAnimationPlaceholder}>
                <Text style={styles.noAnimationText}>No animation available</Text>
              </View>
          }
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.label}>Description</Text>
          <Text style={styles.text}>{workout.description}</Text>

          <Text style={styles.label}>Tips</Text>
          <Text style={styles.text}>{workout.tips || '—'}</Text>

          <Text style={styles.label}>Target Muscles</Text>
          <Text style={styles.text}>{workout.targetMuscles.join(', ')}</Text>

          <Text style={styles.label}>Duration</Text>
          <Text style={styles.text}>{workout.duration}</Text>
        </View>
      </ScrollView>
    </View>
  )
}

// (keep your existing styles unchanged)


const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  scrollContentContainer: {
    flexGrow: 1,
    padding: 24,
    alignItems: 'center',
    paddingBottom: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  animationContainer: {
    backgroundColor: '#3A3A3C',
    borderRadius: 16,
    padding: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center', // Center content vertically in placeholder
    minHeight: 270, // Ensure a minimum height even without animation
  },
  animation: {
    width: 250,
    height: 250,
  },
  noAnimationPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 250, // Match animation height
    width: '100%',
  },
  noAnimationText: {
    color: '#B0B0B0',
    fontSize: 16,
    marginBottom: 10,
  },
  noAnimationEmoji: {
    fontSize: 40,
  },
  detailsCard: {
    backgroundColor: '#3A3A3C',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
    color: '#B0B0B0',
    alignSelf: 'flex-start',
    marginTop: 15,
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'left',
    alignSelf: 'stretch',
    marginTop: 4,
    lineHeight: 24,
    marginBottom: 10,
  },
  toastContainer: {
    position: 'absolute',
    bottom: 50,
    left: 24,
    right: 24,
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toastText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
});