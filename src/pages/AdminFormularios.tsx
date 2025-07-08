import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import FormulariosList from '@/components/admin/formularios/FormulariosList';

const AdminFormularios = () => {
  return (
    <AdminLayout>
      <FormulariosList />
    </AdminLayout>
  );
};

export default AdminFormularios;