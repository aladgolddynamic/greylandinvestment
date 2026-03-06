export type CommentStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SPAM';
export type ContentType = 'news' | 'project' | 'service';

export interface Comment {
    id: string;
    contentType: ContentType;
    contentId: string;
    fullName: string;
    email: string;
    text: string;
    status: CommentStatus;
    ipAddress?: string;
    createdAt: string;
    updatedAt: string;
    parentId?: string;
    isEdited?: boolean;
    isCompanyReply?: boolean;
    replies?: Comment[];
}
