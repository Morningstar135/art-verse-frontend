import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Modal, Button, Loader, EmptyState } from '../common';
import {
  adminGetCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
} from '../../services/adminService';

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

function CategoryForm({ form, setForm, onSubmit, loading, isEdit }) {
  return (
    <form
      onSubmit={onSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}
    >
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Name *</label>
        <input
          className="form-input"
          required
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
      </div>

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Description</label>
        <textarea
          className="form-input"
          rows={2}
          style={{ resize: 'vertical' }}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        />
      </div>

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Sort Order</label>
        <input
          className="form-input"
          type="number"
          value={form.sortOrder}
          onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
        />
      </div>

      <Button type="submit" variant="primary" fullWidth loading={loading}>
        {isEdit ? 'Update Category' : 'Create Category'}
      </Button>
    </form>
  );
}

const INITIAL_FORM = { name: '', description: '', sortOrder: 0 };

function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    setLoading(true);
    try {
      const res = await adminGetCategories();
      setCategories(res.categories || []);
    } catch {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditTarget(null);
    setForm(INITIAL_FORM);
    setShowModal(true);
  }

  function openEdit(cat) {
    setEditTarget(cat);
    setForm({
      name: cat.name || '',
      description: cat.description || '',
      sortOrder: cat.sortOrder || 0,
    });
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editTarget) {
        await adminUpdateCategory(editTarget.id, form);
        toast.success('Category updated');
      } else {
        await adminCreateCategory(form);
        toast.success('Category created');
      }
      setShowModal(false);
      loadCategories();
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminDeleteCategory(deleteTarget.id);
      toast.success('Category deleted');
      setDeleteTarget(null);
      loadCategories();
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to delete category');
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Loader /></div>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-lg)' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-primary)', margin: 0 }}>
          Categories
        </h2>
        <Button variant="primary" onClick={openCreate}>+ Add Category</Button>
      </div>

      {categories.length === 0 ? (
        <EmptyState title="No categories yet" description="Create your first category to organize artworks." />
      ) : (
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <table style={tableStyle}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-bg)' }}>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Slug</th>
                <th style={thStyle}>Description</th>
                <th style={thStyle}>Order</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr
                  key={cat.id}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                >
                  <td style={{ ...tdStyle, fontWeight: 500 }}>{cat.name}</td>
                  <td style={{ ...tdStyle, color: 'var(--color-text-light)', fontSize: '0.8125rem' }}>{cat.slug}</td>
                  <td style={{ ...tdStyle, fontSize: '0.875rem' }}>{cat.description || '—'}</td>
                  <td style={tdStyle}>{cat.sortOrder}</td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                      <Button variant="outline" size="sm" onClick={() => openEdit(cat)}>Edit</Button>
                      <Button variant="danger" size="sm" onClick={() => setDeleteTarget(cat)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editTarget ? 'Edit Category' : 'Add Category'}>
        <CategoryForm form={form} setForm={setForm} onSubmit={handleSubmit} loading={saving} isEdit={!!editTarget} />
      </Modal>

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Category">
        <p style={{ marginBottom: 'var(--space-lg)', color: 'var(--color-text)' }}>
          Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? Categories with artworks cannot be deleted.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end' }}>
          <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" loading={deleting} onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}

export default CategoryManager;
