import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Header } from '../components/Header';
import { COLORS, SIZES } from '../constants/theme';

export const ExploreScreen = () => {
  return (
    <View style={styles.container}>
      <Header subtitle="Discover" title="Explore Map & Filters" />
      <View style={styles.content}>
        <Text style={styles.placeholderIcon}>🗺️</Text>
        <Text style={styles.title}>Interactive Map & Advanced Filters</Text>
        <Text style={styles.subtitle}>Explore properties in your favorite neighborhoods with real-time location data.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding * 2,
  },
  placeholderIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.subtext,
    textAlign: 'center',
    lineHeight: 20,
  },
});
