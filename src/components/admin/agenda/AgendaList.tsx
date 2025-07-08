import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Calendar, Clock, MapPin, Eye } from 'lucide-react';
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

interface Evento {
  id: string;
  titulo: string;
  descricao: string | null;
  data_evento: string;
  hora_inicio: string | null;
  hora_fim: string | null;
  local: string | null;
  tipo_evento: string;
  status: string;
  publico: boolean;
  created_at: string;
}

const AgendaList = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchEventos();
  }, []);

  const fetchEventos = async () => {
    try {
      const { data, error } = await supabase
        .from('agenda')
        .select('*')
        .order('data_evento', { ascending: true });

      if (error) throw error;
      setEventos(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar eventos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleEventoStatus = async (id: string, publico: boolean) => {
    try {
      const { error } = await supabase
        .from('agenda')
        .update({ publico })
        .eq('id', id);

      if (error) throw error;

      setEventos(prev => 
        prev.map(e => e.id === id ? { ...e, publico } : e)
      );

      toast({
        title: publico ? "Evento publicado" : "Evento despublicado",
        description: `O evento foi ${publico ? 'publicado' : 'despublicado'} com sucesso.`,
      });
    } catch (error: any) {
      toast({
        title: "Erro ao alterar status do evento",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteEvento = async (id: string) => {
    try {
      const { error } = await supabase
        .from('agenda')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEventos(eventos.filter(e => e.id !== id));
      toast({
        title: "Evento excluído",
        description: "O evento foi excluído com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao excluir evento",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'agendado': 'default',
      'confirmado': 'secondary',
      'realizado': 'outline',
      'cancelado': 'destructive'
    } as const;

    const labels = {
      'agendado': 'Agendado',
      'confirmado': 'Confirmado',
      'realizado': 'Realizado',
      'cancelado': 'Cancelado'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'default'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const getTipoEventoBadge = (tipo: string) => {
    const variants = {
      'sessao': 'default',
      'reuniao': 'secondary',
      'audiencia': 'outline',
      'evento': 'default'
    } as const;

    const labels = {
      'sessao': 'Sessão',
      'reuniao': 'Reunião',
      'audiencia': 'Audiência Pública',
      'evento': 'Evento'
    };

    return (
      <Badge variant={variants[tipo as keyof typeof variants] || 'default'}>
        {labels[tipo as keyof typeof labels] || tipo}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return null;
    return timeString.substring(0, 5); // Remove seconds
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
          <h1 className="text-3xl font-bold text-gray-900">Agenda de Eventos</h1>
          <p className="text-gray-600">Gerencie os eventos da câmara municipal</p>
        </div>
        <Link to="/admin/agenda/novo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Evento
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {eventos.map((evento) => (
          <Card key={evento.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {evento.titulo}
                  </CardTitle>
                  <CardDescription className="mt-1 flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(evento.data_evento)}
                    </span>
                    {(evento.hora_inicio || evento.hora_fim) && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(evento.hora_inicio)}
                        {evento.hora_fim && ` - ${formatTime(evento.hora_fim)}`}
                      </span>
                    )}
                    {evento.local && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {evento.local}
                      </span>
                    )}
                  </CardDescription>
                  <div className="flex items-center gap-2 mt-2">
                    {getTipoEventoBadge(evento.tipo_evento)}
                    {getStatusBadge(evento.status)}
                    {evento.publico ? (
                      <Badge variant="default">Público</Badge>
                    ) : (
                      <Badge variant="destructive">Privado</Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={evento.publico ? "secondary" : "default"}
                    size="sm"
                    onClick={() => toggleEventoStatus(evento.id, !evento.publico)}
                  >
                    {evento.publico ? 'Despublicar' : 'Publicar'}
                  </Button>
                  <Link to={`/admin/agenda/${evento.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to={`/admin/agenda/${evento.id}/editar`}>
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
                          Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteEvento(evento.id)}>
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            {evento.descricao && (
              <CardContent>
                <p className="text-sm text-gray-600">{evento.descricao}</p>
              </CardContent>
            )}
          </Card>
        ))}

        {eventos.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">Nenhum evento encontrado.</p>
              <Link to="/admin/agenda/novo">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar primeiro evento
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AgendaList;