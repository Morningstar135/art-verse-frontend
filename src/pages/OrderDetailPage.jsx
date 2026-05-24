import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Loader } from '../components/common';
import { formatPrice, formatDate } from '../utils/formatters';

const pageStyle = {
  maxWidth: '800px',
  margin: '0 auto',
  padding: 'var(--space-xl) var(--space-md)',
};

const backLinkStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--space-xs)',
  color: 'var(--color-accent)',
  textDecoration: 'none',
  fontSize: '0.9375rem',
  fontWeight: 500,
  marginBottom: 'var(--space-lg)',
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 'var(--space-xl)',
  flexWrap: 'wrap',
  gap: 'var(--space-sm)',
};

const orderTitleStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: '1.5rem',
  fontWeight: 700,
  color: 'var(--color-primary)',
};

const sectionStyle = {
  backgroundColor: 'var(--color-surface)',
  borderRadius: 'var(--radius-lg)',
  padding: 'var(--space-lg)',
  marginBottom: 'var(--space-lg)',
  boxShadow: 'var(--shadow-sm)',
};

const sectionTitleStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: '1.1rem',
  fontWeight: 600,
  color: 'var(--color-primary)',
  marginBottom: 'var(--space-md)',
};

const STATUS_STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

const timelineContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'relative',
  padding: 'var(--space-md) 0',
};

const itemRowStyle = {
  display: 'flex',
  gap: 'var(--space-md)',
  alignItems: 'center',
  padding: 'var(--space-md) 0',
  borderBottom: '1px solid var(--color-border)',
};

const itemImageStyle = {
  width: '64px',
  height: '64px',
  objectFit: 'cover',
  borderRadius: 'var(--radius-md)',
  flexShrink: 0,
};

const itemDetailsStyle = {
  flex: 1,
};

const itemTitleStyle = {
  fontWeight: 600,
  fontSize: '0.9375rem',
  color: 'var(--color-primary)',
  marginBottom: '4px',
};

const itemMetaStyle = {
  fontSize: '0.8125rem',
  color: 'var(--color-text-light)',
};

const addressLineStyle = {
  fontSize: '0.9375rem',
  color: 'var(--color-text)',
  lineHeight: 1.6,
};

const summaryRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: 'var(--space-xs) 0',
  fontSize: '0.9375rem',
};

const statusBadgeColors = {
  pending: { bg: 'rgba(255, 193, 7, 0.15)', color: '#ffc107' },
  confirmed: { bg: 'rgba(23, 162, 184, 0.15)', color: '#17a2b8' },
  processing: { bg: 'rgba(40, 167, 69, 0.15)', color: '#28a745' },
  shipped: { bg: 'rgba(0, 123, 255, 0.15)', color: '#5b9aff' },
  delivered: { bg: 'rgba(40, 167, 69, 0.15)', color: '#28a745' },
  cancelled: { bg: 'rgba(177, 88, 70, 0.15)', color: '#ff6b6b' },
  paid: { bg: 'rgba(40, 167, 69, 0.15)', color: '#28a745' },
  failed: { bg: 'rgba(177, 88, 70, 0.15)', color: '#ff6b6b' },
};

