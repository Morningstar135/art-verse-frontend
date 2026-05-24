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

/* ─── About the Artist ─── */
const aboutSectionStyle = {
  maxWidth: '900px',
  margin: '0 auto',
  padding: '0 var(--space-md) var(--space-2xl)',
};

const aboutHeaderStyle = {
  textAlign: 'center',
  marginBottom: 'var(--space-lg)',
};

const aboutTitleStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
  fontWeight: 700,
  color: 'var(--color-text)',
  marginBottom: 'var(--space-xs)',
};

const aboutContentStyle = {
  backgroundColor: 'var(--color-surface)',
  borderRadius: 'var(--radius-lg)',
  padding: 'var(--space-xl)',
  border: '1px solid var(--color-border)',
};

const aboutTextStyle = {
  fontSize: '1rem',
  color: 'var(--color-text-light)',
  lineHeight: 1.8,
  marginBottom: 'var(--space-md)',
};

const aboutSubheadingStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: '1.125rem',
  fontWeight: 700,
  color: 'var(--color-text)',
  marginBottom: 'var(--space-sm)',
  marginTop: 'var(--space-lg)',
};

const aboutLinkStyle = {
  color: 'var(--color-accent)',
  textDecoration: 'none',
  fontWeight: 600,
};

const notableWorksGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 'var(--space-md)',
  marginTop: 'var(--space-md)',
};

const notableWorkCardStyle = {
  backgroundColor: 'var(--color-bg)',
  borderRadius: 'var(--radius-md)',
  padding: 'var(--space-md)',
  border: '1px solid var(--color-border)',
  textAlign: 'center',
};

const notableWorkTitleStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: '0.9375rem',
  fontWeight: 700,
  color: 'var(--color-text)',
  marginBottom: '4px',
};

const notableWorkDescStyle = {
  fontSize: '0.8125rem',
  color: 'var(--color-text-light)',
  lineHeight: 1.5,
};

const NOTABLE_WORKS = [
  {
    title: 'Meenakshi Pattabhishekam',
    desc: 'A commissioned digital artwork rendered in a highly detailed Tanjore style.',
  },
  {
    title: 'Melmalayanur Angaala Parameshwari',
    desc: 'A vibrant portrayal of the deity along with the historical legends associated with the temple.',
  },
  {
    title: 'Thiruvarur Kamalambika',
    desc: 'An intricate illustration capturing the traditional aesthetic of the famous deity from Thiruvarur.',
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
  background: 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-secondary) 50%, var(--color-surface) 100%)',
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
  backgroundColor: 'rgba(177, 88, 70, 0.15)',
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
  boxShadow: '0 4px 20px rgba(177, 88, 70, 0.3)',
};

/* ─── Decorative glow ─── */
const glowStyle = {
  position: 'absolute',
  width: '300px',
  height: '300px',
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(177,88,70,0.08) 0%, transparent 70%)',
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

      {/* ── About the Artist ── */}
      <section style={aboutSectionStyle}>
        <div style={aboutHeaderStyle}>
          <h2 style={aboutTitleStyle}>About the Artist</h2>
        </div>

        <motion.div
          style={aboutContentStyle}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6 }}
        >
          <p style={aboutTextStyle}>
            <strong style={{ color: 'var(--color-text)' }}>Thillai Nathan</strong> (
            <a href="https://www.instagram.com/dheena_tn07/" target="_blank" rel="noopener noreferrer" style={aboutLinkStyle}>@dheena_tn07</a>
            ) is a prominent digital artist and illustrator specializing in traditional South Indian Hindu deity artwork. He creates stunning Tanjore-painting-styled artwork and traditional digital illustrations, with art primarily focused on deities, temples, and legends from Shaivism and Shaktism.
          </p>

          <h3 style={aboutSubheadingStyle}>Online Presence</h3>
          <p style={aboutTextStyle}>
            <a href="https://www.instagram.com/dheena_tn07/" target="_blank" rel="noopener noreferrer" style={aboutLinkStyle}>Instagram</a> — Explore his main gallery featuring commissioned works, divine digital art reels, and detailed descriptions of temple legends.
            <br />
            <a href="https://www.pinterest.com/gurusamyrajkumarmct/" target="_blank" rel="noopener noreferrer" style={aboutLinkStyle}>Pinterest</a> — A collection of god drawings and concept sketches.
          </p>

          <h3 style={aboutSubheadingStyle}>Notable Artworks</h3>
          <div style={notableWorksGridStyle}>
            {NOTABLE_WORKS.map((w, i) => (
              <motion.div
                key={i}
                style={notableWorkCardStyle}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <h4 style={notableWorkTitleStyle}>{w.title}</h4>
                <p style={notableWorkDescStyle}>{w.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
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
                  e.currentTarget.style.boxShadow = '0 6px 28px rgba(177, 88, 70, 0.45)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(177, 88, 70, 0.3)';
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
