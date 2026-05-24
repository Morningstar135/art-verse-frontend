import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Modal, Button, Loader, EmptyState } from '../common';
import {
  adminGetAnnouncements,
  adminCreateAnnouncement,
  adminUpdateAnnouncement,
  adminDeleteAnnouncement,
} from '../../services/adminService';

const TYPES = [
  { value: 'course', label: 'Course' },
  { value: 'campaign', label: 'Campaign' },
  { value: 'event', label: 'Event' },
  { value: 'general', label: 'General' },
];

const typeBadgeColors = {
  course: { bg: 'rgba(0, 123, 255, 0.15)', color: '#5b9aff' },
  campaign: { bg: 'rgba(177, 88, 70, 0.15)', color: '#ff6b6b' },
  event: { bg: 'rgba(255, 193, 7, 0.15)', color: '#ffc107' },
  general: { bg: 'rgba(40, 167, 69, 0.15)', color: '#28a745' },
};

const INITIAL_FORM = {
  title: '',
  description: '',
  type: 'course',
  startDate: '',
  endDate: '',
  ctaText: 'Learn More',
  ctaLink: '/courses',
  isActive: true,
};

const cardContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-md)',
};

const cardStyle = {
  backgroundColor: 'var(--color-surface)',
  borderRadius: 'var(--radius-lg)',
  padding: 'var(--space-lg)',
  border: '1px solid var(--color-border)',
  transition: 'box-shadow var(--transition-fast)',
};

const cardHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: 'var(--space-md)',
  marginBottom: 'var(--space-sm)',
};

const cardTitleStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: '1.0625rem',
  fontWeight: 600,
  color: 'var(--color-text)',
  margin: 0,
};

const cardDescStyle = {
  fontSize: '0.875rem',
  color: 'var(--color-text-light)',
  lineHeight: 1.6,
  marginBottom: 'var(--space-sm)',
};

const cardMetaStyle = {
  display: 'flex',
  gap: 'var(--space-md)',
  flexWrap: 'wrap',
  alignItems: 'center',
  fontSize: '0.8125rem',
  color: 'var(--color-text-light)',
};

const badgeStyle = (type) => {
  const colors = typeBadgeColors[type] || typeBadgeColors.general;
  return {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '999px',
    fontSize: '0.75rem',
    fontWeight: 600,
    backgroundColor: colors.bg,
    color: colors.color,
    textTransform: 'capitalize',
  };
};

const activeBadgeStyle = (active) => ({
  display: 'inline-block',
  padding: '3px 10px',
  borderRadius: '999px',
  fontSize: '0.75rem',
  fontWeight: 600,
  backgroundColor: active ? 'rgba(40, 167, 69, 0.15)' : 'rgba(177, 88, 70, 0.15)',
  color: active ? '#28a745' : '#ff6b6b',
});

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-md)',
};

const rowStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 'var(--space-md)',
};

function formatDateForInput(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
}

