import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import NoticiaForm from '@/components/admin/noticias/NoticiaForm';

const AdminNoticiaForm = () => {
  return (
    <AdminLayout>
      <NoticiaForm />
    </AdminLayout>
  );
};

export default AdminNoticiaForm;