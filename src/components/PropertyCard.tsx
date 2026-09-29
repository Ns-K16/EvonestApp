import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  imageUrl: string;
}

interface PropertyCardProps {
  property: Property;
  onPress: () => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <Image source={{ uri: property.imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.price}>{property.price}</Text>
          <Text style={styles.location}>{property.location}</Text>
        </View>
        <Text style={styles.title} numberOfLines={1}>{property.title}</Text>
        <View style={styles.features}>
          <Text style={styles.featureText}>🛏 {property.beds} Beds</Text>
          <Text style={styles.featureText}>🛁 {property.baths} Baths</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    marginHorizontal: SIZES.padding,
    marginBottom: SIZES.margin,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: COLORS.border,
  },
  content: {
    padding: SIZES.padding,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  location: {
    fontSize: 12,
    color: COLORS.subtext,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  features: {
    flexDirection: 'row',
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
  },
  featureText: {
    fontSize: 12,
    color: COLORS.subtext,
  },
});
