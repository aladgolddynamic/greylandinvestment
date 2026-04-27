import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { randomUUID } from 'crypto';

import { Comment, CommentStatus, ContentType } from '@/types/comment';

/**
 * CommentService handles the CRUD operations and persistence for comments using Supabase.
 */
class CommentServiceCore {
    private mapToComment(dbComment: any): Comment {
        return {
            id: dbComment.id,
            contentType: dbComment.contentType as ContentType,
            contentId: dbComment.newsArticleId || dbComment.projectId || dbComment.serviceId || '',
            fullName: dbComment.fullName,
            email: dbComment.email,
            text: dbComment.content,
            status: dbComment.status as CommentStatus,
            ipAddress: dbComment.ipAddress || undefined,
            createdAt: dbComment.createdAt ? new Date(dbComment.createdAt).toISOString() : new Date().toISOString(),
            updatedAt: dbComment.updatedAt ? new Date(dbComment.updatedAt).toISOString() : new Date().toISOString(),
            parentId: dbComment.parentId || undefined,
            isEdited: dbComment.isEdited,
            isCompanyReply: dbComment.isCompanyReply,
            replies: dbComment._replies?.map((r: any) => this.mapToComment(r))
        };
    }

    async submitComment(data: Omit<Comment, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'replies'>): Promise<Comment> {
        const createData: any = {
            contentType: data.contentType,
            fullName: data.fullName,
            email: data.email,
            content: data.text,
            status: 'PENDING',
            parentId: data.parentId || null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // Link to the correct entity
        if (data.contentType === 'news') createData.newsArticleId = data.contentId;
        else if (data.contentType === 'project') createData.projectId = data.contentId;
        else if (data.contentType === 'service') createData.serviceId = data.contentId;

        const { data: comment, error } = await supabaseAdmin
            .from('Comment')
            .insert([{
                id: randomUUID(),
                ...createData
            }])
            .select()
            .single();
        if (error) throw error;

        return this.mapToComment(comment);
    }

    async getApprovedComments(type: ContentType, id: string): Promise<Comment[]> {
        // Build the filter for the content type
        let query = supabaseAdmin
            .from('Comment')
            .select('*')
            .eq('contentType', type)
            .eq('status', 'APPROVED')
            .is('parentId', null)
            .order('createdAt', { ascending: false });

        if (type === 'news') query = query.eq('newsArticleId', id);
        else if (type === 'project') query = query.eq('projectId', id);
        else if (type === 'service') query = query.eq('serviceId', id);

        const { data: comments, error } = await query;
        if (error) throw error;

        // Fetch replies for each top-level comment
        const result: Comment[] = [];
        for (const comment of (comments || [])) {
            const { data: replies } = await supabaseAdmin
                .from('Comment')
                .select('*')
                .eq('parentId', comment.id)
                .eq('status', 'APPROVED')
                .order('createdAt', { ascending: true });

            const mapped = this.mapToComment({ ...comment, _replies: replies || [] });
            result.push(mapped);
        }

        return result;
    }

    async getAllCommentsAdmin(): Promise<Comment[]> {
        const { data: comments, error } = await supabaseAdmin
            .from('Comment')
            .select('*')
            .is('parentId', null)
            .order('createdAt', { ascending: false });
        if (error) throw error;

        const result: Comment[] = [];
        for (const comment of (comments || [])) {
            const { data: replies } = await supabaseAdmin
                .from('Comment')
                .select('*')
                .eq('parentId', comment.id)
                .order('createdAt', { ascending: true });

            const mapped = this.mapToComment({ ...comment, _replies: replies || [] });
            result.push(mapped);
        }

        return result;
    }

    async updateCommentStatus(id: string, status: CommentStatus): Promise<Comment> {
        const { data: comment, error } = await supabaseAdmin
            .from('Comment')
            .update({ status, updatedAt: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return this.mapToComment(comment);
    }

    async deleteComment(id: string): Promise<void> {
        const { error } = await supabaseAdmin
            .from('Comment')
            .delete()
            .eq('id', id);
        if (error) throw error;
    }

    async addCompanyReply(parentId: string, text: string): Promise<Comment> {
        // Fetch parent comment
        const { data: parent, error: parentError } = await supabaseAdmin
            .from('Comment')
            .select('*')
            .eq('id', parentId)
            .single();
        if (parentError || !parent) throw new Error('Parent comment not found');

        const replyData: any = {
            contentType: parent.contentType,
            parentId: parent.id,
            fullName: 'Greyland Advisory',
            email: 'editorial@greyland.com',
            content: text,
            status: 'APPROVED',
            isCompanyReply: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        if (parent.newsArticleId) replyData.newsArticleId = parent.newsArticleId;
        else if (parent.projectId) replyData.projectId = parent.projectId;
        else if (parent.serviceId) replyData.serviceId = parent.serviceId;

        const { data: reply, error } = await supabaseAdmin
            .from('Comment')
            .insert([{
                id: randomUUID(),
                ...replyData
            }])
            .select()
            .single();
        if (error) throw error;

        return this.mapToComment(reply);
    }
}

export const commentService = new CommentServiceCore();
export const CommentService = commentService;
