import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import CourseManager from '../../components/admin/CourseManager';

function AdminCoursesPage() {
  return (
    <AdminLayout>
      <CourseManager />
    </AdminLayout>
  );
}

export default AdminCoursesPage;
