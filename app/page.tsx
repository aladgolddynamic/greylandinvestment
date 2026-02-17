'use client';

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import WhyChoose from '@/components/WhyChoose';
import Stats from '@/components/Stats';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <WhyChoose />
      <Stats />
      <CTA />
      <Footer />
    </main>
  );
}

