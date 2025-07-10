import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import VereadoresForm from '@/components/admin/vereadores/VereadoresForm';

const AdminVereadoresForm = () => {
  return (
    <AdminLayout>
      <VereadoresForm />
    </AdminLayout>
  );
};

export default AdminVereadoresForm;