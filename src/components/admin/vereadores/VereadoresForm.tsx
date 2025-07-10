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
import { ArrowLeft, Save } from 'lucide-react';

interface VereadorFormData {
  nome: string;
  partido: string;
  email: string;
  telefone: string;
  biografia: string;
  foto_url: string;
  ativo: boolean;
  ordem_exibicao: number;
  redes_sociais: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

const VereadoresForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<VereadorFormData>({
    nome: '',
    partido: '',
    email: '',
    telefone: '',
    biografia: '',
    foto_url: '',
    ativo: true,
    ordem_exibicao: 1,
    redes_sociais: {},
  });

  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      fetchVereador();
    }
  }, [id, isEdit]);

  const fetchVereador = async () => {
    try {
      const { data, error } = await supabase
        .from('vereadores')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;

      setFormData({
        nome: data.nome || '',
        partido: data.partido || '',
        email: data.email || '',
        telefone: data.telefone || '',
        biografia: data.biografia || '',
        foto_url: data.foto_url || '',
        ativo: data.ativo || true,
        ordem_exibicao: data.ordem_exibicao || 1,
        redes_sociais: typeof data.redes_sociais === 'object' ? data.redes_sociais as any : {},
      });
    } catch (error: any) {
      toast({
        title: "Erro ao carregar vereador",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const vereadorData = {
        ...formData,
        redes_sociais: JSON.stringify(formData.redes_sociais),
      };

      let result;
      if (isEdit) {
        result = await supabase
          .from('vereadores')
          .update(vereadorData)
          .eq('id', id);
      } else {
        result = await supabase
          .from('vereadores')
          .insert([vereadorData]);
      }

      if (result.error) throw result.error;

      toast({
        title: isEdit ? "Vereador atualizado" : "Vereador criado",
        description: `O vereador foi ${isEdit ? 'atualizado' : 'criado'} com sucesso.`,
      });

      navigate('/admin/vereadores');
    } catch (error: any) {
      toast({
        title: `Erro ao ${isEdit ? 'atualizar' : 'criar'} vereador`,
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith('redes_sociais.')) {
      const socialField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        redes_sociais: {
          ...prev.redes_sociais,
          [socialField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/admin/vereadores')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Editar Vereador' : 'Novo Vereador'}
          </h1>
          <p className="text-gray-600">
            {isEdit ? 'Edite as informações do vereador' : 'Preencha as informações do novo vereador'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>Dados básicos do vereador</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Label htmlFor="partido">Partido *</Label>
                    <Input
                      id="partido"
                      value={formData.partido}
                      onChange={(e) => handleInputChange('partido', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => handleInputChange('telefone', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="biografia">Biografia</Label>
                  <Textarea
                    id="biografia"
                    value={formData.biografia}
                    onChange={(e) => handleInputChange('biografia', e.target.value)}
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="foto_url">URL da Foto</Label>
                  <Input
                    id="foto_url"
                    type="url"
                    value={formData.foto_url}
                    onChange={(e) => handleInputChange('foto_url', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Redes Sociais</CardTitle>
                <CardDescription>Perfis nas redes sociais</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={formData.redes_sociais.facebook || ''}
                    onChange={(e) => handleInputChange('redes_sociais.facebook', e.target.value)}
                    placeholder="https://facebook.com/usuario"
                  />
                </div>

                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={formData.redes_sociais.instagram || ''}
                    onChange={(e) => handleInputChange('redes_sociais.instagram', e.target.value)}
                    placeholder="https://instagram.com/usuario"
                  />
                </div>

                <div>
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    value={formData.redes_sociais.twitter || ''}
                    onChange={(e) => handleInputChange('redes_sociais.twitter', e.target.value)}
                    placeholder="https://twitter.com/usuario"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações</CardTitle>
                <CardDescription>Configurações de exibição</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="ordem_exibicao">Ordem de Exibição</Label>
                  <Input
                    id="ordem_exibicao"
                    type="number"
                    value={formData.ordem_exibicao}
                    onChange={(e) => handleInputChange('ordem_exibicao', parseInt(e.target.value))}
                    min="1"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="ativo"
                    checked={formData.ativo}
                    onCheckedChange={(checked) => handleInputChange('ativo', checked)}
                  />
                  <Label htmlFor="ativo">Vereador ativo</Label>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Salvando...' : isEdit ? 'Atualizar' : 'Criar'} Vereador
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default VereadoresForm;