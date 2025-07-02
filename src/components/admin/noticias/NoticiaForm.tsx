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

interface NoticiaFormData {
  titulo: string;
  subtitulo: string;
  conteudo: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  destaque: boolean;
  imagem_destaque: string;
  data_publicacao: string;
}

const NoticiaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<NoticiaFormData>({
    titulo: '',
    subtitulo: '',
    conteudo: '',
    slug: '',
    status: 'draft',
    destaque: false,
    imagem_destaque: '',
    data_publicacao: '',
  });

  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      fetchNoticia();
    }
  }, [id, isEdit]);

  const fetchNoticia = async () => {
    try {
      const { data, error } = await supabase
        .from('noticias')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;

      setFormData({
        titulo: data.titulo || '',
        subtitulo: data.subtitulo || '',
        conteudo: data.conteudo || '',
        slug: data.slug || '',
        status: data.status || 'draft',
        destaque: data.destaque || false,
        imagem_destaque: data.imagem_destaque || '',
        data_publicacao: data.data_publicacao ? new Date(data.data_publicacao).toISOString().slice(0, 16) : '',
      });
    } catch (error: any) {
      toast({
        title: "Erro ao carregar notícia",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const generateSlug = (titulo: string) => {
    return titulo
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const slug = formData.slug || generateSlug(formData.titulo);
      
      const noticiaData = {
        ...formData,
        slug,
        autor_id: user.id,
        data_publicacao: formData.data_publicacao ? new Date(formData.data_publicacao).toISOString() : null,
      };

      let result;
      if (isEdit) {
        result = await supabase
          .from('noticias')
          .update(noticiaData)
          .eq('id', id);
      } else {
        result = await supabase
          .from('noticias')
          .insert([noticiaData]);
      }

      if (result.error) throw result.error;

      toast({
        title: isEdit ? "Notícia atualizada" : "Notícia criada",
        description: `A notícia foi ${isEdit ? 'atualizada' : 'criada'} com sucesso.`,
      });

      navigate('/admin/noticias');
    } catch (error: any) {
      toast({
        title: `Erro ao ${isEdit ? 'atualizar' : 'criar'} notícia`,
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof NoticiaFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'titulo' && !prev.slug ? { slug: generateSlug(value as string) } : {})
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/admin/noticias')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Editar Notícia' : 'Nova Notícia'}
          </h1>
          <p className="text-gray-600">
            {isEdit ? 'Edite as informações da notícia' : 'Preencha as informações da nova notícia'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Conteúdo</CardTitle>
                <CardDescription>Informações principais da notícia</CardDescription>
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
                  <Label htmlFor="subtitulo">Subtítulo</Label>
                  <Input
                    id="subtitulo"
                    value={formData.subtitulo}
                    onChange={(e) => handleInputChange('subtitulo', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="slug">Slug (URL)</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="url-da-noticia"
                  />
                </div>

                <div>
                  <Label htmlFor="conteudo">Conteúdo *</Label>
                  <Textarea
                    id="conteudo"
                    value={formData.conteudo}
                    onChange={(e) => handleInputChange('conteudo', e.target.value)}
                    rows={10}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="imagem_destaque">URL da Imagem de Destaque</Label>
                  <Input
                    id="imagem_destaque"
                    type="url"
                    value={formData.imagem_destaque}
                    onChange={(e) => handleInputChange('imagem_destaque', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publicação</CardTitle>
                <CardDescription>Configurações de publicação</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="published">Publicado</SelectItem>
                      <SelectItem value="archived">Arquivado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="destaque"
                    checked={formData.destaque}
                    onCheckedChange={(checked) => handleInputChange('destaque', checked)}
                  />
                  <Label htmlFor="destaque">Destacar na página inicial</Label>
                </div>

                <div>
                  <Label htmlFor="data_publicacao">Data de Publicação</Label>
                  <Input
                    id="data_publicacao"
                    type="datetime-local"
                    value={formData.data_publicacao}
                    onChange={(e) => handleInputChange('data_publicacao', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Salvando...' : isEdit ? 'Atualizar' : 'Criar'} Notícia
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NoticiaForm;