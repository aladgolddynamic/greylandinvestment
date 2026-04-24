import { prisma } from '@/lib/prisma';
import { Career as DbJob } from '@prisma/client';

import { Job } from '@/types/careers';

class CareersService {
    private mapToJob(dbJob: DbJob): Job {
        return {
            id: dbJob.id,
            title: dbJob.title,
            slug: dbJob.slug,
            department: dbJob.department,
            location: dbJob.location,
            employmentType: dbJob.employmentType as any,
            experienceLevel: dbJob.experienceLevel,
            excerpt: dbJob.excerpt,
            descriptionBlocks: dbJob.descriptionBlocks as any[] || [],
            responsibilities: dbJob.responsibilities as string[],
            requirements: dbJob.requirements as string[],
            salaryRange: dbJob.salaryRange || undefined,
            deadline: dbJob.deadline.toISOString().split('T')[0],
            status: dbJob.status as 'OPEN' | 'CLOSED',
            featured: dbJob.featured,
            createdAt: dbJob.createdAt.toISOString(),
            updatedAt: dbJob.updatedAt.toISOString()
        };
    }

    async getJobs(): Promise<Job[]> {
        try {
            const jobs = await prisma.career.findMany({
                orderBy: { createdAt: 'desc' }
            });
            return jobs.map(this.mapToJob);
        } catch (err) {
            console.warn('[CareersService] DB unavailable for getJobs.', err);
            return [];
        }
    }

    async getJobBySlug(slug: string): Promise<Job | undefined> {
        try {
            const job = await prisma.career.findUnique({
                where: { slug }
            });
            return job ? this.mapToJob(job) : undefined;
        } catch (err) {
            console.warn('[CareersService] DB unavailable for getJobBySlug.', err);
            return undefined;
        }
    }

    async getJobById(id: string): Promise<Job | undefined> {
        try {
            const job = await prisma.career.findUnique({
                where: { id }
            });
            return job ? this.mapToJob(job) : undefined;
        } catch (err) {
            console.warn('[CareersService] DB unavailable for getJobById.', err);
            return undefined;
        }
    }

    async createJob(data: Job): Promise<Job> {
        const job = await prisma.career.create({
            data: {
                title: data.title,
                slug: data.slug,
                department: data.department,
                location: data.location,
                employmentType: data.employmentType,
                experienceLevel: data.experienceLevel,
                excerpt: data.excerpt,
                descriptionBlocks: data.descriptionBlocks as any,
                responsibilities: data.responsibilities,
                requirements: data.requirements,
                salaryRange: data.salaryRange,
                deadline: new Date(data.deadline),
                status: data.status,
                featured: data.featured || false
            }
        });
        return this.mapToJob(job);
    }

    async updateJob(id: string, data: Partial<Job>): Promise<Job> {
        const updateData: any = { ...data };
        if (data.deadline) updateData.deadline = new Date(data.deadline);
        if (data.descriptionBlocks) updateData.descriptionBlocks = data.descriptionBlocks as any;
        if (data.responsibilities) updateData.responsibilities = data.responsibilities as any;
        if (data.requirements) updateData.requirements = data.requirements as any;

        const job = await prisma.career.update({
            where: { id },
            data: updateData
        });
        return this.mapToJob(job);
    }

    async deleteJob(id: string): Promise<void> {
        await prisma.career.delete({
            where: { id }
        });
    }
}

export const careersService = new CareersService();
