import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const headerStyle = {
  position: 'sticky',
  top: 0,
  zIndex: 100,
  backgroundColor: 'rgba(253, 246, 238, 0.92)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  borderBottom: '1px solid var(--color-border)',
};

const navContainerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 var(--space-md)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '64px',
};

const logoStyle = {
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
};

const logoImgStyle = {
  height: '40px',
  width: 'auto',
};

const navLinksStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-lg)',
};

const navLinkStyle = {
  color: 'var(--color-text)',
  textDecoration: 'none',
  fontSize: '0.9375rem',
  fontWeight: 500,
  transition: 'color var(--transition-fast)',
};

const actionsStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-md)',
};

const iconBtnStyle = {
  position: 'relative',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: 'var(--color-text)',
  fontSize: '1.25rem',
  display: 'flex',
  alignItems: 'center',
  padding: '6px',
  borderRadius: 'var(--radius-md)',
  transition: 'background-color var(--transition-fast)',
};

const badgeStyle = {
  position: 'absolute',
  top: '-2px',
  right: '-4px',
  backgroundColor: 'var(--color-accent)',
  color: 'var(--color-white)',
  fontSize: '0.625rem',
  fontWeight: 700,
  width: '18px',
  height: '18px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const dropdownStyle = {
  position: 'absolute',
  top: '100%',
  right: 0,
  marginTop: '8px',
  backgroundColor: 'var(--color-surface)',
  borderRadius: 'var(--radius-md)',
  boxShadow: 'var(--shadow-lg)',
  border: '1px solid var(--color-border)',
  minWidth: '180px',
  overflow: 'hidden',
  zIndex: 200,
};

const dropdownItemStyle = {
  display: 'block',
  width: '100%',
  padding: '10px 16px',
  fontSize: '0.875rem',
  color: 'var(--color-text)',
  textDecoration: 'none',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'background-color var(--transition-fast)',
};

const mobileMenuBtnStyle = {
  display: 'none',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: 'var(--color-text)',
  fontSize: '1.5rem',
  padding: '4px',
};

const mobileOverlayStyle = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(58, 42, 30, 0.3)',
  zIndex: 150,
};

const mobileDrawerStyle = {
  position: 'fixed',
  top: 0,
  right: 0,
  width: '280px',
  height: '100%',
  backgroundColor: 'var(--color-surface)',
  zIndex: 200,
  padding: 'var(--space-xl)',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-md)',
  boxShadow: 'var(--shadow-xl)',
};

const responsiveStyles = `
  @media (max-width: 768px) {
    .header-nav-links,
    .header-desktop-actions { display: none !important; }
    .header-mobile-btn { display: flex !important; }
  }
`;

function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const cartCount = 0;

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate('/');
  }

  return (
    <>
      <style>{responsiveStyles}</style>
      <header style={headerStyle}>
        <nav style={navContainerStyle}>
          {/* Logo */}
          <Link to="/" style={logoStyle}>
            <img src="/logo.jpeg" alt="Dheena Arts" style={logoImgStyle} />
          </Link>

          {/* Desktop Nav Links */}
          <div className="header-nav-links" style={navLinksStyle}>
            <Link to="/" style={navLinkStyle}>Gallery</Link>
            <Link to="/courses" style={navLinkStyle}>Courses</Link>
          </div>

          {/* Desktop Actions */}
          <div className="header-desktop-actions" style={actionsStyle}>
            <Link to="/cart" style={iconBtnStyle} aria-label="Cart">
              <FiShoppingCart />
              {cartCount > 0 && <span style={badgeStyle}>{cartCount}</span>}
            </Link>

            {isAuthenticated ? (
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button
                  style={{ ...iconBtnStyle, gap: '4px' }}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-label="User menu"
                >
                  <FiUser />
                  <FiChevronDown style={{ fontSize: '0.875rem' }} />
                </button>
                {dropdownOpen && (
                  <div style={dropdownStyle}>
                    <Link
                      to="/dashboard"
                      style={dropdownItemStyle}
                      onClick={() => setDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        style={dropdownItemStyle}
                        onClick={() => setDropdownOpen(false)}
                      >
                        Admin
                      </Link>
                    )}
                    <button
                      style={{ ...dropdownItemStyle, color: 'var(--color-error)' }}
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="header-mobile-btn"
            style={mobileMenuBtnStyle}
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <FiMenu />
          </button>
        </nav>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <>
          <div style={mobileOverlayStyle} onClick={() => setMobileOpen(false)} />
          <div style={mobileDrawerStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={logoStyle}><img src="/logo.jpeg" alt="Dheena Arts" style={{ ...logoImgStyle, height: '32px' }} /></span>
              <button
                style={{ ...mobileMenuBtnStyle, display: 'flex' }}
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <FiX />
              </button>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)' }} />
            <Link to="/" style={navLinkStyle} onClick={() => setMobileOpen(false)}>Gallery</Link>
            <Link to="/courses" style={navLinkStyle} onClick={() => setMobileOpen(false)}>Courses</Link>
            <Link to="/cart" style={navLinkStyle} onClick={() => setMobileOpen(false)}>
              Cart {cartCount > 0 && `(${cartCount})`}
            </Link>
            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)' }} />
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" style={navLinkStyle} onClick={() => setMobileOpen(false)}>Dashboard</Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" style={navLinkStyle} onClick={() => setMobileOpen(false)}>Admin</Link>
                )}
                <button
                  style={{ ...dropdownItemStyle, padding: 0, color: 'var(--color-error)' }}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="btn btn-primary btn-full"
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default Header;
