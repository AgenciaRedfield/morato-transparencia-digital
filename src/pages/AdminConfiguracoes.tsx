import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ConfiguracoesList from '@/components/admin/configuracoes/ConfiguracoesList';

const AdminConfiguracoes = () => {
  return (
    <AdminLayout>
      <ConfiguracoesList />
    </AdminLayout>
  );
};

export default AdminConfiguracoes;