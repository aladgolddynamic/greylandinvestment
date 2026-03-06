'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaUser, FaEnvelope, FaPhone, FaLink, FaFileUpload, FaPaperPlane, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { submitApplicationAction } from '@/lib/actions/applicationActions';

interface JobApplicationFormProps {
    jobId: string;
    jobTitle: string;
    onClose: () => void;
}

export default function JobApplicationForm({ jobId, jobTitle, onClose }: JobApplicationFormProps) {
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        coverLetter: '',
        portfolioLink: '',
    });
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!form.fullName || !form.email || !form.phone || !file) {
            setMessage('Please fill in all required fields and upload your CV.');
            setStatus('error');
            return;
        }

        setStatus('submitting');
        try {
            // Helper to convert file to base64
            const fileToBase64 = (file: File): Promise<string> => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = error => reject(error);
                });
            };

            const fileData = await fileToBase64(file);

            await submitApplicationAction({
                jobId,
                jobTitle,
                fullName: form.fullName,
                email: form.email,
                phone: form.phone,
                coverLetter: form.coverLetter,
                portfolioLink: form.portfolioLink,
                cvFile: {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    data: fileData
                }
            });

            setStatus('success');
            setTimeout(() => {
                onClose();
            }, 3000);
        } catch (err: any) {
            setStatus('error');
            setMessage(err.message || 'Submission failed. Please try again.');
        }
    };

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-primary-dark/80 backdrop-blur-md"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden overflow-y-auto max-h-[90vh]"
            >
                {/* Header */}
                <div className="bg-primary-dark p-8 md:p-10 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
                    >
                        <FaTimes size={20} />
                    </button>
                    <span className="text-primary-orange font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Application Form</span>
                    <h2 className="text-3xl font-black uppercase tracking-tighter">
                        {jobTitle}
                    </h2>
                </div>

                <div className="p-8 md:p-10">
                    <AnimatePresence mode="wait">
                        {status === 'success' ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-12"
                            >
                                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                                    <FaCheckCircle />
                                </div>
                                <h3 className="text-2xl font-black text-primary-dark uppercase tracking-tight mb-4">Application Received!</h3>
                                <p className="text-gray-500 font-medium">Thank you for your interest in joining Greyland. Our talent team will review your application and get back to you shortly.</p>
                                <button
                                    onClick={onClose}
                                    className="mt-10 bg-primary-dark text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-primary-orange transition-all"
                                >
                                    Close Window
                                </button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Success/Error Toast */}
                                {status === 'error' && (
                                    <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-600 text-xs font-bold uppercase tracking-widest leading-relaxed">
                                        <FaExclamationTriangle className="shrink-0" />
                                        {message}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primary-dark ml-1">Full Name *</label>
                                        <div className="relative">
                                            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                            <input
                                                type="text"
                                                required
                                                value={form.fullName}
                                                onChange={e => setForm({ ...form, fullName: e.target.value })}
                                                placeholder="John Doe"
                                                className="w-full pl-12 pr-4 py-4 bg-[#F8FAFC] border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-orange/20 font-medium text-primary-dark"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primary-dark ml-1">Email Address *</label>
                                        <div className="relative">
                                            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                            <input
                                                type="email"
                                                required
                                                value={form.email}
                                                onChange={e => setForm({ ...form, email: e.target.value })}
                                                placeholder="john@example.com"
                                                className="w-full pl-12 pr-4 py-4 bg-[#F8FAFC] border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-orange/20 font-medium text-primary-dark"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primary-dark ml-1">Phone Number *</label>
                                        <div className="relative">
                                            <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                            <input
                                                type="tel"
                                                required
                                                value={form.phone}
                                                onChange={e => setForm({ ...form, phone: e.target.value })}
                                                placeholder="+234 ..."
                                                className="w-full pl-12 pr-4 py-4 bg-[#F8FAFC] border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-orange/20 font-medium text-primary-dark"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primary-dark ml-1">Portfolio / LinkedIn (Optional)</label>
                                        <div className="relative">
                                            <FaLink className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                            <input
                                                type="url"
                                                value={form.portfolioLink}
                                                onChange={e => setForm({ ...form, portfolioLink: e.target.value })}
                                                placeholder="https://..."
                                                className="w-full pl-12 pr-4 py-4 bg-[#F8FAFC] border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-orange/20 font-medium text-primary-dark"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary-dark ml-1">CV Upload (PDF/DOC) *</label>
                                    <div className="relative border-2 border-dashed border-gray-200 rounded-2xl p-8 hover:border-primary-orange transition-colors group text-center">
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            onChange={e => setFile(e.target.files?.[0] || null)}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                        <div className="space-y-2">
                                            <FaFileUpload className={`mx-auto text-3xl ${file ? 'text-primary-orange' : 'text-gray-200'} group-hover:scale-110 transition-transform`} />
                                            <p className="text-[10px] font-black uppercase tracking-widest text-primary-dark">
                                                {file ? file.name : 'Click to upload your CV'}
                                            </p>
                                            <p className="text-[9px] text-gray-400 font-bold">Max file size: 5MB</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary-dark ml-1">Brief Cover Letter</label>
                                    <textarea
                                        rows={4}
                                        value={form.coverLetter}
                                        onChange={e => setForm({ ...form, coverLetter: e.target.value })}
                                        placeholder="Tell us why you're a great fit for this role..."
                                        className="w-full p-6 bg-[#F8FAFC] border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-orange/20 font-medium text-primary-dark resize-none leading-relaxed"
                                    />
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={status === 'submitting'}
                                        className="w-full bg-primary-orange text-white py-5 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-primary-dark transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-50 disabled:transform-none shadow-xl shadow-primary-orange/20"
                                    >
                                        {status === 'submitting' ? (
                                            <>Submitting Application...</>
                                        ) : (
                                            <>Submit Application <FaPaperPlane /></>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
