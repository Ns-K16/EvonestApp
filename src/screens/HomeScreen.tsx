import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, FlatList } from 'react-native';
import { Header } from '../components/Header';
import { PropertyCard } from '../components/PropertyCard';
import { COLORS, SIZES } from '../constants/theme';

const MOCK_PROPERTIES = [
  {
    id: '1',
    title: 'Modern Luxury Villa with Pool',
    location: 'Istanbul, Beşiktaş',
    price: '$450,000',
    beds: 4,
    baths: 3,
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600',
  },
  {
    id: '2',
    title: 'Cozy Downtown Apartment',
    location: 'Izmir, Alsancak',
    price: '$180,000',
    beds: 2,
    baths: 1,
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600',
  },
  {
    id: '3',
    title: 'Scenic Sea View Penthouse',
    location: 'Antalya, Lara',
    price: '$320,000',
    beds: 3,
    baths: 2,
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600',
  },
];

export const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Header subtitle="Welcome to Evonest" title="Find Your Dream Home" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search location, property, price..."
            placeholderTextColor={COLORS.subtext}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Properties</Text>
          <Text style={styles.seeAll}>See All</Text>
        </View>

        {MOCK_PROPERTIES.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onPress={() => console.log(`Selected ${property.title}`)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    paddingBottom: 24,
  },
  searchContainer: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
  },
  searchInput: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.text,
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    marginBottom: SIZES.margin,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  seeAll: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
});
