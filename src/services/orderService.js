import api from './api';

export const createOrder = (data) => api.post('/orders', data);

export const getOrders = (params) => api.get('/orders', { params });

export const getOrderDetail = (id) => api.get(`/orders/${id}`);

export const confirmOrderPayment = (id, transactionLast4) =>
  api.post(`/orders/${id}/confirm-payment`, { transactionLast4 });
