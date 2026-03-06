'use server';

import { projectService, Project } from '@/services/projectService';
import { revalidatePath } from 'next/cache';

export async function getProjectsAction() {
    return await projectService.getProjects();
}

export async function getProjectBySlugAction(slug: string) {
    return await projectService.getProjectBySlug(slug);
}

export async function getProjectByIdAction(id: string) {
    return await projectService.getProjectById(id);
}

export async function getProjectsByCategoryAction(category: string) {
    return await projectService.getProjectsByCategory(category);
}

export async function createProjectAction(data: Project) {
    const project = await projectService.createProject(data);
    revalidatePath('/admin/dashboard/projects');
    revalidatePath('/projects');
    return project;
}

export async function updateProjectAction(id: string, data: Partial<Project>) {
    const project = await projectService.updateProject(id, data);
    revalidatePath('/admin/dashboard/projects');
    revalidatePath(`/projects/${project.slug}`);
    revalidatePath('/projects');
    return project;
}

export async function deleteProjectAction(id: string) {
    await projectService.deleteProject(id);
    revalidatePath('/admin/dashboard/projects');
    revalidatePath('/projects');
}
