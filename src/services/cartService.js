import api from './api';

export const getCart = () => api.get('/cart');

export const addCartItem = (item) => api.post('/cart/items', item);

export const updateCartItem = (artworkId, data) =>
  api.put(`/cart/items/${artworkId}`, data);

export const removeCartItem = (artworkId, params) =>
  api.delete(`/cart/items/${artworkId}`, { params });
