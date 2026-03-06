'use server';

import { commentService } from '@/services/commentService';
import { Comment, CommentStatus, ContentType } from '@/types/comment';
import { revalidatePath } from 'next/cache';

export async function submitCommentAction(data: Omit<Comment, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'replies'>) {
    const comment = await commentService.submitComment(data);
    revalidatePath('/admin/dashboard/comments');
    return comment;
}

export async function getApprovedCommentsAction(type: ContentType, id: string) {
    return await commentService.getApprovedComments(type, id);
}

export async function getAllCommentsAdminAction() {
    return await commentService.getAllCommentsAdmin();
}

export async function updateCommentStatusAction(id: string, status: CommentStatus) {
    const comment = await commentService.updateCommentStatus(id, status);
    revalidatePath('/admin/dashboard/comments');
    return comment;
}

export async function deleteCommentAction(id: string) {
    await commentService.deleteComment(id);
    revalidatePath('/admin/dashboard/comments');
}

export async function addCompanyReplyAction(parentId: string, text: string) {
    const reply = await commentService.addCompanyReply(parentId, text);
    revalidatePath('/admin/dashboard/comments');
    return reply;
}
