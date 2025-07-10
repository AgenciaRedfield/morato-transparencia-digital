import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';

interface CampoFormulario {
  id: string;
  tipo: string;
  label: string;
  placeholder?: string;
  obrigatorio: boolean;
  opcoes?: string[];
}

interface FormularioFormData {
  nome: string;
  descricao: string;
  email_destino: string;
  ativo: boolean;
  campos: CampoFormulario[];
}

const FormulariosForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormularioFormData>({
    nome: '',
    descricao: '',
    email_destino: '',
    ativo: true,
    campos: [],
  });

  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      fetchFormulario();
    }
  }, [id, isEdit]);

  const fetchFormulario = async () => {
    try {
      const { data, error } = await supabase
        .from('formularios')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;

      setFormData({
        nome: data.nome || '',
        descricao: data.descricao || '',
        email_destino: data.email_destino || '',
        ativo: data.ativo || true,
        campos: Array.isArray(data.campos) ? data.campos as unknown as CampoFormulario[] : [],
      });
    } catch (error: any) {
      toast({
        title: "Erro ao carregar formulário",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formularioData = {
        ...formData,
        campos: JSON.stringify(formData.campos),
      };

      let result;
      if (isEdit) {
        result = await supabase
          .from('formularios')
          .update(formularioData)
          .eq('id', id);
      } else {
        result = await supabase
          .from('formularios')
          .insert([formularioData]);
      }

      if (result.error) throw result.error;

      toast({
        title: isEdit ? "Formulário atualizado" : "Formulário criado",
        description: `O formulário foi ${isEdit ? 'atualizado' : 'criado'} com sucesso.`,
      });

      navigate('/admin/formularios');
    } catch (error: any) {
      toast({
        title: `Erro ao ${isEdit ? 'atualizar' : 'criar'} formulário`,
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormularioFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const adicionarCampo = () => {
    const novoCampo: CampoFormulario = {
      id: Date.now().toString(),
      tipo: 'text',
      label: '',
      placeholder: '',
      obrigatorio: false,
    };

    setFormData(prev => ({
      ...prev,
      campos: [...prev.campos, novoCampo]
    }));
  };

  const removerCampo = (campoId: string) => {
    setFormData(prev => ({
      ...prev,
      campos: prev.campos.filter(campo => campo.id !== campoId)
    }));
  };

  const atualizarCampo = (campoId: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      campos: prev.campos.map(campo => 
        campo.id === campoId ? { ...campo, [field]: value } : campo
      )
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/admin/formularios')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Editar Formulário' : 'Novo Formulário'}
          </h1>
          <p className="text-gray-600">
            {isEdit ? 'Edite as informações do formulário' : 'Preencha as informações do novo formulário'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Formulário</CardTitle>
                <CardDescription>Dados básicos do formulário</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => handleInputChange('descricao', e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="email_destino">E-mail de Destino *</Label>
                  <Input
                    id="email_destino"
                    type="email"
                    value={formData.email_destino}
                    onChange={(e) => handleInputChange('email_destino', e.target.value)}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Campos do Formulário</CardTitle>
                <CardDescription>Configure os campos que serão exibidos no formulário</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.campos.map((campo, index) => (
                  <div key={campo.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Campo {index + 1}</h4>
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="sm"
                        onClick={() => removerCampo(campo.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Tipo</Label>
                        <select 
                          className="w-full px-3 py-2 border rounded-md"
                          value={campo.tipo}
                          onChange={(e) => atualizarCampo(campo.id, 'tipo', e.target.value)}
                        >
                          <option value="text">Texto</option>
                          <option value="email">E-mail</option>
                          <option value="tel">Telefone</option>
                          <option value="textarea">Texto Longo</option>
                          <option value="select">Seleção</option>
                          <option value="radio">Múltipla Escolha</option>
                          <option value="checkbox">Checkbox</option>
                        </select>
                      </div>
                      
                      <div>
                        <Label>Label</Label>
                        <Input
                          value={campo.label}
                          onChange={(e) => atualizarCampo(campo.id, 'label', e.target.value)}
                          placeholder="Nome do campo"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Placeholder</Label>
                      <Input
                        value={campo.placeholder || ''}
                        onChange={(e) => atualizarCampo(campo.id, 'placeholder', e.target.value)}
                        placeholder="Texto de exemplo"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`obrigatorio-${campo.id}`}
                        checked={campo.obrigatorio}
                        onChange={(e) => atualizarCampo(campo.id, 'obrigatorio', e.target.checked)}
                      />
                      <Label htmlFor={`obrigatorio-${campo.id}`}>Campo obrigatório</Label>
                    </div>
                  </div>
                ))}

                <Button 
                  type="button"
                  variant="outline" 
                  onClick={adicionarCampo}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Campo
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações</CardTitle>
                <CardDescription>Status do formulário</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="ativo"
                    checked={formData.ativo}
                    onCheckedChange={(checked) => handleInputChange('ativo', checked)}
                  />
                  <Label htmlFor="ativo">Formulário ativo</Label>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Salvando...' : isEdit ? 'Atualizar' : 'Criar'} Formulário
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormulariosForm;