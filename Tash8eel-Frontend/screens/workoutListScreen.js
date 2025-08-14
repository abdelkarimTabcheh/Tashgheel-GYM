import React from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native'
import { useSelector } from 'react-redux'
import { useNavigation, useRoute } from '@react-navigation/native'
import LottieView from 'lottie-react-native'
import Header from '../components/Header'; // Import the Header component

export default function WorkoutListScreen() {
  const route = useRoute()
  const navigation = useNavigation()
  const category = route.params?.category
  const workouts = useSelector(s => s.workouts.data)
  const filtered = workouts.filter(w => w.category === category)

  return (
    <SafeAreaView style={styles.container}>
      {/* Replaced the title with the Header component */}
      <Header title={`${category} Workouts`} onBackPress={() => navigation.goBack()} />

      <FlatList
        data={filtered}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('WorkoutDetail', { workout: item })}
            activeOpacity={0.85}
          >
            <LottieView
              source={{ uri: item.animationUrl }}
              autoPlay
              loop
              style={styles.lottie}
            />
            <Text style={styles.name}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E', // Dark background to match the app theme
    // Removed padding as the Header component has its own padding
  },
  // The title style block is removed as it's now handled by the Header component.
  listContent: {
    paddingHorizontal: 24, // Added horizontal padding to the list content
    paddingBottom: 60, // Ensure enough space at the bottom (e.g., for tab bar)
    paddingTop: 10, // Add a bit of space below the header
  },
  card: {
    backgroundColor: '#3A3A3C', // Darker background for cards
    borderRadius: 16, // Consistent border radius
    padding: 12,
    marginBottom: 16, // Space between cards
    alignItems: 'center',
    shadowColor: '#000', // Consistent shadows
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  lottie: {
    width: 150, // Keep original size or adjust as needed for list view
    height: 150,
    marginBottom: 10, // Add space below Lottie animation
  },
  name: {
    marginTop: 10, // Keep original margin or adjust
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF', // White text for dark background
    textAlign: 'center', // Center the workout name
  },
});
