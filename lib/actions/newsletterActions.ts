'use server';

import { newsletterService } from '@/services/newsletterService';
import {
    Subscriber,
    SubscriberStatus,
    SubscriptionSource,
    CreateCampaignPayload,
    CampaignStatus
} from '@/types/newsletter';
import { revalidatePath } from 'next/cache';

export async function getSubscribersAction() {
    return await newsletterService.getSubscribers();
}

export async function addSubscriberAction(email: string, name?: string, source: SubscriptionSource = 'MANUAL') {
    const sub = await newsletterService.addSubscriber(email, name, source);
    revalidatePath('/admin/dashboard/newsletter');
    return sub;
}

export async function removeSubscriberAction(id: string) {
    await newsletterService.removeSubscriber(id);
    revalidatePath('/admin/dashboard/newsletter');
}

export async function updateSubscriberStatusAction(id: string, status: SubscriberStatus) {
    const sub = await newsletterService.updateSubscriberStatus(id, status);
    revalidatePath('/admin/dashboard/newsletter');
    return sub;
}

export async function exportCSVAction() {
    return await newsletterService.exportCSV();
}

export async function getCampaignsAction() {
    return await newsletterService.getCampaigns();
}

export async function createCampaignAction(payload: CreateCampaignPayload) {
    const camp = await newsletterService.createCampaign(payload);
    revalidatePath('/admin/dashboard/newsletter');
    return camp;
}

export async function updateCampaignAction(id: string, payload: Partial<CreateCampaignPayload>) {
    const camp = await newsletterService.updateCampaign(id, payload);
    revalidatePath('/admin/dashboard/newsletter');
    return camp;
}

export async function sendCampaignAction(id: string) {
    const camp = await newsletterService.sendCampaign(id);
    revalidatePath('/admin/dashboard/newsletter');
    return camp;
}

export async function duplicateCampaignAction(id: string) {
    const camp = await newsletterService.duplicateCampaign(id);
    revalidatePath('/admin/dashboard/newsletter');
    return camp;
}

export async function deleteCampaignAction(id: string) {
    await newsletterService.deleteCampaign(id);
    revalidatePath('/admin/dashboard/newsletter');
}
