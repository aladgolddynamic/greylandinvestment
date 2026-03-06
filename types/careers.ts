/**
 * Enhanced Career Opening Interface
 */
export interface Job {
    id: string;
    title: string;
    slug: string;
    department: string;
    location: string;
    employmentType: 'Full-Time' | 'Part-Time' | 'Contract' | 'Internship';
    experienceLevel: string;
    excerpt: string;
    descriptionBlocks: any[]; // Matches NewsBlock or generic JSON
    responsibilities: string[];
    requirements: string[];
    salaryRange?: string;
    deadline: string;
    status: 'OPEN' | 'CLOSED';
    featured: boolean;
    createdAt: string;
    updatedAt: string;
}
