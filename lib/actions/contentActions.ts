'use server';

import { contentService, SiteContent } from '@/services/contentService';
import { revalidatePath } from 'next/cache';

export async function getContentAction(): Promise<SiteContent> {
    return await contentService.getContent();
}

export async function updateContentAction(data: Partial<SiteContent>): Promise<SiteContent> {
    const content = await contentService.updateContent(data);
    revalidatePath('/admin/dashboard/content');
    // Also revalidate public pages that use this content
    revalidatePath('/');
    revalidatePath('/about');
    return content;
}
