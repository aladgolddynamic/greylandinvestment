'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer/Footer';
import NewsCard from '@/components/News/NewsCard';
import { motion } from 'framer-motion';

export default function NewsPage() {
    const newsArticles = [
        {
            title: "Future of Enterprise ERP: Cloud-First Strategies",
            category: "Technology",
            date: "Feb 15, 2026",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop",
            excerpt: "How modern organizations are leveraging cloud-based ERP systems to streamline HR, finance, and supply chain operations while reducing overhead costs.",
            slug: "future-of-enterprise-erp"
        },
        {
            title: "Safety Standards in Modern Infrastructure Rehab",
            category: "Engineering",
            date: "Feb 12, 2026",
            image: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=1000&auto=format&fit=crop",
            excerpt: "A look at the innovative safety protocols being implemented across our major structural rehabilitation projects to ensure long-term durability and worker safety.",
            slug: "safety-standards-infrastructure"
        },
        {
            title: "Greyland's Nationwide ICT Supply Expansion",
            category: "Procurement",
            date: "Feb 08, 2026",
            image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc4b?q=80&w=1000&auto=format&fit=crop",
            excerpt: "Greyland Investment Ltd announces a significant expansion in our ICT equipment supply chain, now reaching telecom hubs in all 36 states.",
            slug: "ict-supply-expansion"
        },
        {
            title: "Sustainable Construction: Greyland's Green Initiative",
            category: "Engineering",
            date: "Feb 05, 2026",
            image: "https://images.unsplash.com/photo-1503387762-592dea58ef21?q=80&w=1000&auto=format&fit=crop",
            excerpt: "Exploring our commitment to sustainable building practices through eco-friendly material sourcing and energy-efficient structural designs.",
            slug: "sustainable-construction-initiative"
        },
        {
            title: "Cybersecurity Trends: Protecting Public Sector Data",
            category: "Technology",
            date: "Jan 30, 2026",
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop",
            excerpt: "Key insights from our latest government-level security audits on how to defend against evolving ransomware threats in administrative networks.",
            slug: "cybersecurity-trends-public-sector"
        },
        {
            title: "Optimizing Asset Longevity through Facility Support",
            category: "Procurement",
            date: "Jan 25, 2026",
            image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1000&auto=format&fit=crop",
            excerpt: "The critical role of structured facility management in maintaining commercial complex performance and ensuring operational sustainability.",
            slug: "optimizing-asset-longevity"
        }
    ];

    return (
        <main className="min-h-screen bg-[#F8FAFC]">
            <Navbar />

            {/* News Hero */}
            <section className="bg-gradient-to-r from-[#3F4A5A] to-[#5B5F73] pt-32 pb-24 relative overflow-hidden shadow-lg">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-orange blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-primary-orange font-black text-[10px] uppercase tracking-[0.5em] mb-6 block">Company Insights</span>
                        <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter mb-8 leading-none drop-shadow-sm">
                            Latest <br />
                            <span className="text-[#F28C28]">News & Insights</span>
                        </h1>
                        <div className="h-1 w-24 bg-[#F28C28] mx-auto rounded-full mb-8"></div>
                        <p className="text-gray-400 font-bold text-xs md:text-sm tracking-[0.4em] uppercase max-w-2xl mx-auto">
                            Technical updates, project milestones, and industry perspectives from Greyland.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* News Feed Grid */}
            <section className="py-20 md:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                        {newsArticles.map((article, index) => (
                            <NewsCard key={index} index={index} {...article} />
                        ))}
                    </div>

                    {/* Newsletter Subscription (Inlay) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="mt-32 bg-white rounded-2xl p-8 md:p-16 border border-gray-100 text-center relative overflow-hidden group shadow-xl"
                    >
                        <div className="absolute inset-0 bg-primary-orange/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <h3 className="text-2xl md:text-4xl font-black text-primary-dark uppercase mb-4">Stay Ahead of the Curve</h3>
                        <p className="text-gray-600 font-medium mb-10 max-w-xl mx-auto">Subscribe to our newsletter for bi-weekly technical insights and company updates delivered to your inbox.</p>

                        <form className="max-w-md mx-auto flex flex-col md:flex-row gap-4">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-sm px-6 py-4 text-primary-dark focus:outline-none focus:border-primary-orange transition-all font-bold text-sm"
                            />
                            <button className="bg-primary-orange hover:bg-primary-orange/90 text-white font-black px-10 py-4 rounded-sm uppercase tracking-widest text-[10px] transition-all transform active:scale-95 shadow-xl">
                                Subscribe
                            </button>
                        </form>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
