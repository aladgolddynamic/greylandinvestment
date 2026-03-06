'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer/Footer';
import NewsCard from '@/components/News/NewsCard';
import { motion } from 'framer-motion';
import { getArticlesAction } from '@/lib/actions/newsActions';
import { addSubscriberAction } from '@/lib/actions/newsletterActions';
import { NewsArticle } from '@/types/news';
import { FaCheck } from 'react-icons/fa';

export default function NewsPage() {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [subEmail, setSubEmail] = useState('');
    const [subState, setSubState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [subError, setSubError] = useState('');

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubState('loading');
        setSubError('');
        try {
            await addSubscriberAction(subEmail, undefined, 'NEWS_PAGE');
            setSubState('success');
            setSubEmail('');
        } catch (err: any) {
            setSubError(err.message || 'Subscription failed.');
            setSubState('error');
        }
    };

    useEffect(() => {
        const fetchNews = async () => {
            const data = await getArticlesAction();
            // Filter only published articles for the public page
            setArticles(data.filter(a => a.status === 'PUBLISHED'));
            setLoading(false);
        };
        fetchNews();
    }, []);

    return (
        <main className="min-h-screen bg-[#F8FAFC]">
            <Navbar />

            {/* News Hero */}
            <section className="bg-gradient-to-r from-[#3F4A5A] to-[#5B5F73] pt-32 pb-24 relative overflow-hidden shadow-lg">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
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
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-10 h-10 border-4 border-primary-orange/20 border-t-primary-orange rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                            {articles.map((article, index) => (
                                <NewsCard key={article.id} index={index} {...article} />
                            ))}
                        </div>
                    )}

                    {/* Newsletter Subscription (Inlay) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="mt-32 bg-white rounded-2xl p-8 md:p-16 border border-gray-100 text-center relative overflow-hidden group shadow-xl"
                    >
                        <div className="absolute inset-0 bg-primary-orange/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                        <h3 className="text-2xl md:text-4xl font-black text-primary-dark uppercase mb-4">Stay Ahead of the Curve</h3>
                        <p className="text-gray-600 font-medium mb-10 max-w-xl mx-auto">Subscribe to our newsletter for bi-weekly technical insights and company updates delivered to your inbox.</p>

                        {subState === 'success' ? (
                            <div className="max-w-md mx-auto flex items-center justify-center gap-3 bg-green-50 border border-green-200 rounded-sm px-6 py-4">
                                <FaCheck className="text-green-500 shrink-0" size={14} />
                                <p className="text-green-700 text-sm font-bold">You&apos;re subscribed! Thanks for joining.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col md:flex-row gap-4">
                                <input
                                    type="email"
                                    required
                                    value={subEmail}
                                    onChange={e => setSubEmail(e.target.value)}
                                    disabled={subState === 'loading'}
                                    placeholder="Enter your email address"
                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-sm px-6 py-4 text-primary-dark focus:outline-none focus:border-primary-orange transition-all font-bold text-sm disabled:opacity-50"
                                />
                                <button
                                    type="submit"
                                    disabled={subState === 'loading'}
                                    className="bg-primary-orange hover:bg-primary-orange/90 text-white font-black px-10 py-4 rounded-sm uppercase tracking-widest text-[10px] transition-all transform active:scale-95 shadow-xl disabled:opacity-60"
                                >
                                    {subState === 'loading' ? 'Subscribing...' : 'Subscribe'}
                                </button>
                            </form>
                        )}
                        {subState === 'error' && <p className="text-red-500 text-xs font-bold mt-4">{subError}</p>}
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
