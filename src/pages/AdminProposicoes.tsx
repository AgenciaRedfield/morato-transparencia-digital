import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProposicoesList from '@/components/admin/proposicoes/ProposicoesList';

const AdminProposicoes = () => {
  return (
    <AdminLayout>
      <ProposicoesList />
    </AdminLayout>
  );
};

export default AdminProposicoes;