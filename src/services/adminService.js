import api from './api';

// ── Dashboard ──────────────────────────────────────────────────────────

export async function getDashboardStats() {
  const res = await api.get('/admin/dashboard');
  return res.data;
}

// ── Artworks ───────────────────────────────────────────────────────────

export async function adminGetArtworks({ page = 1, limit = 20 } = {}) {
  const res = await api.get('/admin/artworks', { params: { page, limit } });
  return res.data;
}

export async function adminCreateArtwork(formData) {
  const res = await api.post('/admin/artworks', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function adminUpdateArtwork(id, formData) {
  const res = await api.put(`/admin/artworks/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function adminDeleteArtwork(id) {
  const res = await api.delete(`/admin/artworks/${id}`);
  return res.data;
}

// ── Categories ─────────────────────────────────────────────────────────

export async function adminGetCategories() {
  const res = await api.get('/admin/categories');
  return res.data;
}

export async function adminCreateCategory(data) {
  const res = await api.post('/admin/categories', data);
  return res.data;
}

export async function adminUpdateCategory(id, data) {
  const res = await api.put(`/admin/categories/${id}`, data);
  return res.data;
}

export async function adminDeleteCategory(id) {
  const res = await api.delete(`/admin/categories/${id}`);
  return res.data;
}

// ── Courses ────────────────────────────────────────────────────────────

export async function adminGetCourses() {
  const res = await api.get('/admin/courses');
  return res.data;
}

export async function adminCreateCourse(formData) {
  const res = await api.post('/admin/courses', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function adminUpdateCourse(id, formData) {
  const res = await api.put(`/admin/courses/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function adminDeleteCourse(id) {
  const res = await api.delete(`/admin/courses/${id}`);
  return res.data;
}

// ── Lessons ────────────────────────────────────────────────────────────

export async function adminAddLesson(courseId, formData) {
  const res = await api.post(`/admin/courses/${courseId}/lessons`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function adminUpdateLesson(courseId, lessonId, formData) {
  const res = await api.put(
    `/admin/courses/${courseId}/lessons/${lessonId}`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return res.data;
}

export async function adminDeleteLesson(courseId, lessonId) {
  const res = await api.delete(`/admin/courses/${courseId}/lessons/${lessonId}`);
  return res.data;
}

// ── Announcements ─────────────────────────────────────────────────────

export async function adminGetAnnouncements() {
  const res = await api.get('/admin/announcements');
  return res.data;
}

export async function adminCreateAnnouncement(data) {
  const res = await api.post('/admin/announcements', data);
  return res.data;
}

export async function adminUpdateAnnouncement(id, data) {
  const res = await api.put(`/admin/announcements/${id}`, data);
  return res.data;
}

export async function adminDeleteAnnouncement(id) {
  const res = await api.delete(`/admin/announcements/${id}`);
  return res.data;
}

// ── Orders ─────────────────────────────────────────────────────────────

export async function adminGetOrders({ page = 1, limit = 20, status, startDate, endDate } = {}) {
  const params = { page, limit };
  if (status) params.status = status;
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  const res = await api.get('/admin/orders', { params });
  return res.data;
}

export async function adminGetOrderDetail(id) {
  const res = await api.get(`/admin/orders/${id}`);
  return res.data;
}

export async function adminUpdateOrderStatus(id, status) {
  const res = await api.put(`/admin/orders/${id}/status`, { status });
  return res.data;
}
