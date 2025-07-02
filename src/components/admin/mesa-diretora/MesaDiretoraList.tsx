import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Mail, Phone } from 'lucide-react';
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

interface MesaDiretora {
  id: string;
  cargo: string;
  telefone_institucional: string | null;
  email_institucional: string | null;
  periodo_inicio: string;
  periodo_fim: string | null;
  ativo: boolean;
  created_at: string;
  vereadores?: {
    nome: string;
    partido: string;
  };
}

const MesaDiretoraList = () => {
  const [membros, setMembros] = useState<MesaDiretora[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMembros();
  }, []);

  const fetchMembros = async () => {
    try {
      const { data, error } = await supabase
        .from('mesa_diretora')
        .select(`
          id, cargo, telefone_institucional, email_institucional, 
          periodo_inicio, periodo_fim, ativo, created_at,
          vereadores:vereador_id (nome, partido)
        `)
        .order('periodo_inicio', { ascending: false });

      if (error) throw error;
      setMembros(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar mesa diretora",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteMembro = async (id: string) => {
    try {
      const { error } = await supabase
        .from('mesa_diretora')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMembros(membros.filter(m => m.id !== id));
      toast({
        title: "Membro removido",
        description: "O membro foi removido da mesa diretora com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao remover membro",
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
          <h1 className="text-3xl font-bold text-gray-900">Mesa Diretora</h1>
          <p className="text-gray-600">Gerencie os membros da mesa diretora</p>
        </div>
        <Link to="/admin/mesa-diretora/novo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Membro
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {membros.map((membro) => (
          <Card key={membro.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{membro.cargo}</CardTitle>
                  {membro.vereadores && (
                    <CardDescription className="mt-1">
                      {membro.vereadores.nome} - {membro.vereadores.partido}
                    </CardDescription>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    {membro.ativo ? (
                      <Badge variant="default">Ativo</Badge>
                    ) : (
                      <Badge variant="secondary">Inativo</Badge>
                    )}
                    <Badge variant="outline">
                      {new Date(membro.periodo_inicio).toLocaleDateString('pt-BR')} - 
                      {membro.periodo_fim ? 
                        new Date(membro.periodo_fim).toLocaleDateString('pt-BR') : 
                        'Atual'
                      }
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link to={`/admin/mesa-diretora/${membro.id}/editar`}>
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
                        <AlertDialogTitle>Confirmar remoção</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja remover este membro da mesa diretora? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteMembro(membro.id)}>
                          Remover
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            {(membro.email_institucional || membro.telefone_institucional) && (
              <CardContent>
                <div className="flex gap-4 text-sm text-gray-600">
                  {membro.email_institucional && (
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {membro.email_institucional}
                    </div>
                  )}
                  {membro.telefone_institucional && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {membro.telefone_institucional}
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        ))}

        {membros.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">Nenhum membro da mesa diretora encontrado.</p>
              <Link to="/admin/mesa-diretora/novo">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar primeiro membro
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MesaDiretoraList;