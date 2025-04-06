'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Home } from '@/components/Home';
import { AboutUs } from '@/components/AboutUs';
import { Events } from '@/components/Events';
import { Newsletter } from '@/components/Newsletter';
import { ShopCarousel } from '@/components/ShopCarousel';

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Home />
        <ShopCarousel 
          title="Gifts of Ukraine" 
          subtitle="Every purchase supports our mission to help Ukraine through art and creativity."
        />
        <Events />
        <AboutUs />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
} 