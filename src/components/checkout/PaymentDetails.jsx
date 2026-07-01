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

const amountStyle = {
  fontSize: '1.1rem',
  color: 'var(--color-accent)',
  fontWeight: 700,
  marginBottom: '16px',
  padding: '10px 12px',
  backgroundColor: 'rgba(233, 69, 96, 0.1)',
  borderRadius: '8px',
  textAlign: 'center',
};

const txnInputStyle = {
  width: '100%',
  padding: '12px 14px',
  fontSize: '1.1rem',
  fontFamily: 'monospace',
  letterSpacing: '8px',
  textAlign: 'center',
  backgroundColor: 'rgba(255,255,255,0.05)',
  border: '1px solid var(--color-border, rgba(255,255,255,0.2))',
  borderRadius: '8px',
  color: 'var(--color-text)',
  outline: 'none',
  boxSizing: 'border-box',
};

const submitBtnStyle = (disabled) => ({
  width: '100%',
  marginTop: '12px',
  padding: '14px',
  fontSize: '1rem',
  fontWeight: 600,
  backgroundColor: disabled ? 'rgba(233, 69, 96, 0.4)' : 'var(--color-accent)',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  cursor: disabled ? 'not-allowed' : 'pointer',
  fontFamily: 'var(--font-primary)',
});

function PaymentDetails({ amount, onPaymentConfirm, processing }) {
  const [activeTab, setActiveTab] = useState('upi');
  const [txnLast4, setTxnLast4] = useState('');

  const handleTxnChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    setTxnLast4(val);
  };

  const handleSubmit = () => {
    if (txnLast4.length !== 4 || processing) return;
    onPaymentConfirm(txnLast4);
  };

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>Payment Details</h3>
      <p style={subtitleStyle}>
        Complete your payment using any method below, then enter the last 4 digits of your transaction ID
      </p>

      <div style={amountStyle}>
        Total: {formatPrice(amount)}
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
        <strong>Important:</strong> Your order will be created and confirmed once you submit the transaction details below.
      </div>

      <div style={{ marginTop: '20px', padding: '16px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid var(--color-border, rgba(255,255,255,0.1))' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '8px' }}>
          Enter last 4 digits of your Transaction ID
        </div>
        <input
          type="text"
          inputMode="numeric"
          maxLength={4}
          placeholder="0000"
          value={txnLast4}
          onChange={handleTxnChange}
          disabled={processing}
          style={txnInputStyle}
        />
        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginTop: '6px' }}>
          You can find this in your UPI app or bank statement
        </div>
        <button
          onClick={handleSubmit}
          disabled={txnLast4.length !== 4 || processing}
          style={submitBtnStyle(txnLast4.length !== 4 || processing)}
          type="button"
        >
          {processing ? 'Placing Order...' : 'Submit & Place Order'}
        </button>
      </div>
    </div>
  );
}

export default PaymentDetails;
