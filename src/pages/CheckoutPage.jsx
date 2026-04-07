import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import AddressForm from '../components/checkout/AddressForm';
import OrderSummary from '../components/checkout/OrderSummary';
import PaymentButton from '../components/checkout/PaymentButton';
import { Loader, EmptyState } from '../components/common';
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
  backgroundColor: 'rgba(230, 57, 70, 0.1)',
  border: '1px solid rgba(230, 57, 70, 0.3)',
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
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleAddressSubmit = (address) => {
    setShippingAddress(address);
    setStep(2);
    setError('');
  };

  const handlePlaceOrder = async () => {
    setProcessing(true);
    setError('');

    try {
      const response = await orderService.createOrder({
        shippingAddress,
      });

      setOrderData(response.data);
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.errors?.[0]?.msg ||
        'Failed to create order. Please try again.';
      setError(message);
    } finally {
      setProcessing(false);
    }
  };

  const handlePaymentSuccess = async (paymentData) => {
    setProcessing(true);
    setError('');

    try {
      await orderService.verifyPayment(orderData.orderId, paymentData);
      clearCart();
      navigate(`/orders/${orderData.orderId}/confirmation`);
    } catch (err) {
      const message =
        err.response?.data?.error || 'Payment verification failed. Please contact support.';
      setError(message);
    } finally {
      setProcessing(false);
    }
  };

  const handlePaymentFailure = (reason) => {
    setError(reason || 'Payment was not completed.');
  };

  if (cartLoading) {
    return (
      <div style={pageStyle}>
        <Loader size="lg" />
      </div>
    );
  }

  if ((!items || items.length === 0) && !orderData) {
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
          <button style={backBtnStyle} onClick={() => setStep(1)} type="button">
            &larr; Back to Address
          </button>

          <OrderSummary items={items} total={total} shippingAddress={shippingAddress} />

          <div style={spacerStyle} />

          {!orderData ? (
            <button
              className="btn btn-primary btn-full"
              style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
              onClick={handlePlaceOrder}
              disabled={processing}
            >
              {processing ? 'Creating Order...' : 'Place Order & Pay'}
            </button>
          ) : (
            <PaymentButton
              amount={orderData.amount}
              orderId={orderData.orderId}
              razorpayOrderId={orderData.razorpayOrderId}
              razorpayKey={orderData.key}
              onSuccess={handlePaymentSuccess}
              onFailure={handlePaymentFailure}
            />
          )}
        </>
      )}
    </div>
  );
}

export default CheckoutPage;
