import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import MesaDiretoraList from '@/components/admin/mesa-diretora/MesaDiretoraList';

const AdminMesaDiretora = () => {
  return (
    <AdminLayout>
      <MesaDiretoraList />
    </AdminLayout>
  );
};

export default AdminMesaDiretora;