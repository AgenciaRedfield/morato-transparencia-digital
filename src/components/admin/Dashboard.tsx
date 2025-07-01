
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Users, FileText, Newspaper, MessageSquare } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    vereadores: 0,
    noticias: 0,
    proposicoes: 0,
    ouvidoria: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [vereadores, noticias, proposicoes, ouvidoria] = await Promise.all([
          supabase.from('vereadores').select('id', { count: 'exact' }),
          supabase.from('noticias').select('id', { count: 'exact' }),
          supabase.from('proposicoes').select('id', { count: 'exact' }),
          supabase.from('ouvidoria').select('id', { count: 'exact' })
        ]);

        setStats({
          vereadores: vereadores.count || 0,
          noticias: noticias.count || 0,
          proposicoes: proposicoes.count || 0,
          ouvidoria: ouvidoria.count || 0
        });
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsCards = [
    {
      title: 'Vereadores',
      value: stats.vereadores,
      description: 'Total de vereadores cadastrados',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Notícias',
      value: stats.noticias,
      description: 'Total de notícias publicadas',
      icon: Newspaper,
      color: 'text-green-600'
    },
    {
      title: 'Proposições',
      value: stats.proposicoes,
      description: 'Total de proposições legislativas',
      icon: FileText,
      color: 'text-purple-600'
    },
    {
      title: 'Ouvidoria',
      value: stats.ouvidoria,
      description: 'Mensagens recebidas',
      icon: MessageSquare,
      color: 'text-orange-600'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral do sistema CMS</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <CardDescription className="text-xs text-muted-foreground">
                  {card.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Acesso rápido às funcionalidades mais utilizadas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <a 
              href="/admin/noticias/nova" 
              className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">Nova Notícia</div>
              <div className="text-sm text-gray-500">Criar uma nova notícia</div>
            </a>
            <a 
              href="/admin/vereadores/novo" 
              className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">Cadastrar Vereador</div>
              <div className="text-sm text-gray-500">Adicionar novo vereador</div>
            </a>
            <a 
              href="/admin/proposicoes/nova" 
              className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">Nova Proposição</div>
              <div className="text-sm text-gray-500">Cadastrar proposição legislativa</div>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>
              Últimas ações realizadas no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-500">
              Nenhuma atividade recente
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
