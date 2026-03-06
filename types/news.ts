/**
 * News Article Types
 */
export type BlockType = 'paragraph' | 'h2' | 'h3' | 'quote' | 'callout' | 'bullet-list' | 'number-list' | 'divider';

export interface NewsBlock {
    id: string;
    type: BlockType;
    content: string;
    calloutTitle?: string;
}

export interface NewsArticle {
    id: string;
    title: string;
    slug: string;
    category: string;
    date: string;
    image: string;
    excerpt: string;
    readTime?: string;
    content?: string;
    featured?: boolean;
    status: 'PUBLISHED' | 'DRAFT';
    contentBlocks?: NewsBlock[];
    createdAt?: string;
    updatedAt?: string;
}
