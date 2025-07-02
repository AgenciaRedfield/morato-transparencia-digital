import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';
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

interface Legislatura {
  id: string;
  numero: number;
  periodo_inicio: string;
  periodo_fim: string;
  descricao: string | null;
  ativa: boolean;
  created_at: string;
}

const LegislaturasList = () => {
  const [legislaturas, setLegislaturas] = useState<Legislatura[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchLegislaturas();
  }, []);

  const fetchLegislaturas = async () => {
    try {
      const { data, error } = await supabase
        .from('legislaturas')
        .select('*')
        .order('numero', { ascending: false });

      if (error) throw error;
      setLegislaturas(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar legislaturas",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteLegislatura = async (id: string) => {
    try {
      const { error } = await supabase
        .from('legislaturas')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setLegislaturas(legislaturas.filter(l => l.id !== id));
      toast({
        title: "Legislatura excluída",
        description: "A legislatura foi excluída com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao excluir legislatura",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleAtiva = async (id: string, ativa: boolean) => {
    try {
      // Se estamos ativando uma legislatura, primeiro desativamos todas as outras
      if (ativa) {
        await supabase
          .from('legislaturas')
          .update({ ativa: false })
          .neq('id', id);
      }

      const { error } = await supabase
        .from('legislaturas')
        .update({ ativa })
        .eq('id', id);

      if (error) throw error;

      // Atualizar o estado local
      setLegislaturas(prev => 
        prev.map(l => ({
          ...l,
          ativa: l.id === id ? ativa : (ativa ? false : l.ativa)
        }))
      );

      toast({
        title: ativa ? "Legislatura ativada" : "Legislatura desativada",
        description: `A legislatura foi ${ativa ? 'ativada' : 'desativada'} com sucesso.`,
      });
    } catch (error: any) {
      toast({
        title: "Erro ao alterar status",
        description: error.message,
        variant: "destructive",
      });
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Legislaturas</h1>
          <p className="text-gray-600">Gerencie os períodos legislativos</p>
        </div>
        <Link to="/admin/legislaturas/nova">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Legislatura
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {legislaturas.map((legislatura) => (
          <Card key={legislatura.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {legislatura.numero}ª Legislatura
                  </CardTitle>
                  {legislatura.descricao && (
                    <CardDescription className="mt-1">
                      {legislatura.descricao}
                    </CardDescription>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    {legislatura.ativa ? (
                      <Badge variant="default">Ativa</Badge>
                    ) : (
                      <Badge variant="secondary">Inativa</Badge>
                    )}
                    <Badge variant="outline">
                      {new Date(legislatura.periodo_inicio).toLocaleDateString('pt-BR')} - 
                      {new Date(legislatura.periodo_fim).toLocaleDateString('pt-BR')}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={legislatura.ativa ? "secondary" : "default"}
                    size="sm"
                    onClick={() => toggleAtiva(legislatura.id, !legislatura.ativa)}
                  >
                    {legislatura.ativa ? 'Desativar' : 'Ativar'}
                  </Button>
                  <Link to={`/admin/legislaturas/${legislatura.id}/editar`}>
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
                          Tem certeza que deseja excluir esta legislatura? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteLegislatura(legislatura.id)}>
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
                Período: {Math.ceil((new Date(legislatura.periodo_fim).getTime() - new Date(legislatura.periodo_inicio).getTime()) / (365.25 * 24 * 60 * 60 * 1000))} anos
              </div>
            </CardContent>
          </Card>
        ))}

        {legislaturas.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">Nenhuma legislatura encontrada.</p>
              <Link to="/admin/legislaturas/nova">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar primeira legislatura
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LegislaturasList;