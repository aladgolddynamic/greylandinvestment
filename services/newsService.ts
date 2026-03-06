import { prisma } from '@/lib/prisma';
import { NewsArticle as DbNewsArticle } from '@prisma/client';
import { NewsArticle, NewsBlock, BlockType } from '@/types/news';

/**
 * NewsService handles news-specific operations using Prisma.
 */
class NewsService {
    private mapToNewsArticle(article: DbNewsArticle): NewsArticle {
        return {
            id: article.id,
            title: article.title,
            slug: article.slug,
            category: article.category,
            date: article.date,
            image: article.image,
            excerpt: article.excerpt,
            readTime: article.readTime,
            content: article.content || undefined,
            featured: article.featured,
            status: article.status as 'PUBLISHED' | 'DRAFT',
            contentBlocks: article.contentBlocks as unknown as NewsBlock[],
            createdAt: article.createdAt.toISOString(),
            updatedAt: article.updatedAt.toISOString()
        };
    }

    async getArticles(): Promise<NewsArticle[]> {
        const articles = await prisma.newsArticle.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return articles.map(this.mapToNewsArticle);
    }

    async getArticleBySlug(slug: string): Promise<NewsArticle | undefined> {
        const article = await prisma.newsArticle.findUnique({
            where: { slug }
        });
        return article ? this.mapToNewsArticle(article) : undefined;
    }

    async getArticleById(id: string): Promise<NewsArticle | undefined> {
        const article = await prisma.newsArticle.findUnique({
            where: { id }
        });
        return article ? this.mapToNewsArticle(article) : undefined;
    }

    async createArticle(data: NewsArticle): Promise<NewsArticle> {
        const article = await prisma.newsArticle.create({
            data: {
                title: data.title,
                slug: data.slug,
                category: data.category,
                date: data.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                image: data.image,
                excerpt: data.excerpt,
                readTime: data.readTime || '5 min read',
                content: data.content,
                featured: data.featured || false,
                status: data.status,
                contentBlocks: data.contentBlocks as any
            }
        });
        return this.mapToNewsArticle(article);
    }

    async updateArticle(id: string, data: Partial<NewsArticle>): Promise<NewsArticle> {
        const updateData: any = { ...data };
        if (data.contentBlocks) updateData.contentBlocks = data.contentBlocks as any;
        if (data.readTime) updateData.readTime = data.readTime;
        if (data.content !== undefined) updateData.content = data.content;

        const article = await prisma.newsArticle.update({
            where: { id },
            data: updateData
        });
        return this.mapToNewsArticle(article);
    }

    async deleteArticle(id: string): Promise<void> {
        await prisma.newsArticle.delete({
            where: { id }
        });
    }
}

export const newsService = new NewsService();
