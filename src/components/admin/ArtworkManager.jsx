import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { Modal, Button, Loader, EmptyState } from '../common';
import { formatPrice } from '../../utils/formatters';
import {
  adminGetArtworks,
  adminCreateArtwork,
  adminUpdateArtwork,
  adminDeleteArtwork,
  adminGetCategories,
} from '../../services/adminService';

const MEDIUMS = ['paper'];
const SIZES = ['A4', 'A3', 'A2'];
const QUALITIES = ['300gsm'];

const DEFAULT_PRICE = 100000; // ₹1,000 in paise

function buildDefaultPricing() {
  const pricing = [];
  for (const medium of MEDIUMS) {
    for (const size of SIZES) {
      for (const quality of QUALITIES) {
        pricing.push({ medium, size, quality, price: DEFAULT_PRICE });
      }
    }
  }
  return pricing;
}

const INITIAL_FORM = {
  title: '',
  description: '',
  categories: [],
  dimensions: '',
  medium: '',
  year: '',
  isActive: true,
  pricing: buildDefaultPricing(),
  imageFile: null,
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '0.9rem',
};

const thStyle = {
  textAlign: 'left',
  padding: 'var(--space-sm) var(--space-md)',
  borderBottom: '2px solid var(--color-border)',
  color: 'var(--color-text-light)',
  fontSize: '0.8125rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const tdStyle = {
  padding: 'var(--space-sm) var(--space-md)',
  borderBottom: '1px solid var(--color-border)',
  verticalAlign: 'middle',
};

const badgeStyle = (active) => ({
  display: 'inline-block',
  padding: '2px 8px',
  borderRadius: '999px',
  fontSize: '0.75rem',
  fontWeight: 600,
  backgroundColor: active ? 'rgba(40, 167, 69, 0.15)' : 'rgba(177, 88, 70, 0.15)',
  color: active ? '#28a745' : '#ff6b6b',
});

