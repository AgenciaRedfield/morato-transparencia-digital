
import React from 'react';
import { Users, FileText, Eye, Phone, Calendar, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ServicesSection = () => {
  const services = [
    {
      icon: Users,
      title: 'Vereadores',
      description: 'Conheça os representantes eleitos, suas proposições e formas de contato.',
      link: '/vereadores',
      color: 'bg-blue-500'
    },
    {
      icon: FileText,
      title: 'Proposições',
      description: 'Acompanhe projetos de lei, requerimentos e demais proposições legislativas.',
      link: '/proposicoes',
      color: 'bg-green-500'
    },
    {
      icon: Eye,
      title: 'Transparência',
      description: 'Acesse informações sobre gastos públicos, licitações e prestação de contas.',
      link: '/transparencia',
      color: 'bg-purple-500'
    },
    {
      icon: Calendar,
      title: 'Agenda',
      description: 'Confira as sessões ordinárias, extraordinárias e eventos da Câmara.',
      link: '/agenda',
      color: 'bg-orange-500'
    },
    {
      icon: BookOpen,
      title: 'Legislação',
      description: 'Consulte leis municipais, decretos e demais atos normativos.',
      link: '/legislacao',
      color: 'bg-red-500'
    },
    {
      icon: Phone,
      title: 'Ouvidoria',
      description: 'Canal direto para denúncias, sugestões e solicitações dos cidadãos.',
      link: '/ouvidoria',
      color: 'bg-teal-500'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Serviços e Informações
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Acesse os principais serviços oferecidos pela Câmara Municipal
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 ${service.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <service.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
