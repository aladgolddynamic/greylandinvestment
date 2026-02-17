'use client';

import Navbar from '@/components/Navbar';
import AboutSection from '@/components/About/AboutSection';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer/Footer';

export default function AboutPage() {
    return (
        <main className="min-h-screen">
            <Navbar />
            <div className="pt-20"> {/* Offset for fixed navbar */}
                <AboutSection />
            </div>
            <CTA />
            <Footer />
        </main>
    );
}
