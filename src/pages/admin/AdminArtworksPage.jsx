import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import ArtworkManager from '../../components/admin/ArtworkManager';

function AdminArtworksPage() {
  return (
    <AdminLayout>
      <ArtworkManager />
    </AdminLayout>
  );
}

export default AdminArtworksPage;
