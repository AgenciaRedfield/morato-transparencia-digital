import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Database, Users, Shield, Globe, Mail } from 'lucide-react';

const ConfiguracoesList = () => {
  const configSections = [
    {
      id: 'site',
      title: 'Configurações do Site',
      description: 'Configurações gerais do portal',
      icon: Globe,
      items: [
        'Nome do município',
        'Logo da câmara',
        'Cores do tema',
        'Informações de contato'
      ]
    },
    {
      id: 'users',
      title: 'Gestão de Usuários',
      description: 'Configurações de usuários e permissões',
      icon: Users,
      items: [
        'Políticas de senha',
        'Níveis de acesso',
        'Notificações por email',
        'Sessões ativas'
      ]
    },
    {
      id: 'security',
      title: 'Segurança',
      description: 'Configurações de segurança do sistema',
      icon: Shield,
      items: [
        'Autenticação dois fatores',
        'Logs de auditoria',
        'Backup automático',
        'Política de retenção'
      ]
    },
    {
      id: 'email',
      title: 'Configurações de Email',
      description: 'Configurações do servidor de email',
      icon: Mail,
      items: [
        'Servidor SMTP',
        'Templates de email',
        'Assinatura automática',
        'Lista de distribuição'
      ]
    },
    {
      id: 'database',
      title: 'Banco de Dados',
      description: 'Manutenção e backup do banco',
      icon: Database,
      items: [
        'Backup automático',
        'Limpeza de logs',
        'Otimização',
        'Relatórios de uso'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600">Gerencie as configurações do sistema</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {configSections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  {section.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                      {item}
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurar
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações Avançadas
          </CardTitle>
          <CardDescription>
            Configurações técnicas para administradores experientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline">
              Limpar Cache
            </Button>
            <Button variant="outline">
              Reindexar Busca
            </Button>
            <Button variant="outline">
              Verificar Sistema
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfiguracoesList;