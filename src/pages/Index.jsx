import React from 'react';
import { Carousel } from '@/components/Carousel';
import { Header } from '@/components/Header';
import { Home } from '@/components/Home';
import { Upcoming } from '@/components/Upcoming';
import { AboutUs } from '@/components/AboutUs';
import { Donate } from '@/components/Donate';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Carousel />
      <div className="container mx-auto px-4 py-16 space-y-32">
        <Home />
        <Upcoming />
        <AboutUs />
        <Donate />
      </div>
    </div>
  );
};

export default Index;