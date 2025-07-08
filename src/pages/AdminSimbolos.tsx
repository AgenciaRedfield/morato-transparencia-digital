import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import SimbolosList from '@/components/admin/simbolos/SimbolosList';

const AdminSimbolos = () => {
  return (
    <AdminLayout>
      <SimbolosList />
    </AdminLayout>
  );
};

export default AdminSimbolos;