import api from './api';

export async function getArtworks({ category, page = 1, limit = 20 } = {}) {
  const params = { page, limit };
  if (category) params.category = category;
  const res = await api.get('/artworks', { params });
  return res.data;
}

export async function getArtwork(id) {
  const res = await api.get(`/artworks/${id}`);
  return res.data;
}

export async function getCategories() {
  const res = await api.get('/categories');
  return res.data;
}
