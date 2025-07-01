
import React from 'react';
import { Download, ExternalLink, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const QuickAccessSection = () => {
  const quickLinks = [
    {
      title: 'Portal da Transparência',
      description: 'Acesse dados de gastos públicos e prestação de contas',
      action: 'Acessar Portal',
      icon: ExternalLink,
      variant: 'default' as const
    },
    {
      title: 'Regimento Interno',
      description: 'Consulte as regras de funcionamento da Câmara',
      action: 'Download PDF',
      icon: Download,
      variant: 'outline' as const
    },
    {
      title: 'Ouvidoria',
      description: 'Faça denúncias, sugestões ou tire dúvidas',
      action: 'Fale Conosco',
      icon: AlertCircle,
      variant: 'secondary' as const
    }
  ];

  const upcomingEvents = [
    {
      date: '25 JAN',
      title: 'Sessão Ordinária',
      time: '19h00',
      type: 'Sessão Plenária'
    },
    {
      date: '30 JAN',
      title: 'Audiência Pública - Orçamento 2024',
      time: '14h00',
      type: 'Audiência Pública'
    },
    {
      date: '01 FEV',
      title: 'Reunião Comissão de Finanças',
      time: '09h00',
      type: 'Comissão'
    }
  ];

  return (
    <section className="py-16 bg-blue-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Links Rápidos */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Acesso Rápido
            </h2>
            <div className="space-y-6">
              {quickLinks.map((link, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {link.title}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {link.description}
                        </p>
                        <Button variant={link.variant} className="w-full sm:w-auto">
                          <link.icon className="mr-2 h-4 w-4" />
                          {link.action}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Próximos Eventos */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Próximos Eventos
            </h2>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Agenda da Câmara</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50">
                      <div className="text-center">
                        <div className="text-sm font-bold text-blue-600 bg-white px-2 py-1 rounded">
                          {event.date}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {event.title}
                        </h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{event.time}</span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                            {event.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Button variant="outline" className="w-full">
                    Ver Agenda Completa
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickAccessSection;
