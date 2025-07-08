import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, FileDown, Eye } from 'lucide-react';
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

interface Formulario {
  id: string;
  nome: string;
  descricao: string | null;
  ativo: boolean;
  email_destino: string;
  created_at: string;
  updated_at: string;
}

const FormulariosList = () => {
  const [formularios, setFormularios] = useState<Formulario[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchFormularios();
  }, []);

  const fetchFormularios = async () => {
    try {
      const { data, error } = await supabase
        .from('formularios')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFormularios(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar formulários",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFormularioStatus = async (id: string, ativo: boolean) => {
    try {
      const { error } = await supabase
        .from('formularios')
        .update({ ativo })
        .eq('id', id);

      if (error) throw error;

      setFormularios(prev => 
        prev.map(f => f.id === id ? { ...f, ativo } : f)
      );

      toast({
        title: ativo ? "Formulário ativado" : "Formulário desativado",
        description: `O formulário foi ${ativo ? 'ativado' : 'desativado'} com sucesso.`,
      });
    } catch (error: any) {
      toast({
        title: "Erro ao alterar status do formulário",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteFormulario = async (id: string) => {
    try {
      const { error } = await supabase
        .from('formularios')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setFormularios(formularios.filter(f => f.id !== id));
      toast({
        title: "Formulário excluído",
        description: "O formulário foi excluído com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao excluir formulário",
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
          <h1 className="text-3xl font-bold text-gray-900">Formulários</h1>
          <p className="text-gray-600">Gerencie os formulários públicos</p>
        </div>
        <Link to="/admin/formularios/novo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Formulário
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {formularios.map((formulario) => (
          <Card key={formulario.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileDown className="h-5 w-5" />
                    {formulario.nome}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {formulario.descricao || 'Sem descrição'}
                  </CardDescription>
                  <div className="flex items-center gap-2 mt-2">
                    {formulario.ativo ? (
                      <Badge variant="default">Ativo</Badge>
                    ) : (
                      <Badge variant="destructive">Inativo</Badge>
                    )}
                    <Badge variant="outline">Para: {formulario.email_destino}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={formulario.ativo ? "secondary" : "default"}
                    size="sm"
                    onClick={() => toggleFormularioStatus(formulario.id, !formulario.ativo)}
                  >
                    {formulario.ativo ? 'Desativar' : 'Ativar'}
                  </Button>
                  <Link to={`/admin/formularios/${formulario.id}/respostas`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to={`/admin/formularios/${formulario.id}/editar`}>
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
                          Tem certeza que deseja excluir este formulário? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteFormulario(formulario.id)}>
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
                Criado em: {new Date(formulario.created_at).toLocaleDateString('pt-BR')}
                {formulario.updated_at !== formulario.created_at && (
                  <span className="ml-4">
                    Atualizado em: {new Date(formulario.updated_at).toLocaleDateString('pt-BR')}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {formularios.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">Nenhum formulário encontrado.</p>
              <Link to="/admin/formularios/novo">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar primeiro formulário
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FormulariosList;