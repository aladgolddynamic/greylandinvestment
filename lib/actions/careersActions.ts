'use server';

import { careersService } from '@/services/careersService';
import { Job } from '@/types/careers';
import { revalidatePath } from 'next/cache';

export async function getJobsAction() {
    return await careersService.getJobs();
}

export async function getJobBySlugAction(slug: string) {
    return await careersService.getJobBySlug(slug);
}

export async function getJobByIdAction(id: string) {
    return await careersService.getJobById(id);
}

export async function createJobAction(data: Job) {
    const job = await careersService.createJob(data);
    revalidatePath('/admin/dashboard/careers');
    revalidatePath('/careers');
    return job;
}

export async function updateJobAction(id: string, data: Partial<Job>) {
    const job = await careersService.updateJob(id, data);
    revalidatePath('/admin/dashboard/careers');
    revalidatePath(`/careers/${job.slug}`);
    revalidatePath('/careers');
    return job;
}

export async function deleteJobAction(id: string) {
    await careersService.deleteJob(id);
    revalidatePath('/admin/dashboard/careers');
    revalidatePath('/careers');
}
