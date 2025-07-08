import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import TransparenciaList from '@/components/admin/transparencia/TransparenciaList';

const AdminTransparencia = () => {
  return (
    <AdminLayout>
      <TransparenciaList />
    </AdminLayout>
  );
};

export default AdminTransparencia;