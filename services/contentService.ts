import { SiteContent } from '@/types/content';

/**
 * ContentService handles generic site content sections.
 * Backend-ready abstraction for dynamic updates.
 */
class ContentService {
    private CONTENT_DATA: SiteContent = {
        homepage: {
            heroTitle: 'Shape the Future with Us',
            heroSubtitle: 'Build your career at the intersection of Engineering, Technology, and Excellence.',
            featuredNewsId: 'news-1'
        },
        about: {
            heroHeadline: 'Building Value. Delivering Confidence. Creating Lasting Impact.',
            heroSubtitle: 'An integrated engineering, technology, and contracting firm dedicated to excellence.',
            narrative: 'Greyland Investment Ltd is a premier multisectoral firm providing cutting-edge solutions across Engineering, Technology, and Infrastructure.',
            mission: 'To build the foundation of Nigeria’s infrastructure through disciplined engineering and technological innovation.',
            vision: 'To be the most trusted partner for large-scale digital and physical infrastructure transformation in Africa.'
        }
    };

    /**
     * Get all content
     */
    async getContent(): Promise<SiteContent> {
        await new Promise(resolve => setTimeout(resolve, 500));
        return { ...this.CONTENT_DATA };
    }

    /**
     * Update site content (Mock)
     */
    async updateContent(data: Partial<SiteContent>): Promise<SiteContent> {
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.CONTENT_DATA = { ...this.CONTENT_DATA, ...data };
        return { ...this.CONTENT_DATA };
    }
}

export const contentService = new ContentService();
