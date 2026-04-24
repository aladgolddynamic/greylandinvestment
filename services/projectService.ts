import { prisma } from '@/lib/prisma';
import { Project as DbProject } from '@prisma/client';

import { Project, ProjectStatus } from '@/types/project';

/**
 * ProjectService handles project-specific operations using Prisma.
 */
class ProjectService {
    private mapToProject(project: DbProject): Project {
        return {
            id: project.id,
            title: project.title,
            slug: project.slug,
            industry: project.industry,
            duration: project.duration,
            location: project.location,
            description: project.description,
            deliverables: project.deliverables as string[],
            image: project.image,
            category: project.category,
            featured: project.featured,
            status: project.status as ProjectStatus,
            publicationStatus: project.publicationStatus as 'DRAFT' | 'PUBLISHED',
            startDate: project.startDate?.toISOString(),
            endDate: project.endDate?.toISOString(),
            client: project.client || undefined,
            objectives: (project.objectives as string[]) || undefined,
            technologies: (project.technologies as string[]) || undefined,
            achievements: (project.achievements as string[]) || undefined,
            gallery: (project.gallery as any[]) || undefined,
            createdAt: project.createdAt.toISOString(),
            updatedAt: project.updatedAt.toISOString()
        };
    }

    async getProjects(): Promise<Project[]> {
        const projects = await prisma.project.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return projects.map(this.mapToProject);
    }

    async getProjectBySlug(slug: string): Promise<Project | undefined> {
        const project = await prisma.project.findUnique({
            where: { slug }
        });
        return project ? this.mapToProject(project) : undefined;
    }

    async getProjectById(id: string): Promise<Project | undefined> {
        const project = await prisma.project.findUnique({
            where: { id }
        });
        return project ? this.mapToProject(project) : undefined;
    }

    async getProjectsByCategory(category: string): Promise<Project[]> {
        const projects = await prisma.project.findMany({
            where: { category: category.toUpperCase() },
            orderBy: { createdAt: 'desc' }
        });
        return projects.map(this.mapToProject);
    }

    async createProject(data: Project): Promise<Project> {
        const project = await prisma.project.create({
            data: {
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
                startDate: data.startDate ? new Date(data.startDate) : null,
                endDate: data.endDate ? new Date(data.endDate) : null,
                client: data.client,
                objectives: data.objectives as any,
                technologies: data.technologies as any,
                achievements: data.achievements as any,
                gallery: data.gallery as any
            }
        });
        return this.mapToProject(project);
    }

    async updateProject(id: string, data: Partial<Project>): Promise<Project> {
        const updateData: any = { ...data };
        if (data.startDate) updateData.startDate = new Date(data.startDate);
        if (data.endDate) updateData.endDate = new Date(data.endDate);
        if (data.deliverables) updateData.deliverables = data.deliverables as any;
        if (data.objectives) updateData.objectives = data.objectives as any;
        if (data.technologies) updateData.technologies = data.technologies as any;
        if (data.achievements) updateData.achievements = data.achievements as any;
        if (data.gallery) updateData.gallery = data.gallery as any;

        const project = await prisma.project.update({
            where: { id },
            data: updateData
        });
        return this.mapToProject(project);
    }

    async deleteProject(id: string): Promise<void> {
        await prisma.project.delete({
            where: { id }
        });
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
