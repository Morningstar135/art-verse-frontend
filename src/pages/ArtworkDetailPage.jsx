import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getArtwork } from '../services/artworkService';
import { formatPrice } from '../utils/formatters';
import { Loader, ProtectedImage } from '../components/common';
import PrintConfigurator from '../components/artwork/PrintConfigurator';
import PriceDisplay from '../components/artwork/PriceDisplay';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const pageStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: 'var(--space-xl) var(--space-md) var(--space-2xl)',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 'var(--space-2xl)',
  alignItems: 'start',
};

const imageSectionStyle = {
  position: 'sticky',
  top: '80px',
};

const imageStyle = {
  width: '100%',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-lg)',
};

const titleStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: '2rem',
  fontWeight: 700,
  color: 'var(--color-primary)',
  marginBottom: 'var(--space-sm)',
};

const descStyle = {
  fontSize: '1rem',
  color: 'var(--color-text-light)',
  lineHeight: 1.7,
  marginBottom: 'var(--space-lg)',
};

const metaGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
  gap: 'var(--space-md)',
  marginBottom: 'var(--space-xl)',
  padding: 'var(--space-lg)',
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'var(--color-bg)',
};

const metaItemStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
};

const metaLabelStyle = {
  fontSize: '0.75rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: 'var(--color-text-light)',
};

const metaValueStyle = {
  fontSize: '0.9375rem',
  fontWeight: 500,
  color: 'var(--color-text)',
};

const categoryBadgesStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--space-xs)',
  marginBottom: 'var(--space-lg)',
};

const badgeStyle = {
  fontSize: '0.8125rem',
  padding: '4px 12px',
  borderRadius: 'var(--radius-full)',
  backgroundColor: 'var(--color-bg)',
  border: '1px solid var(--color-border)',
  color: 'var(--color-text)',
};

const purchasePanelStyle = {
  marginTop: 'var(--space-lg)',
  padding: 'var(--space-lg)',
  borderRadius: 'var(--radius-lg)',
  border: '1.5px solid var(--color-border)',
  backgroundColor: 'var(--color-surface)',
};

const btnRowStyle = {
  display: 'flex',
  gap: 'var(--space-md)',
  marginTop: 'var(--space-lg)',
};

const responsiveCSS = `
  @media (max-width: 768px) {
    .artwork-detail-grid {
      grid-template-columns: 1fr !important;
    }
    .artwork-detail-image-section {
      position: static !important;
    }
  }
`;

function ArtworkDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState({
    medium: 'paper',
    size: 'A4',
    quality: '200gsm',
    quantity: 1,
  });
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    setLoading(true);
    getArtwork(id)
      .then(setArtwork)
      .catch(() => setArtwork(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Loader /></div>;
  }

  if (!artwork) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Artwork not found</h2>
        <Link to="/" className="btn btn-primary" style={{ marginTop: 'var(--space-lg)' }}>Back to Gallery</Link>
      </div>
    );
  }

  async function handleAddToCart() {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    setAddingToCart(true);
    try {
      await addToCart(artwork.id, config.medium, config.size, config.quality, config.quantity);
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  }

  async function handleBuyNow() {
    if (!isAuthenticated) {
      toast.error('Please login to purchase');
      navigate('/login');
      return;
    }
    setAddingToCart(true);
    try {
      await addToCart(artwork.id, config.medium, config.size, config.quality, config.quantity);
      navigate('/cart');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  }

  return (
    <>
      <style>{responsiveCSS}</style>
      <div style={pageStyle}>
        <div className="artwork-detail-grid" style={gridStyle}>
          {/* Left: Image */}
          <div className="artwork-detail-image-section" style={imageSectionStyle}>
            <ProtectedImage
              src={artwork.imageUrl}
              alt={artwork.title}
              style={imageStyle}
              borderRadius="var(--radius-lg)"
            />
          </div>

          {/* Right: Info + Purchase */}
          <div>
            <h1 style={titleStyle}>{artwork.title}</h1>

            {artwork.categories?.length > 0 && (
              <div style={categoryBadgesStyle}>
                {artwork.categories.map((cat) => (
                  <span key={cat.id} style={badgeStyle}>{cat.name}</span>
                ))}
              </div>
            )}

            {artwork.description && <p style={descStyle}>{artwork.description}</p>}

            {/* Metadata */}
            {(artwork.dimensions || artwork.medium || artwork.year) && (
              <div style={metaGridStyle}>
                {artwork.dimensions && (
                  <div style={metaItemStyle}>
                    <span style={metaLabelStyle}>Dimensions</span>
                    <span style={metaValueStyle}>{artwork.dimensions}</span>
                  </div>
                )}
                {artwork.medium && (
                  <div style={metaItemStyle}>
                    <span style={metaLabelStyle}>Medium</span>
                    <span style={metaValueStyle}>{artwork.medium}</span>
                  </div>
                )}
                {artwork.year && (
                  <div style={metaItemStyle}>
                    <span style={metaLabelStyle}>Year</span>
                    <span style={metaValueStyle}>{artwork.year}</span>
                  </div>
                )}
              </div>
            )}

            {/* Purchase Panel */}
            {artwork.pricing?.length > 0 && (
              <div style={purchasePanelStyle}>
                <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--space-md)' }}>
                  Order a Print
                </h3>
                <PrintConfigurator config={config} onChange={setConfig} />
                <PriceDisplay pricing={artwork.pricing} config={config} />
                <div style={btnRowStyle}>
                  <button
                    className="btn btn-primary btn-lg"
                    style={{ flex: 1 }}
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                  >
                    {addingToCart ? 'Adding...' : 'Add to Cart'}
                  </button>
                  <button
                    className="btn btn-secondary btn-lg"
                    style={{ flex: 1 }}
                    onClick={handleBuyNow}
                    disabled={addingToCart}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ArtworkDetailPage;
