'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getArticleByIdAction } from '@/lib/actions/newsActions';
import { NewsArticle } from '@/types/news';
import NewsForm from '@/components/Admin/News/NewsForm';

export default function EditNewsPage() {
    const { id } = useParams();
    const [article, setArticle] = useState<NewsArticle | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            if (typeof id === 'string') {
                const articleData = await getArticleByIdAction(id);
                setArticle(articleData || null);
            }
            setLoading(false);
        };
        fetchArticle();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-primary-orange border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest">Loading Article Details...</p>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-400 font-black text-sm uppercase tracking-widest">Article not found.</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pb-20">
            <NewsForm initialData={article} isEdit={true} />
        </div>
    );
}
