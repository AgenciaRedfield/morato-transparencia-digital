import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AgendaList from '@/components/admin/agenda/AgendaList';

const AdminAgenda = () => {
  return (
    <AdminLayout>
      <AgendaList />
    </AdminLayout>
  );
};

export default AdminAgenda;