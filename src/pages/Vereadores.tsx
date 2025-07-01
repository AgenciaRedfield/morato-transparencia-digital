
import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Facebook, Instagram } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type Vereador = Tables<'vereadores'>;

const Vereadores = () => {
  const [vereadores, setVereadores] = useState<Vereador[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVereadores = async () => {
      try {
        const { data, error } = await supabase
          .from('vereadores')
          .select('*')
          .eq('ativo', true)
          .order('ordem_exibicao', { nullsFirst: false });

        if (error) throw error;
        setVereadores(data || []);
      } catch (error) {
        console.error('Erro ao carregar vereadores:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVereadores();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Nossos Vereadores
              </h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Nossos Vereadores
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Conheça os representantes eleitos pela população de Francisco Morato
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {vereadores.map((vereador) => (
              <Card key={vereador.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <img
                      src={vereador.foto_url || '/api/placeholder/200/200'}
                      alt={vereador.nome}
                      className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {vereador.nome}
                    </h3>
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                      {vereador.partido}
                    </span>
                  </div>

                  {vereador.biografia && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {vereador.biografia}
                    </p>
                  )}

                  <div className="space-y-2 mb-4">
                    {vereador.email && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600 truncate">
                          {vereador.email}
                        </span>
                      </div>
                    )}
                    {vereador.telefone && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">
                          {vereador.telefone}
                        </span>
                      </div>
                    )}
                  </div>

                  {vereador.redes_sociais && (
                    <div className="flex space-x-2 mb-4">
                      {(vereador.redes_sociais as any)?.facebook && (
                        <Button variant="outline" size="sm" className="flex-1">
                          <Facebook className="h-4 w-4" />
                        </Button>
                      )}
                      {(vereador.redes_sociais as any)?.instagram && (
                        <Button variant="outline" size="sm" className="flex-1">
                          <Instagram className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}

                  <Button className="w-full" variant="outline">
                    Ver Perfil Completo
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Vereadores;
