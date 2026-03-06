'use server';

import { newsService } from '@/services/newsService';
import { NewsArticle } from '@/types/news';
import { revalidatePath } from 'next/cache';

export async function getArticlesAction() {
    return await newsService.getArticles();
}

export async function getArticleBySlugAction(slug: string) {
    return await newsService.getArticleBySlug(slug);
}

export async function getArticleByIdAction(id: string) {
    return await newsService.getArticleById(id);
}

export async function createArticleAction(data: NewsArticle) {
    const article = await newsService.createArticle(data);
    revalidatePath('/admin/dashboard/news');
    revalidatePath('/news');
    return article;
}

export async function updateArticleAction(id: string, data: Partial<NewsArticle>) {
    const article = await newsService.updateArticle(id, data);
    revalidatePath('/admin/dashboard/news');
    revalidatePath(`/news/${article.slug}`);
    revalidatePath('/news');
    return article;
}

export async function deleteArticleAction(id: string) {
    await newsService.deleteArticle(id);
    revalidatePath('/admin/dashboard/news');
    revalidatePath('/news');
}
