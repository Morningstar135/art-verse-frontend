import api from './api';

export const createOrder = (data) => api.post('/orders', data);

export const verifyPayment = (orderId, data) =>
  api.post(`/orders/${orderId}/verify-payment`, data);

export const getOrders = (params) => api.get('/orders', { params });

export const getOrderDetail = (id) => api.get(`/orders/${id}`);
