import React, { useEffect, useCallback, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator,
  StatusBar, SafeAreaView, Platform, RefreshControl, // Import RefreshControl for pull-to-refresh
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWorkouts } from '../app/features/workoutsSlice';

export default function WorkoutCategoriesScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Redux slice state (data = workouts array)
  const { data: workouts, status, error } = useSelector(state => state.workouts);

  // Extract unique categories
  const categories = [...new Set(workouts.map(w => w.category))];

  // Create onRefresh handler for FlatList
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(fetchWorkouts())
      .finally(() => setRefreshing(false));
  }, [dispatch]);

  // Fetch workouts on initial load if status is idle
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchWorkouts());
    }
  }, [status, dispatch]);

  // Defines a set of vibrant colors for category icons/cards that work well on dark backgrounds
  const getCategoryColor = (category, index) => {
    const colors = [
      { bg: '#FF6B6B', text: '#FFFFFF' }, // Red
      { bg: '#4ADE80', text: '#FFFFFF' }, // Green
      { bg: '#3B82F6', text: '#FFFFFF' }, // Blue
      { bg: '#FBBF24', text: '#FFFFFF' }, // Yellow
      { bg: '#8B5CF6', text: '#FFFFFF' }, // Purple
      { bg: '#EC4899', text: '#FFFFFF' }, // Pink
      { bg: '#10B981', text: '#FFFFFF' }, // Emerald
      { bg: '#F97316', text: '#FFFFFF' }, // Orange
    ];
    return colors[index % colors.length];
  };

  // Calculates the number of workouts for a given category
  const getWorkoutCountForCategory = (category) => {
    return workouts.filter(workout => workout.category === category).length;
  };

  // Renders each category item in the FlatList
  const renderCategoryItem = ({ item, index }) => {
    const workoutCount = getWorkoutCountForCategory(item);
    const categoryColor = getCategoryColor(item, index);

    return (
      <TouchableOpacity
        style={styles.categoryCard}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('WorkoutList', { category: item })}
      >
        <View style={styles.cardInner}> 
          <View style={styles.cardHeader}>
            <View style={[styles.categoryIcon, { backgroundColor: categoryColor.bg }]}>
              <Text style={[styles.categoryLetter, { color: categoryColor.text }]}>
                {item.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.cardBadge}>
              <Text style={styles.badgeText}>{workoutCount}</Text>
            </View>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.categoryTitle}>{item}</Text>
            <Text style={styles.categorySubtitle}>
              {workoutCount} {workoutCount === 1 ? 'workout' : 'workouts'} available
            </Text>
          </View>

          <View style={styles.cardFooter}>
            <Text style={styles.actionText}>
              {workoutCount > 0 ? 'Start training →' : 'Coming soon →'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Displays a full-screen loading indicator
  if (status === 'loading') {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#1C1C1E" />
        <View style={styles.loadingContent}>
          <View style={styles.loadingSpinner}>
            <ActivityIndicator size="large" color="#5856D6" />
          </View>
          <Text style={styles.loadingText}>Loading your workouts...</Text>

        </View>
      </SafeAreaView>
    );
  }

  // Displays an error message if fetching fails
  if (status === 'failed') {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#1C1C1E" />
        <Text style={styles.errorText}>Error: {error || 'Failed to load workouts.'}</Text>
        <TouchableOpacity onPress={onRefresh} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Tap to Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1C1C1E" />
      
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.greeting}>Ready to</Text>
          <View style={styles.headerActions}>
            <View style={styles.notificationDot} />
          </View>
        </View>
        <Text style={styles.title}>Train Hard?</Text>
        <Text style={styles.subtitle}>Choose your workout category</Text>

        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{categories.length}</Text>
            <Text style={styles.statLabel}>Categories</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>💪</Text>
            <Text style={styles.statLabel}>Ready</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>🔥</Text>
            <Text style={styles.statLabel}>Let's Go</Text>
          </View>
        </View>
      </View>

      
      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <FlatList
          data={categories}
          keyExtractor={(item, index) => `${item}-${index}`}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={renderCategoryItem}
          refreshControl={ // Integrated RefreshControl for pull-to-refresh
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#5856D6" // Color of the refreshing indicator
            />
          }
          numColumns={1}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // --- Loading/Error State Styles ---
  loadingContainer: {
    flex: 1,
    backgroundColor: '#1C1C1E', // Consistent dark background
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingSpinner: {
    marginBottom: 24,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#B0B0B0', // Lighter gray for readability
    marginBottom: 24,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF6B6B', // Soft red for error messages
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#5856D6',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 10,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // --- Main Screen Styles ---
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E', // Consistent dark background
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 10 : 20, // Adjust for iOS notch/status bar
    paddingBottom: 32,
    backgroundColor: '#1C1C1E', // Consistent dark background
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '500',
    color: '#B0B0B0', // Lighter gray for readability
  },
  headerActions: {
    position: 'relative',
    // Add space for potential icons/badges
    width: 30, // Example fixed width
    height: 30, // Example fixed height
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationDot: {
    width: 10, // Smaller dot
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF6B6B', // Use a vibrant red for notification
    position: 'absolute',
    top: 0,
    right: 0,
    borderWidth: 2, // Border for visibility on dark background
    borderColor: '#1C1C1E',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF', // White text
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#B0B0B0', // Lighter gray
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -4, // Counteract statCard margin
  },
  statCard: {
    flex: 1,
    backgroundColor: '#3A3A3C', // Consistent card background
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000', // Consistent shadows
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#5856D6', // Consistent accent color
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#B0B0B0', // Lighter gray
    textTransform: 'uppercase',
    letterSpacing: 0.2,
  },

  // --- Categories List Styles ---
  categoriesSection: {
    flex: 1,
    backgroundColor: '#2C2C2E', // Slightly lighter dark background for this section
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 24,
    // Add shadow to the section itself for a lifted effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 }, // Shadow pointing upwards to lift the section
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF', // White text
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 40, // Ensure enough space at the bottom for scroll
  },
  separator: {
    height: 16, // Space between cards
    backgroundColor: 'transparent', // Make separator transparent if shadows provide enough visual separation
  },
  categoryCard: {
    borderRadius: 16, // Consistent border radius for cards
    overflow: 'hidden',
    marginBottom: 16, // Space between cards
    shadowColor: '#000', // Consistent shadows for individual cards
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, // Slightly less opaque than section shadow
    shadowRadius: 8,
    elevation: 5,
  },
  cardInner: { // Renamed from cardGradient, now the main background for the card content
    backgroundColor: '#3A3A3C', // Consistent card background
    padding: 20,
    minHeight: 140,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 16, // Consistent border radius
    justifyContent: 'center',
    alignItems: 'center',
    // Background color set dynamically by getCategoryColor
  },
  categoryLetter: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    // Color set dynamically by getCategoryColor
  },
  cardBadge: {
    backgroundColor: '#5856D6', // Consistent accent color for badge
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF', // White text
    letterSpacing: 0.5,
  },
  cardContent: {
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF', // White text
    textTransform: 'capitalize',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  categorySubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#B0B0B0', // Lighter gray
  },
  cardFooter: {
    marginTop: 'auto',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5856D6', // Consistent accent color
    textAlign: 'right',
  },
});
