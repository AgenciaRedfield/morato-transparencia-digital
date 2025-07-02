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

interface Noticia {
  id: string;
  titulo: string;
  subtitulo: string | null;
  status: 'draft' | 'published' | 'archived';
  destaque: boolean;
  data_publicacao: string | null;
  visualizacoes: number;
  created_at: string;
}

const NoticiasList = () => {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchNoticias();
  }, []);

  const fetchNoticias = async () => {
    try {
      const { data, error } = await supabase
        .from('noticias')
        .select('id, titulo, subtitulo, status, destaque, data_publicacao, visualizacoes, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNoticias(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar notícias",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteNoticia = async (id: string) => {
    try {
      const { error } = await supabase
        .from('noticias')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setNoticias(noticias.filter(n => n.id !== id));
      toast({
        title: "Notícia excluída",
        description: "A notícia foi excluída com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao excluir notícia",
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
          <h1 className="text-3xl font-bold text-gray-900">Notícias</h1>
          <p className="text-gray-600">Gerencie as notícias do portal</p>
        </div>
        <Link to="/admin/noticias/nova">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Notícia
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {noticias.map((noticia) => (
          <Card key={noticia.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{noticia.titulo}</CardTitle>
                  {noticia.subtitulo && (
                    <CardDescription className="mt-1">
                      {noticia.subtitulo}
                    </CardDescription>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    {getStatusBadge(noticia.status)}
                    {noticia.destaque && (
                      <Badge variant="outline">Destaque</Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link to={`/admin/noticias/${noticia.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to={`/admin/noticias/${noticia.id}/editar`}>
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
                          Tem certeza que deseja excluir esta notícia? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteNoticia(noticia.id)}>
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm text-gray-500">
                <span>
                  Criado em: {new Date(noticia.created_at).toLocaleDateString('pt-BR')}
                </span>
                <span>
                  Visualizações: {noticia.visualizacoes}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}

        {noticias.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">Nenhuma notícia encontrada.</p>
              <Link to="/admin/noticias/nova">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar primeira notícia
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NoticiasList;