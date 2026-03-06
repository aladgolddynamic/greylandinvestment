'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getApprovedCommentsAction } from '@/lib/actions/commentActions';
import { Comment } from '@/types/comment';
import CommentCard from './CommentCard';
import CommentForm from './CommentForm';
import CommentTrigger from './CommentTrigger';

interface CommentsSectionProps {
    articleId: string;
}

export default function CommentsSection({ articleId }: CommentsSectionProps) {
    const [allComments, setAllComments] = useState<Comment[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            try {
                const approved = await getApprovedCommentsAction('news', articleId);
                setAllComments(approved);
            } catch (e) {
                console.error('Failed to load comments', e);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, [articleId]);

    const handleNewComment = (comment: Comment) => {
        // We don't add PENDING comments to the public list immediately
        // The success message in CommentForm handles the feedback.
        // However, if we wanted to show it just for this user session:
        // setAllComments([comment, ...allComments]);
    };

    if (loading) return (
        <div className="py-20 text-center">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-primary-orange rounded-full animate-spin mx-auto mb-4"></div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Gathering insights...</span>
        </div>
    );

    const displayComments = isExpanded ? allComments : allComments.slice(0, 3);

    return (
        <section className="mt-32 pt-20 border-t border-gray-100">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                <div>
                    <h3 className="text-3xl md:text-4xl font-black text-primary-dark uppercase tracking-tighter mb-4">
                        Industry <span className="text-primary-orange">Perspectives</span>
                        <span className="ml-4 text-sm font-bold text-gray-400">({allComments.length})</span>
                    </h3>
                    <p className="text-gray-400 text-sm font-medium">
                        Expert opinions and corporate discussions from the Greyland community.
                    </p>
                </div>

                <CommentTrigger onClick={() => setIsFormOpen(true)} isActive={isFormOpen} />
            </div>

            <CommentForm
                articleId={articleId}
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSuccess={handleNewComment}
            />

            <div className="relative">
                <div className="space-y-6">
                    {allComments.length === 0 ? (
                        <div className="py-20 text-center bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
                            <p className="text-gray-400 text-sm font-medium">No perspectives shared yet. Be the first to contribute.</p>
                        </div>
                    ) : (
                        <>
                            {displayComments.map(comment => (
                                <div key={comment.id}>
                                    <CommentCard comment={comment} />
                                    {comment.replies?.map(reply => (
                                        <CommentCard key={reply.id} comment={reply} isReply />
                                    ))}
                                </div>
                            ))}

                            {!isExpanded && allComments.length > 3 && (
                                <div className="pt-8 text-center">
                                    <button
                                        onClick={() => setIsExpanded(true)}
                                        className="text-[11px] font-black text-primary-orange uppercase tracking-[.25em] hover:text-primary-dark transition-all flex items-center gap-4 mx-auto group"
                                    >
                                        <div className="h-px w-8 bg-gray-100 group-hover:w-12 transition-all" />
                                        Show all {allComments.length} comments
                                        <div className="h-px w-8 bg-gray-100 group-hover:w-12 transition-all" />
                                    </button>
                                </div>
                            )}

                            {isExpanded && allComments.length > 3 && (
                                <div className="pt-8 text-center">
                                    <button
                                        onClick={() => setIsExpanded(false)}
                                        className="text-[11px] font-black text-gray-400 uppercase tracking-[.25em] hover:text-primary-dark transition-all flex items-center gap-4 mx-auto group"
                                    >
                                        <div className="h-px w-8 bg-gray-100 group-hover:w-12 transition-all" />
                                        Show Less
                                        <div className="h-px w-8 bg-gray-100 group-hover:w-12 transition-all" />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
