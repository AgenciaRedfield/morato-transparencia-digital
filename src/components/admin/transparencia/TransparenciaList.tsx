import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Download, Eye } from 'lucide-react';
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

interface Transparencia {
  id: string;
  titulo: string;
  categoria: string;
  tipo_arquivo: string;
  arquivo_url: string;
  data_publicacao: string;
  data_documento: string | null;
  descricao: string | null;
  created_at: string;
}

const TransparenciaList = () => {
  const [documentos, setDocumentos] = useState<Transparencia[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDocumentos();
  }, []);

  const fetchDocumentos = async () => {
    try {
      const { data, error } = await supabase
        .from('transparencia')
        .select('*')
        .order('data_publicacao', { ascending: false });

      if (error) throw error;
      setDocumentos(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar documentos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteDocumento = async (id: string) => {
    try {
      const { error } = await supabase
        .from('transparencia')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDocumentos(documentos.filter(d => d.id !== id));
      toast({
        title: "Documento excluído",
        description: "O documento foi excluído com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao excluir documento",
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
          <h1 className="text-3xl font-bold text-gray-900">Transparência</h1>
          <p className="text-gray-600">Gerencie os documentos de transparência</p>
        </div>
        <Link to="/admin/transparencia/novo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Documento
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {documentos.map((documento) => (
          <Card key={documento.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{documento.titulo}</CardTitle>
                  <CardDescription className="mt-1">
                    {documento.categoria}
                  </CardDescription>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{documento.tipo_arquivo}</Badge>
                    {documento.data_documento && (
                      <Badge variant="secondary">
                        {new Date(documento.data_documento).toLocaleDateString('pt-BR')}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={documento.arquivo_url} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                  <Link to={`/admin/transparencia/${documento.id}/editar`}>
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
                          Tem certeza que deseja excluir este documento? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteDocumento(documento.id)}>
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {documento.descricao && (
                <p className="text-sm text-gray-600 mb-2">{documento.descricao}</p>
              )}
              <div className="text-sm text-gray-500">
                Publicado em: {new Date(documento.data_publicacao).toLocaleDateString('pt-BR')}
              </div>
            </CardContent>
          </Card>
        ))}

        {documentos.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">Nenhum documento encontrado.</p>
              <Link to="/admin/transparencia/novo">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar primeiro documento
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TransparenciaList;