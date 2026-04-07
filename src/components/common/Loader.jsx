import React from 'react';

const sizeMap = {
  sm: 24,
  md: 40,
  lg: 56,
};

const keyframes = `
  @keyframes loader-spin {
    to { transform: rotate(360deg); }
  }
`;

function Loader({ size = 'md', fullPage = false }) {
  const dimension = sizeMap[size] || sizeMap.md;
  const borderWidth = size === 'sm' ? 2 : size === 'lg' ? 4 : 3;

  const spinnerStyle = {
    width: dimension,
    height: dimension,
    border: `${borderWidth}px solid var(--color-border)`,
    borderTopColor: 'var(--color-accent)',
    borderRadius: '50%',
    animation: 'loader-spin 0.7s linear infinite',
  };

  if (fullPage) {
    return (
      <>
        <style>{keyframes}</style>
        <div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(248, 248, 248, 0.8)',
            zIndex: 9999,
          }}
          role="status"
          aria-label="Loading"
        >
          <div style={spinnerStyle} />
        </div>
      </>
    );
  }

  return (
    <>
      <style>{keyframes}</style>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-xl)',
        }}
        role="status"
        aria-label="Loading"
      >
        <div style={spinnerStyle} />
      </div>
    </>
  );
}

export default Loader;
