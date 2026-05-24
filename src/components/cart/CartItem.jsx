import React from 'react';
import { formatPrice } from '../../utils/formatters';

const containerStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '16px',
  padding: '16px 48px 16px 16px',
  borderBottom: '1px solid var(--color-border)',
  position: 'relative',
};

const thumbnailStyle = {
  width: 72,
  height: 72,
  objectFit: 'cover',
  borderRadius: '8px',
  flexShrink: 0,
  backgroundColor: 'var(--color-bg)',
};

const infoStyle = {
  flex: 1,
  minWidth: 0,
};

const titleStyle = {
  fontFamily: 'var(--font-display, serif)',
  fontSize: '1rem',
  fontWeight: 600,
  color: 'var(--color-text)',
  margin: '0 0 8px 0',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const badgeContainerStyle = {
  display: 'flex',
  gap: '6px',
  flexWrap: 'wrap',
  marginBottom: '12px',
};

const badgeStyle = {
  display: 'inline-block',
  padding: '3px 10px',
  fontSize: '0.75rem',
  borderRadius: '4px',
  backgroundColor: 'var(--color-bg)',
  border: '1px solid var(--color-border)',
  color: 'var(--color-text-light)',
  fontWeight: 500,
  letterSpacing: '0.02em',
};

const quantityContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0',
};

const quantityBtnStyle = {
  width: 32,
  height: 32,
  border: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-bg)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1rem',
  fontWeight: 600,
  color: 'var(--color-text)',
  transition: 'all 0.15s ease',
  padding: 0,
  lineHeight: 1,
  fontFamily: 'var(--font-primary)',
};

const quantityValueStyle = {
  fontSize: '0.875rem',
  fontWeight: 600,
  minWidth: '36px',
  height: '32px',
  textAlign: 'center',
  lineHeight: '32px',
  borderTop: '1px solid var(--color-border)',
  borderBottom: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-surface)',
  color: 'var(--color-text)',
};

const priceContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  flexShrink: 0,
  gap: '4px',
  paddingTop: '4px',
};

const unitPriceStyle = {
  fontSize: '0.75rem',
  color: 'var(--color-text-light)',
};

const lineTotalStyle = {
  fontSize: '1.125rem',
  fontWeight: 700,
  color: 'var(--color-accent)',
};

const removeBtnStyle = {
  position: 'absolute',
  top: '12px',
  right: '12px',
  width: '28px',
  height: '28px',
  background: 'transparent',
  border: '1px solid transparent',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '1.25rem',
  color: 'var(--color-text-light)',
  padding: 0,
  lineHeight: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.15s ease',
};

function CartItem({ item, onUpdateQuantity, onRemove }) {
  const { artworkId, title, imageUrl, medium, size, quality, quantity, unitPrice, lineTotal } = item;

  const handleDecrease = () => {
    if (quantity > 1) {
      onUpdateQuantity(artworkId, medium, size, quality, quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < 10) {
      onUpdateQuantity(artworkId, medium, size, quality, quantity + 1);
    }
  };

  const handleRemove = () => {
    onRemove(artworkId, medium, size, quality);
  };

  return (
    <div style={containerStyle}>
      <img
        src={imageUrl}
        alt={title}
        style={thumbnailStyle}
      />

      <div style={infoStyle}>
        <h4 style={titleStyle}>{title}</h4>

        <div style={badgeContainerStyle}>
          <span style={badgeStyle}>{medium ? medium.charAt(0).toUpperCase() + medium.slice(1) : medium}</span>
          <span style={badgeStyle}>{size}</span>
          <span style={badgeStyle}>{quality ? quality.toUpperCase() : quality}</span>
        </div>

        <div style={quantityContainerStyle}>
          <button
            style={{
              ...quantityBtnStyle,
              borderRadius: '6px 0 0 6px',
              opacity: quantity <= 1 ? 0.3 : 1,
              cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
            }}
            onClick={handleDecrease}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            type="button"
          >
            &#8722;
          </button>
          <span style={quantityValueStyle}>{quantity}</span>
          <button
            style={{
              ...quantityBtnStyle,
              borderRadius: '0 6px 6px 0',
              opacity: quantity >= 10 ? 0.3 : 1,
              cursor: quantity >= 10 ? 'not-allowed' : 'pointer',
            }}
            onClick={handleIncrease}
            disabled={quantity >= 10}
            aria-label="Increase quantity"
            type="button"
          >
            &#43;
          </button>
        </div>
      </div>

      <div style={priceContainerStyle}>
        <span style={unitPriceStyle}>{formatPrice(unitPrice)} each</span>
        <span style={lineTotalStyle}>{formatPrice(lineTotal || unitPrice * quantity)}</span>
      </div>

      <button
        style={removeBtnStyle}
        onClick={handleRemove}
        aria-label={`Remove ${title} from cart`}
        title="Remove item"
        type="button"
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(177, 88, 70, 0.1)';
          e.currentTarget.style.borderColor = 'var(--color-accent)';
          e.currentTarget.style.color = 'var(--color-accent)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.borderColor = 'transparent';
          e.currentTarget.style.color = 'var(--color-text-light)';
        }}
      >
        &#215;
      </button>
    </div>
  );
}

export default CartItem;
