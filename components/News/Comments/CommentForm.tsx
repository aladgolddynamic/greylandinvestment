'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaTimes, FaCheckCircle } from 'react-icons/fa';
import { submitCommentAction } from '@/lib/actions/commentActions';
import { Comment } from '@/services/commentService';

interface CommentFormProps {
    articleId: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (comment: Comment) => void;
}

export default function CommentForm({ articleId, isOpen, onClose, onSuccess }: CommentFormProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const newComment = await submitCommentAction({
                contentType: 'news',
                contentId: articleId,
                fullName: name,
                email: email,
                text: message
            });

            setShowSuccess(true);
            setTimeout(() => {
                onSuccess(newComment);
                setName('');
                setEmail('');
                setMessage('');
                setShowSuccess(false);
                onClose();
            }, 3000);
        } catch (err) {
            console.error('Submission failed', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                >
                    <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl border border-gray-100 my-8 relative">
                        {!showSuccess ? (
                            <>
                                <button
                                    onClick={onClose}
                                    className="absolute top-6 right-6 text-gray-400 hover:text-primary-dark"
                                >
                                    <FaTimes size={18} />
                                </button>

                                <form onSubmit={handleSubmit}>
                                    <h4 className="text-xl font-black text-primary-dark uppercase tracking-tighter mb-8">
                                        Share Your Professional Insight
                                    </h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-bold text-primary-dark uppercase ml-2">Full Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full bg-gray-50 border-none rounded-xl px-5 py-3 text-sm focus:ring-2 focus:ring-primary-orange transition-all shadow-inner"
                                                placeholder="E.g. John Doe"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-bold text-primary-dark uppercase ml-2">Work Email</label>
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-gray-50 border-none rounded-xl px-5 py-3 text-sm focus:ring-2 focus:ring-primary-orange transition-all shadow-inner"
                                                placeholder="john@company.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-8">
                                        <label className="text-[9px] font-bold text-primary-dark uppercase ml-2">Your Comment</label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-primary-orange transition-all shadow-inner resize-none"
                                            placeholder="Keep it professional and concise..."
                                        ></textarea>
                                    </div>

                                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                        <p className="text-[9px] text-gray-400 font-medium max-w-xs leading-relaxed">
                                            All submissions undergo a moderation process. High-quality insights are featured at the top.
                                        </p>

                                        <div className="flex gap-4 w-full md:w-auto">
                                            <button
                                                type="button"
                                                onClick={onClose}
                                                className="flex-1 md:flex-none px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:text-primary-dark transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="flex-1 md:flex-none px-10 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest bg-primary-dark text-white hover:bg-primary-orange transition-all shadow-lg flex items-center justify-center gap-3"
                                            >
                                                {isSubmitting ? 'Processing...' : <>Submit Comment <FaPaperPlane size={11} /></>}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <div className="py-12 text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                                >
                                    <FaCheckCircle size={40} />
                                </motion.div>
                                <h4 className="text-2xl font-black text-primary-dark uppercase tracking-tighter mb-4">Submission Received</h4>
                                <p className="text-gray-500 font-medium max-w-sm mx-auto leading-relaxed">
                                    Your comment has been submitted and is awaiting approval. Thank you for contributing to the discussion.
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
