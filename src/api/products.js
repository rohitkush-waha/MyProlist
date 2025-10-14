import axios from 'axios';

const BASE_URL = 'https://fakestoreapi.com';

export const fetchProducts = async (limit = 10, offset = 0) => {
  try {
    const response = await axios.get(`${BASE_URL}/products`);
    const products = response.data || [];

    return {
      data: products.slice(offset, offset + limit),
      total: products.length,
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchProductById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};
