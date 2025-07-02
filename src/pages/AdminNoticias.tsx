import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import NoticiasList from '@/components/admin/noticias/NoticiasList';

const AdminNoticias = () => {
  return (
    <AdminLayout>
      <NoticiasList />
    </AdminLayout>
  );
};

export default AdminNoticias;