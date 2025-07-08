import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import VereadoresList from '@/components/admin/vereadores/VereadoresList';

const AdminVereadores = () => {
  return (
    <AdminLayout>
      <VereadoresList />
    </AdminLayout>
  );
};

export default AdminVereadores;