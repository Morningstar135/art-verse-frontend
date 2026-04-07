import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Modal, Button, Loader, EmptyState } from '../common';
import { formatPrice } from '../../utils/formatters';
import {
  adminGetCourses,
  adminCreateCourse,
  adminUpdateCourse,
  adminDeleteCourse,
  adminAddLesson,
  adminDeleteLesson,
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

const badgeStyle = (active) => ({
  display: 'inline-block',
  padding: '2px 8px',
  borderRadius: '999px',
  fontSize: '0.75rem',
  fontWeight: 600,
  backgroundColor: active ? 'rgba(40, 167, 69, 0.15)' : 'rgba(255, 193, 7, 0.15)',
  color: active ? '#28a745' : '#ffc107',
});

const INITIAL_COURSE_FORM = {
  title: '',
  description: '',
  price: 1000000, // ₹10,000 in paise
  curriculum: '',
  isPublished: false,
  thumbnailFile: null,
};

const INITIAL_LESSON_FORM = {
  title: '',
  description: '',
  duration: '',
  videoFile: null,
};

function CourseForm({ form, setForm, onSubmit, loading, isEdit }) {
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
        <label className="form-label">Description *</label>
        <textarea
          className="form-input"
          required
          rows={3}
          style={{ resize: 'vertical' }}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Price *</label>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            overflow: 'hidden',
          }}>
            <span style={{
              padding: '8px 12px',
              fontSize: '0.9375rem',
              fontWeight: 600,
              color: 'var(--color-text-light)',
              borderRight: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-bg)',
              userSelect: 'none',
            }}>₹</span>
            <input
              type="text"
              inputMode="decimal"
              required
              placeholder="10000"
              style={{
                flex: 1,
                padding: '8px 12px',
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                fontSize: '0.9375rem',
                fontWeight: 500,
                color: 'var(--color-text)',
                fontFamily: 'var(--font-primary)',
              }}
              value={form.price ? (form.price / 100).toFixed(0) : ''}
              onChange={(e) => {
                const paise = Math.round((parseFloat(e.target.value) || 0) * 100);
                setForm((f) => ({ ...f, price: paise }));
              }}
              onFocus={(e) => e.target.select()}
            />
          </div>
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">
            Published
            <input
              type="checkbox"
              style={{ marginLeft: 'var(--space-sm)' }}
              checked={form.isPublished}
              onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))}
            />
          </label>
        </div>
      </div>

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Curriculum Overview</label>
        <textarea
          className="form-input"
          rows={2}
          style={{ resize: 'vertical' }}
          placeholder="Brief curriculum description"
          value={form.curriculum}
          onChange={(e) => setForm((f) => ({ ...f, curriculum: e.target.value }))}
        />
      </div>

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">{isEdit ? 'Replace Thumbnail (optional)' : 'Thumbnail Image'}</label>
        <input
          type="file"
          accept="image/*"
          style={{ fontSize: '0.875rem' }}
          onChange={(e) =>
            setForm((f) => ({ ...f, thumbnailFile: e.target.files[0] || null }))
          }
        />
      </div>

      <Button type="submit" variant="primary" fullWidth loading={loading}>
        {isEdit ? 'Update Course' : 'Create Course'}
      </Button>
    </form>
  );
}

function LessonForm({ onSubmit, loading }) {
  const [form, setForm] = useState(INITIAL_LESSON_FORM);

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}
    >
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Lesson Title *</label>
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
          rows={2}
          style={{ resize: 'vertical' }}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        />
      </div>

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Duration (minutes)</label>
        <input
          className="form-input"
          type="number"
          min="1"
          value={form.duration}
          onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
        />
      </div>

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Video File</label>
        <input
          type="file"
          accept="video/*"
          style={{ fontSize: '0.875rem' }}
          onChange={(e) =>
            setForm((f) => ({ ...f, videoFile: e.target.files[0] || null }))
          }
        />
      </div>

      <Button type="submit" variant="primary" fullWidth loading={loading}>
        Add Lesson
      </Button>
    </form>
  );
}

