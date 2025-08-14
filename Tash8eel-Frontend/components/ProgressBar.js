// components/ProgressBar.js
import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function ProgressBar({ progress = 0, barColor }) {
  // clamp progress to [0, 1]
  const p = Math.max(0, Math.min(progress, 1));

  return (
    <View style={styles.outer}>
      <View style={[styles.inner, { flex: p, backgroundColor: barColor }]} />
      <View style={[styles.placeholder, { flex: 1 - p }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flexDirection: 'row',
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    overflow: 'hidden'
  },
  inner: {
    // backgroundColor is passed via barColor prop
  },
  placeholder: {
    backgroundColor: '#ddd'
  }
});