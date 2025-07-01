
import React from 'react';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Informações */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">FM</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">Câmara Municipal</h3>
                <p className="text-sm text-gray-300">Francisco Morato</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm">
              Portal oficial da Câmara Municipal de Francisco Morato, 
              promovendo transparência e participação cidadã.
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/vereadores" className="text-gray-300 hover:text-white transition-colors">Vereadores</a></li>
              <li><a href="/transparencia" className="text-gray-300 hover:text-white transition-colors">Transparência</a></li>
              <li><a href="/proposicoes" className="text-gray-300 hover:text-white transition-colors">Proposições</a></li>
              <li><a href="/noticias" className="text-gray-300 hover:text-white transition-colors">Notícias</a></li>
              <li><a href="/contato" className="text-gray-300 hover:text-white transition-colors">Fale Conosco</a></li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contato</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">
                  Rua Exemplo, 123<br />
                  Francisco Morato - SP<br />
                  CEP: 07999-000
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">(11) 4656-1244</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">contato@camarafm.sp.gov.br</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">Seg-Sex: 8h às 17h</span>
              </div>
            </div>
          </div>

          {/* Redes Sociais */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Redes Sociais</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Youtube className="h-6 w-6" />
              </a>
            </div>
            <div className="mt-4">
              <h5 className="font-semibold mb-2">Ouvidoria</h5>
              <p className="text-sm text-gray-300">
                Canal direto para denúncias, sugestões e elogios.
              </p>
              <a href="/ouvidoria" className="text-blue-400 hover:text-blue-300 text-sm">
                Acesse aqui →
              </a>
            </div>
          </div>
        </div>

        {/* Rodapé inferior */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © 2024 Câmara Municipal de Francisco Morato. Todos os direitos reservados.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="/lgpd" className="text-sm text-gray-400 hover:text-white">
                Política de Privacidade
              </a>
              <a href="/acessibilidade" className="text-sm text-gray-400 hover:text-white">
                Acessibilidade
              </a>
              <a href="/mapa-site" className="text-sm text-gray-400 hover:text-white">
                Mapa do Site
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
