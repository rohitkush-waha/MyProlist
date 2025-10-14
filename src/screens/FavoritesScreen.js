import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import ProductCard from '../components/ProductCard';
import { getFavorites, removeFavorite } from '../utils/storage';

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadFavorites = async () => {
      const storedFavorites = await getFavorites();
      setFavorites(storedFavorites);
      dispatch({ type: 'products/setFavorites', payload: storedFavorites });
    };

    const unsubscribe = navigation.addListener('focus', loadFavorites);
    loadFavorites();

    return unsubscribe;
  }, [navigation, dispatch]);

  const removeFromFavorites = async (id) => {
    const updated = await removeFavorite(id);
    setFavorites(updated);
    dispatch({ type: 'products/setFavorites', payload: updated });
  };

  if (favorites.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Text style={styles.emptyText}>You haven’t added any favorites yet 😢</Text>
      </SafeAreaView>
    );
  }

  return (
    <FlatList
      data={favorites}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
        <ProductCard
          product={item}
          onPress={() =>
            navigation.navigate('Home', {
              screen: 'Details',
              params: { productId: item.id },
            })
          }
          style={styles.card}
          rightElement={
            <TouchableOpacity
              onPress={() => removeFromFavorites(item.id)}
              style={styles.removeBtn}
            >
              <Text style={styles.removeBtnText}>Remove</Text>
            </TouchableOpacity>
          }
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 10,
    paddingBottom: 20,
  },
  card: {
    marginVertical: 6,
  },
  removeBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#FF4C4C',
    borderRadius: 8,
  },
  removeBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
});
