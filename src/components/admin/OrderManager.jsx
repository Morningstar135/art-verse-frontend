import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Modal, Button, Loader, EmptyState } from '../common';
import { formatPrice, formatDate } from '../../utils/formatters';
import {
  adminGetOrders,
  adminGetOrderDetail,
  adminUpdateOrderStatus,
  adminUpdatePaymentStatus,
} from '../../services/adminService';

const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const VALID_TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

const STATUS_COLORS = {
  pending: { bg: '#fef9c3', color: '#854d0e' },
  confirmed: { bg: '#dbeafe', color: '#1e40af' },
  processing: { bg: '#ede9fe', color: '#5b21b6' },
  shipped: { bg: '#d1fae5', color: '#065f46' },
  delivered: { bg: '#dcfce7', color: '#166534' },
  cancelled: { bg: '#fee2e2', color: '#991b1b' },
};

const PAYMENT_COLORS = {
  pending: { bg: '#fef9c3', color: '#854d0e' },
  paid: { bg: '#dcfce7', color: '#166534' },
  failed: { bg: '#fee2e2', color: '#991b1b' },
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '0.9rem',
};

const thStyle = {
  textAlign: 'left',
  padding: 'var(--space-sm) var(--space-md)',
  borderBottom: '2px solid var(--color-border)',
  color: 'var(--color-text-light)',
  fontSize: '0.8125rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const tdStyle = {
  padding: 'var(--space-sm) var(--space-md)',
  borderBottom: '1px solid var(--color-border)',
  verticalAlign: 'middle',
};

function StatusBadge({ status, colorMap }) {
  const colors = (colorMap || STATUS_COLORS)[status] || { bg: '#f3f4f6', color: '#374151' };
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: '999px',
      fontSize: '0.75rem',
      fontWeight: 600,
      backgroundColor: colors.bg,
      color: colors.color,
      textTransform: 'capitalize',
    }}>
      {status}
    </span>
  );
}

function OrderDetailView({ orderId, onClose }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [newPaymentStatus, setNewPaymentStatus] = useState('');
  const [updatingPayment, setUpdatingPayment] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await adminGetOrderDetail(orderId);
        setOrder(data);
      } catch {
        toast.error('Failed to load order');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [orderId]);

  async function handleStatusUpdate() {
    if (!newStatus) return;
    setUpdating(true);
    try {
      await adminUpdateOrderStatus(orderId, newStatus);
      setOrder((o) => ({ ...o, status: newStatus }));
      setNewStatus('');
      toast.success(`Order status updated to "${newStatus}"`);
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  }

  async function handlePaymentStatusUpdate() {
    if (!newPaymentStatus) return;
    setUpdatingPayment(true);
    try {
      await adminUpdatePaymentStatus(orderId, newPaymentStatus);
      setOrder((o) => ({ ...o, paymentStatus: newPaymentStatus }));
      setNewPaymentStatus('');
      toast.success(`Payment status updated to "${newPaymentStatus}"`);
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to update payment status');
    } finally {
      setUpdatingPayment(false);
    }
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}><Loader /></div>;
  if (!order) return <p>Order not found.</p>;

  const allowedNextStatuses = VALID_TRANSITIONS[order.status] || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
        <div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-light)', marginBottom: 4 }}>Order Number</div>
          <div style={{ fontWeight: 600 }}>{order.orderNumber}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-light)', marginBottom: 4 }}>Date</div>
          <div>{formatDate(order.createdAt)}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-light)', marginBottom: 4 }}>Customer</div>
          <div>{order.customer?.name || 'N/A'}</div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-light)' }}>{order.customer?.email}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-light)', marginBottom: 4 }}>Total</div>
          <div style={{ fontWeight: 600 }}>{formatPrice(order.total)}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-light)', marginBottom: 4 }}>Status</div>
          <StatusBadge status={order.status} />
        </div>
        <div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-light)', marginBottom: 4 }}>Payment</div>
          <StatusBadge status={order.paymentStatus} colorMap={PAYMENT_COLORS} />
        </div>
      </div>

      {order.transactionLast4 && (
        <div style={{ backgroundColor: 'var(--color-bg)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-light)', marginBottom: 'var(--space-xs)', textTransform: 'uppercase' }}>Transaction Last 4 Digits</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '4px', color: 'var(--color-accent)' }}>
            {order.transactionLast4}
          </div>
        </div>
      )}

      {/* Payment Status Update */}
      <div style={{ backgroundColor: 'var(--color-bg)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
        <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-light)', marginBottom: 'var(--space-sm)', textTransform: 'uppercase' }}>Update Payment Status</div>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
          <select
            className="form-input"
            style={{ maxWidth: 200 }}
            value={newPaymentStatus}
            onChange={(e) => setNewPaymentStatus(e.target.value)}
          >
            <option value="">Select...</option>
            {['paid', 'failed', 'refunded'].filter(s => s !== order.paymentStatus).map((s) => (
              <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>
            ))}
          </select>
          <Button variant="primary" size="sm" loading={updatingPayment} onClick={handlePaymentStatusUpdate} disabled={!newPaymentStatus}>
            Update Payment
          </Button>
        </div>
      </div>

      {order.shippingAddress && (
        <div style={{ backgroundColor: 'var(--color-bg)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-light)', marginBottom: 'var(--space-xs)', textTransform: 'uppercase' }}>Shipping Address</div>
          <div style={{ fontSize: '0.9rem' }}>
            {order.shippingAddress.line1}{order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ''}
            <br />
            {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
            <br />
            Phone: {order.shippingAddress.phone}
          </div>
        </div>
      )}

      <div>
        <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-light)', marginBottom: 'var(--space-sm)', textTransform: 'uppercase' }}>Items</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          {(order.items || []).map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: 'var(--space-sm) var(--space-md)',
                backgroundColor: 'var(--color-bg)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div>
                <div style={{ fontWeight: 500 }}>{item.title || item.artworkId}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-light)' }}>
                  {item.medium} · {item.size} · {item.quality} × {item.quantity}
                </div>
              </div>
              <div style={{ fontWeight: 600 }}>{formatPrice(item.lineTotal || item.unitPrice * item.quantity)}</div>
            </div>
          ))}
        </div>
      </div>

      {allowedNextStatuses.length > 0 && (
        <div style={{
          borderTop: '1px solid var(--color-border)',
          paddingTop: 'var(--space-md)',
          display: 'flex',
          gap: 'var(--space-sm)',
          alignItems: 'center',
        }}>
          <select
            className="form-input"
            style={{ maxWidth: 200 }}
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          >
            <option value="">Update status...</option>
            {allowedNextStatuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <Button variant="primary" size="sm" loading={updating} onClick={handleStatusUpdate} disabled={!newStatus}>
            Update
          </Button>
        </div>
      )}
    </div>
  );
}

function OrderManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [detailOrderId, setDetailOrderId] = useState(null);

  useEffect(() => {
    loadOrders();
  }, [page, statusFilter]);

  async function loadOrders() {
    setLoading(true);
    try {
      const params = { page };
      if (statusFilter) params.status = statusFilter;
      const res = await adminGetOrders(params);
      setOrders(res.orders || []);
      setPagination(res.pagination || null);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }

  function handleFilterChange(value) {
    setStatusFilter(value);
    setPage(1);
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-lg)' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-primary)', margin: 0 }}>
          Orders
        </h2>
        <select
          className="form-input"
          style={{ maxWidth: 180 }}
          value={statusFilter}
          onChange={(e) => handleFilterChange(e.target.value)}
        >
          <option value="">All Statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Loader /></div>
      ) : orders.length === 0 ? (
        <EmptyState title="No orders found" description={statusFilter ? `No orders with status "${statusFilter}".` : 'No orders placed yet.'} />
      ) : (
        <>
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <table style={tableStyle}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-bg)' }}>
                  <th style={thStyle}>Order #</th>
                  <th style={thStyle}>Customer</th>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}>Items</th>
                  <th style={thStyle}>Total</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Payment</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                  >
                    <td style={{ ...tdStyle, fontWeight: 600, fontSize: '0.875rem' }}>{order.orderNumber}</td>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 500 }}>{order.customer?.name || 'N/A'}</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-light)' }}>{order.customer?.email}</div>
                    </td>
                    <td style={{ ...tdStyle, fontSize: '0.875rem' }}>{formatDate(order.createdAt)}</td>
                    <td style={tdStyle}>{order.itemCount}</td>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{formatPrice(order.total)}</td>
                    <td style={tdStyle}><StatusBadge status={order.status} /></td>
                    <td style={tdStyle}><StatusBadge status={order.paymentStatus} colorMap={PAYMENT_COLORS} /></td>
                    <td style={tdStyle}>
                      <Button variant="outline" size="sm" onClick={() => setDetailOrderId(order.id)}>
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-sm)', marginTop: 'var(--space-lg)' }}>
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </Button>
              <span style={{ padding: 'var(--space-sm)', fontSize: '0.875rem', color: 'var(--color-text-light)' }}>
                Page {page} of {pagination.totalPages}
              </span>
              <Button variant="outline" size="sm" disabled={page >= pagination.totalPages} onClick={() => setPage((p) => p + 1)}>
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Order Detail Modal */}
      <Modal
        isOpen={!!detailOrderId}
        onClose={() => { setDetailOrderId(null); loadOrders(); }}
        title="Order Detail"
      >
        {detailOrderId && (
          <OrderDetailView
            orderId={detailOrderId}
            onClose={() => setDetailOrderId(null)}
          />
        )}
      </Modal>
    </div>
  );
}

export default OrderManager;
