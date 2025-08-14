import React from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, SafeAreaView } from 'react-native';
import { colors } from '../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

/**
 * A reusable header component for the application.
 *
 * @param {string} title The title to display in the header.
 * @param {function} onBackPress An optional function to handle a back button press.
 */
export default function Header({ title, onBackPress }) {
  return (
    <SafeAreaView style={styles.headerContainer}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface} />
      <View style={styles.header}>
        {/* Conditionally render the back button */}
        {onBackPress ? (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
        ) : (
          // Placeholder to keep the title centered when there's no back button
          <View style={styles.backButtonPlaceholder} />
        )}
        <Text style={styles.title}>{title}</Text>
        {/* Placeholder on the right to balance the back button */}
        <View style={styles.backButtonPlaceholder} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: colors.surface,
    elevation: 4, // Subtle shadow for Android
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    // Added a small amount of paddingTop to move the header content down
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  backButton: {
    paddingRight: 16,
  },
  backButtonPlaceholder: {
    width: 24, // This width matches the back button icon size to keep the title centered
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    flex: 1, // Ensures the title takes up the available space
    textAlign: 'center',
  },
});
