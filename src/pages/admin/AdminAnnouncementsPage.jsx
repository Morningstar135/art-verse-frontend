import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AnnouncementManager from '../../components/admin/AnnouncementManager';

function AdminAnnouncementsPage() {
  return (
    <AdminLayout>
      <AnnouncementManager />
    </AdminLayout>
  );
}

export default AdminAnnouncementsPage;
