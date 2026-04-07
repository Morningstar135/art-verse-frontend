import React from 'react';

const sectionStyle = {
  marginBottom: 'var(--space-md)',
};

const labelStyle = {
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: 'var(--color-text)',
  marginBottom: 'var(--space-xs)',
  display: 'block',
};

const toggleGroupStyle = {
  display: 'flex',
  gap: '0',
  borderRadius: 'var(--radius-md)',
  overflow: 'hidden',
  border: '1.5px solid var(--color-border)',
};

const toggleBtnStyle = {
  flex: 1,
  padding: '0.5rem 1rem',
  fontSize: '0.875rem',
  fontWeight: 500,
  fontFamily: 'var(--font-primary)',
  border: 'none',
  cursor: 'pointer',
  transition: 'all var(--transition-fast)',
  backgroundColor: 'var(--color-surface)',
  color: 'var(--color-text)',
};

const toggleBtnActiveStyle = {
  ...toggleBtnStyle,
  backgroundColor: 'var(--color-accent)',
  color: 'var(--color-white)',
};

const quantityContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-sm)',
};

const qtyBtnStyle = {
  width: '36px',
  height: '36px',
  borderRadius: 'var(--radius-md)',
  border: '1.5px solid var(--color-border)',
  backgroundColor: 'var(--color-surface)',
  fontSize: '1.125rem',
  fontWeight: 600,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all var(--transition-fast)',
  fontFamily: 'var(--font-primary)',
  color: 'var(--color-text)',
};

const qtyValueStyle = {
  fontSize: '1.125rem',
  fontWeight: 600,
  minWidth: '32px',
  textAlign: 'center',
};

function PrintConfigurator({ config, onChange }) {
  function update(field, value) {
    onChange({ ...config, [field]: value });
  }

  return (
    <div>
      {/* Medium */}
      <div style={sectionStyle}>
        <span style={labelStyle}>Print Medium</span>
        <div style={toggleGroupStyle}>
          {['paper', 'canvas'].map((m) => (
            <button
              key={m}
              style={config.medium === m ? toggleBtnActiveStyle : toggleBtnStyle}
              onClick={() => update('medium', m)}
              type="button"
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Size */}
      <div style={sectionStyle}>
        <span style={labelStyle}>Size</span>
        <div style={toggleGroupStyle}>
          {['A4', 'A3', 'A2'].map((s) => (
            <button
              key={s}
              style={config.size === s ? toggleBtnActiveStyle : toggleBtnStyle}
              onClick={() => update('size', s)}
              type="button"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Quality */}
      <div style={sectionStyle}>
        <span style={labelStyle}>Paper Quality</span>
        <div style={toggleGroupStyle}>
          {['200gsm', '300gsm'].map((q) => (
            <button
              key={q}
              style={config.quality === q ? toggleBtnActiveStyle : toggleBtnStyle}
              onClick={() => update('quality', q)}
              type="button"
            >
              {q.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div style={sectionStyle}>
        <span style={labelStyle}>Quantity</span>
        <div style={quantityContainerStyle}>
          <button
            style={qtyBtnStyle}
            onClick={() => update('quantity', Math.max(1, config.quantity - 1))}
            disabled={config.quantity <= 1}
            type="button"
          >
            −
          </button>
          <span style={qtyValueStyle}>{config.quantity}</span>
          <button
            style={qtyBtnStyle}
            onClick={() => update('quantity', Math.min(10, config.quantity + 1))}
            disabled={config.quantity >= 10}
            type="button"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

export default PrintConfigurator;
