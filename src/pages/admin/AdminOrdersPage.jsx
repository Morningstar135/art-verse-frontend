import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import OrderManager from '../../components/admin/OrderManager';

function AdminOrdersPage() {
  return (
    <AdminLayout>
      <OrderManager />
    </AdminLayout>
  );
}

export default AdminOrdersPage;
