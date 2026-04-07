import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import OrderHistory from '../components/dashboard/OrderHistory';
import EnrolledCourses from '../components/dashboard/EnrolledCourses';

const pageStyle = {
  maxWidth: '900px',
  margin: '0 auto',
  padding: 'var(--space-xl) var(--space-md)',
};

const headerStyle = {
  marginBottom: 'var(--space-xl)',
};

const greetingStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: '1.75rem',
  fontWeight: 700,
  color: 'var(--color-primary)',
  marginBottom: 'var(--space-xs)',
};

const subtitleStyle = {
  fontSize: '0.9375rem',
  color: 'var(--color-text-light)',
};

const tabContainerStyle = {
  display: 'flex',
  gap: 'var(--space-xs)',
  borderBottom: '2px solid var(--color-border)',
  marginBottom: 'var(--space-lg)',
};

const tabBaseStyle = {
  padding: 'var(--space-sm) var(--space-lg)',
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  fontSize: '0.9375rem',
  fontWeight: 500,
  color: 'var(--color-text-light)',
  position: 'relative',
  transition: 'color var(--transition-fast)',
  fontFamily: 'var(--font-primary)',
  paddingBottom: 'calc(var(--space-sm) + 2px)',
  marginBottom: '-2px',
};

function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');

  const tabs = [
    { key: 'orders', label: 'My Orders' },
    { key: 'courses', label: 'My Courses' },
  ];

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={greetingStyle}>
          Welcome{user?.name ? `, ${user.name}` : ''}
        </h1>
        <p style={subtitleStyle}>
          Manage your orders and enrolled courses from your dashboard.
        </p>
      </div>

      <div style={tabContainerStyle}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            style={{
              ...tabBaseStyle,
              color:
                activeTab === tab.key
                  ? 'var(--color-accent)'
                  : 'var(--color-text-light)',
              borderBottom:
                activeTab === tab.key
                  ? '2px solid var(--color-accent)'
                  : '2px solid transparent',
              fontWeight: activeTab === tab.key ? 600 : 500,
            }}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'orders' && <OrderHistory />}
      {activeTab === 'courses' && <EnrolledCourses />}
    </div>
  );
}

export default DashboardPage;
