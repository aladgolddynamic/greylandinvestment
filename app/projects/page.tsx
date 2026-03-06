'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer/Footer';
import ProjectCard from '@/components/Projects/ProjectCard';
import { motion } from 'framer-motion';
import { getProjectsAction } from '@/lib/actions/projectActions';
import { projectStyleService, Project } from '@/services/projectService';
import { projectData as initialSections } from '@/constants/projectData';

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            const data = await getProjectsAction();
            // Only show published projects on the public frontend
            setProjects(data.filter(p => p.publicationStatus === 'PUBLISHED'));
            setLoading(false);
        };
        fetchProjects();
    }, []);

    // Dynamic pillars from style service, enriched with theme statements from initial constant
    const pillars = projectStyleService.getCategories().map(cat => {
        const original = initialSections.find(s => s.id === cat.id);
        return {
            ...cat,
            desc: original?.themeStatement || 'High-impact project delivery.',
            number: original?.number || '00'
        };
    });

    return (
        <main className="min-h-screen bg-[#F2F2F2]">
            <Navbar />

            {/* Projects Hero */}
            <section className="bg-gradient-to-r from-[#3F4A5A] to-[#5B5F73] pt-32 pb-24 relative overflow-hidden shadow-lg">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-orange blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl mx-auto"
                    >
                        <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter mb-6 drop-shadow-sm">
                            Project <br />
                            <span className="text-[#F28C28]">Showcase</span>
                        </h1>
                        <div className="h-1 w-24 bg-[#F28C28] mx-auto rounded-full mb-8"></div>
                        <p className="text-gray-400 font-bold text-sm md:text-lg tracking-widest uppercase mx-auto max-w-xl">
                            A portfolio of technical excellence, structural integrity, and operational efficiency.
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="py-20 space-y-32">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-primary-orange/20 border-t-primary-orange rounded-full animate-spin"></div>
                    </div>
                ) : (
                    pillars.map((pillar) => {
                        const pillarProjects = projects.filter(p => p.category === pillar.id);
                        if (pillarProjects.length === 0) return null;

                        return (
                            <section key={pillar.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="max-w-3xl mx-auto text-center mb-16">
                                    <div className="flex items-center justify-center gap-4 mb-6">
                                        <div className="h-[2px] w-12 bg-primary-orange"></div>
                                        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary-dark">{pillar.number}. {pillar.label}</h2>
                                        <div className="h-[2px] w-12 bg-primary-orange"></div>
                                    </div>
                                    <h3 className="text-3xl md:text-5xl font-extrabold text-primary-dark leading-tight mb-6">
                                        {pillar.desc}
                                    </h3>
                                    {pillar.id === 'TECHNOLOGY & DIGITAL' && (
                                        <div className="inline-block bg-white px-6 py-2 rounded-full border border-gray-100 shadow-sm">
                                            <span className="text-primary-dark font-black text-[10px] uppercase tracking-widest">Innovation Active</span>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                    {pillarProjects.map((project, index) => (
                                        <ProjectCard key={project.id} index={index} {...project} />
                                    ))}
                                </div>
                            </section>
                        );
                    })
                )}
            </div>

            <Footer />
        </main>
    );
}
