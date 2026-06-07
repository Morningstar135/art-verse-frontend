import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  // On mount, check for existing token and fetch user
  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        setUser(response.data.user || response.data);
      } catch (err) {
        // Token invalid or expired
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  async function login(phone, password) {
    const response = await api.post('/auth/login', { phone, password });
    const { token, refreshToken, user: userData } = response.data;
    localStorage.setItem('token', token);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    setUser(userData);
    return userData;
  }

  async function register(name, phone, password) {
    const response = await api.post('/auth/register', { name, phone, password });
    const { token, refreshToken, user: userData } = response.data;
    localStorage.setItem('token', token);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    setUser(userData);
    return userData;
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setUser(null);
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
