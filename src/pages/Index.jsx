import React from 'react';
import { Carousel } from '@/components/Carousel';
import { Header } from '@/components/Header';
import { Home } from '@/components/Home';
import { Upcoming } from '@/components/Upcoming';
import { AboutUs } from '@/components/AboutUs';
import { Newsletter } from '@/components/Newsletter';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Carousel />
      <div className="container mx-auto px-4 py-16 space-y-32">
        <Home />
        <Upcoming />
        <AboutUs />
        <Newsletter />
      </div>
      <Footer />
    </div>
  );
};

export default Index;