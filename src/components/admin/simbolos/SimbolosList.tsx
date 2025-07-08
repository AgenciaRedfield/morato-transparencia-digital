import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Award, Eye } from 'lucide-react';
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

interface Simbolo {
  id: string;
  titulo: string;
  tipo: string;
  ativo: boolean;
  descricao: string | null;
  arquivo_url: string | null;
  created_at: string;
}

const SimbolosList = () => {
  const [simbolos, setSimbolos] = useState<Simbolo[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSimbolos();
  }, []);

  const fetchSimbolos = async () => {
    try {
      const { data, error } = await supabase
        .from('simbolos_oficiais')
        .select('*')
        .order('tipo', { ascending: true });

      if (error) throw error;
      setSimbolos(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar símbolos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSimboloStatus = async (id: string, ativo: boolean) => {
    try {
      const { error } = await supabase
        .from('simbolos_oficiais')
        .update({ ativo })
        .eq('id', id);

      if (error) throw error;

      setSimbolos(prev => 
        prev.map(s => s.id === id ? { ...s, ativo } : s)
      );

      toast({
        title: ativo ? "Símbolo ativado" : "Símbolo desativado",
        description: `O símbolo foi ${ativo ? 'ativado' : 'desativado'} com sucesso.`,
      });
    } catch (error: any) {
      toast({
        title: "Erro ao alterar status do símbolo",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteSimbolo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('simbolos_oficiais')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSimbolos(simbolos.filter(s => s.id !== id));
      toast({
        title: "Símbolo excluído",
        description: "O símbolo foi excluído com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao excluir símbolo",
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
          <h1 className="text-3xl font-bold text-gray-900">Símbolos Oficiais</h1>
          <p className="text-gray-600">Gerencie os símbolos oficiais do município</p>
        </div>
        <Link to="/admin/simbolos/novo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Símbolo
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {simbolos.map((simbolo) => (
          <Card key={simbolo.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    {simbolo.titulo}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {simbolo.tipo}
                  </CardDescription>
                  <div className="flex items-center gap-2 mt-2">
                    {simbolo.ativo ? (
                      <Badge variant="default">Ativo</Badge>
                    ) : (
                      <Badge variant="destructive">Inativo</Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={simbolo.ativo ? "secondary" : "default"}
                    size="sm"
                    onClick={() => toggleSimboloStatus(simbolo.id, !simbolo.ativo)}
                  >
                    {simbolo.ativo ? 'Desativar' : 'Ativar'}
                  </Button>
                  <Link to={`/admin/simbolos/${simbolo.id}/editar`}>
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
                          Tem certeza que deseja excluir este símbolo? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteSimbolo(simbolo.id)}>
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {simbolo.descricao && (
                <p className="text-sm text-gray-600 mb-2">{simbolo.descricao}</p>
              )}
              <div className="text-sm text-gray-500">
                Criado em: {new Date(simbolo.created_at).toLocaleDateString('pt-BR')}
              </div>
            </CardContent>
          </Card>
        ))}

        {simbolos.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">Nenhum símbolo encontrado.</p>
              <Link to="/admin/simbolos/novo">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar primeiro símbolo
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SimbolosList;