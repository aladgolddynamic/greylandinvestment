'use server';

import { serviceService, ServiceItem } from '@/services/serviceService';
import { revalidatePath } from 'next/cache';

export async function getServicesAction() {
    return await serviceService.getServices();
}

export async function getServiceByIdAction(id: string) {
    return await serviceService.getServiceById(id);
}

export async function getServiceBySlugAction(slug: string) {
    return await serviceService.getServiceBySlug(slug);
}

export async function createServiceAction(data: ServiceItem) {
    const service = await serviceService.createService(data);
    revalidatePath('/admin/dashboard/services');
    revalidatePath('/services');
    return service;
}

export async function updateServiceAction(id: string, data: Partial<ServiceItem>) {
    const service = await serviceService.updateService(id, data);
    revalidatePath('/admin/dashboard/services');
    revalidatePath(`/services/${service.slug}`);
    revalidatePath('/services');
    return service;
}

export async function deleteServiceAction(id: string) {
    await serviceService.deleteService(id);
    revalidatePath('/admin/dashboard/services');
    revalidatePath('/services');
}
