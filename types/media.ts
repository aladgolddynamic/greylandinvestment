/**
 * Media Asset Interface
 */
export interface MediaAsset {
    id: string;
    url: string;
    filename: string;
    type: 'IMAGE' | 'DOCUMENT' | 'VIDEO';
    size: string;
    uploadedAt: string;
}
