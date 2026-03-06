/**
 * Project Status — matches public presentation semantics
 */
export type ProjectStatus = 'Ongoing' | 'Completed' | 'Planned';

/**
 * Project Interface (Aligned with UI & Constants)
 */
export interface Project {
    id: string;
    title: string;
    slug: string;
    industry: string;
    duration: string;
    location: string;
    description: string;
    deliverables: string[];
    image: string;
    category: string;
    featured?: boolean;
    status?: ProjectStatus;
    publicationStatus?: 'DRAFT' | 'PUBLISHED';
    startDate?: string;
    endDate?: string;
    client?: string;
    objectives?: string[];
    technologies?: string[];
    achievements?: string[];
    gallery?: { url: string; caption?: string }[];
    createdAt?: string;
    updatedAt?: string;
}
