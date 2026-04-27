import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { randomUUID } from 'crypto';

import { Project, ProjectStatus } from '@/types/project';

/**
 * ProjectService handles project-specific operations using Prisma.
 */
class ProjectService {
    private mapToProject(project: any): Project {
        try {
            return {
                id: project.id,
                title: project.title,
                slug: project.slug,
                industry: project.industry,
                duration: project.duration,
                location: project.location,
                description: project.description,
                deliverables: project.deliverables,
                image: project.image,
                category: project.category,
                featured: project.featured,
                status: project.status as ProjectStatus,
                publicationStatus: project.publicationStatus as 'DRAFT' | 'PUBLISHED',
                startDate: project.startDate ? new Date(project.startDate).toISOString() : undefined,
                endDate: project.endDate ? new Date(project.endDate).toISOString() : undefined,
                client: project.client || undefined,
                objectives: project.objectives || undefined,
                technologies: project.technologies || undefined,
                achievements: project.achievements || undefined,
                gallery: project.gallery || undefined,
                tags: project.tags || undefined,
                metaTitle: project.metaTitle || undefined,
                metaDescription: project.metaDescription || undefined,
                createdAt: project.createdAt ? new Date(project.createdAt).toISOString() : undefined,
                updatedAt: project.updatedAt ? new Date(project.updatedAt).toISOString() : undefined
            };
        } catch (err) {
            console.error('[ProjectService] Mapping error for project:', project?.id, err);
            throw err;
        }
    }

    async getProjects(): Promise<Project[]> {
        try {
            const { data, error } = await supabaseAdmin
                .from('Project')
                .select('*')
                .order('createdAt', { ascending: false });
            if (error) {
                console.error('[ProjectService] Supabase Error:', error);
                throw error;
            }
            console.log(`[ProjectService] Fetched ${(data || []).length} projects`);
            return (data || []).map(p => this.mapToProject(p));
        } catch (err) {
            console.error('[ProjectService] Error in getProjects:', err);
            return [];
        }
    }

    async getProjectBySlug(slug: string): Promise<Project | undefined> {
        try {
            const { data, error } = await supabaseAdmin
                .from('Project')
                .select('*')
                .eq('slug', slug)
                .single();
            if (error) throw error;
            return data ? this.mapToProject(data) : undefined;
        } catch (err) {
            console.warn('[ProjectService] DB unavailable for getProjectBySlug.', err);
            return undefined;
        }
    }

    async getProjectById(id: string): Promise<Project | undefined> {
        try {
            const { data, error } = await supabaseAdmin
                .from('Project')
                .select('*')
                .eq('id', id)
                .single();
            if (error) throw error;
            return data ? this.mapToProject(data) : undefined;
        } catch (err) {
            console.warn('[ProjectService] DB unavailable for getProjectById.', err);
            return undefined;
        }
    }

    async getProjectsByCategory(category: string): Promise<Project[]> {
        try {
            const { data, error } = await supabaseAdmin
                .from('Project')
                .select('*')
                .eq('category', category.toUpperCase())
                .order('createdAt', { ascending: false });
            if (error) throw error;
            return (data || []).map(this.mapToProject);
        } catch (err) {
            console.warn('[ProjectService] DB unavailable for getProjectsByCategory.', err);
            return [];
        }
    }

    async createProject(data: Project): Promise<Project> {
        const { data: project, error } = await supabaseAdmin
            .from('Project')
            .insert([{
                id: randomUUID(),
                title: data.title,
                slug: data.slug || data.title.toLowerCase().replace(/ /g, '-'),
                industry: data.industry,
                duration: data.duration,
                location: data.location,
                description: data.description,
                deliverables: data.deliverables,
                image: data.image,
                category: data.category.toUpperCase(),
                featured: data.featured || false,
                status: data.status || 'Planned',
                publicationStatus: data.publicationStatus || 'DRAFT',
                startDate: data.startDate ? new Date(data.startDate).toISOString() : null,
                endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
                client: data.client,
                objectives: data.objectives as any,
                technologies: data.technologies as any,
                achievements: data.achievements as any,
                gallery: data.gallery as any,
                tags: data.tags as any,
                metaTitle: data.metaTitle,
                metaDescription: data.metaDescription,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }])
            .select()
            .single();
        if (error) throw error;
        return this.mapToProject(project);
    }

    async updateProject(id: string, data: Partial<Project>): Promise<Project> {
        const updateData: any = { ...data };
        delete updateData.id;
        delete updateData.createdAt;
        if (data.startDate) updateData.startDate = new Date(data.startDate).toISOString();
        if (data.endDate) updateData.endDate = new Date(data.endDate).toISOString();
        if (data.deliverables) updateData.deliverables = data.deliverables as any;
        if (data.objectives) updateData.objectives = data.objectives as any;
        if (data.technologies) updateData.technologies = data.technologies as any;
        if (data.achievements) updateData.achievements = data.achievements as any;
        if (data.gallery) updateData.gallery = data.gallery as any;

        const { data: project, error } = await supabaseAdmin
            .from('Project')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return this.mapToProject(project);
    }

    async deleteProject(id: string): Promise<void> {
        const { error } = await supabaseAdmin
            .from('Project')
            .delete()
            .eq('id', id);
        if (error) throw error;
    }
}

export const projectService = new ProjectService();

/**
 * ProjectStyleService remains unchanged as it logic-heavy constants
 */
class ProjectStyleService {
    // Helper to get categories (mapped to original labels)
    getCategories(): { id: string; label: string; badge: string }[] {
        return [
            { id: 'TECHNOLOGY_DIGITAL', label: 'Technology & Digital', badge: 'Innovation Active' },
            { id: 'ENGINEERING_EXECUTION', label: 'Engineering & Execution', badge: 'Structural Integrity' },
            { id: 'PROCUREMENT_SUPPORT', label: 'Procurement & Support', badge: 'Operational Excellence' },
        ];
    }

    getStatusOptions(): ProjectStatus[] {
        return ['Ongoing', 'Completed', 'Planned'];
    }

    getStyleSchema() {
        return {
            cardLayout: {
                imageRatio: '16:10',
                imageEffect: 'bg-cover bg-center group-hover:scale-110',
                titleStyle: 'text-2xl font-black text-primary-dark uppercase tracking-tight',
                descriptionStyle: 'text-sm font-medium text-gray-600 leading-relaxed',
                deliverableIcon: 'FaCheckCircle / text-primary-orange',
                metaPills: ['industry (FaBriefcase)', 'duration (FaCalendarAlt)', 'location (FaMapMarkerAlt)'],
            },
            typography: {
                headings: 'font-black uppercase tracking-tighter text-primary-dark',
                body: 'font-medium text-gray-600',
                badge: 'text-[10px] font-black uppercase tracking-widest px-3 py-1',
            },
            colors: {
                accent: '#F28C28',
                dark: '#1A2433',
                surface: '#FFFFFF',
            }
        };
    }
}

export const projectStyleService = new ProjectStyleService();
