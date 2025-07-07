import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FeaturedNews {
  id: string;
  titulo: string;
  subtitulo: string | null;
  imagem_destaque: string | null;
  data_publicacao: string | null;
  slug: string;
}

const FeaturedNewsCarousel = () => {
  const [featuredNews, setFeaturedNews] = useState<FeaturedNews[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedNews();
  }, []);

  const fetchFeaturedNews = async () => {
    try {
      const { data, error } = await supabase
        .from('noticias')
        .select('id, titulo, subtitulo, imagem_destaque, data_publicacao, slug')
        .eq('destaque', true)
        .eq('status', 'published')
        .order('data_publicacao', { ascending: false })
        .limit(5);

      if (error) throw error;
      setFeaturedNews(data || []);
    } catch (error) {
      console.error('Erro ao carregar notícias em destaque:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <section className="py-8 bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-64 mx-auto mb-8"></div>
            <div className="h-96 bg-muted rounded-lg"></div>
          </div>
        </div>
      </section>
    );
  }

  if (featuredNews.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-r from-primary/5 to-primary/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Notícias em Destaque
          </h2>
          <p className="text-muted-foreground text-lg">
            Principais acontecimentos da Câmara Municipal
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {featuredNews.map((news) => (
                <CarouselItem key={news.id} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                      {news.imagem_destaque ? (
                        <img
                          src={news.imagem_destaque}
                          alt={news.titulo}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                          <span className="text-primary font-semibold">
                            Câmara Municipal
                          </span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                          Destaque
                        </span>
                        {news.data_publicacao && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(news.data_publicacao)}
                          </div>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                        {news.titulo}
                      </h3>
                      {news.subtitulo && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {news.subtitulo}
                        </p>
                      )}
                      <Button variant="ghost" size="sm" className="p-0 h-auto text-primary hover:text-primary/80">
                        Ler mais
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Button>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default FeaturedNewsCarousel;