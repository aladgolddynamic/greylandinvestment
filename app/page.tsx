import nextDynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import { contentService } from '@/services/contentService';

export const dynamic = 'force-dynamic';

// Dynamically import all below-the-fold components
const WhyChoose = nextDynamic(() => import('@/components/WhyChoose'), {
  loading: () => <div className="h-64 animate-pulse bg-gray-100" />,
});
const Stats = nextDynamic(() => import('@/components/Stats'), {
  loading: () => <div className="h-32 animate-pulse bg-gray-50" />,
});
const CTA = nextDynamic(() => import('@/components/CTA'), {
  loading: () => <div className="h-40 animate-pulse bg-gray-100" />,
});
const Footer = nextDynamic(() => import('@/components/Footer/Footer'));

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
