import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function ProductCard({ product, onPress, rightElement }) {
  // When user taps the card
  const handlePress = () => {
    if (onPress) {
      onPress(product);
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.8}>
      {/* Product Image */}
      <Image
        source={{ uri: product.image }}
        style={styles.image}
        resizeMode="contain"
      />

      {/* Product Details */}
      <View style={styles.info}>
        <Text numberOfLines={2} style={styles.title}>
          {product.title}
        </Text>
        <Text style={styles.price}>₹ {Number(product.price).toFixed(2)}</Text>
      </View>

      {/* Optional right-side element (like a heart icon) */}
      {rightElement && <View style={styles.right}>{rightElement}</View>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 10,
    borderRadius: 12,
    alignItems: 'center',

    // Small shadow for iOS
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,

    // Elevation for Android
    elevation: 3,
  },

  image: {
    width: 80,
    height: 80,
    marginRight: 12,
    borderRadius: 8,
  },

  info: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },

  price: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '700',
    color: '#007AFF',
  },

  right: {
    marginLeft: 8,
  },
});
