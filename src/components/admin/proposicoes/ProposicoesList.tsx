import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Eye, FileText } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Proposicao {
  id: string;
  numero: string;
  ano: number;
  tipo: 'projeto_lei' | 'requerimento' | 'indicacao' | 'mocao' | 'emenda';
  ementa: string;
  situacao: string;
  status: 'draft' | 'published' | 'archived';
  data_apresentacao: string;
  created_at: string;
  vereadores?: {
    nome: string;
  };
}

const ProposicoesList = () => {
  const [proposicoes, setProposicoes] = useState<Proposicao[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProposicoes();
  }, []);

  const fetchProposicoes = async () => {
    try {
      const { data, error } = await supabase
        .from('proposicoes')
        .select(`
          id, numero, ano, tipo, ementa, situacao, status, data_apresentacao, created_at,
          vereadores:autor_id (nome)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProposicoes(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar proposições",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteProposicao = async (id: string) => {
    try {
      const { error } = await supabase
        .from('proposicoes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProposicoes(proposicoes.filter(p => p.id !== id));
      toast({
        title: "Proposição excluída",
        description: "A proposição foi excluída com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao excluir proposição",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: 'secondary',
      published: 'default',
      archived: 'destructive'
    } as const;

    const labels = {
      draft: 'Rascunho',
      published: 'Publicado',
      archived: 'Arquivado'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const getTipoBadge = (tipo: string) => {
    const labels = {
      projeto_lei: 'Projeto de Lei',
      requerimento: 'Requerimento',
      indicacao: 'Indicação',
      mocao: 'Moção',
      emenda: 'Emenda'
    };

    return (
      <Badge variant="outline">
        {labels[tipo as keyof typeof labels]}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Proposições</h1>
          <p className="text-gray-600">Gerencie as proposições legislativas</p>
        </div>
        <Link to="/admin/proposicoes/nova">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Proposição
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {proposicoes.map((proposicao) => (
          <Card key={proposicao.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {proposicao.numero}/{proposicao.ano}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {proposicao.ementa}
                  </CardDescription>
                  <div className="flex items-center gap-2 mt-2">
                    {getTipoBadge(proposicao.tipo)}
                    {getStatusBadge(proposicao.status)}
                    <Badge variant="outline">{proposicao.situacao}</Badge>
                  </div>
                  {proposicao.vereadores && (
                    <div className="text-sm text-gray-600 mt-1">
                      Autor: {proposicao.vereadores.nome}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Link to={`/admin/proposicoes/${proposicao.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to={`/admin/proposicoes/${proposicao.id}/editar`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir esta proposição? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteProposicao(proposicao.id)}>
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500">
                Apresentado em: {new Date(proposicao.data_apresentacao).toLocaleDateString('pt-BR')}
              </div>
            </CardContent>
          </Card>
        ))}

        {proposicoes.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">Nenhuma proposição encontrada.</p>
              <Link to="/admin/proposicoes/nova">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar primeira proposição
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProposicoesList;