import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { fetchProductById } from '../api/products';
import { addFavorite, removeFavorite, getFavorites } from '../utils/storage';
import { useDispatch } from 'react-redux';

export default function ProductDetailsScreen({ route }) {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      const fetchedProduct = await fetchProductById(productId);
      setProduct(fetchedProduct);

      const favorites = await getFavorites();
      const isFavorite = favorites.some(fav => fav.id === fetchedProduct.id);
      setIsFav(isFavorite);

      setLoading(false);
    };

    loadProduct();
  }, [productId]);

  const toggleFavorite = async () => {
    if (isFav) {
      await removeFavorite(product.id);
      dispatch({ type: 'products/setFavorites', payload: await getFavorites() });
      setIsFav(false);
    } else {
      await addFavorite(product);
      dispatch({ type: 'products/setFavorites', payload: await getFavorites() });
      setIsFav(true);
    }
  };

  if (loading) {
    return <ActivityIndicator style={styles.loader} size="large" color="#007AFF" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>₹ {Number(product.price).toFixed(2)}</Text>
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.desc}>{product.description}</Text>

        <TouchableOpacity
          style={[styles.favBtn, isFav ? styles.favBtnActive : styles.favBtnInactive]}
          onPress={toggleFavorite}
        >
          <Text style={styles.favBtnText}>
            {isFav ? 'Remove from Favorites' : 'Add to Favorites'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  container: { padding: 16, backgroundColor: '#F9F9F9' },
  imageContainer: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  image: { width: '80%', height: '80%', borderRadius: 12 },
  content: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  price: { fontSize: 18, fontWeight: '600', color: '#007AFF', marginBottom: 6 },
  category: { fontSize: 14, fontStyle: 'italic', color: '#555', marginBottom: 12 },
  desc: { fontSize: 16, lineHeight: 22, color: '#333' },
  favBtn: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favBtnActive: { backgroundColor: '#FFD700' },
  favBtnInactive: { backgroundColor: '#007AFF' },
  favBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
