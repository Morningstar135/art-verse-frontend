import api from './api';

export const sendOtp = (phone) => api.post('/auth/send-otp', { phone });
export const verifyOtp = (phone, code) => api.post('/auth/verify-otp', { phone, code });
export const forgotPassword = (phone) => api.post('/auth/forgot-password', { phone });
export const resetPassword = (phone, code, newPassword) =>
  api.post('/auth/reset-password', { phone, code, newPassword });
