import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AgendaForm from '@/components/admin/agenda/AgendaForm';

const AdminAgendaForm = () => {
  return (
    <AdminLayout>
      <AgendaForm />
    </AdminLayout>
  );
};

export default AdminAgendaForm;