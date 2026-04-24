import { prisma } from '@/lib/prisma';
import { SiteContent } from '@/types/content';

const DEFAULT_HOMEPAGE = {
    heroTitle: 'Engineering Excellence. Technology Innovation.',
    heroSubtitle: 'Greyland Investment Ltd delivers integrated engineering, technology, and infrastructure solutions across Nigeria.',
    featuredNewsId: '',
};

const DEFAULT_ABOUT = {
    heroHeadline: 'Building Value. Delivering Confidence. Creating Lasting Impact.',
    heroSubtitle: 'An integrated engineering, technology, and contracting firm dedicated to excellence.',
    narrative: '',
    mission: '',
    vision: '',
};

/**
 * ContentService handles generic site content sections.
 * Fetches dynamic content from the database, with graceful fallbacks.
 */
class ContentService {
    /**
     * Get specific page content — returns null on DB failure instead of throwing
     */
    async getPageContent(pageId: string): Promise<any> {
        try {
            const page = await prisma.pageContent.findUnique({
                where: { id: pageId }
            });
            return page?.data || null;
        } catch (err) {
            console.warn(`[ContentService] DB unavailable for pageId "${pageId}", using defaults.`, err);
            return null;
        }
    }

    /**
     * Get all content — returns hardcoded defaults if DB is unreachable
     */
    async getContent(): Promise<SiteContent> {
        try {
            const home = await this.getPageContent('homepage');
            const about = await this.getPageContent('about');

            return {
                homepage: home || DEFAULT_HOMEPAGE,
                about: about || DEFAULT_ABOUT,
            };
        } catch (err) {
            console.warn('[ContentService] Failed to load content, using defaults.', err);
            return {
                homepage: DEFAULT_HOMEPAGE,
                about: DEFAULT_ABOUT,
            };
        }
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
