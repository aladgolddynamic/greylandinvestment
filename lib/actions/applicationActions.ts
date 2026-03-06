'use server';

import { applicationService } from '@/services/applicationService';
import { JobApplication } from '@/types/application';
import { revalidatePath } from 'next/cache';

export async function getApplicationsAction() {
    return await applicationService.getApplications();
}

export async function submitApplicationAction(data: Omit<JobApplication, 'id' | 'status' | 'createdAt'>) {
    const app = await applicationService.submitApplication(data);
    revalidatePath('/admin/dashboard/applications');
    return app;
}

export async function updateApplicationStatusAction(id: string, status: JobApplication['status']) {
    const app = await applicationService.updateApplicationStatus(id, status);
    revalidatePath('/admin/dashboard/applications');
    return app;
}

export async function deleteApplicationAction(id: string) {
    await applicationService.deleteApplication(id);
    revalidatePath('/admin/dashboard/applications');
}
