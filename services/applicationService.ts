import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { randomUUID } from 'crypto';
import { JobApplication } from '@/types/application';

class ApplicationService {
    private mapToApplication(dbApp: any): JobApplication {
        return {
            id: dbApp.id,
            jobId: dbApp.careerId,
            jobTitle: '', // Needs to be joined or fetched separately for full accuracy
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
            createdAt: dbApp.createdAt ? new Date(dbApp.createdAt).toISOString() : new Date().toISOString()
        };
    }

    async getApplications(): Promise<JobApplication[]> {
        const { data, error } = await supabaseAdmin
            .from('Application')
            .select('*')
            .order('createdAt', { ascending: false });
        if (error) throw error;
        return (data || []).map(this.mapToApplication.bind(this));
    }

    async submitApplication(data: Omit<JobApplication, 'id' | 'status' | 'createdAt'>): Promise<JobApplication> {
        const { data: app, error } = await supabaseAdmin
            .from('Application')
            .insert([{
                id: randomUUID(),
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
                status: 'NEW',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }])
            .select()
            .single();
        if (error) throw error;
        return this.mapToApplication(app);
    }

    async updateApplicationStatus(id: string, status: JobApplication['status']): Promise<JobApplication> {
        const { data: app, error } = await supabaseAdmin
            .from('Application')
            .update({ status })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return this.mapToApplication(app);
    }

    async deleteApplication(id: string): Promise<void> {
        const { error } = await supabaseAdmin
            .from('Application')
            .delete()
            .eq('id', id);
        if (error) throw error;
    }
}

export const applicationService = new ApplicationService();
