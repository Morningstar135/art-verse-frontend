import api from './api';

export const getCourses = (params) => api.get('/courses', { params });
export const getCourse = (id) => api.get(`/courses/${id}`);
export const enrollInCourse = (id) => api.post(`/courses/${id}/enroll`);
export const verifyEnrollmentPayment = (id, data) => api.post(`/courses/${id}/verify-payment`, data);
export const getLesson = (courseId, lessonId) => api.get(`/courses/${courseId}/lessons/${lessonId}`);
