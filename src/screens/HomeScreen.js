import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, ActivityIndicator, RefreshControl, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import { loadProducts, resetItems, loadFavoritesFromStorage } from '../store/productsSlice';
import { addFavorite, removeFavorite, getFavorites } from '../utils/storage';

const PAGE_SIZE = 6;

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.products.items);
  const total = useSelector((state) => state.products.total);
  const status = useSelector((state) => state.products.status);
  const favorites = useSelector((state) => state.products.favorites);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    dispatch(resetItems());
    dispatch(loadProducts({ limit: PAGE_SIZE, offset: 0 }));
    dispatch(loadFavoritesFromStorage());
  }, [dispatch]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    dispatch(resetItems());
    await dispatch(loadProducts({ limit: PAGE_SIZE, offset: 0 }));
    setRefreshing(false);
  }, [dispatch]);

  const loadMore = () => {
    if (items.length < total) {
      dispatch(loadProducts({ limit: PAGE_SIZE, offset: items.length }));
    }
  };

  const handlePress = (product) => {
    navigation.navigate('Details', { productId: product.id });
  };

  const toggleFavorite = async (product) => {
    const favs = await getFavorites();
    const exists = favs.find((p) => p.id === product.id);

    if (exists) {
      const updatedFavorites = await removeFavorite(product.id);
      dispatch({ type: 'products/setFavorites', payload: updatedFavorites });
    } else {
      const updatedFavorites = await addFavorite(product);
      dispatch({ type: 'products/setFavorites', payload: updatedFavorites });
    }
  };

  const filteredItems = query
    ? items.filter((product) => product.title.toLowerCase().includes(query.toLowerCase()))
    : items;

  return (
    <>
      <SearchBar value={query} onChange={setQuery} style={styles.searchBar} />

      {status === 'loading' && items.length === 0 ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={filteredItems.length === 0 ? styles.flatListEmpty : styles.flatListContent}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={handlePress}
              style={styles.card}
              rightElement={
                <TouchableOpacity onPress={() => toggleFavorite(item)} style={styles.favoriteBtn}>
                  <Text style={{ fontSize: 20, color: favorites.find((f) => f.id === item.id) ? '#FFD700' : '#999' }}>
                    {favorites.find((f) => f.id === item.id) ? '★' : '☆'}
                  </Text>
                </TouchableOpacity>
              }
            />
          )}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListFooterComponent={() => (items.length < total ? <ActivityIndicator style={{ margin: 20 }} /> : null)}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No products found 😢</Text>
            </View>
          )}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    margin: 10,
    borderRadius: 10,
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  flatListContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  flatListEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    padding: 10,
  },
  favoriteBtn: {
    padding: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#777',
    textAlign: 'center',
  },
});
