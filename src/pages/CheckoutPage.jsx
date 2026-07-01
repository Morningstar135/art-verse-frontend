import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import AddressForm from '../components/checkout/AddressForm';
import OrderSummary from '../components/checkout/OrderSummary';
import PaymentDetails from '../components/checkout/PaymentDetails';
import { Loader, EmptyState } from '../components/common';
import { formatPrice } from '../utils/formatters';
import * as orderService from '../services/orderService';

const pageStyle = {
  maxWidth: '720px',
  margin: '0 auto',
  padding: '32px 16px',
};

const headerStyle = {
  fontFamily: 'var(--font-display, serif)',
  fontSize: '1.75rem',
  fontWeight: 700,
  color: 'var(--color-text)',
  marginBottom: '8px',
};

const stepIndicatorStyle = {
  display: 'flex',
  gap: '24px',
  marginBottom: '32px',
};

const stepStyle = (active) => ({
  fontSize: '0.875rem',
  fontWeight: active ? 700 : 400,
  color: active ? 'var(--color-accent)' : 'var(--color-text-light)',
  paddingBottom: '8px',
  borderBottom: active ? '2px solid var(--color-accent)' : '2px solid transparent',
});

const errorStyle = {
  padding: '12px 16px',
  backgroundColor: 'rgba(177, 88, 70, 0.1)',
  border: '1px solid rgba(177, 88, 70, 0.3)',
  borderRadius: '8px',
  color: '#ff6b6b',
  fontSize: '0.875rem',
  marginBottom: '16px',
};

const backBtnStyle = {
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  color: 'var(--color-accent)',
  fontSize: '0.875rem',
  fontWeight: 600,
  padding: '0',
  marginBottom: '16px',
  fontFamily: 'var(--font-primary)',
};

const spacerStyle = {
  height: '20px',
};

function CheckoutPage() {
  const navigate = useNavigate();
  const { items, total, loading: cartLoading, clearCart } = useCart();

  const [step, setStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  // Snapshot items before cart is cleared
  const [savedItems, setSavedItems] = useState(null);
  const [savedTotal, setSavedTotal] = useState(null);

  const handleAddressSubmit = (address) => {
    setShippingAddress(address);
    setStep(2);
    setError('');
  };

  const handleProceedToPayment = () => {
    // Save cart snapshot and show payment section — NO DB call yet
    setSavedItems([...items]);
    setSavedTotal(total);
    setShowPayment(true);
  };

  const handlePaymentConfirm = async (transactionLast4) => {
    setProcessing(true);
    setError('');

    try {
      const response = await orderService.createOrder({
        shippingAddress,
        transactionLast4,
      });

      const data = response.data;
      setOrderData(data);
      clearCart();
      toast.success('Order placed successfully!');
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.errors?.[0]?.msg ||
        'Failed to create order. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setProcessing(false);
    }
  };

  if (cartLoading) {
    return (
      <div style={pageStyle}>
        <Loader size="lg" />
      </div>
    );
  }

  if ((!items || items.length === 0) && !orderData && !savedItems) {
    return (
      <div style={pageStyle}>
        <h1 style={headerStyle}>Checkout</h1>
        <EmptyState
          title="Nothing to checkout"
          message="Your cart is empty. Add some artwork prints to continue."
          action={{
            label: 'Browse Gallery',
            onClick: () => navigate('/gallery'),
          }}
        />
      </div>
    );
  }

  // Order placed successfully
  if (orderData) {
    return (
      <div style={pageStyle}>
        <h1 style={headerStyle}>Order Confirmed!</h1>
        <div style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: '12px',
          padding: '32px',
          textAlign: 'center',
          border: '1px solid var(--color-border)',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>&#10003;</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '8px' }}>
            Thank you for your order!
          </h2>
          <p style={{ color: 'var(--color-text-light)', marginBottom: '16px' }}>
            Order <strong>#{orderData.orderNumber}</strong> — {formatPrice(orderData.amount)}
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', marginBottom: '24px' }}>
            Our team will verify your payment and update the status.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/dashboard')}
            style={{ padding: '12px 32px' }}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const displayItems = savedItems || items;
  const displayTotal = savedTotal ?? total;

  return (
    <div style={pageStyle}>
      <h1 style={headerStyle}>Checkout</h1>

      <div style={stepIndicatorStyle}>
        <span style={stepStyle(step === 1)}>1. Shipping Address</span>
        <span style={stepStyle(step === 2)}>2. Review & Pay</span>
      </div>

      {error && <div style={errorStyle}>{error}</div>}

      {step === 1 && (
        <AddressForm onSubmit={handleAddressSubmit} initialValues={shippingAddress} />
      )}

      {step === 2 && (
        <>
          <button style={backBtnStyle} onClick={() => { setStep(1); setShowPayment(false); }} type="button">
            &larr; Back to Address
          </button>

          <OrderSummary items={displayItems} total={displayTotal} shippingAddress={shippingAddress} />

          <div style={spacerStyle} />

          {!showPayment ? (
            <button
              className="btn btn-primary btn-full"
              style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
              onClick={handleProceedToPayment}
            >
              Proceed to Payment
            </button>
          ) : (
            <PaymentDetails
              amount={displayTotal}
              onPaymentConfirm={handlePaymentConfirm}
              processing={processing}
            />
          )}
        </>
      )}
    </div>
  );
}

export default CheckoutPage;