function formatDateDisplay(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function AnnouncementForm({ form, setForm, onSubmit, loading, isEdit }) {
  return (
    <form onSubmit={onSubmit} style={formStyle}>
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Title *</label>
        <input
          className="form-input"
          required
          maxLength={200}
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        />
      </div>

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Description *</label>
        <textarea
          className="form-input"
          required
          rows={3}
          maxLength={1000}
          style={{ resize: 'vertical' }}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        />
      </div>

      <div style={rowStyle}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Type *</label>
          <select
            className="form-input"
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            style={{ cursor: 'pointer' }}
          >
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
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
      </div>

      <div style={rowStyle}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Start Date *</label>
          <input
            className="form-input"
            type="datetime-local"
            required
            value={form.startDate}
            onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
          />
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">End Date (optional)</label>
          <input
            className="form-input"
            type="datetime-local"
            value={form.endDate}
            onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
          />
        </div>
      </div>

      <div style={rowStyle}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Button Text</label>
          <input
            className="form-input"
            maxLength={50}
            placeholder="e.g. View Courses"
            value={form.ctaText}
            onChange={(e) => setForm((f) => ({ ...f, ctaText: e.target.value }))}
          />
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Button Link</label>
          <input
            className="form-input"
            placeholder="e.g. /courses"
            value={form.ctaLink}
            onChange={(e) => setForm((f) => ({ ...f, ctaLink: e.target.value }))}
          />
        </div>
      </div>

      <Button type="submit" variant="primary" fullWidth loading={loading}>
        {isEdit ? 'Update Announcement' : 'Create Announcement'}
      </Button>
    </form>
  );
}

function AnnouncementManager() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const res = await adminGetAnnouncements();
      setAnnouncements(res.announcements || []);
    } catch {
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditTarget(null);
    setForm(INITIAL_FORM);
    setShowModal(true);
  }

  function openEdit(a) {
    setEditTarget(a);
    setForm({
      title: a.title || '',
      description: a.description || '',
      type: a.type || 'general',
      startDate: formatDateForInput(a.startDate),
      endDate: formatDateForInput(a.endDate),
      ctaText: a.ctaText || 'Learn More',
      ctaLink: a.ctaLink || '/courses',
      isActive: a.isActive !== false,
    });
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        type: form.type,
        startDate: form.startDate ? new Date(form.startDate).toISOString() : undefined,
        endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
        ctaText: form.ctaText,
        ctaLink: form.ctaLink,
        isActive: form.isActive,
      };

      if (editTarget) {
        await adminUpdateAnnouncement(editTarget.id, payload);
        toast.success('Announcement updated');
      } else {
        await adminCreateAnnouncement(payload);
        toast.success('Announcement created');
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to save announcement');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminDeleteAnnouncement(deleteTarget.id);
      toast.success('Announcement deleted');
      setDeleteTarget(null);
      loadData();
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to delete announcement');
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 'var(--space-lg)',
      }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.5rem',
          color: 'var(--color-primary)',
          margin: 0,
        }}>
          Announcements
        </h2>
        <Button variant="primary" onClick={openCreate}>+ New Announcement</Button>
      </div>

      {announcements.length === 0 ? (
        <EmptyState
          title="No announcements yet"
          description="Create your first announcement to display on the home page."
        />
      ) : (
        <div style={cardContainerStyle}>
          {announcements.map((a) => (
            <div
              key={a.id}
              style={cardStyle}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={cardHeaderStyle}>
                <div style={{ flex: 1 }}>
                  <h3 style={cardTitleStyle}>{a.title}</h3>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-xs)', flexShrink: 0 }}>
                  <Button variant="outline" size="sm" onClick={() => openEdit(a)}>Edit</Button>
                  <Button variant="danger" size="sm" onClick={() => setDeleteTarget(a)}>Delete</Button>
                </div>
              </div>

              <p style={cardDescStyle}>{a.description}</p>

              <div style={cardMetaStyle}>
                <span style={badgeStyle(a.type)}>{a.type}</span>
                <span style={activeBadgeStyle(a.isActive)}>
                  {a.isActive ? 'Active' : 'Inactive'}
                </span>
                <span>Starts: {formatDateDisplay(a.startDate)}</span>
                {a.endDate && <span>Ends: {formatDateDisplay(a.endDate)}</span>}
                {a.ctaText && (
                  <span style={{ color: 'var(--color-accent)' }}>
                    {a.ctaText} &rarr; {a.ctaLink}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editTarget ? 'Edit Announcement' : 'New Announcement'}
      >
        <AnnouncementForm
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          loading={saving}
          isEdit={!!editTarget}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Announcement"
      >
        <p style={{ marginBottom: 'var(--space-lg)', color: 'var(--color-text)' }}>
          Are you sure you want to delete <strong>{deleteTarget?.title}</strong>? This cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end' }}>
          <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" loading={deleting} onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}

export default AnnouncementManager;
