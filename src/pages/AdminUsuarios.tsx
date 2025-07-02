import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import UsuariosList from '@/components/admin/usuarios/UsuariosList';

const AdminUsuarios = () => {
  return (
    <AdminLayout>
      <UsuariosList />
    </AdminLayout>
  );
};

export default AdminUsuarios;