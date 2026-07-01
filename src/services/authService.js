import api from './api';

export const sendOtp = (email) => api.post('/auth/send-otp', { email });
export const verifyOtp = (email, code) => api.post('/auth/verify-otp', { email, code });
export const forgotPassword = (email) => api.post('/auth/forgot-password', { email });
export const resetPassword = (email, code, newPassword) =>
  api.post('/auth/reset-password', { email, code, newPassword });
