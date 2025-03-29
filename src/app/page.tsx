'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Home } from '@/components/Home';
import { AboutUs } from '@/components/AboutUs';
import { Upcoming } from '@/components/Upcoming';
import { Newsletter } from '@/components/Newsletter';

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Home />
        <Upcoming />
        <AboutUs />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
} 