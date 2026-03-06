import { MediaAsset } from '@/types/media';

/**
 * MediaService handles asset management.
 * Mock implementation for backend-ready image/file handling.
 */
class MediaService {
    private ASSETS: MediaAsset[] = [
        { id: 'img-1', url: '/logo.png', filename: 'logo.png', type: 'IMAGE', size: '45kb', uploadedAt: new Date().toISOString() },
    ];

    /**
     * Get all assets
     */
    async getAssets(): Promise<MediaAsset[]> {
        await new Promise(resolve => setTimeout(resolve, 500));
        return [...this.ASSETS];
    }

    /**
     * Upload new asset (Mock)
     */
    async uploadAsset(file: File): Promise<MediaAsset> {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const newAsset: MediaAsset = {
            id: `img-${this.ASSETS.length + 1}`,
            url: URL.createObjectURL(file), // Mock URL
            filename: file.name,
            type: 'IMAGE',
            size: `${(file.size / 1024).toFixed(1)}kb`,
            uploadedAt: new Date().toISOString()
        };
        this.ASSETS.push(newAsset);
        return newAsset;
    }

    /**
     * Delete asset (Mock)
     */
    async deleteAsset(id: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.ASSETS = this.ASSETS.filter(asset => asset.id !== id);
    }
}

export const mediaService = new MediaService();
