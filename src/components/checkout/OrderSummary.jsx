import React from 'react';
import { formatPrice } from '../../utils/formatters';

const containerStyle = {
  padding: '24px',
  backgroundColor: 'var(--color-surface)',
  borderRadius: '12px',
  border: '1px solid var(--color-border)',
};

const sectionTitleStyle = {
  fontFamily: 'var(--font-display, serif)',
  fontSize: '1.125rem',
  fontWeight: 600,
  color: 'var(--color-text)',
  marginBottom: '16px',
};

const itemRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  padding: '10px 0',
  borderBottom: '1px solid var(--color-border)',
};

const itemInfoStyle = {
  flex: 1,
};

const itemTitleStyle = {
  fontSize: '0.9375rem',
  fontWeight: 600,
  color: 'var(--color-text)',
  margin: '0 0 4px 0',
};

const itemConfigStyle = {
  fontSize: '0.8125rem',
  color: 'var(--color-text-light)',
};

const itemPriceStyle = {
  fontSize: '0.9375rem',
  fontWeight: 600,
  color: 'var(--color-text)',
  flexShrink: 0,
  marginLeft: '16px',
};

const dividerStyle = {
  height: '1px',
  backgroundColor: 'var(--color-border)',
  margin: '20px 0',
};

const addressContainerStyle = {
  marginBottom: '20px',
};

const addressLabelStyle = {
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: 'var(--color-text-light)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: '8px',
};

const addressTextStyle = {
  fontSize: '0.9375rem',
  color: 'var(--color-text)',
  lineHeight: 1.6,
};

const totalRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingTop: '16px',
  borderTop: '2px solid var(--color-border)',
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

function OrderSummary({ items, total, shippingAddress }) {
  return (
    <div style={containerStyle}>
      <h3 style={sectionTitleStyle}>Order Summary</h3>

      {/* Items list */}
      <div>
        {items.map((item, index) => {
          const price = item.unitPrice || item.price;
          const lineTotal = item.lineTotal || price * item.quantity;
          const displayMedium = item.medium ? item.medium.charAt(0).toUpperCase() + item.medium.slice(1) : item.medium;
          const displayQuality = item.quality ? item.quality.toUpperCase() : item.quality;

          return (
            <div
              key={`${item.artworkId}-${item.medium}-${item.size}-${item.quality}-${index}`}
              style={itemRowStyle}
            >
              <div style={itemInfoStyle}>
                <p style={itemTitleStyle}>{item.title}</p>
                <p style={itemConfigStyle}>
                  {displayMedium} / {item.size} / {displayQuality} &middot; Qty: {item.quantity}
                </p>
              </div>
              <span style={itemPriceStyle}>{formatPrice(lineTotal)}</span>
            </div>
          );
        })}
      </div>

      {/* Shipping address */}
      {shippingAddress && (
        <>
          <div style={dividerStyle} />
          <div style={addressContainerStyle}>
            <p style={addressLabelStyle}>Shipping To</p>
            <div style={addressTextStyle}>
              {shippingAddress.label && <strong>{shippingAddress.label}</strong>}
              {shippingAddress.label && <br />}
              {shippingAddress.line1}
              <br />
              {shippingAddress.line2 && (
                <>
                  {shippingAddress.line2}
                  <br />
                </>
              )}
              {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}
              <br />
              Phone: {shippingAddress.phone}
            </div>
          </div>
        </>
      )}

      {/* Total */}
      <div style={totalRowStyle}>
        <span style={totalLabelStyle}>Total</span>
        <span style={totalValueStyle}>{formatPrice(total)}</span>
      </div>
    </div>
  );
}

export default OrderSummary;
