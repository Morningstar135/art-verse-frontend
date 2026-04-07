import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import { getArtworks, getCategories } from '../services/artworkService';
import CategoryFilter from '../components/gallery/CategoryFilter';
import MasonryGrid from '../components/gallery/MasonryGrid';
import { Loader, EmptyState } from '../components/common';

/* ─── Hero ─── */
const heroStyle = {
  textAlign: 'center',
  padding: 'var(--space-2xl) var(--space-md)',
  background: 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-bg) 100%)',
  color: 'var(--color-text)',
  marginBottom: 'var(--space-xl)',
};

const heroTitleStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
  fontWeight: 800,
  marginBottom: 'var(--space-sm)',
  letterSpacing: '-0.02em',
};

const heroSubStyle = {
  fontSize: '1.125rem',
  opacity: 0.85,
  maxWidth: '600px',
  margin: '0 auto',
};

/* ─── Artist Highlights ─── */
const artistSectionStyle = {
  maxWidth: '1100px',
  margin: '0 auto',
  padding: '0 var(--space-md) var(--space-2xl)',
};

const artistHeaderStyle = {
  textAlign: 'center',
  marginBottom: 'var(--space-xl)',
};

const artistTitleStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
  fontWeight: 700,
  color: 'var(--color-text)',
  marginBottom: 'var(--space-xs)',
};

const artistSubtitleStyle = {
  fontSize: '1rem',
  color: 'var(--color-text-light)',
  maxWidth: '500px',
  margin: '0 auto',
};

const highlightsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 'var(--space-lg)',
};

const highlightCardStyle = {
  backgroundColor: 'var(--color-surface)',
  borderRadius: 'var(--radius-lg)',
  padding: 'var(--space-lg)',
  border: '1px solid var(--color-border)',
  textAlign: 'center',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
};

const highlightIconStyle = {
  fontSize: '2.25rem',
  marginBottom: 'var(--space-sm)',
  display: 'block',
};

const highlightTitleStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: '1.0625rem',
  fontWeight: 700,
  color: 'var(--color-text)',
  marginBottom: '6px',
};

const highlightDescStyle = {
  fontSize: '0.875rem',
  color: 'var(--color-text-light)',
  lineHeight: 1.6,
};

const HIGHLIGHTS = [
  {
    icon: '🎨',
    title: 'Original Creations',
    desc: 'Every artwork is a unique, hand-crafted original — no reproductions, no mass prints.',
  },
  {
    icon: '🏆',
    title: 'Award-Winning Talent',
    desc: 'Recognized by galleries and art institutions for exceptional artistic vision and craft.',
  },
  {
    icon: '✨',
    title: 'Premium Quality',
    desc: 'Museum-grade prints on archival paper and canvas, built to last for generations.',
  },
  {
    icon: '🌍',
    title: 'Global Collector Base',
    desc: 'Artwork cherished by collectors across the world, from private homes to public spaces.',
  },
];

/* ─── Divider ─── */
const dividerStyle = {
  width: '60px',
  height: '3px',
  backgroundColor: 'var(--color-accent)',
  margin: '0 auto var(--space-2xl)',
  borderRadius: '2px',
};

/* ─── Gallery Container ─── */
const containerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 var(--space-md) var(--space-2xl)',
};

const loadMoreStyle = {
  display: 'flex',
  justifyContent: 'center',
  padding: 'var(--space-xl) 0',
};

/* ─── Announcement / Campaign ─── */
const announcementSectionStyle = {
  position: 'relative',
  overflow: 'hidden',
  background: 'linear-gradient(135deg, var(--color-surface) 0%, #1f1f1f 50%, var(--color-surface) 100%)',
  borderTop: '1px solid var(--color-border)',
  borderBottom: '1px solid var(--color-border)',
};

const announcementInnerStyle = {
  maxWidth: '800px',
  margin: '0 auto',
  padding: 'var(--space-2xl) var(--space-md)',
  textAlign: 'center',
  position: 'relative',
  zIndex: 1,
};

const announcementLabelStyle = {
  display: 'inline-block',
  padding: '4px 16px',
  borderRadius: '999px',
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  backgroundColor: 'rgba(230, 57, 70, 0.15)',
  color: 'var(--color-accent)',
  marginBottom: 'var(--space-md)',
};

const announcementTitleStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
  fontWeight: 800,
  color: 'var(--color-text)',
  marginBottom: 'var(--space-sm)',
  lineHeight: 1.2,
};

const announcementDescStyle = {
  fontSize: '1.0625rem',
  color: 'var(--color-text-light)',
  lineHeight: 1.7,
  maxWidth: '600px',
  margin: '0 auto var(--space-lg)',
};

