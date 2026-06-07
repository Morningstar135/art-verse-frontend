import React from 'react';
import { FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi';

const footerStyle = {
  backgroundColor: 'var(--color-surface)',
  color: 'var(--color-text)',
  padding: 'var(--space-xl) 0',
  marginTop: 'auto',
};

const containerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 var(--space-md)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: 'var(--space-md)',
};

const copyrightStyle = {
  fontSize: '0.875rem',
  opacity: 0.8,
};

const socialContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-md)',
};

const socialLinkStyle = {
  color: 'var(--color-white)',
  opacity: 0.7,
  fontSize: '1.125rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'opacity var(--transition-fast)',
  textDecoration: 'none',
};

function Footer() {
  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <p style={copyrightStyle}>
          &copy; 2026 Dheena Arts. All rights reserved.
        </p>
        <div style={socialContainerStyle}>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            style={socialLinkStyle}
            aria-label="Instagram"
          >
            <FiInstagram />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            style={socialLinkStyle}
            aria-label="Twitter"
          >
            <FiTwitter />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            style={socialLinkStyle}
            aria-label="Facebook"
          >
            <FiFacebook />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
