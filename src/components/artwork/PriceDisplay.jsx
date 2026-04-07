import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice } from '../../utils/formatters';

const containerStyle = {
  padding: 'var(--space-md) 0',
  minHeight: '48px',
  display: 'flex',
  alignItems: 'center',
};

const priceStyle = {
  fontSize: '1.75rem',
  fontWeight: 700,
  fontFamily: 'var(--font-display)',
  color: 'var(--color-accent)',
};

const totalLabelStyle = {
  fontSize: '0.8125rem',
  color: 'var(--color-text-light)',
  marginTop: '2px',
};

const unavailableStyle = {
  fontSize: '0.9375rem',
  color: 'var(--color-text-light)',
  fontStyle: 'italic',
};

function PriceDisplay({ pricing = [], config }) {
  const match = pricing.find(
    (p) => p.medium === config.medium && p.size === config.size && p.quality === config.quality
  );

  const unitPrice = match ? match.price : null;
  const totalPrice = unitPrice !== null ? unitPrice * config.quantity : null;

  return (
    <div style={containerStyle}>
      <AnimatePresence mode="wait">
        {totalPrice !== null ? (
          <motion.div
            key={`${config.medium}-${config.size}-${config.quality}-${config.quantity}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <div style={priceStyle}>{formatPrice(totalPrice)}</div>
            {config.quantity > 1 && (
              <div style={totalLabelStyle}>
                {formatPrice(unitPrice)} × {config.quantity}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="unavailable"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <span style={unavailableStyle}>Price unavailable for this combination</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PriceDisplay;
