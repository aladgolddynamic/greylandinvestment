'use client';

import React, { useState, useEffect } from 'react';
import {
    getArticlesAction,
    deleteArticleAction,
    updateArticleAction
} from '@/lib/actions/newsActions';
import { NewsArticle } from '@/types/news';
import { useDebounce } from '@/utils/useDebounce';
import {
    FaPlus,
    FaSearch,
    FaEdit,
    FaTrash,
    FaEye,
    FaStar,
    FaRegStar,
    FaCheckCircle,
    FaClock,
    FaFilter
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function NewsManager() {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedQuery = useDebounce(searchQuery, 300);
    const [filterStatus, setFilterStatus] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL');

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        setLoading(true);
        const data = await getArticlesAction();
        setArticles(data);
        setLoading(false);
    };

    const handleToggleFeatured = async (id: string, current: boolean) => {
        await updateArticleAction(id, { featured: !current });
        fetchArticles();
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to terminate this article? This action is irreversible.')) {
            await deleteArticleAction(id);
            fetchArticles();
        }
    };

    const filteredArticles = articles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
            article.category.toLowerCase().includes(debouncedQuery.toLowerCase());
        const matchesStatus = filterStatus === 'ALL' || article.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-primary-dark uppercase tracking-tighter mb-2">
                        News <span className="text-primary-orange">Intelligence</span>
                    </h1>
                    <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                        Manage Corporate Briefs, Media Releases, and Featured Stories
                    </p>
                </div>
                <a href="/admin/dashboard/news/create" className="flex items-center gap-3 px-8 py-4 bg-primary-dark hover:bg-primary-orange text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-primary-orange/20">
                    <FaPlus /> New Article
                </a>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <FaSearch size={14} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by Title, Category, or Keywords..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-gray-100 rounded-xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-orange/10 focus:border-primary-orange transition-all shadow-sm"
                    />
                </div>
                <div className="flex gap-4">
                    <select
                        value={filterStatus}
                        onChange={(e: any) => setFilterStatus(e.target.value)}
                        className="bg-white border border-gray-100 rounded-xl px-6 py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-primary-orange shadow-sm cursor-pointer"
                    >
                        <option value="ALL">All Status</option>
                        <option value="PUBLISHED">Published</option>
                        <option value="DRAFT">Drafts</option>
                    </select>
                    <button className="bg-white border border-gray-100 rounded-xl px-6 py-4 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:text-primary-orange transition-colors shadow-sm">
                        <FaFilter /> Advanced
                    </button>
                </div>
            </div>

            {/* Article List */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[#F8FAFC] border-b border-gray-100">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Article Details</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Featured</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <div className="inline-block w-8 h-8 border-4 border-primary-orange/20 border-t-primary-orange rounded-full animate-spin"></div>
                                    </td>
                                </tr>
                            ) : filteredArticles.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                                        No articles found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredArticles.map((article) => (
                                    <tr key={article.id} className="hover:bg-[#F8FAFC] transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                                    <img src={article.image} alt={article.title} className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-black text-primary-dark uppercase truncate mb-1">{article.title}</p>
                                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                                                        {article.date} {article.updatedAt && ` / Updated: ${new Date(article.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[9px] font-black text-primary-orange uppercase tracking-widest px-3 py-1 bg-primary-orange/5 rounded-full">
                                                {article.category}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <button
                                                onClick={() => article.id && handleToggleFeatured(article.id, !!article.featured)}
                                                className={`transition-colors ${article.featured ? 'text-primary-orange' : 'text-gray-200 hover:text-primary-orange'}`}
                                            >
                                                {article.featured ? <FaStar size={16} /> : <FaRegStar size={16} />}
                                            </button>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-center gap-2">
                                                {article.status === 'PUBLISHED' ? (
                                                    <span className="flex items-center gap-2 text-[9px] font-black text-green-500 uppercase tracking-widest">
                                                        <FaCheckCircle /> Published
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-2 text-[9px] font-black text-yellow-500 uppercase tracking-widest">
                                                        <FaClock /> Draft
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-end gap-3">
                                                <a href={`/news/${article.slug}`} target="_blank" rel="noopener noreferrer" title="View Live" className="p-3 bg-[#F8FAFC] text-gray-400 hover:text-primary-dark rounded-xl transition-all block">
                                                    <FaEye size={14} />
                                                </a>
                                                <a href={`/admin/dashboard/news/edit/${article.id}`} title="Edit Brief" className="p-3 bg-[#F8FAFC] text-gray-400 hover:text-primary-orange rounded-xl transition-all block">
                                                    <FaEdit size={14} />
                                                </a>
                                                <button
                                                    onClick={() => article.id && handleDelete(article.id)}
                                                    title="Terminate"
                                                    className="p-3 bg-[#F8FAFC] text-gray-400 hover:text-red-500 rounded-xl transition-all"
                                                >
                                                    <FaTrash size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Placeholder */}
                <div className="bg-[#F8FAFC] p-6 border-t border-gray-100 flex justify-between items-center">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                        Showing {filteredArticles.length} of {articles.length} records
                    </p>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 border border-gray-200 rounded-lg text-[9px] font-black uppercase text-gray-400 cursor-not-allowed">Previous</button>
                        <button className="px-4 py-2 border border-gray-200 rounded-lg text-[9px] font-black uppercase text-gray-400 cursor-not-allowed">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
