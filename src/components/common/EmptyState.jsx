import React from 'react';

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 'var(--space-2xl) var(--space-md)',
  textAlign: 'center',
};

const iconContainerStyle = {
  fontSize: '3rem',
  color: 'var(--color-text-light)',
  marginBottom: 'var(--space-md)',
  opacity: 0.6,
};

const titleStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: '1.25rem',
  fontWeight: 600,
  color: 'var(--color-primary)',
  marginBottom: 'var(--space-sm)',
};

const messageStyle = {
  fontSize: '0.9375rem',
  color: 'var(--color-text-light)',
  maxWidth: '400px',
  lineHeight: 1.6,
  marginBottom: 'var(--space-lg)',
};

function EmptyState({ icon, title, message, action }) {
  return (
    <div style={containerStyle}>
      {icon && <div style={iconContainerStyle}>{icon}</div>}
      {title && <h3 style={titleStyle}>{title}</h3>}
      {message && <p style={messageStyle}>{message}</p>}
      {action && (
        <button className="btn btn-primary" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