function ArtworkForm({ form, setForm, categories, onSubmit, loading, isEdit }) {
  const fileRef = useRef(null);

  function handlePriceChange(index, rupeeValue) {
    const updated = [...form.pricing];
    const paise = Math.round((parseFloat(rupeeValue) || 0) * 100);
    updated[index] = { ...updated[index], price: paise };
    setForm((f) => ({ ...f, pricing: updated }));
  }

  function toggleCategory(catId) {
    setForm((f) => {
      const already = f.categories.includes(catId);
      return {
        ...f,
        categories: already
          ? f.categories.filter((c) => c !== catId)
          : [...f.categories, catId],
      };
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}
    >
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Title *</label>
        <input
          className="form-input"
          required
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        />
      </div>

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Description</label>
        <textarea
          className="form-input"
          rows={3}
          style={{ resize: 'vertical' }}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-sm)' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Dimensions</label>
          <input
            className="form-input"
            placeholder="e.g. 30x40 cm"
            value={form.dimensions}
            onChange={(e) => setForm((f) => ({ ...f, dimensions: e.target.value }))}
          />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Medium</label>
          <input
            className="form-input"
            placeholder="e.g. Oil on canvas"
            value={form.medium}
            onChange={(e) => setForm((f) => ({ ...f, medium: e.target.value }))}
          />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Year</label>
          <input
            className="form-input"
            type="number"
            min="1900"
            max="2100"
            value={form.year}
            onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
          />
        </div>
      </div>

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Category</label>
        <select
          className="form-input"
          value={form.categories[0] || ''}
          onChange={(e) => {
            const val = e.target.value;
            setForm((f) => ({ ...f, categories: val ? [val] : [] }));
          }}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => {
            const catId = cat.id || cat._id;
            return (
              <option key={catId} value={catId}>
                {cat.name}
              </option>
            );
          })}
        </select>
      </div>

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">{isEdit ? 'Replace Image (optional)' : 'Image *'}</label>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          required={!isEdit}
          style={{ fontSize: '0.875rem' }}
          onChange={(e) =>
            setForm((f) => ({ ...f, imageFile: e.target.files[0] || null }))
          }
        />
      </div>

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">
          Active
          <input
            type="checkbox"
            style={{ marginLeft: 'var(--space-sm)' }}
            checked={form.isActive}
            onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
          />
        </label>
      </div>

      <div>
        <label className="form-label" style={{ marginBottom: 'var(--space-sm)', display: 'block' }}>
          Pricing
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {form.pricing.map((p, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                backgroundColor: 'var(--color-bg)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div style={{ flex: 1, display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{
                  padding: '3px 10px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                }}>
                  {p.medium.charAt(0).toUpperCase() + p.medium.slice(1)}
                </span>
                <span style={{
                  padding: '3px 10px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                }}>
                  {p.size}
                </span>
                <span style={{
                  padding: '3px 10px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                }}>
                  {p.quality.toUpperCase()}
                </span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                overflow: 'hidden',
                flexShrink: 0,
              }}>
                <span style={{
                  padding: '6px 10px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--color-text-light)',
                  borderRight: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-bg)',
                  userSelect: 'none',
                }}>₹</span>
                <input
                  type="text"
                  inputMode="decimal"
                  style={{
                    width: '90px',
                    padding: '6px 10px',
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'var(--color-text)',
                    fontFamily: 'var(--font-primary)',
                    textAlign: 'right',
                  }}
                  value={(p.price / 100).toFixed(0)}
                  onChange={(e) => handlePriceChange(i, e.target.value)}
                  onFocus={(e) => e.target.select()}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" variant="primary" fullWidth loading={loading}>
        {isEdit ? 'Update Artwork' : 'Create Artwork'}
      </Button>
    </form>
  );
}

function ArtworkManager() {
  const [artworks, setArtworks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    loadData();
  }, [page]);

  async function loadData() {
    setLoading(true);
    try {
      const [artRes, catRes] = await Promise.all([
        adminGetArtworks({ page }),
        adminGetCategories(),
      ]);
      setArtworks(artRes.artworks || []);
      setPagination(artRes.pagination || null);
      setCategories(catRes.categories || []);
    } catch {
      toast.error('Failed to load artworks');
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditTarget(null);
    setForm(INITIAL_FORM);
    setShowModal(true);
  }

  function openEdit(artwork) {
    setEditTarget(artwork);
    const existingPricing = buildDefaultPricing().map((def) => {
      const match = (artwork.pricing || []).find(
        (p) => p.medium === def.medium && p.size === def.size && p.quality === def.quality
      );
      return match ? { ...def, price: match.price } : def;
    });
    setForm({
      title: artwork.title || '',
      description: artwork.description || '',
      categories: (artwork.categories || []).map((c) => c.id || c._id),
      dimensions: artwork.dimensions || '',
      medium: artwork.medium || '',
      year: artwork.year || '',
      isActive: artwork.isActive !== false,
      pricing: existingPricing,
      imageFile: null,
    });
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('dimensions', form.dimensions);
      fd.append('medium', form.medium);
      fd.append('year', form.year);
      fd.append('isActive', form.isActive);
      fd.append('categories', JSON.stringify(form.categories));
      fd.append('pricing', JSON.stringify(form.pricing));
      if (form.imageFile) {
        fd.append('image', form.imageFile);
      }

      if (editTarget) {
        await adminUpdateArtwork(editTarget.id, fd);
        toast.success('Artwork updated');
      } else {
        await adminCreateArtwork(fd);
        toast.success('Artwork created');
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      const data = err?.response?.data;
      if (err?.response?.status === 409 && data?.existingArtwork) {
        toast.error(`Duplicate image — already used in "${data.existingArtwork.title}"`, { duration: 5000 });
      } else {
        toast.error(data?.error || 'Failed to save artwork');
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminDeleteArtwork(deleteTarget.id);
      toast.success('Artwork deleted');
      setDeleteTarget(null);
      loadData();
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to delete artwork');
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Loader /></div>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-lg)' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-primary)', margin: 0 }}>
          Artworks
        </h2>
        <Button variant="primary" onClick={openCreate}>+ Add Artwork</Button>
      </div>

      {artworks.length === 0 ? (
        <EmptyState title="No artworks yet" description="Add your first artwork to get started." />
      ) : (
        <>
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <table style={tableStyle}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-bg)' }}>
                  <th style={thStyle}>Image</th>
                  <th style={thStyle}>Title</th>
                  <th style={thStyle}>Categories</th>
                  <th style={thStyle}>Starting Price</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {artworks.map((artwork) => {
                  const prices = (artwork.pricing || []).map((p) => p.price).filter((p) => p > 0);
                  const startingPrice = prices.length > 0 ? Math.min(...prices) : null;
                  return (
                    <tr key={artwork.id} style={{ transition: 'background var(--transition-fast)' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                    >
                      <td style={tdStyle}>
                        {artwork.imageUrl ? (
                          <img
                            src={artwork.imageUrl}
                            alt={artwork.title}
                            style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                          />
                        ) : (
                          <div style={{ width: 48, height: 48, backgroundColor: 'var(--color-border)', borderRadius: 'var(--radius-sm)' }} />
                        )}
                      </td>
                      <td style={{ ...tdStyle, fontWeight: 500 }}>{artwork.title}</td>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {(artwork.categories || []).map((c) => (
                            <span key={c.id || c._id} style={{
                              padding: '2px 8px',
                              borderRadius: '999px',
                              fontSize: '0.75rem',
                              backgroundColor: 'var(--color-bg)',
                              border: '1px solid var(--color-border)',
                            }}>
                              {c.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={tdStyle}>
                        {startingPrice != null ? formatPrice(startingPrice) : '—'}
                      </td>
                      <td style={tdStyle}>
                        <span style={badgeStyle(artwork.isActive)}>
                          {artwork.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                          <Button variant="outline" size="sm" onClick={() => openEdit(artwork)}>Edit</Button>
                          <Button variant="danger" size="sm" onClick={() => setDeleteTarget(artwork)}>Delete</Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-sm)', marginTop: 'var(--space-lg)' }}>
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </Button>
              <span style={{ padding: 'var(--space-sm)', fontSize: '0.875rem', color: 'var(--color-text-light)' }}>
                Page {page} of {pagination.totalPages}
              </span>
              <Button variant="outline" size="sm" disabled={page >= pagination.totalPages} onClick={() => setPage((p) => p + 1)}>
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editTarget ? 'Edit Artwork' : 'Add Artwork'}
      >
        <ArtworkForm
          form={form}
          setForm={setForm}
          categories={categories}
          onSubmit={handleSubmit}
          loading={saving}
          isEdit={!!editTarget}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Artwork"
      >
        <p style={{ marginBottom: 'var(--space-lg)', color: 'var(--color-text)' }}>
          Are you sure you want to delete <strong>{deleteTarget?.title}</strong>? This will also remove the image and cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end' }}>
          <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" loading={deleting} onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}

export default ArtworkManager;
