import Navbar from '@/components/Navbar';
import AboutSection from '@/components/About/AboutSection';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer/Footer';
import { contentService } from '@/services/contentService';

export default async function AboutPage() {
    const content = await contentService.getContent();

    return (
        <main className="min-h-screen">
            <Navbar />
            <div className="pt-20"> {/* Offset for fixed navbar */}
                <AboutSection initialContent={content} />
            </div>
            <CTA />
            <Footer />
        </main>
    );
}
