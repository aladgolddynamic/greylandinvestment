/**
 * Job Application Type Definition
 * This file is safe to import in both client and server components.
 */
export interface JobApplication {
    id: string;
    jobId: string;
    jobTitle: string;
    fullName: string;
    email: string;
    phone: string;
    coverLetter: string;
    cvFile?: {
        name: string;
        size: number;
        type: string;
        data?: string; // Base64 or mock URL
    };
    portfolioLink?: string;
    status: 'NEW' | 'REVIEWED' | 'SHORTLISTED' | 'REJECTED';
    createdAt: string;
}
