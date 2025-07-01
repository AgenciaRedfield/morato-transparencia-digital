
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, FileText, Eye } from 'lucide-react';

const HeroSection = () => {
  const stats = [
    { icon: Users, label: 'Vereadores', value: '11' },
    { icon: FileText, label: 'Proposições', value: '245' },
    { icon: Eye, label: 'Transparência', value: '100%' },
  ];

  return (
    <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Conteúdo Principal */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Transparência e 
              <span className="text-blue-300"> Democracia</span>
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Acompanhe os trabalhos da Câmara Municipal de Francisco Morato. 
              Conheça os vereadores, proposições e tenha acesso completo às 
              informações públicas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-white text-blue-900 hover:bg-blue-50 font-semibold"
              >
                Conheça os Vereadores
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-900"
              >
                Portal da Transparência
              </Button>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">
                Câmara em Números
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <stat.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-blue-200 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-blue-100">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Horário de Funcionamento */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
              <h4 className="font-semibold text-lg mb-3">Horário de Funcionamento</h4>
              <div className="space-y-2 text-blue-100">
                <div className="flex justify-between">
                  <span>Segunda a Sexta:</span>
                  <span className="font-semibold">8h às 17h</span>
                </div>
                <div className="flex justify-between">
                  <span>Sessões:</span>
                  <span className="font-semibold">Quintas, 19h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
