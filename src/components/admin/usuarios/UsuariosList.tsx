import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Shield, ShieldCheck, ShieldAlert, User } from 'lucide-react';
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

interface Usuario {
  id: string;
  full_name: string;
  email: string;
  role: 'admin' | 'editor' | 'operador';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const UsuariosList = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsuarios(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar usuários",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleUsuarioStatus = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: isActive })
        .eq('id', id);

      if (error) throw error;

      setUsuarios(prev => 
        prev.map(u => u.id === id ? { ...u, is_active: isActive } : u)
      );

      toast({
        title: isActive ? "Usuário ativado" : "Usuário desativado",
        description: `O usuário foi ${isActive ? 'ativado' : 'desativado'} com sucesso.`,
      });
    } catch (error: any) {
      toast({
        title: "Erro ao alterar status do usuário",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getRoleBadge = (role: string) => {
    const config = {
      admin: { variant: 'default' as const, icon: ShieldCheck, label: 'Administrador' },
      editor: { variant: 'secondary' as const, icon: Shield, label: 'Editor' },
      operador: { variant: 'outline' as const, icon: ShieldAlert, label: 'Operador' }
    };

    const { variant, icon: Icon, label } = config[role as keyof typeof config];

    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {label}
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
          <h1 className="text-3xl font-bold text-gray-900">Usuários</h1>
          <p className="text-gray-600">Gerencie os usuários do sistema</p>
        </div>
        <Link to="/admin/usuarios/novo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Usuário
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {usuarios.map((usuario) => (
          <Card key={usuario.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {usuario.full_name}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {usuario.email}
                  </CardDescription>
                  <div className="flex items-center gap-2 mt-2">
                    {getRoleBadge(usuario.role)}
                    {usuario.is_active ? (
                      <Badge variant="default">Ativo</Badge>
                    ) : (
                      <Badge variant="destructive">Inativo</Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={usuario.is_active ? "secondary" : "default"}
                    size="sm"
                    onClick={() => toggleUsuarioStatus(usuario.id, !usuario.is_active)}
                  >
                    {usuario.is_active ? 'Desativar' : 'Ativar'}
                  </Button>
                  <Link to={`/admin/usuarios/${usuario.id}/editar`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500">
                Criado em: {new Date(usuario.created_at).toLocaleDateString('pt-BR')}
                {usuario.updated_at !== usuario.created_at && (
                  <span className="ml-4">
                    Atualizado em: {new Date(usuario.updated_at).toLocaleDateString('pt-BR')}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {usuarios.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">Nenhum usuário encontrado.</p>
              <Link to="/admin/usuarios/novo">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar primeiro usuário
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UsuariosList;