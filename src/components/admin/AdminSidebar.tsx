
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  FileText, 
  Newspaper, 
  Scale, 
  Eye, 
  MessageSquare, 
  FileDown, 
  Award,
  Settings,
  User,
  Calendar
} from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', icon: Home, label: 'Dashboard' },
    { path: '/admin/vereadores', icon: Users, label: 'Vereadores' },
    { path: '/admin/mesa-diretora', icon: Award, label: 'Mesa Diretora' },
    { path: '/admin/legislaturas', icon: Scale, label: 'Legislaturas' },
    { path: '/admin/proposicoes', icon: FileText, label: 'Proposições' },
    { path: '/admin/noticias', icon: Newspaper, label: 'Notícias' },
    { path: '/admin/agenda', icon: Calendar, label: 'Agenda' },
    { path: '/admin/paginas', icon: FileText, label: 'Páginas' },
    { path: '/admin/transparencia', icon: Eye, label: 'Transparência' },
    { path: '/admin/simbolos', icon: Award, label: 'Símbolos Oficiais' },
    { path: '/admin/ouvidoria', icon: MessageSquare, label: 'Ouvidoria' },
    { path: '/admin/formularios', icon: FileDown, label: 'Formulários' },
    { path: '/admin/usuarios', icon: User, label: 'Usuários' },
    { path: '/admin/configuracoes', icon: Settings, label: 'Configurações' },
  ];

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
      <div className="flex h-16 items-center justify-center border-b">
        <h1 className="text-xl font-bold text-gray-900">CMS Câmara</h1>
      </div>
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar;
