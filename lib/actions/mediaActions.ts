'use server';

import { mediaService, MediaAsset } from '@/services/mediaService';
import { revalidatePath } from 'next/cache';

export async function getAssetsAction(): Promise<MediaAsset[]> {
    return await mediaService.getAssets();
}

export async function uploadAssetAction(formData: FormData): Promise<MediaAsset> {
    const file = formData.get('file') as File;
    if (!file) throw new Error('No file provided');

    const asset = await mediaService.uploadAsset(file);
    revalidatePath('/admin/dashboard/media');
    return asset;
}

export async function deleteAssetAction(id: string): Promise<void> {
    await mediaService.deleteAsset(id);
    revalidatePath('/admin/dashboard/media');
}
