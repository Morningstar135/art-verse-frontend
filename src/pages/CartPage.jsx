import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import { Loader, EmptyState } from '../components/common';

const pageStyle = {
  maxWidth: '800px',
  margin: '0 auto',
  padding: '32px 16px',
};

const headerStyle = {
  fontFamily: 'var(--font-display, serif)',
  fontSize: '1.75rem',
  fontWeight: 700,
  color: 'var(--color-text)',
  marginBottom: '24px',
};

const cartListStyle = {
  background: 'var(--color-surface)',
  borderRadius: '12px',
  border: '1px solid var(--color-border)',
  overflow: 'hidden',
};

function CartPage() {
  const { items, total, updateQuantity, removeItem, loading } = useCart();

  if (loading) {
    return (
      <div style={pageStyle}>
        <Loader size="lg" />
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div style={pageStyle}>
        <h1 style={headerStyle}>Your Cart</h1>
        <EmptyState
          title="Your cart is empty"
          message="Discover beautiful artwork in our gallery and add prints to your cart."
          action={{
            label: 'Browse Gallery',
            onClick: () => (window.location.href = '/gallery'),
          }}
        />
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <h1 style={headerStyle}>Your Cart</h1>

      <div style={cartListStyle}>
        {items.map((item) => (
          <CartItem
            key={`${item.artworkId}-${item.medium}-${item.size}-${item.quality}`}
            item={{
              ...item,
              unitPrice: item.unitPrice || item.price,
              lineTotal: item.lineTotal || (item.unitPrice || item.price) * item.quantity,
            }}
            onUpdateQuantity={updateQuantity}
            onRemove={removeItem}
          />
        ))}
      </div>

      <CartSummary items={items} total={total} />
    </div>
  );
}

export default CartPage;
