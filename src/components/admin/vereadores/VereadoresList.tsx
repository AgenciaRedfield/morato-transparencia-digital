import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Eye, Users } from 'lucide-react';
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

interface Vereador {
  id: string;
  nome: string;
  partido: string;
  ativo: boolean;
  email: string | null;
  telefone: string | null;
  foto_url: string | null;
  created_at: string;
}

const VereadoresList = () => {
  const [vereadores, setVereadores] = useState<Vereador[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchVereadores();
  }, []);

  const fetchVereadores = async () => {
    try {
      const { data, error } = await supabase
        .from('vereadores')
        .select('id, nome, partido, ativo, email, telefone, foto_url, created_at')
        .order('nome', { ascending: true });

      if (error) throw error;
      setVereadores(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar vereadores",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleVereadorStatus = async (id: string, ativo: boolean) => {
    try {
      const { error } = await supabase
        .from('vereadores')
        .update({ ativo })
        .eq('id', id);

      if (error) throw error;

      setVereadores(prev => 
        prev.map(v => v.id === id ? { ...v, ativo } : v)
      );

      toast({
        title: ativo ? "Vereador ativado" : "Vereador desativado",
        description: `O vereador foi ${ativo ? 'ativado' : 'desativado'} com sucesso.`,
      });
    } catch (error: any) {
      toast({
        title: "Erro ao alterar status do vereador",
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
          <h1 className="text-3xl font-bold text-gray-900">Vereadores</h1>
          <p className="text-gray-600">Gerencie os vereadores da câmara</p>
        </div>
        <Link to="/admin/vereadores/novo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Vereador
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {vereadores.map((vereador) => (
          <Card key={vereador.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {vereador.nome}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {vereador.partido}
                  </CardDescription>
                  <div className="flex items-center gap-2 mt-2">
                    {vereador.ativo ? (
                      <Badge variant="default">Ativo</Badge>
                    ) : (
                      <Badge variant="destructive">Inativo</Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={vereador.ativo ? "secondary" : "default"}
                    size="sm"
                    onClick={() => toggleVereadorStatus(vereador.id, !vereador.ativo)}
                  >
                    {vereador.ativo ? 'Desativar' : 'Ativar'}
                  </Button>
                  <Link to={`/admin/vereadores/${vereador.id}/editar`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500">
                {vereador.email && <p>Email: {vereador.email}</p>}
                {vereador.telefone && <p>Telefone: {vereador.telefone}</p>}
                <p>Criado em: {new Date(vereador.created_at).toLocaleDateString('pt-BR')}</p>
              </div>
            </CardContent>
          </Card>
        ))}

        {vereadores.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">Nenhum vereador encontrado.</p>
              <Link to="/admin/vereadores/novo">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar primeiro vereador
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VereadoresList;