import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/formatters';

const containerStyle = {
  padding: '24px',
  backgroundColor: 'var(--color-surface)',
  borderRadius: '12px',
  border: '1px solid var(--color-border)',
  marginTop: '16px',
};

const rowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '12px',
};

const labelStyle = {
  fontSize: '0.9375rem',
  color: 'var(--color-text-light)',
};

const valueStyle = {
  fontSize: '0.9375rem',
  fontWeight: 600,
  color: 'var(--color-text)',
};

const totalRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingTop: '12px',
  borderTop: '1px solid var(--color-border)',
  marginBottom: '20px',
};

const totalLabelStyle = {
  fontSize: '1.125rem',
  fontWeight: 700,
  color: 'var(--color-text)',
};

const totalValueStyle = {
  fontSize: '1.25rem',
  fontWeight: 700,
  color: 'var(--color-accent)',
};

const checkoutLinkStyle = {
  display: 'block',
  width: '100%',
  padding: '14px',
  textAlign: 'center',
  backgroundColor: 'var(--color-accent)',
  color: '#fff',
  borderRadius: '8px',
  textDecoration: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  transition: 'opacity 0.2s',
  border: 'none',
  boxSizing: 'border-box',
};

function CartSummary({ items, total }) {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div style={containerStyle}>
      <div style={rowStyle}>
        <span style={labelStyle}>Items</span>
        <span style={valueStyle}>{itemCount}</span>
      </div>

      <div style={rowStyle}>
        <span style={labelStyle}>Subtotal</span>
        <span style={valueStyle}>{formatPrice(total)}</span>
      </div>

      <div style={totalRowStyle}>
        <span style={totalLabelStyle}>Total</span>
        <span style={totalValueStyle}>{formatPrice(total)}</span>
      </div>

      <Link
        to="/checkout"
        style={checkoutLinkStyle}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
      >
        Proceed to Checkout
      </Link>
    </div>
  );
}

export default CartSummary;
