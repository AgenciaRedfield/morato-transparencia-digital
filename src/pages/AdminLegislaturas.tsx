import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import LegislaturasList from '@/components/admin/legislaturas/LegislaturasList';

const AdminLegislaturas = () => {
  return (
    <AdminLayout>
      <LegislaturasList />
    </AdminLayout>
  );
};

export default AdminLegislaturas;