function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrder() {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/orders/${id}`);
        setOrder(response.data);
      } catch (err) {
        setError('Failed to load order details.');
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  if (loading) return <Loader fullPage />;

  if (error || !order) {
    return (
      <div style={pageStyle}>
        <Link to="/dashboard" style={backLinkStyle}>
          &larr; Back to Dashboard
        </Link>
        <div style={{ textAlign: 'center', padding: 'var(--space-xl)', color: '#c0392b' }}>
          {error || 'Order not found'}
        </div>
      </div>
    );
  }

  const currentStepIndex = STATUS_STEPS.indexOf(order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div style={pageStyle}>
      <Link to="/dashboard" style={backLinkStyle}>
        &larr; Back to Dashboard
      </Link>

      <div style={headerStyle}>
        <h1 style={orderTitleStyle}>Order {order.orderNumber}</h1>
        <span style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>
          Placed on {formatDate(order.createdAt)}
        </span>
      </div>

      {/* Status Timeline */}
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Order Status</h2>
        {isCancelled ? (
          <div
            style={{
              textAlign: 'center',
              padding: 'var(--space-md)',
              backgroundColor: 'rgba(177, 88, 70, 0.15)',
              borderRadius: 'var(--radius-md)',
              color: '#ff6b6b',
              fontWeight: 600,
            }}
          >
            This order has been cancelled
          </div>
        ) : (
          <div style={timelineContainerStyle}>
            {/* Progress line behind the steps */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '10%',
                right: '10%',
                height: '3px',
                backgroundColor: 'var(--color-border)',
                transform: 'translateY(-50%)',
                zIndex: 0,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '10%',
                width: `${Math.max(0, currentStepIndex) * 20}%`,
                height: '3px',
                backgroundColor: 'var(--color-accent)',
                transform: 'translateY(-50%)',
                zIndex: 1,
                transition: 'width 0.5s ease',
              }}
            />
            {STATUS_STEPS.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              return (
                <div
                  key={step}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    zIndex: 2,
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      width: isCurrent ? '20px' : '14px',
                      height: isCurrent ? '20px' : '14px',
                      borderRadius: '50%',
                      backgroundColor: isCompleted
                        ? 'var(--color-accent)'
                        : 'var(--color-border)',
                      border: isCurrent
                        ? '3px solid var(--color-accent)'
                        : 'none',
                      boxShadow: isCurrent
                        ? '0 0 0 4px rgba(var(--color-accent-rgb, 200, 155, 60), 0.2)'
                        : 'none',
                      transition: 'all var(--transition-base)',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      marginTop: 'var(--space-xs)',
                      textTransform: 'capitalize',
                      fontWeight: isCurrent ? 600 : 400,
                      color: isCompleted
                        ? 'var(--color-primary)'
                        : 'var(--color-text-light)',
                    }}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Items */}
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>
          Items ({(order.items || []).length})
        </h2>
        {(order.items || []).map((item, index) => (
          <div
            key={index}
            style={{
              ...itemRowStyle,
              borderBottom:
                index === order.items.length - 1
                  ? 'none'
                  : '1px solid var(--color-border)',
            }}
          >
            <img src={item.imageUrl} alt={item.title} style={itemImageStyle} />
            <div style={itemDetailsStyle}>
              <div style={itemTitleStyle}>{item.title}</div>
              <div style={itemMetaStyle}>
                {item.medium ? item.medium.charAt(0).toUpperCase() + item.medium.slice(1) : item.medium} | {item.size} | {item.quality ? item.quality.toUpperCase() : item.quality} | Qty: {item.quantity}
              </div>
            </div>
            <div style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
              {formatPrice(item.lineTotal)}
            </div>
          </div>
        ))}
      </div>

      {/* Shipping Address */}
      {order.shippingAddress && (
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Shipping Address</h2>
          <div style={addressLineStyle}>
            {order.shippingAddress.label && (
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                {order.shippingAddress.label}
              </div>
            )}
            <div>{order.shippingAddress.line1}</div>
            {order.shippingAddress.line2 && (
              <div>{order.shippingAddress.line2}</div>
            )}
            <div>
              {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
              {order.shippingAddress.pincode}
            </div>
            <div style={{ marginTop: '4px' }}>
              Phone: {order.shippingAddress.phone}
            </div>
          </div>
        </div>
      )}

      {/* Payment & Total */}
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Payment Summary</h2>
        <div style={summaryRowStyle}>
          <span>Payment Status</span>
          <span
            style={{
              padding: '2px 10px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'capitalize',
              backgroundColor: (statusBadgeColors[order.paymentStatus] || statusBadgeColors.pending).bg,
              color: (statusBadgeColors[order.paymentStatus] || statusBadgeColors.pending).color,
            }}
          >
            {order.paymentStatus}
          </span>
        </div>
        <div style={summaryRowStyle}>
          <span>Subtotal</span>
          <span>{formatPrice(order.subtotal)}</span>
        </div>
        <div
          style={{
            ...summaryRowStyle,
            borderTop: '2px solid var(--color-border)',
            marginTop: 'var(--space-sm)',
            paddingTop: 'var(--space-sm)',
            fontWeight: 700,
            fontSize: '1.1rem',
          }}
        >
          <span>Total</span>
          <span style={{ color: 'var(--color-accent)' }}>
            {formatPrice(order.total)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailPage;
