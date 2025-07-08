import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, MessageSquare, Eye } from 'lucide-react';

interface Ouvidoria {
  id: string;
  nome: string;
  email: string;
  assunto: string;
  status: string;
  created_at: string;
  respondido_em: string | null;
  telefone: string | null;
}

const OuvidoriaList = () => {
  const [mensagens, setMensagens] = useState<Ouvidoria[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMensagens();
  }, []);

  const fetchMensagens = async () => {
    try {
      const { data, error } = await supabase
        .from('ouvidoria')
        .select('id, nome, email, assunto, status, created_at, respondido_em, telefone')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMensagens(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar mensagens",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'Nova': 'default',
      'Em andamento': 'secondary',
      'Respondida': 'outline',
      'Fechada': 'destructive'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'default'}>
        {status}
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
          <h1 className="text-3xl font-bold text-gray-900">Ouvidoria</h1>
          <p className="text-gray-600">Gerencie as mensagens da ouvidoria</p>
        </div>
      </div>

      <div className="grid gap-4">
        {mensagens.map((mensagem) => (
          <Card key={mensagem.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    {mensagem.assunto}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    De: {mensagem.nome} ({mensagem.email})
                  </CardDescription>
                  <div className="flex items-center gap-2 mt-2">
                    {getStatusBadge(mensagem.status)}
                    {mensagem.respondido_em && (
                      <Badge variant="outline">
                        Respondida em {new Date(mensagem.respondido_em).toLocaleDateString('pt-BR')}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link to={`/admin/ouvidoria/${mensagem.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to={`/admin/ouvidoria/${mensagem.id}/responder`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500">
                {mensagem.telefone && <p>Telefone: {mensagem.telefone}</p>}
                <p>Recebida em: {new Date(mensagem.created_at).toLocaleDateString('pt-BR')}</p>
              </div>
            </CardContent>
          </Card>
        ))}

        {mensagens.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">Nenhuma mensagem encontrada.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OuvidoriaList;