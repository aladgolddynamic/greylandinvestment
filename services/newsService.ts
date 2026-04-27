import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { randomUUID } from 'crypto';
import { NewsArticle, NewsBlock, BlockType } from '@/types/news';

/**
 * NewsService handles news-specific operations using Supabase.
 */
class NewsService {
    private mapToNewsArticle(article: any): NewsArticle {
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
            createdAt: article.createdAt ? new Date(article.createdAt).toISOString() : new Date().toISOString(),
            updatedAt: article.updatedAt ? new Date(article.updatedAt).toISOString() : new Date().toISOString()
        };
    }

    async getArticles(): Promise<NewsArticle[]> {
        try {
            const { data, error } = await supabaseAdmin
                .from('NewsArticle')
                .select('*')
                .order('createdAt', { ascending: false });
            if (error) throw error;
            console.log(`[NewsService] Fetched ${(data || []).length} articles`);
            return (data || []).map(a => this.mapToNewsArticle(a));
        } catch (err) {
            console.error('[NewsService] Error in getArticles:', err);
            return [];
        }
    }

    async getArticleBySlug(slug: string): Promise<NewsArticle | undefined> {
        try {
            const { data, error } = await supabaseAdmin
                .from('NewsArticle')
                .select('*')
                .eq('slug', slug)
                .single();
            if (error) throw error;
            return data ? this.mapToNewsArticle(data) : undefined;
        } catch (err) {
            console.warn('[NewsService] DB unavailable for getArticleBySlug.', err);
            return undefined;
        }
    }

    async getArticleById(id: string): Promise<NewsArticle | undefined> {
        try {
            const { data, error } = await supabaseAdmin
                .from('NewsArticle')
                .select('*')
                .eq('id', id)
                .single();
            if (error) throw error;
            return data ? this.mapToNewsArticle(data) : undefined;
        } catch (err) {
            console.warn('[NewsService] DB unavailable for getArticleById.', err);
            return undefined;
        }
    }

    async createArticle(data: NewsArticle): Promise<NewsArticle> {
        const { data: article, error } = await supabaseAdmin
            .from('NewsArticle')
            .insert([
                {
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
                    contentBlocks: data.contentBlocks as any,
                    id: randomUUID(),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            ])
            .select()
            .single();
        if (error) throw error;
        return this.mapToNewsArticle(article);
    }

    async updateArticle(id: string, data: Partial<NewsArticle>): Promise<NewsArticle> {
        const updateData: any = { ...data };
        // Remove fields that shouldn't be passed directly
        delete updateData.id;
        delete updateData.createdAt;
        if (data.contentBlocks) updateData.contentBlocks = data.contentBlocks as any;

        const { data: article, error } = await supabaseAdmin
            .from('NewsArticle')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return this.mapToNewsArticle(article);
    }

    async deleteArticle(id: string): Promise<void> {
        const { error } = await supabaseAdmin
            .from('NewsArticle')
            .delete()
            .eq('id', id);
        if (error) throw error;
    }
}

export const newsService = new NewsService();
