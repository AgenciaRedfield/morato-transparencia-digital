import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';

interface EventoFormData {
  titulo: string;
  descricao: string;
  data_evento: string;
  hora_inicio: string;
  hora_fim: string;
  local: string;
  tipo_evento: string;
  publico: boolean;
  status: string;
}

const AgendaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<EventoFormData>({
    titulo: '',
    descricao: '',
    data_evento: '',
    hora_inicio: '',
    hora_fim: '',
    local: '',
    tipo_evento: 'sessao',
    publico: true,
    status: 'agendado',
  });

  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      fetchEvento();
    }
  }, [id, isEdit]);

  const fetchEvento = async () => {
    try {
      const { data, error } = await supabase
        .from('agenda')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;

      setFormData({
        titulo: data.titulo || '',
        descricao: data.descricao || '',
        data_evento: data.data_evento || '',
        hora_inicio: data.hora_inicio || '',
        hora_fim: data.hora_fim || '',
        local: data.local || '',
        tipo_evento: data.tipo_evento || 'sessao',
        publico: data.publico || true,
        status: data.status || 'agendado',
      });
    } catch (error: any) {
      toast({
        title: "Erro ao carregar evento",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const eventoData = {
        ...formData,
        autor_id: user.id,
      };

      let result;
      if (isEdit) {
        result = await supabase
          .from('agenda')
          .update(eventoData)
          .eq('id', id);
      } else {
        result = await supabase
          .from('agenda')
          .insert([eventoData]);
      }

      if (result.error) throw result.error;

      toast({
        title: isEdit ? "Evento atualizado" : "Evento criado",
        description: `O evento foi ${isEdit ? 'atualizado' : 'criado'} com sucesso.`,
      });

      navigate('/admin/agenda');
    } catch (error: any) {
      toast({
        title: `Erro ao ${isEdit ? 'atualizar' : 'criar'} evento`,
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof EventoFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/admin/agenda')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Editar Evento' : 'Novo Evento'}
          </h1>
          <p className="text-gray-600">
            {isEdit ? 'Edite as informações do evento' : 'Preencha as informações do novo evento'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Evento</CardTitle>
                <CardDescription>Dados principais do evento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="titulo">Título *</Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => handleInputChange('titulo', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => handleInputChange('descricao', e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="data_evento">Data do Evento *</Label>
                    <Input
                      id="data_evento"
                      type="date"
                      value={formData.data_evento}
                      onChange={(e) => handleInputChange('data_evento', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="local">Local</Label>
                    <Input
                      id="local"
                      value={formData.local}
                      onChange={(e) => handleInputChange('local', e.target.value)}
                      placeholder="Ex: Plenário da Câmara"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hora_inicio">Hora de Início</Label>
                    <Input
                      id="hora_inicio"
                      type="time"
                      value={formData.hora_inicio}
                      onChange={(e) => handleInputChange('hora_inicio', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="hora_fim">Hora de Término</Label>
                    <Input
                      id="hora_fim"
                      type="time"
                      value={formData.hora_fim}
                      onChange={(e) => handleInputChange('hora_fim', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações</CardTitle>
                <CardDescription>Configurações do evento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="tipo_evento">Tipo de Evento</Label>
                  <Select 
                    value={formData.tipo_evento} 
                    onValueChange={(value) => handleInputChange('tipo_evento', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sessao">Sessão</SelectItem>
                      <SelectItem value="audiencia">Audiência Pública</SelectItem>
                      <SelectItem value="reuniao">Reunião</SelectItem>
                      <SelectItem value="evento">Evento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleInputChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agendado">Agendado</SelectItem>
                      <SelectItem value="andamento">Em Andamento</SelectItem>
                      <SelectItem value="concluido">Concluído</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="publico"
                    checked={formData.publico}
                    onCheckedChange={(checked) => handleInputChange('publico', checked)}
                  />
                  <Label htmlFor="publico">Evento público</Label>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Salvando...' : isEdit ? 'Atualizar' : 'Criar'} Evento
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AgendaForm;