
import React, { useState } from 'react';
import { Menu, X, Search, Phone, Mail, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navigation from './Navigation';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 24));
    document.documentElement.style.fontSize = `${Math.min(fontSize + 2, 24)}px`;
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 12));
    document.documentElement.style.fontSize = `${Math.max(fontSize - 2, 12)}px`;
  };

  const toggleContrast = () => {
    setHighContrast(!highContrast);
    document.documentElement.classList.toggle('high-contrast');
  };

  return (
    <header className="bg-white shadow-lg">
      {/* Top Bar */}
      <div className="bg-blue-900 text-white">
        <div className="container mx-auto px-4 py-2">
          <div className="flex flex-wrap items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Phone className="h-4 w-4" />
                <span>(11) 4656-1244</span>
              </div>
              <div className="flex items-center space-x-1">
                <Mail className="h-4 w-4" />
                <span>contato@camarafm.sp.gov.br</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Seg-Sex: 8h às 17h</span>
              </div>
            </div>
            
            {/* Accessibility Controls */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={decreaseFontSize}
                className="text-white hover:bg-blue-800 text-xs"
              >
                A-
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={increaseFontSize}
                className="text-white hover:bg-blue-800 text-xs"
              >
                A+
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleContrast}
                className="text-white hover:bg-blue-800 text-xs"
              >
                Alto Contraste
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">FM</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-blue-900">
                Câmara Municipal
              </h1>
              <p className="text-blue-700 text-lg">Francisco Morato</p>
              <p className="text-gray-600 text-sm">Estado de São Paulo</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Pesquisar no portal..."
                className="pl-10 w-80"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Buscar
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Pesquisar no portal..."
              className="pl-10 w-full"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <Navigation isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
};

export default Header;
