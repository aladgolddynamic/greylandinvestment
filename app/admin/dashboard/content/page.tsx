'use client';

import React, { useState, useEffect } from 'react';
import {
    getContentAction,
    updateContentAction
} from '@/lib/actions/contentActions';
import { SiteContent } from '@/services/contentService';
import {
    FaSave,
    FaHome,
    FaInfoCircle,
    FaCheck,
    FaParagraph,
    FaHeading,
    FaLink,
    FaEye
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

type PageSection = 'homepage' | 'about';

export default function ContentManager() {
    const [content, setContent] = useState<SiteContent | null>(null);
    const [activeSection, setActiveSection] = useState<PageSection>('homepage');
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        const data = await getContentAction();
        setContent(data);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content) return;

        setIsSaving(true);
        try {
            await updateContentAction(content);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            console.error('Content update failed:', error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!content) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary-orange/20 border-t-primary-orange rounded-full animate-spin"></div>
            </div>
        );
    }

    const sections: { id: PageSection; label: string; icon: any }[] = [
        { id: 'homepage', label: 'Homepage Hero', icon: FaHome },
        { id: 'about', label: 'About Us Content', icon: FaInfoCircle },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-primary-dark uppercase tracking-tighter mb-2">
                        Site <span className="text-primary-orange">Narration</span>
                    </h1>
                    <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                        Manage Public-Facing Copy, Hero Statements, and Core Messaging
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`flex items-center gap-3 px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl ${saveSuccess
                            ? 'bg-green-500 text-white shadow-green-500/20'
                            : 'bg-primary-dark hover:bg-primary-orange text-white shadow-primary-orange/20'
                        } disabled:opacity-50`}
                >
                    {isSaving ? (
                        <>
                            <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            Synchronizing...
                        </>
                    ) : saveSuccess ? (
                        <>
                            <FaCheck /> Content Deployed
                        </>
                    ) : (
                        <>
                            <FaSave /> Save Changes
                        </>
                    )}
                </button>
            </div>

            {/* Main Editor Card */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden min-h-[500px] flex flex-col md:flex-row">
                {/* Section Navigation */}
                <div className="w-full md:w-64 bg-[#F8FAFC] border-b md:border-b-0 md:border-r border-gray-100 p-6 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 md:shrink ${activeSection === section.id
                                    ? 'bg-white text-primary-orange shadow-md border border-gray-100'
                                    : 'text-gray-400 hover:text-primary-dark'
                                }`}
                        >
                            <section.icon size={14} /> {section.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="flex-1 p-8 md:p-12 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeSection}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-10"
                        >
                            {activeSection === 'homepage' && (
                                <div className="space-y-8">
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-3">
                                        <FaHeading className="text-primary-orange" /> Hero Section Configuration
                                    </h3>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">Hero Prime Headline</label>
                                        <input
                                            type="text"
                                            value={content.homepage.heroTitle}
                                            onChange={(e) => setContent({
                                                ...content,
                                                homepage: { ...content.homepage, heroTitle: e.target.value }
                                            })}
                                            className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-4 px-6 text-sm font-bold text-primary-dark focus:outline-none focus:border-primary-orange transition-all shadow-inner"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">Hero Supporting Subtitle</label>
                                        <textarea
                                            rows={3}
                                            value={content.homepage.heroSubtitle}
                                            onChange={(e) => setContent({
                                                ...content,
                                                homepage: { ...content.homepage, heroSubtitle: e.target.value }
                                            })}
                                            className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-4 px-6 text-sm font-medium leading-relaxed text-primary-dark focus:outline-none focus:border-primary-orange transition-all resize-none shadow-inner"
                                        />
                                    </div>

                                    <div className="pt-8 border-t border-gray-50">
                                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-3 mb-6">
                                            <FaLink className="text-primary-orange" /> Dynamic References
                                        </h3>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">Featured News Reference (ID)</label>
                                            <div className="flex gap-4">
                                                <input
                                                    type="text"
                                                    value={content.homepage.featuredNewsId}
                                                    onChange={(e) => setContent({
                                                        ...content,
                                                        homepage: { ...content.homepage, featuredNewsId: e.target.value }
                                                    })}
                                                    className="flex-1 bg-[#F8FAFC] border border-gray-100 rounded-xl py-4 px-6 text-sm font-black text-primary-orange focus:outline-none"
                                                />
                                                <button className="px-6 bg-primary-dark text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-primary-orange transition-all">
                                                    Validate ID
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSection === 'about' && (
                                <div className="space-y-10">
                                    <div className="space-y-8">
                                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-3">
                                            <FaParagraph className="text-primary-orange" /> Corporate Narrative
                                        </h3>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">About Us Hero Headline</label>
                                            <input
                                                type="text"
                                                value={content.about.heroHeadline}
                                                onChange={(e) => setContent({
                                                    ...content,
                                                    about: { ...content.about, heroHeadline: e.target.value }
                                                })}
                                                className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-4 px-6 text-sm font-bold text-primary-dark focus:outline-none focus:border-primary-orange transition-all shadow-inner"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">About Us Supporting Subtitle</label>
                                            <input
                                                type="text"
                                                value={content.about.heroSubtitle}
                                                onChange={(e) => setContent({
                                                    ...content,
                                                    about: { ...content.about, heroSubtitle: e.target.value }
                                                })}
                                                className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-4 px-6 text-sm font-bold text-primary-dark focus:outline-none focus:border-primary-orange transition-all shadow-inner"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">Principal Company Narrative</label>
                                            <textarea
                                                rows={6}
                                                value={content.about.narrative}
                                                onChange={(e) => setContent({
                                                    ...content,
                                                    about: { ...content.about, narrative: e.target.value }
                                                })}
                                                className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-4 px-6 text-sm font-medium leading-relaxed text-primary-dark focus:outline-none focus:border-primary-orange transition-all resize-none shadow-inner"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-50">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">Foundation Mission</label>
                                            <textarea
                                                rows={4}
                                                value={content.about.mission}
                                                onChange={(e) => setContent({
                                                    ...content,
                                                    about: { ...content.about, mission: e.target.value }
                                                })}
                                                className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-4 px-6 text-xs font-medium leading-relaxed text-gray-400 focus:outline-none italic"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">Strategic Vision</label>
                                            <textarea
                                                rows={4}
                                                value={content.about.vision}
                                                onChange={(e) => setContent({
                                                    ...content,
                                                    about: { ...content.about, vision: e.target.value }
                                                })}
                                                className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-4 px-6 text-xs font-medium leading-relaxed text-gray-400 focus:outline-none italic"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Preview Tip */}
                            <div className="mt-12 p-6 bg-primary-orange/5 rounded-2xl border border-primary-orange/10 flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-primary-orange/10 text-primary-orange flex items-center justify-center shrink-0">
                                    <FaEye size={16} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-primary-dark uppercase tracking-widest mb-1">Live Preview Synchronization</p>
                                    <p className="text-[9px] text-gray-400 font-medium leading-relaxed uppercase tracking-tighter">Changes updated here will be reflected across the corporate website immediately upon persistence.</p>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
