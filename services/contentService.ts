import { prisma } from '@/lib/prisma';
import { SiteContent } from '@/types/content';

/**
 * ContentService handles generic site content sections.
 * Fetches dynamic content from the database.
 */
class ContentService {
    /**
     * Get specific page content
     */
    async getPageContent(pageId: string): Promise<any> {
        const page = await prisma.pageContent.findUnique({
            where: { id: pageId }
        });
        return page?.data || null;
    }

    /**
     * Get all content (Legacy support for SiteContent type)
     */
    async getContent(): Promise<SiteContent> {
        const home = await this.getPageContent('homepage');
        const about = await this.getPageContent('about');

        return {
            homepage: home || {
                heroTitle: 'Shape the Future with Us',
                heroSubtitle: 'Build your career at the intersection of Engineering, Technology, and Excellence.',
                featuredNewsId: 'news-1'
            },
            about: about || {
                heroHeadline: 'Building Value. Delivering Confidence. Creating Lasting Impact.',
                heroSubtitle: 'An integrated engineering, technology, and contracting firm dedicated to excellence.',
                narrative: '',
                mission: '',
                vision: ''
            }
        };
    }

    /**
     * Update site content (bulk or single)
     */
    async updateContent(data: Partial<SiteContent>): Promise<SiteContent> {
        if (data.homepage) {
            await prisma.pageContent.upsert({
                where: { id: 'homepage' },
                update: { data: data.homepage as any },
                create: { id: 'homepage', data: data.homepage as any }
            });
        }
        
        if (data.about) {
            await prisma.pageContent.upsert({
                where: { id: 'about' },
                update: { data: data.about as any },
                create: { id: 'about', data: data.about as any }
            });
        }

        return this.getContent();
    }
}

export const contentService = new ContentService();
