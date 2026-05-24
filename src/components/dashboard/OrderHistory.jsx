import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Loader, EmptyState } from '../common';
import { formatPrice, formatDate } from '../../utils/formatters';

const containerStyle = {
  padding: 'var(--space-md) 0',
};

const cardStyle = {
  backgroundColor: 'var(--color-surface)',
  borderRadius: 'var(--radius-lg)',
  padding: 'var(--space-lg)',
  marginBottom: 'var(--space-md)',
  boxShadow: 'var(--shadow-sm)',
  transition: 'box-shadow var(--transition-base)',
  textDecoration: 'none',
  color: 'inherit',
  display: 'block',
};

const cardHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 'var(--space-sm)',
  flexWrap: 'wrap',
  gap: 'var(--space-sm)',
};

const orderNumberStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: '1.1rem',
  fontWeight: 600,
  color: 'var(--color-primary)',
};

const statusBadgeColors = {
  pending: { bg: 'rgba(255, 193, 7, 0.15)', color: '#ffc107' },
  confirmed: { bg: 'rgba(23, 162, 184, 0.15)', color: '#17a2b8' },
  processing: { bg: 'rgba(40, 167, 69, 0.15)', color: '#28a745' },
  shipped: { bg: 'rgba(0, 123, 255, 0.15)', color: '#5b9aff' },
  delivered: { bg: 'rgba(40, 167, 69, 0.15)', color: '#28a745' },
  cancelled: { bg: 'rgba(177, 88, 70, 0.15)', color: '#ff6b6b' },
};

const cardFooterStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 'var(--space-sm)',
  fontSize: '0.875rem',
  color: 'var(--color-text-light)',
};

const paginationStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 'var(--space-md)',
  marginTop: 'var(--space-xl)',
};

const pageBtnStyle = {
  padding: 'var(--space-xs) var(--space-md)',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-surface)',
  cursor: 'pointer',
  fontSize: '0.875rem',
  transition: 'background-color var(--transition-fast)',
};

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/orders', {
          params: { page, limit: 10 },
        });
        setOrders(response.data.orders || []);
        setPagination(response.data.pagination || null);
      } catch (err) {
        setError('Failed to load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [page]);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-xl)', color: '#c0392b' }}>
        {error}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        title="No orders yet"
        message="You haven't placed any orders. Browse our gallery to find art you love."
        action={{ label: 'Browse Gallery', onClick: () => window.location.href = '/' }}
      />
    );
  }

  return (
    <div style={containerStyle}>
      {orders.map((order) => {
        const statusColor = statusBadgeColors[order.status] || statusBadgeColors.pending;
        return (
          <Link
            key={order._id}
            to={`/orders/${order._id}`}
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
          >
            <div style={cardHeaderStyle}>
              <span style={orderNumberStyle}>{order.orderNumber}</span>
              <span
                style={{
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  backgroundColor: statusColor.bg,
                  color: statusColor.color,
                }}
              >
                {order.status}
              </span>
            </div>
            <div style={cardFooterStyle}>
              <span>{formatDate(order.createdAt)}</span>
              <span>
                {(order.items || []).length} item{(order.items || []).length !== 1 ? 's' : ''}
              </span>
              <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                {formatPrice(order.total)}
              </span>
            </div>
          </Link>
        );
      })}

      {pagination && pagination.totalPages > 1 && (
        <div style={paginationStyle}>
          <button
            style={{
              ...pageBtnStyle,
              opacity: pagination.hasPrevPage ? 1 : 0.5,
              cursor: pagination.hasPrevPage ? 'pointer' : 'not-allowed',
            }}
            disabled={!pagination.hasPrevPage}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>
          <span style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            style={{
              ...pageBtnStyle,
              opacity: pagination.hasNextPage ? 1 : 0.5,
              cursor: pagination.hasNextPage ? 'pointer' : 'not-allowed',
            }}
            disabled={!pagination.hasNextPage}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
