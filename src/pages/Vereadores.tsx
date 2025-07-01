
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Facebook, Instagram } from 'lucide-react';

const Vereadores = () => {
  const vereadores = [
    {
      id: 1,
      nome: 'João Silva',
      partido: 'PSB',
      foto: '/api/placeholder/200/200',
      email: 'joao.silva@camarafm.sp.gov.br',
      telefone: '(11) 4656-1245',
      biografia: 'Vereador eleito em 2020, atua na Comissão de Meio Ambiente e Sustentabilidade.',
      redes: {
        facebook: 'joaosilva.vereador',
        instagram: 'joaosilva_vereador'
      },
      proposicoes: 15
    },
    {
      id: 2,
      nome: 'Maria Santos',
      partido: 'PSDB',
      foto: '/api/placeholder/200/200',
      email: 'maria.santos@camarafm.sp.gov.br',
      telefone: '(11) 4656-1246',
      biografia: 'Presidente da Comissão da Mulher, defensora dos direitos das mulheres e crianças.',
      redes: {
        facebook: 'mariasantos.vereadora',
        instagram: 'maria_santos_vereadora'
      },
      proposicoes: 22
    },
    {
      id: 3,
      nome: 'Carlos Oliveira',
      partido: 'PT',
      foto: '/api/placeholder/200/200',
      email: 'carlos.oliveira@camarafm.sp.gov.br',
      telefone: '(11) 4656-1247',
      biografia: 'Membro da Comissão de Finanças e Orçamento, especialista em políticas públicas.',
      redes: {
        facebook: 'carlosoliveira.vereador',
        instagram: 'carlos_oliveira_vereador'
      },
      proposicoes: 18
    },
    {
      id: 4,
      nome: 'Ana Costa',
      partido: 'PSOL',
      foto: '/api/placeholder/200/200',
      email: 'ana.costa@camarafm.sp.gov.br',
      telefone: '(11) 4656-1248',
      biografia: 'Ativista pelos direitos humanos e transparência pública.',
      redes: {
        facebook: 'anacosta.vereadora',
        instagram: 'ana_costa_vereadora'
      },
      proposicoes: 12
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-16">
        <div className="container mx-auto px-4">
          {/* Cabeçalho */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Nossos Vereadores
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Conheça os representantes eleitos pela população de Francisco Morato
            </p>
          </div>

          {/* Grade de Vereadores */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {vereadores.map((vereador) => (
              <Card key={vereador.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  {/* Foto */}
                  <div className="text-center mb-4">
                    <img
                      src={vereador.foto}
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

                  {/* Biografia */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {vereador.biografia}
                  </p>

                  {/* Estatísticas */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {vereador.proposicoes}
                      </div>
                      <div className="text-sm text-gray-600">
                        Proposições
                      </div>
                    </div>
                  </div>

                  {/* Contato */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600 truncate">
                        {vereador.email}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">
                        {vereador.telefone}
                      </span>
                    </div>
                  </div>

                  {/* Redes Sociais */}
                  <div className="flex space-x-2 mb-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Facebook className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Instagram className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Botão Ver Mais */}
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
