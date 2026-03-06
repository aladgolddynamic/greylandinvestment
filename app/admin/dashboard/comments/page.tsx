'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaCheck,
    FaTimes,
    FaTrash,
    FaBan,
    FaReply,
    FaSearch,
    FaCalendarAlt,
    FaGlobe
} from 'react-icons/fa';
import {
    getAllCommentsAdminAction,
    updateCommentStatusAction,
    deleteCommentAction,
    addCompanyReplyAction
} from '@/lib/actions/commentActions';
import { Comment, CommentStatus } from '@/types/comment';

export default function ModerationPage() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<CommentStatus | 'ALL'>('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedComments, setSelectedComments] = useState<string[]>([]);
    const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
    const [replyText, setReplyText] = useState('');

    useEffect(() => {
        loadComments();
    }, []);

    const loadComments = async () => {
        setLoading(true);
        try {
            const data = await getAllCommentsAdminAction();
            setComments(data);
        } catch (err) {
            console.error('Failed to load comments', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, status: CommentStatus) => {
        try {
            await updateCommentStatusAction(id, status);
            setComments(comments.map(c => c.id === id ? { ...c, status } : c));
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Permanently delete this comment?')) return;
        try {
            await deleteCommentAction(id);
            setComments(comments.filter(c => c.id !== id));
        } catch (err) {
            alert('Failed to delete');
        }
    };

    const handleReply = async () => {
        if (!replyingTo || !replyText.trim()) return;
        try {
            await addCompanyReplyAction(replyingTo.id, replyText);
            setReplyingTo(null);
            setReplyText('');
            loadComments(); // Reload to show new reply
        } catch (err) {
            alert('Failed to send reply');
        }
    };

    const filteredComments = comments.filter(c => {
        const matchesFilter = filter === 'ALL' || c.status === filter;
        const matchesSearch =
            c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getStatusColor = (status: CommentStatus) => {
        switch (status) {
            case 'APPROVED': return 'bg-green-100 text-green-700 border-green-200';
            case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
            case 'SPAM': return 'bg-gray-100 text-gray-700 border-gray-200';
            default: return 'bg-blue-100 text-blue-700 border-blue-200';
        }
    };

    return (
        <div className="max-w-7xl mx-auto pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-primary-dark uppercase tracking-tighter mb-2">
                        Comment <span className="text-primary-orange">Moderation</span>
                    </h1>
                    <p className="text-gray-500 font-medium">Manage and review community contributions across all platforms.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        <input
                            type="text"
                            placeholder="Search comments..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-6 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-orange focus:border-transparent transition-all w-64 shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2 mb-8">
                {(['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'SPAM'] as const).map((s) => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === s
                            ? 'bg-primary-dark text-white shadow-lg'
                            : 'bg-white text-gray-400 border border-gray-100 hover:border-primary-orange/30'
                            }`}
                    >
                        {s} {s === 'ALL' ? `(${comments.length})` : `(${comments.filter(c => c.status === s).length})`}
                    </button>
                ))}
            </div>

            {/* Table View */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Author</th>
                                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Comment</th>
                                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
                                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Content</th>
                                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="w-10 h-10 border-4 border-gray-100 border-t-primary-orange rounded-full animate-spin mx-auto mb-4"></div>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Loading conversations...</span>
                                    </td>
                                </tr>
                            ) : filteredComments.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <p className="text-gray-400 text-sm font-medium">No comments found matching your criteria.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredComments.map((comment) => (
                                    <tr key={comment.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-8 py-6 align-top">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-black text-primary-dark uppercase tracking-tight">{comment.fullName}</span>
                                                <span className="text-[10px] font-medium text-gray-400 truncate max-w-[150px]">{comment.email}</span>
                                                <div className="flex items-center gap-2 mt-1 text-[9px] font-bold text-gray-400 uppercase">
                                                    <FaGlobe size={10} className="text-gray-300" />
                                                    {comment.ipAddress || 'Unknown IP'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 align-top">
                                            <div className="flex flex-col gap-2">
                                                <p className="text-sm text-gray-600 font-medium leading-relaxed max-w-md line-clamp-3">
                                                    {comment.text}
                                                </p>
                                                <div className="flex items-center gap-3 text-[9px] font-black uppercase text-gray-400 tracking-widest">
                                                    <FaCalendarAlt size={10} className="text-primary-orange/50" />
                                                    {new Date(comment.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 align-top">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusColor(comment.status)}`}>
                                                {comment.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 align-top">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[9px] font-black uppercase text-primary-orange tracking-widest">{comment.contentType}</span>
                                                <span className="text-[10px] font-bold text-gray-400 truncate max-w-[120px]">{comment.contentId}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 align-top text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {comment.status !== 'APPROVED' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(comment.id, 'APPROVED')}
                                                        title="Approve"
                                                        className="p-2.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all shadow-sm"
                                                    >
                                                        <FaCheck size={12} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => setReplyingTo(comment)}
                                                    title="Reply"
                                                    className="p-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                >
                                                    <FaReply size={12} />
                                                </button>
                                                {comment.status !== 'REJECTED' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(comment.id, 'REJECTED')}
                                                        title="Reject"
                                                        className="p-2.5 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-600 hover:text-white transition-all shadow-sm"
                                                    >
                                                        <FaTimes size={12} />
                                                    </button>
                                                )}
                                                {comment.status !== 'SPAM' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(comment.id, 'SPAM')}
                                                        title="Mark as Spam"
                                                        className="p-2.5 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-600 hover:text-white transition-all shadow-sm"
                                                    >
                                                        <FaBan size={12} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(comment.id)}
                                                    title="Delete"
                                                    className="p-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                >
                                                    <FaTrash size={12} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Reply Modal */}
            <AnimatePresence>
                {replyingTo && (
                    <div className="fixed inset-0 bg-primary-dark/80 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-[2.5rem] p-10 max-w-2xl w-full shadow-2xl relative"
                        >
                            <button
                                onClick={() => setReplyingTo(null)}
                                className="absolute top-8 right-8 text-gray-400 hover:text-primary-dark"
                            >
                                <FaTimes size={20} />
                            </button>

                            <h3 className="text-2xl font-black text-primary-dark uppercase tracking-tighter mb-8">
                                Draft <span className="text-primary-orange">Official Reply</span>
                            </h3>

                            <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-[10px] font-black uppercase text-primary-dark">{replyingTo.fullName}</span>
                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{new Date(replyingTo.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm text-gray-500 font-medium italic">{replyingTo.text}</p>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase text-primary-dark tracking-widest block ml-2">Your Professional Response</label>
                                <textarea
                                    rows={5}
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    className="w-full bg-gray-50 border-none rounded-2xl p-6 text-sm focus:ring-2 focus:ring-primary-orange transition-all shadow-inner resize-none"
                                    placeholder="Greyland's official stance or advisory..."
                                ></textarea>
                            </div>

                            <div className="flex gap-4 mt-10">
                                <button
                                    onClick={() => setReplyingTo(null)}
                                    className="flex-1 px-8 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest text-gray-400 hover:text-primary-dark transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReply}
                                    disabled={!replyText.trim()}
                                    className="flex-1 px-10 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest bg-primary-dark text-white hover:bg-primary-orange transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    Post Reply <FaReply size={12} />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
