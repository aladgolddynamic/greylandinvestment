'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer/Footer';
import { motion, useScroll, useSpring } from 'framer-motion';
import { FaCalendarAlt, FaChevronLeft, FaClock } from 'react-icons/fa';
import { useParams } from 'next/navigation';
import { getArticleBySlugAction } from '@/lib/actions/newsActions';
import { NewsArticle } from '@/types/news';
import ShareNews from '@/components/News/ShareNews';
import CommentsSection from '@/components/News/Comments/CommentsSection';
import {
    ArticleH2,
    ArticleH3,
    ArticleP,
    ArticleQuote,
    ArticleCallout,
    ArticleList
} from '@/components/News/ArticleElements';

export default function ArticleDetailPage() {
    const { slug } = useParams();
    const { scrollYProgress } = useScroll();
    const [article, setArticle] = useState<NewsArticle | null | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        const fetchArticle = async () => {
            if (slug && typeof slug === 'string') {
                const data = await getArticleBySlugAction(slug);
                setArticle(data);
                setLoading(false);
            }
        };
        fetchArticle();
    }, [slug]);

    if (loading) {
        return (
            <main className="min-h-screen bg-[#F8FAFC]">
                <Navbar />
                <div className="pt-40 pb-32 text-center">
                    <div className="w-10 h-10 border-4 border-primary-orange/20 border-t-primary-orange rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Intelligence...</p>
                </div>
                <Footer />
            </main>
        );
    }

    if (!article) {
        return (
            <main className="min-h-screen bg-[#F8FAFC]">
                <Navbar />
                <div className="pt-40 pb-32 text-center">
                    <h1 className="text-4xl font-black text-primary-dark mb-8">Article Not Found</h1>
                    <a href="/news" className="text-primary-orange font-bold uppercase tracking-widest text-sm hover:underline">
                        Return to News
                    </a>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#F8FAFC]">
            <Navbar />

            {/* Reading Progress Indicator */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-primary-orange z-[100] origin-left"
                style={{ scaleX }}
            />

            {/* Desktop Floating Share Bar */}
            <ShareNews
                title={article.title}
                summary={article.excerpt}
                mode="floating"
            />

            {/* Minimal Header Space */}
            <div className="pt-24 md:pt-32"></div>

            {/* Article Content Area */}
            <article className="max-w-5xl mx-auto px-4 md:px-8 pb-32 focus-reading-area relative">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Back Link */}
                    <div className="max-w-3xl mx-auto">
                        <a href="/news" className="inline-flex items-center gap-2 text-primary-orange font-black text-[10px] uppercase tracking-[0.2em] mb-12 hover:-translate-x-2 transition-transform group">
                            <FaChevronLeft className="group-hover:mr-1 transition-all" /> Back to News
                        </a>
                    </div>

                    {/* Meta & Title - Center Aligned Focus */}
                    <div className="max-w-3xl mx-auto text-center md:text-left">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 mb-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            <span className="bg-primary-orange text-white px-3 py-1 rounded-sm shadow-lg">
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

                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-primary-dark tracking-tighter mb-8 leading-[1.15]">
                            {article.title}
                        </h1>

                        {/* Inline Share Bar */}
                        <ShareNews
                            title={article.title}
                            summary={article.excerpt}
                            mode="inline"
                        />
                    </div>

                    {/* Featured Image */}
                    <div className="relative w-full h-[300px] md:h-[600px] rounded-[2rem] overflow-hidden mb-20 shadow-2xl">
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${article.image})` }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>

                    {/* Article Body - Constrained Width for Readability */}
                    <div className="max-w-3xl mx-auto">
                        <div className="article-body">
                            {article.content}
                            {article.contentBlocks && article.contentBlocks.map(block => {
                                switch (block.type) {
                                    case 'h2': return <ArticleH2 key={block.id}>{block.content}</ArticleH2>;
                                    case 'h3': return <ArticleH3 key={block.id}>{block.content}</ArticleH3>;
                                    case 'paragraph': return <ArticleP key={block.id}>{block.content}</ArticleP>;
                                    case 'quote': return <ArticleQuote key={block.id}>{block.content}</ArticleQuote>;
                                    case 'callout':
                                        return (
                                            <ArticleCallout key={block.id} title={block.calloutTitle || 'Note'}>
                                                <p className="m-0">{block.content}</p>
                                            </ArticleCallout>
                                        );
                                    case 'bullet-list':
                                        return (
                                            <ArticleList
                                                key={block.id}
                                                type="bullet"
                                                items={block.content.split('\n').filter(l => l.trim())}
                                            />
                                        );
                                    case 'number-list':
                                        return (
                                            <ArticleList
                                                key={block.id}
                                                type="number"
                                                items={block.content.split('\n').filter(l => l.trim())}
                                            />
                                        );
                                    case 'divider': return <hr key={block.id} className="my-12 border-gray-100" />;
                                    default: return null;
                                }
                            })}
                        </div>

                        {/* Professional Interaction Section */}
                        <CommentsSection articleId={article.id} />
                    </div>
                </motion.div>
            </article>

            <Footer />
        </main>
    );
}
