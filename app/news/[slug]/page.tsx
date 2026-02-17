'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer/Footer';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaChevronLeft, FaShareAlt, FaClock } from 'react-icons/fa';
import { useParams } from 'next/navigation';

export default function ArticleDetailPage() {
    const { slug } = useParams();

    // In a real app, this would be fetched from a CMS or DB based on the slug
    const article = {
        title: "Future of Enterprise ERP: Cloud-First Strategies",
        category: "Technology",
        date: "Feb 15, 2026",
        readTime: "6 min read",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop",
        content: `
            <p>The landscape of Enterprise Resource Planning (ERP) is undergoing a seismic shift. Traditionally anchored by heavy on-premise installations that required massive capital expenditure and dedicated IT teams, the modern ERP is now predominantly cloud-first. This transformation isn't just about changing where the software lives; it's about redefining how organizations operate in an increasingly digital and fast-paced world.</p>
            
            <h3>The Agility Advantage</h3>
            <p>One of the primary drivers of cloud ERP adoption is agility. Cloud-based systems allow organizations to scale their operations almost instantaneously. Whether it's adding a new warehouse, expanding into a different region, or integrating a new acquisition, the cloud provides the infrastructure flexibility that on-premise systems simply cannot match.</p>
            
            <h3>Data-Driven Decision Making</h3>
            <p>With unified data in the cloud, Greyland's ERP solutions provide real-time insights across finance, HR, and supply chain operations. Gone are the days of manual data reconciliation and delayed reports. Modern ERPs utilize built-in analytics and even machine learning to provide predictive insights, helping leaders make more informed decisions faster.</p>
            
            <blockquote>
                "The move to cloud ERP is no longer a luxury for specialized tech firms—it is a foundational requirement for any enterprise seeking operational efficiency in the 2020s."
            </blockquote>
            
            <h3>Security and Compliance</h3>
            <p>Contrary to early skepticism, cloud ERPs often offer superior security compared to localized servers. Top-tier cloud providers invest billions in security infrastructure, ensuring that data is protected by the latest encryption standards and monitored 24/7. For organizations in highly regulated sectors, cloud ERPs provide pre-built compliance frameworks that simplify auditing and regulatory adherence.</p>
        `
    };

    return (
        <main className="min-h-screen bg-[#F8FAFC]">
            <Navbar />

            {/* Minimal Header Space */}
            <div className="pt-24 md:pt-32"></div>

            {/* Article Content Area */}
            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Back Link */}
                    <a href="/news" className="inline-flex items-center gap-2 text-primary-orange font-black text-[10px] uppercase tracking-[0.2em] mb-12 hover:-translate-x-2 transition-transform">
                        <FaChevronLeft /> Back to News
                    </a>

                    {/* Category & Date */}
                    <div className="flex flex-wrap items-center gap-6 mb-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <span className="bg-primary-orange text-white px-3 py-1 rounded-sm shadow-xl">
                            {article.category}
                        </span>
                        <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-primary-orange" />
                            {article.date}
                        </div>
                        <div className="flex items-center gap-2">
                            <FaClock className="text-primary-orange" />
                            {article.readTime}
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-primary-dark uppercase tracking-tighter mb-12 leading-[1.1]">
                        {article.title}
                    </h1>

                    {/* Featured Image */}
                    <div className="relative w-full h-[300px] md:h-[500px] rounded-2xl overflow-hidden mb-16 shadow-2xl">
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${article.image})` }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent opacity-10"></div>
                    </div>

                    {/* Article Body */}
                    <div className="prose prose-orange max-w-none">
                        <div
                            className="text-gray-700 text-base md:text-lg leading-relaxed space-y-8 font-medium article-content"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        ></div>
                    </div>

                    {/* Share Section */}
                    <div className="mt-20 py-10 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="text-gray-400 font-black text-[10px] uppercase tracking-widest">Share this Insight:</span>
                            <div className="flex gap-4">
                                <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-primary-dark hover:bg-primary-orange hover:text-white transition-all"><FaShareAlt size={14} /></button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </article>

            <Footer />

            <style jsx global>{`
                .article-content h3 {
                    @apply text-2xl font-black text-primary-dark uppercase tracking-tight mt-12 mb-6;
                }
                .article-content blockquote {
                    @apply border-l-4 border-primary-orange pl-8 py-4 italic text-xl text-gray-700 bg-orange-50 my-12 rounded-r-lg font-bold;
                }
                .article-content p {
                    @apply mb-6;
                }
            `}</style>
        </main>
    );
}
