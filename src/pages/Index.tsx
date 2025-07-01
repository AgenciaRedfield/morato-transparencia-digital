
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import NewsSection from '@/components/home/NewsSection';
import ServicesSection from '@/components/home/ServicesSection';
import QuickAccessSection from '@/components/home/QuickAccessSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <NewsSection />
        <QuickAccessSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
