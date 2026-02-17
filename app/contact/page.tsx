'use client';

import Navbar from '@/components/Navbar';
import ContactSection from '@/components/Contact/ContactSection';
import Footer from '@/components/Footer/Footer';

export default function ContactPage() {
    return (
        <main className="min-h-screen">
            <Navbar />
            <div className="pt-20"> {/* Offset for fixed navbar */}
                <ContactSection />
            </div>
            <Footer />
        </main>
    );
}