function LessonManager({ course, onClose, onUpdated }) {
  const [lessons, setLessons] = useState(course.lessons || []);
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [addingLesson, setAddingLesson] = useState(false);
  const [deletingLessonId, setDeletingLessonId] = useState(null);

  async function handleAddLesson(form) {
    setAddingLesson(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('duration', form.duration);
      if (form.videoFile) fd.append('video', form.videoFile);

      const res = await adminAddLesson(course.id, fd);
      setLessons((prev) => [...prev, res.lesson]);
      setShowAddLesson(false);
      toast.success('Lesson added');
      onUpdated();
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to add lesson');
    } finally {
      setAddingLesson(false);
    }
  }

  async function handleDeleteLesson(lessonId) {
    setDeletingLessonId(lessonId);
    try {
      await adminDeleteLesson(course.id, lessonId);
      setLessons((prev) => prev.filter((l) => (l._id || l.id) !== lessonId));
      toast.success('Lesson deleted');
      onUpdated();
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to delete lesson');
    } finally {
      setDeletingLessonId(null);
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-primary)' }}>
          Lessons for: {course.title}
        </h3>
        <Button variant="primary" size="sm" onClick={() => setShowAddLesson(true)}>+ Add Lesson</Button>
      </div>

      {lessons.length === 0 ? (
        <p style={{ color: 'var(--color-text-light)', fontSize: '0.875rem' }}>No lessons yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          {lessons.map((lesson, idx) => {
            const lessonId = lesson._id || lesson.id;
            return (
              <div
                key={lessonId || idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--space-sm) var(--space-md)',
                  backgroundColor: 'var(--color-bg)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div>
                  <div style={{ fontWeight: 500, fontSize: '0.9375rem' }}>{lesson.title}</div>
                  {lesson.duration && (
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-light)' }}>
                      {lesson.duration} min
                    </div>
                  )}
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  loading={deletingLessonId === lessonId}
                  onClick={() => handleDeleteLesson(lessonId)}
                >
                  Delete
                </Button>
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={showAddLesson} onClose={() => setShowAddLesson(false)} title="Add Lesson">
        <LessonForm onSubmit={handleAddLesson} loading={addingLesson} />
      </Modal>
    </div>
  );
}

function CourseManager() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(INITIAL_COURSE_FORM);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [lessonTarget, setLessonTarget] = useState(null);

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    setLoading(true);
    try {
      const res = await adminGetCourses();
      setCourses(res.courses || []);
    } catch {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditTarget(null);
    setForm(INITIAL_COURSE_FORM);
    setShowModal(true);
  }

  function openEdit(course) {
    setEditTarget(course);
    setForm({
      title: course.title || '',
      description: course.description || '',
      price: course.price || '',
      curriculum: course.curriculum || '',
      isPublished: course.isPublished || false,
      thumbnailFile: null,
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
      fd.append('price', form.price);
      fd.append('curriculum', form.curriculum);
      fd.append('isPublished', form.isPublished);
      if (form.thumbnailFile) fd.append('image', form.thumbnailFile);

      if (editTarget) {
        await adminUpdateCourse(editTarget.id, fd);
        toast.success('Course updated');
      } else {
        await adminCreateCourse(fd);
        toast.success('Course created');
      }
      setShowModal(false);
      loadCourses();
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to save course');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminDeleteCourse(deleteTarget.id);
      toast.success('Course deleted');
      setDeleteTarget(null);
      loadCourses();
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to delete course');
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Loader /></div>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-lg)' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-primary)', margin: 0 }}>
          Courses
        </h2>
        <Button variant="primary" onClick={openCreate}>+ Add Course</Button>
      </div>

      {courses.length === 0 ? (
        <EmptyState title="No courses yet" description="Create your first course to get started." />
      ) : (
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <table style={tableStyle}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-bg)' }}>
                <th style={thStyle}>Thumbnail</th>
                <th style={thStyle}>Title</th>
                <th style={thStyle}>Price</th>
                <th style={thStyle}>Lessons</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr
                  key={course.id}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                >
                  <td style={tdStyle}>
                    {course.thumbnailUrl ? (
                      <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                      />
                    ) : (
                      <div style={{ width: 48, height: 48, backgroundColor: 'var(--color-border)', borderRadius: 'var(--radius-sm)' }} />
                    )}
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 500 }}>{course.title}</td>
                  <td style={tdStyle}>{formatPrice(course.price)}</td>
                  <td style={tdStyle}>{course.lessonCount ?? 0}</td>
                  <td style={tdStyle}>
                    <span style={badgeStyle(course.isPublished)}>
                      {course.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap' }}>
                      <Button variant="outline" size="sm" onClick={() => openEdit(course)}>Edit</Button>
                      <Button variant="secondary" size="sm" onClick={() => setLessonTarget(course)}>Lessons</Button>
                      <Button variant="danger" size="sm" onClick={() => setDeleteTarget(course)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Course Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editTarget ? 'Edit Course' : 'Add Course'}>
        <CourseForm
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          loading={saving}
          isEdit={!!editTarget}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Course">
        <p style={{ marginBottom: 'var(--space-lg)', color: 'var(--color-text)' }}>
          Are you sure you want to delete <strong>{deleteTarget?.title}</strong>? Courses with active enrollments cannot be deleted.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end' }}>
          <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" loading={deleting} onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>

      {/* Lesson Manager Modal */}
      <Modal
        isOpen={!!lessonTarget}
        onClose={() => setLessonTarget(null)}
        title="Manage Lessons"
      >
        {lessonTarget && (
          <LessonManager
            course={lessonTarget}
            onClose={() => setLessonTarget(null)}
            onUpdated={loadCourses}
          />
        )}
      </Modal>
    </div>
  );
}

export default CourseManager;
