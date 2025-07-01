
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navItems = [
    { name: 'Início', path: '/' },
    { 
      name: 'Câmara', 
      path: '/camara',
      subItems: [
        { name: 'Mesa Diretora', path: '/mesa-diretora' },
        { name: 'Legislaturas', path: '/legislaturas' },
        { name: 'Símbolos Municipais', path: '/simbolos' },
      ]
    },
    { name: 'Vereadores', path: '/vereadores' },
    { 
      name: 'Trabalhos Legislativos', 
      path: '/trabalhos-legislativos',
      subItems: [
        { name: 'Proposições', path: '/proposicoes' },
        { name: 'Votações', path: '/votacoes' },
        { name: 'Projetos de Lei', path: '/projetos' },
      ]
    },
    { name: 'Transparência', path: '/transparencia' },
    { name: 'Notícias', path: '/noticias' },
    { name: 'Fale Conosco', path: '/contato' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-blue-800 text-white">
      <div className="container mx-auto px-4">
        <div className={`${isOpen ? 'block' : 'hidden'} md:block`}>
          <ul className="flex flex-col md:flex-row md:space-x-8 py-4">
            {navItems.map((item) => (
              <li key={item.name} className="relative group">
                <Link
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-blue-700 text-blue-100'
                  }`}
                  onClick={onClose}
                >
                  {item.name}
                  {item.subItems && <ChevronDown className="ml-1 h-4 w-4" />}
                </Link>
                
                {/* Dropdown Menu */}
                {item.subItems && (
                  <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    <div className="py-2">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.path}
                          className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          onClick={onClose}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
