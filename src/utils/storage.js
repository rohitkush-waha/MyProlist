import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'FAVORITES_v1';
const CART_KEY = 'CART_v1';

export const getFavorites = async () => {
  const stored = await AsyncStorage.getItem(FAVORITES_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveFavorites = async (favorites) => {
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
};

export const addFavorite = async (product) => {
  const current = await getFavorites();
  const alreadyAdded = current.some((item) => item.id === product.id);

  if (!alreadyAdded) {
    const updated = [product, ...current];
    await saveFavorites(updated);
    return updated;
  }

  return current;
};

export const removeFavorite = async (id) => {
  const current = await getFavorites();
  const updated = current.filter((item) => item.id !== id);
  await saveFavorites(updated);
  return updated;
};
