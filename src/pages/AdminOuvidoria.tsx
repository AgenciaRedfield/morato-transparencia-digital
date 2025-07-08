import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import OuvidoriaList from '@/components/admin/ouvidoria/OuvidoriaList';

const AdminOuvidoria = () => {
  return (
    <AdminLayout>
      <OuvidoriaList />
    </AdminLayout>
  );
};

export default AdminOuvidoria;