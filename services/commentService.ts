import { prisma } from '@/lib/prisma';
import { Comment as DbComment } from '@prisma/client';

import { Comment, CommentStatus, ContentType } from '@/types/comment';

/**
 * CommentService handles the CRUD operations and persistence for comments using Prisma.
 */
class CommentServiceCore {
    private mapToComment(dbComment: DbComment & { replies?: any[] }): Comment {
        return {
            id: dbComment.id,
            contentType: dbComment.contentType as ContentType,
            contentId: dbComment.newsArticleId || dbComment.projectId || dbComment.serviceId || '',
            fullName: dbComment.fullName,
            email: dbComment.email,
            text: dbComment.text,
            status: dbComment.status as CommentStatus,
            ipAddress: dbComment.ipAddress || undefined,
            createdAt: dbComment.createdAt.toISOString(),
            updatedAt: dbComment.updatedAt.toISOString(),
            parentId: dbComment.parentId || undefined,
            isEdited: dbComment.isEdited,
            isCompanyReply: dbComment.isCompanyReply,
            replies: dbComment.replies?.map(r => this.mapToComment(r))
        };
    }

    async submitComment(data: Omit<Comment, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'replies'>): Promise<Comment> {
        const createData: any = {
            contentType: data.contentType,
            fullName: data.fullName,
            email: data.email,
            text: data.text,
            status: 'PENDING',
            parentId: data.parentId || null,
        };

        // Link to the correct entity
        if (data.contentType === 'news') createData.newsArticleId = data.contentId;
        else if (data.contentType === 'project') createData.projectId = data.contentId;
        else if (data.contentType === 'service') createData.serviceId = data.contentId;

        const comment = await prisma.comment.create({
            data: createData
        });

        return this.mapToComment(comment);
    }

    async getApprovedComments(type: ContentType, id: string): Promise<Comment[]> {
        const where: any = {
            contentType: type,
            status: 'APPROVED',
            parentId: null
        };

        if (type === 'news') where.newsArticleId = id;
        else if (type === 'project') where.projectId = id;
        else if (type === 'service') where.serviceId = id;

        const comments = await prisma.comment.findMany({
            where,
            include: {
                replies: {
                    where: { status: 'APPROVED' },
                    orderBy: { createdAt: 'asc' }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return comments.map(c => this.mapToComment(c));
    }

    async getAllCommentsAdmin(): Promise<Comment[]> {
        const comments = await prisma.comment.findMany({
            include: { replies: true },
            orderBy: { createdAt: 'desc' }
        });
        return comments.map(c => this.mapToComment(c));
    }

    async updateCommentStatus(id: string, status: CommentStatus): Promise<Comment> {
        const comment = await prisma.comment.update({
            where: { id },
            data: { status, updatedAt: new Date() }
        });
        return this.mapToComment(comment);
    }

    async deleteComment(id: string): Promise<void> {
        await prisma.comment.delete({
            where: { id }
        });
    }

    async addCompanyReply(parentId: string, text: string): Promise<Comment> {
        const parent = await prisma.comment.findUnique({ where: { id: parentId } });
        if (!parent) throw new Error('Parent comment not found');

        const replyData: any = {
            contentType: parent.contentType,
            parentId: parent.id,
            fullName: 'Greyland Advisory',
            email: 'editorial@greyland.com',
            text: text,
            status: 'APPROVED',
            isCompanyReply: true
        };

        if (parent.newsArticleId) replyData.newsArticleId = parent.newsArticleId;
        else if (parent.projectId) replyData.projectId = parent.projectId;
        else if (parent.serviceId) replyData.serviceId = parent.serviceId;

        const reply = await prisma.comment.create({
            data: replyData
        });

        return this.mapToComment(reply);
    }
}

export const commentService = new CommentServiceCore();
export const CommentService = commentService;
