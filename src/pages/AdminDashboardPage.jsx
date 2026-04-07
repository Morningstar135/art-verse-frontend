import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import { Loader } from '../components/common';
import { formatPrice, formatDate } from '../utils/formatters';
import { getDashboardStats } from '../services/adminService';

const STATUS_COLORS = {
  pending: { bg: '#fef9c3', color: '#854d0e' },
  confirmed: { bg: '#dbeafe', color: '#1e40af' },
  processing: { bg: '#ede9fe', color: '#5b21b6' },
  shipped: { bg: '#d1fae5', color: '#065f46' },
  delivered: { bg: '#dcfce7', color: '#166534' },
  cancelled: { bg: '#fee2e2', color: '#991b1b' },
};

const statCards = [
  { key: 'totalOrders', label: 'Total Orders', icon: '📦' },
  { key: 'totalRevenue', label: 'Total Revenue', icon: '💰', isPrice: true },
  { key: 'totalArtworks', label: 'Artworks', icon: '🎨' },
  { key: 'totalCourses', label: 'Courses', icon: '🎓' },
  { key: 'totalEnrollments', label: 'Enrollments', icon: '🎫' },
];

function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch {
        // stats will remain null
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <AdminLayout>
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--color-primary)', margin: 0, marginBottom: 'var(--space-xs)' }}>
          Dashboard
        </h1>
        <p style={{ color: 'var(--color-text-light)', fontSize: '0.9375rem', margin: 0 }}>
          Overview of your ArtVerse platform
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <Loader />
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
            gap: 'var(--space-md)',
            marginBottom: 'var(--space-xl)',
          }}>
            {statCards.map(({ key, label, icon, isPrice }) => (
              <div
                key={key}
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-lg)',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div style={{ fontSize: '1.75rem', marginBottom: 'var(--space-sm)' }}>{icon}</div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  marginBottom: '4px',
                }}>
                  {isPrice ? formatPrice(stats?.[key] || 0) : (stats?.[key] ?? 0).toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Recent Orders */}
          <div style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--color-border)',
            overflow: 'hidden',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-lg) var(--space-lg) var(--space-md)',
              borderBottom: '1px solid var(--color-border)',
            }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', color: 'var(--color-primary)', margin: 0 }}>
                Recent Orders
              </h2>
              <Link
                to="/admin/orders"
                style={{ fontSize: '0.875rem', color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 500 }}
              >
                View All →
              </Link>
            </div>

            {!stats?.recentOrders || stats.recentOrders.length === 0 ? (
              <div style={{ padding: 'var(--space-xl)', textAlign: 'center', color: 'var(--color-text-light)' }}>
                No orders yet.
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-bg)' }}>
                    {['Order #', 'Customer', 'Date', 'Total', 'Status'].map((h) => (
                      <th key={h} style={{
                        textAlign: 'left',
                        padding: 'var(--space-sm) var(--space-lg)',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        color: 'var(--color-text-light)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        borderBottom: '1px solid var(--color-border)',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order) => {
                    const statusColors = STATUS_COLORS[order.status] || { bg: '#f3f4f6', color: '#374151' };
                    return (
                      <tr
                        key={order.id}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                      >
                        <td style={{ padding: 'var(--space-sm) var(--space-lg)', borderBottom: '1px solid var(--color-border)', fontWeight: 600, fontSize: '0.875rem' }}>
                          {order.orderNumber}
                        </td>
                        <td style={{ padding: 'var(--space-sm) var(--space-lg)', borderBottom: '1px solid var(--color-border)' }}>
                          <div style={{ fontWeight: 500 }}>{order.customer?.name || 'N/A'}</div>
                          <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-light)' }}>{order.customer?.email}</div>
                        </td>
                        <td style={{ padding: 'var(--space-sm) var(--space-lg)', borderBottom: '1px solid var(--color-border)', fontSize: '0.875rem' }}>
                          {formatDate(order.createdAt)}
                        </td>
                        <td style={{ padding: 'var(--space-sm) var(--space-lg)', borderBottom: '1px solid var(--color-border)', fontWeight: 600 }}>
                          {formatPrice(order.total)}
                        </td>
                        <td style={{ padding: 'var(--space-sm) var(--space-lg)', borderBottom: '1px solid var(--color-border)' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '2px 10px',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            backgroundColor: statusColors.bg,
                            color: statusColors.color,
                            textTransform: 'capitalize',
                          }}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
}

export default AdminDashboardPage;
