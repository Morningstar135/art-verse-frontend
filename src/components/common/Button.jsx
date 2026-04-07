import React from 'react';

const spinnerStyles = {
  display: 'inline-block',
  border: '2px solid rgba(255, 255, 255, 0.3)',
  borderTopColor: 'currentColor',
  borderRadius: '50%',
  animation: 'spin 0.6s linear infinite',
};

const spinnerKeyframes = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const sizeMap = {
  sm: { width: 14, height: 14 },
  md: { width: 18, height: 18 },
  lg: { width: 22, height: 22 },
};

function Spinner({ size = 'md' }) {
  const dimensions = sizeMap[size] || sizeMap.md;
  return (
    <>
      <style>{spinnerKeyframes}</style>
      <span
        style={{
          ...spinnerStyles,
          width: dimensions.width,
          height: dimensions.height,
        }}
        aria-hidden="true"
      />
    </>
  );
}

function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  fullWidth = false,
}) {
  const variantClass = `btn-${variant}`;
  const sizeClass = size !== 'md' ? `btn-${size}` : '';
  const fullWidthClass = fullWidth ? 'btn-full' : '';

  const classes = ['btn', variantClass, sizeClass, fullWidthClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
    >
      {loading && <Spinner size={size} />}
      {children}
    </button>
  );
}

export default Button;
