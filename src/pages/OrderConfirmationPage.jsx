import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader } from '../components/common';
import * as orderService from '../services/orderService';
import { formatPrice } from '../utils/formatters';

const pageStyle = {
  maxWidth: '640px',
  margin: '0 auto',
  padding: '48px 16px',
  textAlign: 'center',
};

const checkmarkContainerStyle = {
  width: 80,
  height: 80,
  borderRadius: '50%',
  background: '#10b981',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 24px',
};

const checkmarkStyle = {
  color: '#fff',
  fontSize: '2.5rem',
  lineHeight: 1,
};

const titleStyle = {
  fontFamily: 'var(--font-display, serif)',
  fontSize: '1.75rem',
  fontWeight: 700,
  color: 'var(--color-text)',
  marginBottom: '8px',
};

const subtitleStyle = {
  fontSize: '1rem',
  color: 'var(--color-text-light)',
  marginBottom: '32px',
};

const orderNumberStyle = {
  display: 'inline-block',
  padding: '8px 20px',
  backgroundColor: 'var(--color-bg)',
  border: '1px solid var(--color-border)',
  borderRadius: '8px',
  fontFamily: 'monospace',
  fontSize: '1.125rem',
  fontWeight: 700,
  color: 'var(--color-text)',
  marginBottom: '32px',
};

const cardStyle = {
  backgroundColor: 'var(--color-surface)',
  borderRadius: '12px',
  border: '1px solid var(--color-border)',
  padding: '24px',
  marginBottom: '24px',
  textAlign: 'left',
};

const sectionTitleStyle = {
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: 'var(--color-text-light)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: '12px',
};

const itemRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 0',
  borderBottom: '1px solid var(--color-border)',
};

const itemTitleStyle = {
  fontSize: '0.9375rem',
  fontWeight: 500,
  color: 'var(--color-text)',
};

const itemDetailStyle = {
  fontSize: '0.8125rem',
  color: 'var(--color-text-light)',
};

const itemPriceStyle = {
  fontSize: '0.9375rem',
  fontWeight: 600,
  color: 'var(--color-text)',
};

const totalRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingTop: '12px',
  marginTop: '8px',
  borderTop: '2px solid var(--color-border)',
};

const totalLabelStyle = {
  fontSize: '1rem',
  fontWeight: 700,
  color: 'var(--color-text)',
};

const totalValueStyle = {
  fontSize: '1.125rem',
  fontWeight: 700,
  color: 'var(--color-accent)',
};

const linkStyle = {
  display: 'inline-block',
  padding: '14px 32px',
  backgroundColor: 'var(--color-accent)',
  color: '#fff',
  borderRadius: '8px',
  textDecoration: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  marginTop: '8px',
};

const errorStyle = {
  padding: '16px',
  backgroundColor: 'rgba(177, 88, 70, 0.1)',
  border: '1px solid rgba(177, 88, 70, 0.3)',
  borderRadius: '8px',
  color: '#ff6b6b',
  fontSize: '0.9375rem',
  textAlign: 'center',
};

function OrderConfirmationPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchOrder() {
      try {
        const response = await orderService.getOrderDetail(id);
        setOrder(response.data);
      } catch (err) {
        setError('Failed to load order details.');
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div style={pageStyle}>
        <Loader size="lg" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={pageStyle}>
        <div style={errorStyle}>{error || 'Order not found.'}</div>
        <div style={{ marginTop: '24px' }}>
          <Link to="/gallery" style={linkStyle}>
            Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
      >
        <div style={checkmarkContainerStyle}>
          <span style={checkmarkStyle}>&#10003;</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h1 style={titleStyle}>Order Confirmed!</h1>
        <p style={subtitleStyle}>
          Thank you for your purchase. Your artwork prints are being prepared.
        </p>
        <div style={orderNumberStyle}>Order #{order.orderNumber}</div>
      </motion.div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div style={cardStyle}>
          <p style={sectionTitleStyle}>Items</p>
          {order.items.map((item, index) => {
            const displayMedium = item.medium ? item.medium.charAt(0).toUpperCase() + item.medium.slice(1) : item.medium;
            const displayQuality = item.quality ? item.quality.toUpperCase() : item.quality;
            return (
              <div key={index} style={itemRowStyle}>
                <div>
                  <p style={itemTitleStyle}>{item.title}</p>
                  <p style={itemDetailStyle}>
                    {displayMedium} / {item.size} / {displayQuality} &middot; Qty: {item.quantity}
                  </p>
                </div>
                <span style={itemPriceStyle}>{formatPrice(item.lineTotal)}</span>
              </div>
            );
          })}

          <div style={totalRowStyle}>
            <span style={totalLabelStyle}>Total</span>
            <span style={totalValueStyle}>{formatPrice(order.total)}</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Link to="/dashboard" style={linkStyle}>
          Go to Dashboard
        </Link>
      </motion.div>
    </div>
  );
}

export default OrderConfirmationPage;
