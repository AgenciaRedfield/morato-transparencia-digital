import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';

interface TransparenciaFormData {
  titulo: string;
  categoria: string;
  tipo_arquivo: string;
  arquivo_url: string;
  data_documento: string;
  data_publicacao: string;
  descricao: string;
  tamanho_arquivo: number;
}

const TransparenciaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TransparenciaFormData>({
    titulo: '',
    categoria: '',
    tipo_arquivo: '',
    arquivo_url: '',
    data_documento: '',
    data_publicacao: new Date().toISOString().slice(0, 16),
    descricao: '',
    tamanho_arquivo: 0,
  });

  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      fetchDocumento();
    }
  }, [id, isEdit]);

  const fetchDocumento = async () => {
    try {
      const { data, error } = await supabase
        .from('transparencia')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;

      setFormData({
        titulo: data.titulo || '',
        categoria: data.categoria || '',
        tipo_arquivo: data.tipo_arquivo || '',
        arquivo_url: data.arquivo_url || '',
        data_documento: data.data_documento || '',
        data_publicacao: data.data_publicacao ? new Date(data.data_publicacao).toISOString().slice(0, 16) : '',
        descricao: data.descricao || '',
        tamanho_arquivo: data.tamanho_arquivo || 0,
      });
    } catch (error: any) {
      toast({
        title: "Erro ao carregar documento",
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

      const documentoData = {
        ...formData,
        autor_id: user.id,
        data_publicacao: formData.data_publicacao ? new Date(formData.data_publicacao).toISOString() : new Date().toISOString(),
      };

      let result;
      if (isEdit) {
        result = await supabase
          .from('transparencia')
          .update(documentoData)
          .eq('id', id);
      } else {
        result = await supabase
          .from('transparencia')
          .insert([documentoData]);
      }

      if (result.error) throw result.error;

      toast({
        title: isEdit ? "Documento atualizado" : "Documento criado",
        description: `O documento foi ${isEdit ? 'atualizado' : 'criado'} com sucesso.`,
      });

      navigate('/admin/transparencia');
    } catch (error: any) {
      toast({
        title: `Erro ao ${isEdit ? 'atualizar' : 'criar'} documento`,
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof TransparenciaFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/admin/transparencia')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Editar Documento' : 'Novo Documento'}
          </h1>
          <p className="text-gray-600">
            {isEdit ? 'Edite as informações do documento' : 'Preencha as informações do novo documento'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Documento</CardTitle>
                <CardDescription>Dados principais do documento</CardDescription>
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
                  <Label htmlFor="arquivo_url">URL do Arquivo *</Label>
                  <Input
                    id="arquivo_url"
                    type="url"
                    value={formData.arquivo_url}
                    onChange={(e) => handleInputChange('arquivo_url', e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="data_documento">Data do Documento</Label>
                    <Input
                      id="data_documento"
                      type="date"
                      value={formData.data_documento}
                      onChange={(e) => handleInputChange('data_documento', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="data_publicacao">Data de Publicação *</Label>
                    <Input
                      id="data_publicacao"
                      type="datetime-local"
                      value={formData.data_publicacao}
                      onChange={(e) => handleInputChange('data_publicacao', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Classificação</CardTitle>
                <CardDescription>Categoria e tipo do documento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="categoria">Categoria *</Label>
                  <Select 
                    value={formData.categoria} 
                    onValueChange={(value) => handleInputChange('categoria', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="orcamento">Orçamento</SelectItem>
                      <SelectItem value="balancetes">Balancetes</SelectItem>
                      <SelectItem value="contratos">Contratos</SelectItem>
                      <SelectItem value="licitacoes">Licitações</SelectItem>
                      <SelectItem value="diarias">Diárias</SelectItem>
                      <SelectItem value="passagens">Passagens</SelectItem>
                      <SelectItem value="folha">Folha de Pagamento</SelectItem>
                      <SelectItem value="receitas">Receitas</SelectItem>
                      <SelectItem value="despesas">Despesas</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tipo_arquivo">Tipo de Arquivo *</Label>
                  <Select 
                    value={formData.tipo_arquivo} 
                    onValueChange={(value) => handleInputChange('tipo_arquivo', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PDF">PDF</SelectItem>
                      <SelectItem value="DOC">DOC</SelectItem>
                      <SelectItem value="DOCX">DOCX</SelectItem>
                      <SelectItem value="XLS">XLS</SelectItem>
                      <SelectItem value="XLSX">XLSX</SelectItem>
                      <SelectItem value="ZIP">ZIP</SelectItem>
                      <SelectItem value="RAR">RAR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tamanho_arquivo">Tamanho do Arquivo (KB)</Label>
                  <Input
                    id="tamanho_arquivo"
                    type="number"
                    value={formData.tamanho_arquivo}
                    onChange={(e) => handleInputChange('tamanho_arquivo', parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Salvando...' : isEdit ? 'Atualizar' : 'Criar'} Documento
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TransparenciaForm;