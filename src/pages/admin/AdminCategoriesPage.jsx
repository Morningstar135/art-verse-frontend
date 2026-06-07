import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import CategoryManager from '../../components/admin/CategoryManager';

function AdminCategoriesPage() {
  return (
    <AdminLayout>
      <CategoryManager />
    </AdminLayout>
  );
}

export default AdminCategoriesPage;
