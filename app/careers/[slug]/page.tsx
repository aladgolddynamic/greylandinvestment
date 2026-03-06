'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer/Footer';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaBriefcase, FaClock, FaChevronLeft, FaBuilding, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { useParams } from 'next/navigation';
import { getJobBySlugAction } from '@/lib/actions/careersActions';
import { Job } from '@/services/careersService';
import ShareNews from '@/components/News/ShareNews';
import {
    ArticleH2,
    ArticleP,
    ArticleList,
    ArticleCallout
} from '@/components/News/ArticleElements';
import JobApplicationForm from '@/components/Careers/JobApplicationForm';

export default function CareerDetailPage() {
    const { slug } = useParams();
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [showApplyModal, setShowApplyModal] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            if (typeof slug === 'string') {
                const data = await getJobBySlugAction(slug);
                setJob(data || null);
            }
            setLoading(false);
        };
        fetchJob();

        // Handle #apply hash in URL
        if (window.location.hash === '#apply') {
            setShowApplyModal(true);
        }
    }, [slug]);

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    if (loading) {
        return (
            <main className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
                <div className="w-12 h-12 border-4 border-primary-orange border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest">Loading Role Details...</p>
            </main>
        );
    }

    if (!job) {
        return (
            <main className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
                <h1 className="text-4xl font-black text-primary-dark mb-4 uppercase">Role Not Found</h1>
                <p className="text-gray-500 mb-8 font-bold uppercase tracking-widest text-xs">The career opportunity you're looking for might have been filled.</p>
                <a href="/careers" className="bg-primary-orange text-white px-8 py-3 rounded-sm font-black uppercase tracking-widest text-[10px]">
                    Back to careers
                </a>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#F8FAFC]">
            <Navbar />

            {/* Reading Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1.5 bg-primary-orange origin-left z-[1001]"
                style={{ scaleX }}
            />

            {/* Career Header */}
            <section className="bg-primary-dark pt-32 pb-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary-orange/5 opacity-20 pointer-events-none"></div>
                <div className="max-w-4xl mx-auto px-4 relative z-10">
                    <motion.a
                        href="/careers"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 text-primary-orange font-black text-[10px] uppercase tracking-[0.3em] mb-12 hover:gap-4 transition-all"
                    >
                        <FaChevronLeft /> Back to opportunities
                    </motion.a>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="flex flex-wrap items-center gap-4 mb-8">
                            <span className="bg-primary-orange text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg shadow-primary-orange/20">
                                {job.department}
                            </span>
                            <div className="flex items-center gap-6">
                                <span className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                                    <FaMapMarkerAlt className="text-primary-orange" /> {job.location}
                                </span>
                                <span className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                                    <FaBriefcase className="text-primary-orange" /> {job.employmentType}
                                </span>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8 leading-tight">
                            {job.title}
                        </h1>
                    </motion.div>
                </div>
            </section>

            {/* Content Section */}
            <article className="max-w-4xl mx-auto px-4 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Main Content */}
                    <div className="lg:col-span-8">
                        <ShareNews
                            title={`${job.title} | Greyland Careers`}
                            summary={job.excerpt}
                            mode="inline"
                        />

                        <div className="job-content space-y-8">
                            {/* Description Blocks */}
                            <div>
                                <ArticleH2>Role Overview</ArticleH2>
                                {job.descriptionBlocks.map((block) => (
                                    <ArticleP key={block.id}>{block.content}</ArticleP>
                                ))}
                            </div>

                            {/* Responsibilities */}
                            <div>
                                <ArticleH2>Key Responsibilities</ArticleH2>
                                <ArticleList items={job.responsibilities} />
                            </div>

                            {/* Requirements */}
                            <div>
                                <ArticleH2>Requirements & Qualifications</ArticleH2>
                                <ArticleList items={job.requirements} />
                            </div>

                            {/* Salary Target (Optional) */}
                            {job.salaryRange && (
                                <ArticleCallout title="Compensation & Benefits">
                                    <p className="m-0 font-bold text-primary-dark">Expected Range: <span className="text-primary-orange">{job.salaryRange}</span></p>
                                    <p className="mt-2 text-sm text-gray-500">Includes performance bonuses, health coverage, and professional development stipends.</p>
                                </ArticleCallout>
                            )}
                        </div>

                        {/* Application CTA */}
                        <div id="apply" className="mt-20 p-10 md:p-16 bg-white rounded-3xl border border-gray-100 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-orange/5 rounded-bl-full transform translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform" />
                            <div className="relative z-10">
                                <h3 className="text-2xl md:text-4xl font-black text-primary-dark uppercase tracking-tighter mb-4">Ready to build the future?</h3>
                                <p className="text-gray-500 font-medium mb-10 max-w-lg">If your skills and vision align with our mission, we would love to hear from you. Send us your CV and a brief cover letter.</p>
                                <button
                                    onClick={() => setShowApplyModal(true)}
                                    className="inline-block bg-primary-orange text-white font-black px-12 py-5 rounded-sm uppercase tracking-widest text-[10px] hover:bg-primary-dark transition-all transform hover:-translate-y-1 shadow-lg shadow-primary-orange/20"
                                >
                                    Apply for this position
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:col-span-4 space-y-8">
                        <div className="sticky top-32">
                            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xl mb-8">
                                <div className="flex items-center gap-3 text-primary-dark font-black uppercase tracking-tighter mb-6">
                                    <FaBuilding className="text-primary-orange" />
                                    <span>Pillar Details</span>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Department</span>
                                        <span className="block text-sm font-black text-primary-dark uppercase">{job.department}</span>
                                    </div>
                                    <div>
                                        <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Employment Type</span>
                                        <span className="block text-sm font-black text-primary-dark uppercase">{job.employmentType}</span>
                                    </div>
                                    <div>
                                        <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Exp. Level</span>
                                        <span className="block text-sm font-black text-primary-dark uppercase">{job.experienceLevel}</span>
                                    </div>
                                    <div>
                                        <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Application Deadline</span>
                                        <span className="block text-sm font-black text-red-500 uppercase">{job.deadline}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowApplyModal(true)}
                                    className="w-full mt-8 block text-center bg-primary-dark text-white font-black py-4 rounded-xl uppercase tracking-widest text-[10px] hover:bg-primary-orange transition-all"
                                >
                                    Submit Application
                                </button>
                            </div>

                            <div className="p-8 rounded-2xl bg-gradient-to-br from-primary-dark to-[#1a2b3c] text-white">
                                <h4 className="font-black uppercase tracking-tight mb-4">Enterprise Excellence</h4>
                                <p className="text-xs text-gray-400 font-medium leading-relaxed mb-6">
                                    Greyland Investment Ltd is an equal opportunity employer. We value diversity and are committed to creating an inclusive environment for all employees.
                                </p>
                                <div className="h-0.5 w-12 bg-primary-orange"></div>
                            </div>
                        </div>
                    </aside>
                </div>
            </article>

            {/* Application Modal */}
            <AnimatePresence>
                {showApplyModal && (
                    <JobApplicationForm
                        jobId={job.id}
                        jobTitle={job.title}
                        onClose={() => setShowApplyModal(false)}
                    />
                )}
            </AnimatePresence>

            {/* Desktop Floating Share Bar */}
            <ShareNews
                title={`${job.title} | Greyland Careers`}
                summary={job.excerpt}
                mode="floating"
            />

            <Footer />
        </main>
    );
}
