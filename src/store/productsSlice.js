import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProducts, fetchProductById } from '../api/products';
import { getFavorites } from '../utils/storage';

export const loadProducts = createAsyncThunk(
  'products/loadProducts',
  async ({ limit = 10, offset = 0 } = {}) => {
    const result = await fetchProducts(limit, offset);
    return result;
  }
);

export const loadProduct = createAsyncThunk(
  'products/loadProduct',
  async (id) => {
    const result = await fetchProductById(id);
    return result;
  }
);

export const loadFavoritesFromStorage = createAsyncThunk(
  'products/loadFavoritesFromStorage',
  async () => {
    const favorites = await getFavorites();
    return favorites;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    total: 0,
    status: 'idle',
    error: null,
    favorites: [],
    page: 0,
  },
  reducers: {
    setFavorites(state, action) {
      state.favorites = action.payload;
    },
    addFavoriteLocal(state, action) {
      state.favorites.unshift(action.payload);
    },
    removeFavoriteLocal(state, action) {
      state.favorites = state.favorites.filter((p) => p.id !== action.payload);
    },
    resetItems(state) {
      state.items = [];
      state.page = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        const { data, total } = action.payload;
        state.items = [...state.items, ...data];
        state.total = total;
        state.status = 'succeeded';
        state.page += 1;
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(loadFavoritesFromStorage.fulfilled, (state, action) => {
        state.favorites = action.payload;
      });
  },
});

export const {
  setFavorites,
  addFavoriteLocal,
  removeFavoriteLocal,
  resetItems,
} = productsSlice.actions;

export default productsSlice.reducer;
