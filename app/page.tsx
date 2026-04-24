import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import { contentService } from '@/services/contentService';

// Dynamically import all below-the-fold components
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

export default async function Home() {
  const content = await contentService.getContent();
  const homeData = await contentService.getPageContent('homepage');

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero 
        title={homeData?.heroTitle} 
        subtitle={homeData?.heroSubtitle} 
      />
      <WhyChoose />
      <Stats initialStats={homeData?.stats} />
      <CTA />
      <Footer />
    </main>
  );
}
