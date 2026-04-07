import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/artworks', label: 'Artworks', icon: '🎨' },
  { to: '/admin/courses', label: 'Courses', icon: '🎓' },
  { to: '/admin/orders', label: 'Orders', icon: '📦' },
  { to: '/admin/announcements', label: 'Announcements', icon: '📢' },
];

const layoutStyle = {
  display: 'flex',
  minHeight: '100vh',
};

const sidebarStyle = {
  width: '220px',
  flexShrink: 0,
  backgroundColor: 'var(--color-surface)',
  color: 'var(--color-text)',
  display: 'flex',
  flexDirection: 'column',
  padding: 'var(--space-lg) 0',
};

const brandStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: '1.125rem',
  fontWeight: 700,
  color: 'var(--color-white)',
  padding: '0 var(--space-lg)',
  marginBottom: 'var(--space-xl)',
  letterSpacing: '0.02em',
};

const brandSubStyle = {
  fontSize: '0.75rem',
  color: 'rgba(255,255,255,0.5)',
  fontFamily: 'var(--font-primary)',
  fontWeight: 400,
  display: 'block',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  marginTop: '2px',
};

const navStyle = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
};

const navLinkBase = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-sm)',
  padding: 'var(--space-sm) var(--space-lg)',
  fontSize: '0.9375rem',
  fontWeight: 500,
  color: 'rgba(255,255,255,0.7)',
  textDecoration: 'none',
  transition: 'all var(--transition-fast)',
  borderLeft: '3px solid transparent',
};

const contentStyle = {
  flex: 1,
  backgroundColor: 'var(--color-bg)',
  overflow: 'auto',
};

const contentInnerStyle = {
  padding: 'var(--space-xl)',
  maxWidth: '1100px',
};

const footerStyle = {
  padding: 'var(--space-lg)',
  borderTop: '1px solid rgba(255,255,255,0.1)',
  marginTop: 'auto',
};

const logoutBtnStyle = {
  background: 'none',
  border: '1px solid rgba(255,255,255,0.3)',
  color: 'rgba(255,255,255,0.7)',
  padding: 'var(--space-xs) var(--space-md)',
  borderRadius: 'var(--radius-md)',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontFamily: 'var(--font-primary)',
  width: '100%',
  transition: 'all var(--transition-fast)',
};

function AdminLayout({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div style={layoutStyle}>
      <aside style={sidebarStyle}>
        <div style={brandStyle}>
          ArtVerse
          <span style={brandSubStyle}>Admin Panel</span>
        </div>

        <nav style={navStyle}>
          {navLinks.map(({ to, label, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              style={({ isActive }) => ({
                ...navLinkBase,
                color: isActive ? 'var(--color-white)' : 'rgba(255,255,255,0.7)',
                backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                borderLeftColor: isActive ? 'var(--color-accent)' : 'transparent',
              })}
            >
              <span>{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div style={footerStyle}>
          <button
            style={logoutBtnStyle}
            onClick={handleLogout}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-white)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      <main style={contentStyle}>
        <div style={contentInnerStyle}>
          {children}
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
