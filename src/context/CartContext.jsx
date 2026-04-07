import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + (item.price || item.unitPrice || 0) * item.quantity, 0);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }
    try {
      setLoading(true);
      const res = await api.get('/cart');
      setItems(res.data.items || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  async function addToCart(artworkId, medium, size, quality, quantity = 1) {
    const res = await api.post('/cart/items', { artworkId, medium, size, quality, quantity });
    setItems(res.data.items || []);
    return res.data;
  }

  async function updateQuantity(artworkId, medium, size, quality, quantity) {
    const res = await api.put(`/cart/items/${artworkId}`, { medium, size, quality, quantity });
    setItems(res.data.items || []);
    return res.data;
  }

  async function removeItem(artworkId, medium, size, quality) {
    const res = await api.delete(`/cart/items/${artworkId}`, {
      params: { medium, size, quality },
    });
    setItems(res.data.items || []);
    return res.data;
  }

  function clearCart() {
    setItems([]);
  }

  const value = {
    items,
    itemCount,
    total,
    loading,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    fetchCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartContext;
