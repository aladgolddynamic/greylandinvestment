'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaSave, FaArrowLeft, FaCheck, FaTimes,
    FaExclamationTriangle, FaPlus, FaBriefcase, FaMapMarkerAlt,
    FaParagraph, FaHeading, FaClock, FaTag, FaCheckCircle
} from 'react-icons/fa';
import { Job } from '@/types/careers';
import { createJobAction, updateJobAction } from '@/lib/actions/careersActions';
import { NewsBlock, BlockType } from '@/types/news';
import { useRouter } from 'next/navigation';
import {
    ArticleH2,
    ArticleH3,
    ArticleP,
    ArticleList
} from '@/components/News/ArticleElements';

interface JobFormProps {
    initialData?: Job;
    isEdit?: boolean;
}

const uid = () => `blk-${Math.random().toString(36).slice(2)}`;

export default function JobForm({ initialData, isEdit }: JobFormProps) {
    const router = useRouter();
    const [meta, setMeta] = useState({
        title: initialData?.title || '',
        department: initialData?.department || '',
        location: initialData?.location || '',
        employmentType: initialData?.employmentType || 'Full-Time',
        experienceLevel: initialData?.experienceLevel || '',
        excerpt: initialData?.excerpt || '',
        salaryRange: initialData?.salaryRange || '',
        deadline: initialData?.deadline || '',
        status: initialData?.status || 'OPEN',
        featured: initialData?.featured || false,
    });

    const [blocks, setBlocks] = useState<NewsBlock[]>(
        initialData?.descriptionBlocks || [{ id: uid(), type: 'paragraph', content: '' }]
    );

    const [respText, setRespText] = useState(initialData?.responsibilities.join('\n') || '');
    const [reqText, setReqText] = useState(initialData?.requirements.join('\n') || '');

    const [isSaving, setIsSaving] = useState(false);
    const [saveState, setSaveState] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSave = async () => {
        if (!meta.title || !meta.department || !meta.location) {
            setMessage('Please fill in all required fields (Title, Department, Location).');
            setSaveState('error');
            return;
        }

        setIsSaving(true);
        setSaveState('idle');

        const jobData: Job = {
            id: initialData?.id || '',
            ...meta,
            slug: initialData?.slug || '', // careersService will handle slug generation for new jobs
            descriptionBlocks: blocks,
            responsibilities: respText.split('\n').filter(l => l.trim()),
            requirements: reqText.split('\n').filter(l => l.trim()),
            createdAt: initialData?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        try {
            if (isEdit && initialData) {
                await updateJobAction(initialData.id, jobData);
            } else {
                await createJobAction(jobData);
            }
            setSaveState('success');
            setTimeout(() => router.push('/admin/dashboard/careers'), 1500);
        } catch (err: any) {
            setSaveState('error');
            setMessage(err.message || 'Failed to save job opening.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-8 pb-32">
            {/* Top Bar */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-400 hover:text-primary-dark text-[10px] font-black uppercase tracking-widest transition-colors"
                    >
                        <FaArrowLeft size={11} /> Back
                    </button>
                    <div className="w-px h-5 bg-gray-200" />
                    <h1 className="text-xl font-black text-primary-dark uppercase tracking-tight">
                        {isEdit ? 'Edit' : 'Post New'} <span className="text-primary-orange">Job Opening</span>
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-3 px-8 py-3 rounded-xl bg-primary-orange text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-primary-orange/20 disabled:opacity-50"
                    >
                        {isSaving ? 'Saving...' : saveState === 'success' ? <><FaCheck /> Saved</> : <><FaSave /> Save Opening</>}
                    </button>
                </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
                {saveState === 'error' && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-600 text-[10px] font-black uppercase tracking-widest"
                    >
                        <FaExclamationTriangle size={14} />
                        {message}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Form Fields */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Basic Info */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2">Basic Information</h2>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary-dark ml-1">Job Title *</label>
                            <input
                                type="text"
                                value={meta.title}
                                onChange={e => setMeta({ ...meta, title: e.target.value })}
                                placeholder="Senior Structural Engineer..."
                                className="w-full text-xl font-black text-primary-dark bg-[#F8FAFC] border border-gray-100 rounded-xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-primary-orange/20 transition-all leading-tight"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary-dark ml-1">Department / Pillar *</label>
                                <input
                                    type="text"
                                    value={meta.department}
                                    onChange={e => setMeta({ ...meta, department: e.target.value })}
                                    placeholder="Engineering, Tech..."
                                    className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-3 px-5 text-sm font-bold text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-orange/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary-dark ml-1">Location *</label>
                                <input
                                    type="text"
                                    value={meta.location}
                                    onChange={e => setMeta({ ...meta, location: e.target.value })}
                                    placeholder="Abuja, Nigeria..."
                                    className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-3 px-5 text-sm font-bold text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-orange/20"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary-dark ml-1">Employment Type</label>
                                <select
                                    value={meta.employmentType}
                                    onChange={e => setMeta({ ...meta, employmentType: e.target.value as any })}
                                    className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-3 px-5 text-sm font-bold text-primary-dark focus:outline-none"
                                >
                                    <option value="Full-Time">Full-Time</option>
                                    <option value="Part-Time">Part-Time</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Internship">Internship</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary-dark ml-1">Exp. Level</label>
                                <input
                                    type="text"
                                    value={meta.experienceLevel}
                                    onChange={e => setMeta({ ...meta, experienceLevel: e.target.value })}
                                    placeholder="Senior, 5+ yrs..."
                                    className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-3 px-5 text-sm font-bold text-primary-dark focus:outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary-dark ml-1">Deadline</label>
                                <input
                                    type="date"
                                    value={meta.deadline}
                                    onChange={e => setMeta({ ...meta, deadline: e.target.value })}
                                    className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-3 px-5 text-sm font-bold text-primary-dark focus:outline-none uppercase"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Job Description (Blocks) */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Job Description / Overview</h2>
                            <span className="text-[8px] font-black text-primary-orange uppercase bg-orange-50 px-2 py-1 rounded">Rich Content Blocks</span>
                        </div>

                        <div className="space-y-4">
                            {blocks.map((block, i) => (
                                <div key={block.id} className="relative group">
                                    <textarea
                                        value={block.content}
                                        onChange={e => {
                                            const newBlocks = [...blocks];
                                            newBlocks[i].content = e.target.value;
                                            setBlocks(newBlocks);
                                        }}
                                        placeholder="Write description paragraph..."
                                        className="w-full p-4 bg-[#F8FAFC] border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-orange/20 text-sm font-medium text-gray-700 resize-none min-h-[100px]"
                                    />
                                    {blocks.length > 1 && (
                                        <button
                                            onClick={() => setBlocks(blocks.filter((_, idx) => idx !== i))}
                                            className="absolute top-2 right-2 p-1 text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <FaTimes size={10} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                onClick={() => setBlocks([...blocks, { id: uid(), type: 'paragraph', content: '' }])}
                                className="w-full py-3 border-2 border-dashed border-gray-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-400 hover:border-primary-orange hover:text-primary-orange transition-all"
                            >
                                + Add Paragraph Block
                            </button>
                        </div>
                    </div>

                    {/* Responsibilities & Requirements */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-4">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Key Responsibilities</h2>
                            <textarea
                                rows={8}
                                value={respText}
                                onChange={e => setRespText(e.target.value)}
                                placeholder="One responsibility per line..."
                                className="w-full p-4 bg-[#F8FAFC] border border-gray-100 rounded-xl focus:outline-none text-sm font-medium text-gray-700 leading-relaxed"
                            />
                            <p className="text-[8px] text-gray-400 font-bold uppercase">Tips: Put each item on a new line.</p>
                        </div>
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-4">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Qualifications & Req.</h2>
                            <textarea
                                rows={8}
                                value={reqText}
                                onChange={e => setReqText(e.target.value)}
                                placeholder="One requirement per line..."
                                className="w-full p-4 bg-[#F8FAFC] border border-gray-100 rounded-xl focus:outline-none text-sm font-medium text-gray-700 leading-relaxed"
                            />
                            <p className="text-[8px] text-gray-400 font-bold uppercase">Tips: Put each item on a new line.</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Settings & Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Status & Featured */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2">Publishing Settings</h2>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary-dark">Listing Status</p>
                                <p className="text-[9px] font-bold text-gray-400 mt-0.5">Visible on careers page?</p>
                            </div>
                            <select
                                value={meta.status}
                                onChange={e => setMeta({ ...meta, status: e.target.value as any })}
                                className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest outline-none border transition-all ${meta.status === 'OPEN' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
                                    }`}
                            >
                                <option value="OPEN">Open</option>
                                <option value="CLOSED">Closed</option>
                            </select>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary-dark">Featured Role</p>
                                <p className="text-[9px] font-bold text-gray-400 mt-0.5">Prioritize in listings</p>
                            </div>
                            <button
                                onClick={() => setMeta({ ...meta, featured: !meta.featured })}
                                className={`w-12 h-6 rounded-full relative transition-colors ${meta.featured ? 'bg-primary-orange' : 'bg-gray-200'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${meta.featured ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>

                        <div className="space-y-2 pt-4 border-t border-gray-50">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary-dark ml-1">Salary Range (Optional)</label>
                            <input
                                type="text"
                                value={meta.salaryRange}
                                onChange={e => setMeta({ ...meta, salaryRange: e.target.value })}
                                placeholder="e.g. 200k - 350k NGN"
                                className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-3 px-5 text-sm font-bold text-primary-dark focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Sidebar: Excerpt */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-4">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Short Summary (Excerpt)</h2>
                        <textarea
                            rows={4}
                            value={meta.excerpt}
                            onChange={e => setMeta({ ...meta, excerpt: e.target.value })}
                            placeholder="Brief description for job cards..."
                            className="w-full p-4 bg-[#F8FAFC] border border-gray-100 rounded-xl focus:outline-none text-xs font-medium text-gray-700 leading-relaxed resize-none"
                        />
                        <p className="text-[8px] text-gray-400 font-bold tracking-widest uppercase text-center mt-2">Visible on Job Cards</p>
                    </div>

                    {/* Preview Hint */}
                    <div className="bg-primary-dark rounded-2xl p-8 text-white text-center">
                        <FaBriefcase className="text-primary-orange text-3xl mx-auto mb-4" />
                        <h3 className="font-black uppercase tracking-tight text-sm mb-2">Ready to expand?</h3>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest leading-relaxed">Ensure all technical levels and pillar requirements are clearly stated.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
