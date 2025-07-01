
import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const NewsSection = () => {
  const news = [
    {
      id: 1,
      title: 'Nova lei de incentivo à agricultura familiar aprovada em primeira votação',
      excerpt: 'Projeto de lei que beneficia pequenos produtores rurais foi aprovado por unanimidade na sessão desta quinta-feira.',
      date: '2024-01-15',
      category: 'Legislação',
      image: '/api/placeholder/400/250'
    },
    {
      id: 2,
      title: 'Câmara aprova criação de programa de combate ao desperdício de alimentos',
      excerpt: 'Iniciativa visa reduzir o desperdício e distribuir alimentos para famílias em situação de vulnerabilidade.',
      date: '2024-01-12',
      category: 'Meio Ambiente',
      image: '/api/placeholder/400/250'
    },
    {
      id: 3,
      title: 'Mesa Diretora define cronograma de audiências públicas para 2024',
      excerpt: 'Serão realizadas 12 audiências durante o ano para discutir temas relevantes para a população.',
      date: '2024-01-10',
      category: 'Participação',
      image: '/api/placeholder/400/250'
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Últimas Notícias
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Acompanhe as principais atividades e decisões da Câmara Municipal
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {news.map((article) => (
            <Card key={article.id} className="hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    {article.category}
                  </span>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(article.date)}
                  </div>
                </div>
                <CardTitle className="text-xl leading-tight hover:text-blue-600 transition-colors">
                  {article.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                <Button variant="ghost" className="p-0 h-auto text-blue-600 hover:text-blue-800">
                  Ler mais
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Ver Todas as Notícias
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
