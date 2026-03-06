'use client';

import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';

// Dynamically import all below-the-fold components
// Users see the Hero first — these can load as the user scrolls
const WhyChoose = dynamic(() => import('@/components/WhyChoose'), {
  loading: () => <div className="h-64 animate-pulse bg-gray-100" />,
});
const Stats = dynamic(() => import('@/components/Stats'), {
  loading: () => <div className="h-32 animate-pulse bg-gray-50" />,
});
const CTA = dynamic(() => import('@/components/CTA'), {
  loading: () => <div className="h-40 animate-pulse bg-gray-100" />,
});
const Footer = dynamic(() => import('@/components/Footer/Footer'));

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
