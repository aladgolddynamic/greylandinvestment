/**
 * Enhanced Service Interface for the Deployment System
 */
export interface ServiceFeature {
    id: string;
    title: string;
    description: string;
    icon: string;
}

export type ServiceCategory = 'TECHNOLOGY' | 'AUDIT & PROTECTION' | 'ENGINEERING' | 'PROCUREMENT';

export interface ServiceItem {
    id: string;
    title: string;
    slug: string;
    shortDescription: string;
    fullDescription: string;
    features: ServiceFeature[];
    media: {
        banner: string;
        illustrations: string[];
    };
    category: ServiceCategory;
    icon: string;
    bullets: string[]; // For legacy compatibility
    featured: boolean;
    order: number;
    status: 'DRAFT' | 'PUBLISHED';
    createdAt?: string;
    updatedAt?: string;
}
