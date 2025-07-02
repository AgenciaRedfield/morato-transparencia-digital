import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
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

interface Pagina {
  id: string;
  titulo: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  visivel_menu: boolean;
  ordem_menu: number | null;
  created_at: string;
}

const PaginasList = () => {
  const [paginas, setPaginas] = useState<Pagina[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPaginas();
  }, []);

  const fetchPaginas = async () => {
    try {
      const { data, error } = await supabase
        .from('paginas')
        .select('id, titulo, slug, status, visivel_menu, ordem_menu, created_at')
        .order('ordem_menu', { ascending: true, nullsFirst: false });

      if (error) throw error;
      setPaginas(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar páginas",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deletePagina = async (id: string) => {
    try {
      const { error } = await supabase
        .from('paginas')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPaginas(paginas.filter(p => p.id !== id));
      toast({
        title: "Página excluída",
        description: "A página foi excluída com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao excluir página",
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
          <h1 className="text-3xl font-bold text-gray-900">Páginas</h1>
          <p className="text-gray-600">Gerencie as páginas institucionais</p>
        </div>
        <Link to="/admin/paginas/nova">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Página
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {paginas.map((pagina) => (
          <Card key={pagina.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{pagina.titulo}</CardTitle>
                  <CardDescription className="mt-1">
                    /{pagina.slug}
                  </CardDescription>
                  <div className="flex items-center gap-2 mt-2">
                    {getStatusBadge(pagina.status)}
                    {pagina.visivel_menu && (
                      <Badge variant="outline">Visível no menu</Badge>
                    )}
                    {pagina.ordem_menu && (
                      <Badge variant="outline">Ordem: {pagina.ordem_menu}</Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link to={`/admin/paginas/${pagina.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to={`/admin/paginas/${pagina.id}/editar`}>
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
                          Tem certeza que deseja excluir esta página? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deletePagina(pagina.id)}>
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
                Criado em: {new Date(pagina.created_at).toLocaleDateString('pt-BR')}
              </div>
            </CardContent>
          </Card>
        ))}

        {paginas.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">Nenhuma página encontrada.</p>
              <Link to="/admin/paginas/nova">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar primeira página
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PaginasList;