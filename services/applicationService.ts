import { prisma } from '@/lib/prisma';
import { Application as DbApplication } from '@prisma/client';
import { JobApplication } from '@/types/application';

class ApplicationService {
    private mapToApplication(dbApp: DbApplication): JobApplication {
        return {
            id: dbApp.id,
            jobId: dbApp.careerId,
            jobTitle: '', // This might need to be joined or fetched separately for full accuracy
            fullName: dbApp.fullName,
            email: dbApp.email,
            phone: dbApp.phone,
            coverLetter: dbApp.coverLetter || '',
            cvFile: {
                name: dbApp.cvName || 'unknown',
                size: dbApp.cvSize || 0,
                type: dbApp.cvType || 'application/octet-stream',
                data: dbApp.cvData || undefined
            },
            portfolioLink: dbApp.portfolioLink || undefined,
            status: dbApp.status as any,
            createdAt: dbApp.createdAt.toISOString()
        };
    }

    async getApplications(): Promise<JobApplication[]> {
        const apps = await prisma.application.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return apps.map(this.mapToApplication.bind(this));
    }

    async submitApplication(data: Omit<JobApplication, 'id' | 'status' | 'createdAt'>): Promise<JobApplication> {
        const app = await prisma.application.create({
            data: {
                careerId: data.jobId,
                fullName: data.fullName,
                email: data.email,
                phone: data.phone,
                coverLetter: data.coverLetter,
                cvName: data.cvFile?.name,
                cvSize: data.cvFile?.size,
                cvType: data.cvFile?.type,
                cvData: data.cvFile?.data,
                portfolioLink: data.portfolioLink,
                status: 'NEW'
            }
        });

        return this.mapToApplication(app);
    }

    async updateApplicationStatus(id: string, status: JobApplication['status']): Promise<JobApplication> {
        const app = await prisma.application.update({
            where: { id },
            data: { status }
        });
        return this.mapToApplication(app);
    }

    async deleteApplication(id: string): Promise<void> {
        await prisma.application.delete({
            where: { id }
        });
    }
}

export const applicationService = new ApplicationService();