const announcementCTAStyle = {
  display: 'inline-block',
  padding: '14px 36px',
  backgroundColor: 'var(--color-accent)',
  color: '#fff',
  borderRadius: 'var(--radius-md)',
  textDecoration: 'none',
  fontWeight: 700,
  fontSize: '1rem',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  boxShadow: '0 4px 20px rgba(230, 57, 70, 0.3)',
};

/* ─── Decorative glow ─── */
const glowStyle = {
  position: 'absolute',
  width: '300px',
  height: '300px',
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(230,57,70,0.08) 0%, transparent 70%)',
  pointerEvents: 'none',
};

function GalleryPage() {
  const [artworks, setArtworks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data.categories || []))
      .catch(() => {});
    // Fetch active announcements
    api.get('/announcements')
      .then((res) => setAnnouncements(res.data.announcements || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setPage(1);
    getArtworks({ category: activeCategory, page: 1, limit: 20 })
      .then((data) => {
        setArtworks(data.artworks || []);
        setTotalPages(data.pagination?.totalPages || 1);
      })
      .catch(() => setArtworks([]))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  async function loadMore() {
    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      const data = await getArtworks({ category: activeCategory, page: nextPage, limit: 20 });
      setArtworks((prev) => [...prev, ...(data.artworks || [])]);
      setPage(nextPage);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch {
      // ignore
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <div>
      {/* ── Hero ── */}
      <section style={heroStyle}>
        <h1 style={heroTitleStyle}>Explore the Gallery</h1>
        <p style={heroSubStyle}>
          Discover handpicked artworks by our featured artist. Each piece tells a unique story.
        </p>
      </section>

      {/* ── Artist Highlights ── */}
      <section style={artistSectionStyle}>
        <div style={artistHeaderStyle}>
          <h2 style={artistTitleStyle}>Why Collectors Love Our Artist</h2>
          <p style={artistSubtitleStyle}>
            A passion for detail, a commitment to excellence.
          </p>
        </div>

        <div style={highlightsGridStyle}>
          {HIGHLIGHTS.map((h, i) => (
            <motion.div
              key={i}
              style={highlightCardStyle}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ transform: 'translateY(-4px)', boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}
            >
              <span style={highlightIconStyle}>{h.icon}</span>
              <h3 style={highlightTitleStyle}>{h.title}</h3>
              <p style={highlightDescStyle}>{h.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Divider ── */}
      <div style={dividerStyle} />

      {/* ── Gallery ── */}
      <div style={containerStyle}>
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-2xl)' }}>
            <Loader />
          </div>
        ) : artworks.length === 0 ? (
          <EmptyState
            title="No artworks found"
            description={activeCategory ? 'Try selecting a different category.' : 'Check back soon for new artworks!'}
          />
        ) : (
          <>
            <MasonryGrid artworks={artworks} />
            {page < totalPages && (
              <div style={loadMoreStyle}>
                <button
                  className="btn btn-outline btn-lg"
                  onClick={loadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Announcements ── */}
      {announcements.length > 0 && announcements.map((ann, idx) => (
        <section key={ann.id || idx} style={announcementSectionStyle}>
          {/* Decorative glows */}
          <div style={{ ...glowStyle, top: '-100px', left: '-100px' }} />
          <div style={{ ...glowStyle, bottom: '-100px', right: '-100px' }} />

          <div style={announcementInnerStyle}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6 }}
            >
              <span style={announcementLabelStyle}>
                {ann.type === 'course' ? 'Upcoming Course' : ann.type === 'campaign' ? 'Campaign' : ann.type === 'event' ? 'Event' : 'Announcement'}
              </span>
              <h2 style={announcementTitleStyle}>{ann.title}</h2>
              <p style={announcementDescStyle}>{ann.description}</p>

              {ann.startDate && (
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', marginBottom: 'var(--space-md)' }}>
                  {new Date(ann.startDate) > new Date()
                    ? `Starts ${new Date(ann.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`
                    : `Started ${new Date(ann.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`}
                  {ann.endDate && ` — Ends ${new Date(ann.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`}
                </p>
              )}

              <Link
                to={ann.ctaLink || '/courses'}
                style={announcementCTAStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 28px rgba(230, 57, 70, 0.45)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(230, 57, 70, 0.3)';
                }}
              >
                {ann.ctaText || 'Learn More'}
              </Link>
            </motion.div>
          </div>
        </section>
      ))}
    </div>
  );
}

export default GalleryPage;
