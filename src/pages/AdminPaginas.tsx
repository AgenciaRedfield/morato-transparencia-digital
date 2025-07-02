import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import PaginasList from '@/components/admin/paginas/PaginasList';

const AdminPaginas = () => {
  return (
    <AdminLayout>
      <PaginasList />
    </AdminLayout>
  );
};

export default AdminPaginas;