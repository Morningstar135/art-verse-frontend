import React, { useState } from 'react';
import { formatPrice } from '../../utils/formatters';

const containerStyle = {
  backgroundColor: 'var(--color-surface, #1a1a2e)',
  borderRadius: '12px',
  padding: '24px',
  border: '1px solid var(--color-border, rgba(255,255,255,0.1))',
};

const titleStyle = {
  fontFamily: 'var(--font-display, serif)',
  fontSize: '1.25rem',
  fontWeight: 700,
  color: 'var(--color-text)',
  marginBottom: '4px',
};

const subtitleStyle = {
  fontSize: '0.875rem',
  color: 'var(--color-text-light)',
  marginBottom: '20px',
};

const tabsStyle = {
  display: 'flex',
  gap: '0',
  marginBottom: '20px',
  borderBottom: '1px solid var(--color-border, rgba(255,255,255,0.1))',
};

const tabStyle = (active) => ({
  padding: '10px 16px',
  fontSize: '0.875rem',
  fontWeight: active ? 600 : 400,
  color: active ? 'var(--color-accent)' : 'var(--color-text-light)',
  background: 'transparent',
  border: 'none',
  borderBottom: active ? '2px solid var(--color-accent)' : '2px solid transparent',
  cursor: 'pointer',
  fontFamily: 'var(--font-primary)',
});

const sectionStyle = {
  marginBottom: '16px',
};

const labelStyle = {
  fontSize: '0.75rem',
  fontWeight: 600,
  color: 'var(--color-text-light)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: '6px',
};

const valueStyle = {
  fontSize: '0.95rem',
  color: 'var(--color-text)',
  fontWeight: 500,
  padding: '8px 12px',
  backgroundColor: 'rgba(255,255,255,0.05)',
  borderRadius: '6px',
  fontFamily: 'monospace',
  wordBreak: 'break-all',
};

const qrContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  padding: '16px 0',
};

const qrImageStyle = {
  width: '280px',
  height: '280px',
  borderRadius: '12px',
  backgroundColor: '#fff',
  padding: '8px',
};

const noteStyle = {
  fontSize: '0.8rem',
  color: 'var(--color-text-light)',
  backgroundColor: 'rgba(233, 69, 96, 0.1)',
  border: '1px solid rgba(233, 69, 96, 0.2)',
  borderRadius: '8px',
  padding: '12px',
  lineHeight: 1.5,
  marginTop: '16px',
};

const orderRefStyle = {
  fontSize: '0.85rem',
  color: 'var(--color-accent)',
  fontWeight: 600,
  marginBottom: '16px',
  padding: '10px 12px',
  backgroundColor: 'rgba(233, 69, 96, 0.1)',
  borderRadius: '8px',
  textAlign: 'center',
};

function PaymentDetails({ orderNumber, amount }) {
  const [activeTab, setActiveTab] = useState('upi');

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>Payment Details</h3>
      <p style={subtitleStyle}>
        Please complete your payment using any of the methods below
      </p>

      <div style={orderRefStyle}>
        Order #{orderNumber} &mdash; Total: {formatPrice(amount)}
      </div>

      <div style={tabsStyle}>
        <button style={tabStyle(activeTab === 'upi')} onClick={() => setActiveTab('upi')} type="button">
          UPI / QR
        </button>
        <button style={tabStyle(activeTab === 'bank')} onClick={() => setActiveTab('bank')} type="button">
          Bank Transfer
        </button>
      </div>

      {activeTab === 'upi' && (
        <>
          <div style={qrContainerStyle}>
            <img src="/upi-qr.jpeg" alt="UPI QR Code" style={qrImageStyle} />
          </div>

          <div style={sectionStyle}>
            <div style={labelStyle}>GPay Number</div>
            <div style={valueStyle}>+91 8667397995</div>
          </div>

          <div style={sectionStyle}>
            <div style={labelStyle}>UPI ID</div>
            <div style={valueStyle}>thina1999boss@okhdfcbank</div>
          </div>
        </>
      )}

      {activeTab === 'bank' && (
        <>
          <div style={sectionStyle}>
            <div style={labelStyle}>Account Holder Name</div>
            <div style={valueStyle}>Thillainathan</div>
          </div>

          <div style={sectionStyle}>
            <div style={labelStyle}>Bank Name</div>
            <div style={valueStyle}>Tamilnadu Mercantile Bank</div>
          </div>

          <div style={sectionStyle}>
            <div style={labelStyle}>Account Number</div>
            <div style={valueStyle}>328100050310835</div>
          </div>

          <div style={sectionStyle}>
            <div style={labelStyle}>IFSC Code</div>
            <div style={valueStyle}>TMBL0000328</div>
          </div>
        </>
      )}

      <div style={noteStyle}>
        <strong>Important:</strong> Please mention your order number <strong>#{orderNumber}</strong> in
        the payment remarks/note. Your order will be confirmed once payment is verified by our team.
      </div>
    </div>
  );
}

export default PaymentDetails;
