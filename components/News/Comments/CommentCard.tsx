'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaUserCircle, FaCheckCircle, FaClock, FaCalendarAlt } from 'react-icons/fa';
import { Comment } from '@/types/comment';

interface CommentCardProps {
    comment: Comment;
    isReply?: boolean;
}

export default function CommentCard({ comment, isReply = false }: CommentCardProps) {
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative p-6 md:p-8 rounded-[1.5rem] transition-all mb-4 ${comment.isCompanyReply
                    ? 'bg-primary-dark text-white shadow-xl shadow-primary-dark/10 ring-2 ring-primary-orange/20 ml-8 md:ml-16'
                    : 'bg-white border border-gray-100 shadow-sm'
                }`}
        >
            <div className="flex items-start gap-4 md:gap-5">
                <div className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center ${comment.isCompanyReply ? 'bg-primary-orange text-white' : 'bg-gray-100 text-gray-400'
                    }`}>
                    {comment.isCompanyReply ? (
                        <FaCheckCircle size={20} />
                    ) : (
                        <FaUserCircle size={24} />
                    )}
                </div>

                <div className="flex-grow">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-3">
                            <span className={`font-black uppercase tracking-tighter text-sm ${comment.isCompanyReply ? 'text-primary-orange' : 'text-primary-dark'
                                }`}>
                                {comment.fullName}
                            </span>
                            {comment.isCompanyReply && (
                                <span className="bg-primary-orange/20 text-primary-orange text-[8px] font-black uppercase px-2 py-0.5 rounded flex items-center gap-1">
                                    Official Company Response
                                </span>
                            )}
                            {comment.status === 'PENDING' && (
                                <span className="bg-yellow-50 text-yellow-600 border border-yellow-100 text-[8px] font-black uppercase px-2 py-0.5 rounded flex items-center gap-1">
                                    <FaClock size={8} /> Pending Approval
                                </span>
                            )}
                        </div>
                        <div className={`flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest ${comment.isCompanyReply ? 'text-gray-500' : 'text-gray-400'
                            }`}>
                            <FaCalendarAlt size={10} className="text-primary-orange/50" />
                            {formatDate(comment.createdAt)}
                        </div>
                    </div>

                    <p className={`text-sm leading-relaxed font-medium ${comment.isCompanyReply ? 'text-gray-300 italic' : 'text-gray-600'
                        }`}>
                        {comment.text}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
