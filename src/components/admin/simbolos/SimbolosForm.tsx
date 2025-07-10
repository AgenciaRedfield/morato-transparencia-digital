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

interface SimboloFormData {
  titulo: string;
  tipo: string;
  descricao: string;
  arquivo_url: string;
  conteudo_html: string;
  ativo: boolean;
}

const SimbolosForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SimboloFormData>({
    titulo: '',
    tipo: '',
    descricao: '',
    arquivo_url: '',
    conteudo_html: '',
    ativo: true,
  });

  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      fetchSimbolo();
    }
  }, [id, isEdit]);

  const fetchSimbolo = async () => {
    try {
      const { data, error } = await supabase
        .from('simbolos_oficiais')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;

      setFormData({
        titulo: data.titulo || '',
        tipo: data.tipo || '',
        descricao: data.descricao || '',
        arquivo_url: data.arquivo_url || '',
        conteudo_html: data.conteudo_html || '',
        ativo: data.ativo || true,
      });
    } catch (error: any) {
      toast({
        title: "Erro ao carregar símbolo",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (isEdit) {
        result = await supabase
          .from('simbolos_oficiais')
          .update(formData)
          .eq('id', id);
      } else {
        result = await supabase
          .from('simbolos_oficiais')
          .insert([formData]);
      }

      if (result.error) throw result.error;

      toast({
        title: isEdit ? "Símbolo atualizado" : "Símbolo criado",
        description: `O símbolo foi ${isEdit ? 'atualizado' : 'criado'} com sucesso.`,
      });

      navigate('/admin/simbolos');
    } catch (error: any) {
      toast({
        title: `Erro ao ${isEdit ? 'atualizar' : 'criar'} símbolo`,
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof SimboloFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/admin/simbolos')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Editar Símbolo' : 'Novo Símbolo'}
          </h1>
          <p className="text-gray-600">
            {isEdit ? 'Edite as informações do símbolo' : 'Preencha as informações do novo símbolo'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Símbolo</CardTitle>
                <CardDescription>Dados principais do símbolo oficial</CardDescription>
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

                <div>
                  <Label htmlFor="arquivo_url">URL do Arquivo</Label>
                  <Input
                    id="arquivo_url"
                    type="url"
                    value={formData.arquivo_url}
                    onChange={(e) => handleInputChange('arquivo_url', e.target.value)}
                    placeholder="https://exemplo.com/arquivo.pdf"
                  />
                </div>

                <div>
                  <Label htmlFor="conteudo_html">Conteúdo HTML</Label>
                  <Textarea
                    id="conteudo_html"
                    value={formData.conteudo_html}
                    onChange={(e) => handleInputChange('conteudo_html', e.target.value)}
                    rows={8}
                    placeholder="<p>Conteúdo HTML...</p>"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações</CardTitle>
                <CardDescription>Tipo e configurações do símbolo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="tipo">Tipo *</Label>
                  <Select 
                    value={formData.tipo} 
                    onValueChange={(value) => handleInputChange('tipo', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="brasao">Brasão</SelectItem>
                      <SelectItem value="bandeira">Bandeira</SelectItem>
                      <SelectItem value="hino">Hino</SelectItem>
                      <SelectItem value="logo">Logo</SelectItem>
                      <SelectItem value="selo">Selo</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="ativo"
                    checked={formData.ativo}
                    onCheckedChange={(checked) => handleInputChange('ativo', checked)}
                  />
                  <Label htmlFor="ativo">Símbolo ativo</Label>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Salvando...' : isEdit ? 'Atualizar' : 'Criar'} Símbolo
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SimbolosForm;