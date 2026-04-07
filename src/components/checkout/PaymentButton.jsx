import React, { useState, useEffect } from 'react';
import Button from '../common/Button';

function PaymentButton({ amount, orderId, razorpayOrderId, razorpayKey, onSuccess, onFailure }) {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if Razorpay script is already loaded
    if (window.Razorpay) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay SDK');
      if (onFailure) onFailure('Failed to load payment gateway');
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup: only remove if we added it
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, [onFailure]);

  const handlePayment = () => {
    if (!window.Razorpay) {
      if (onFailure) onFailure('Payment gateway not available');
      return;
    }

    setLoading(true);

    const options = {
      key: razorpayKey,
      amount,
      currency: 'INR',
      name: 'ArtVerse',
      description: 'Print Purchase',
      order_id: razorpayOrderId,
      handler: (response) => {
        setLoading(false);
        onSuccess({
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        });
      },
      modal: {
        ondismiss: () => {
          setLoading(false);
          if (onFailure) onFailure('Payment cancelled');
        },
      },
      theme: {
        color: '#e94560',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', (response) => {
      setLoading(false);
      if (onFailure) onFailure(response.error?.description || 'Payment failed');
    });
    rzp.open();
  };

  return (
    <Button
      variant="primary"
      fullWidth
      onClick={handlePayment}
      disabled={!scriptLoaded}
      loading={loading}
    >
      {scriptLoaded ? 'Pay Now' : 'Loading Payment Gateway...'}
    </Button>
  );
}

export default PaymentButton;
