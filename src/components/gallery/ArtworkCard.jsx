import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/formatters';
import { ProtectedImage } from '../common';

const cardStyle = {
  position: 'relative',
  borderRadius: 'var(--radius-lg)',
  overflow: 'hidden',
  backgroundColor: 'var(--color-surface)',
  boxShadow: 'var(--shadow-sm)',
  transition: 'transform var(--transition-base), box-shadow var(--transition-base)',
  cursor: 'pointer',
  breakInside: 'avoid',
  marginBottom: 'var(--space-md)',
};

const imageStyle = {
  width: '100%',
  display: 'block',
  transition: 'transform var(--transition-slow)',
};

const overlayStyle = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: 'var(--space-md)',
  background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.85))',
  color: 'var(--color-white)',
  transform: 'translateY(100%)',
  transition: 'transform var(--transition-base)',
};

const titleStyle = {
  fontSize: '1rem',
  fontWeight: 600,
  fontFamily: 'var(--font-display)',
  marginBottom: '4px',
};

const metaRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 'var(--space-sm)',
};

const badgeContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '4px',
};

const badgeStyle = {
  fontSize: '0.6875rem',
  padding: '2px 8px',
  borderRadius: 'var(--radius-full)',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(4px)',
};

const priceStyle = {
  fontSize: '0.9375rem',
  fontWeight: 700,
  whiteSpace: 'nowrap',
};

function ArtworkCard({ artwork }) {
  return (
    <Link
      to={`/artworks/${artwork.id}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div
        style={cardStyle}
        className="artwork-card"
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
          const img = e.currentTarget.querySelector('img');
          if (img) img.style.transform = 'scale(1.05)';
          const overlay = e.currentTarget.querySelector('.artwork-overlay');
          if (overlay) overlay.style.transform = 'translateY(0)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
          const img = e.currentTarget.querySelector('img');
          if (img) img.style.transform = 'scale(1)';
          const overlay = e.currentTarget.querySelector('.artwork-overlay');
          if (overlay) overlay.style.transform = 'translateY(100%)';
        }}
      >
        <ProtectedImage
          src={artwork.imageUrl}
          alt={artwork.title}
          style={imageStyle}
        />
        <div className="artwork-overlay" style={overlayStyle}>
          <p style={titleStyle}>{artwork.title}</p>
          <div style={metaRowStyle}>
            <div style={badgeContainerStyle}>
              {(artwork.categories || []).slice(0, 2).map((cat) => (
                <span key={cat.id} style={badgeStyle}>{cat.name}</span>
              ))}
            </div>
            {artwork.startingPrice > 0 && (
              <span style={priceStyle}>From {formatPrice(artwork.startingPrice)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ArtworkCard;
