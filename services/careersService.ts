import { supabaseAdmin } from '@/lib/supabaseAdmin';

import { Job } from '@/types/careers';

class CareersService {
    private mapToJob(dbJob: any): Job {
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
            deadline: dbJob.deadline ? new Date(dbJob.deadline).toISOString().split('T')[0] : '',
            status: dbJob.status as 'OPEN' | 'CLOSED',
            featured: dbJob.featured,
            createdAt: dbJob.createdAt ? new Date(dbJob.createdAt).toISOString() : new Date().toISOString(),
            updatedAt: dbJob.updatedAt ? new Date(dbJob.updatedAt).toISOString() : new Date().toISOString()
        };
    }

    async getJobs(): Promise<Job[]> {
        try {
            const { data, error } = await supabaseAdmin
                .from('Career')
                .select('*')
                .order('createdAt', { ascending: false });
            if (error) throw error;
            return (data || []).map(this.mapToJob);
        } catch (err) {
            console.warn('[CareersService] DB unavailable for getJobs.', err);
            return [];
        }
    }

    async getJobBySlug(slug: string): Promise<Job | undefined> {
        try {
            const { data, error } = await supabaseAdmin
                .from('Career')
                .select('*')
                .eq('slug', slug)
                .single();
            if (error) throw error;
            return data ? this.mapToJob(data) : undefined;
        } catch (err) {
            console.warn('[CareersService] DB unavailable for getJobBySlug.', err);
            return undefined;
        }
    }

    async getJobById(id: string): Promise<Job | undefined> {
        try {
            const { data, error } = await supabaseAdmin
                .from('Career')
                .select('*')
                .eq('id', id)
                .single();
            if (error) throw error;
            return data ? this.mapToJob(data) : undefined;
        } catch (err) {
            console.warn('[CareersService] DB unavailable for getJobById.', err);
            return undefined;
        }
    }

    async createJob(data: Job): Promise<Job> {
        const { data: job, error } = await supabaseAdmin
            .from('Career')
            .insert([
                {
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
                    deadline: new Date(data.deadline).toISOString(),
                    status: data.status,
                    featured: data.featured || false
                }
            ])
            .select()
            .single();
        if (error) throw error;
        return this.mapToJob(job);
    }

    async updateJob(id: string, data: Partial<Job>): Promise<Job> {
        const updateData: any = { ...data };
        delete updateData.id;
        delete updateData.createdAt;
        if (data.deadline) updateData.deadline = new Date(data.deadline).toISOString();
        if (data.descriptionBlocks) updateData.descriptionBlocks = data.descriptionBlocks as any;
        if (data.responsibilities) updateData.responsibilities = data.responsibilities as any;
        if (data.requirements) updateData.requirements = data.requirements as any;

        const { data: job, error } = await supabaseAdmin
            .from('Career')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return this.mapToJob(job);
    }

    async deleteJob(id: string): Promise<void> {
        const { error } = await supabaseAdmin
            .from('Career')
            .delete()
            .eq('id', id);
        if (error) throw error;
    }
}

export const careersService = new CareersService();
