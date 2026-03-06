'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer/Footer';
import JobCard from '@/components/Careers/JobCard';
import { getJobsAction } from '@/lib/actions/careersActions';
import { Job } from '@/services/careersService';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUsers, FaLightbulb, FaChartLine, FaRocket, FaSearch, FaFilter, FaBriefcase, FaMapMarkerAlt } from 'react-icons/fa';

export default function CareersPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        department: 'All',
        location: 'All',
        type: 'All'
    });

    useEffect(() => {
        const fetchJobs = async () => {
            const data = await getJobsAction();
            setJobs(data.filter(j => j.status === 'OPEN'));
            setLoading(false);
        };
        fetchJobs();
    }, []);

    const filteredJobs = useMemo(() => {
        return jobs.filter(job => {
            const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDept = filters.department === 'All' || job.department === filters.department;
            const matchesLoc = filters.location === 'All' || job.location.includes(filters.location);
            const matchesType = filters.type === 'All' || job.employmentType === filters.type;

            return matchesSearch && matchesDept && matchesLoc && matchesType;
        });
    }, [jobs, searchTerm, filters]);

    const departments = ['All', ...Array.from(new Set(jobs.map(j => j.department)))];
    const locations = ['All', ...Array.from(new Set(jobs.map(j => j.location.split(',')[0].trim())))];
    const types = ['All', 'Full-Time', 'Part-Time', 'Contract', 'Internship'];

    const values = [
        {
            icon: <FaLightbulb />,
            title: "Innovation-Driven",
            description: "We leverage state-of-the-art technology to solve complex infrastructure and digital challenges."
        },
        {
            icon: <FaUsers />,
            title: "Collaborative Culture",
            description: "Work alongside industry experts in Engineering, Technology, and Supply Chain Management."
        },
        {
            icon: <FaChartLine />,
            title: "Career Growth",
            description: "We invest in our people through continuous learning, certifications, and leadership opportunities."
        },
        {
            icon: <FaRocket />,
            title: "Real Impact",
            description: "Be part of projects that build the foundation of Nigeria's infrastructure and digital future."
        }
    ];

    return (
        <main className="min-h-screen bg-[#F8FAFC]">
            <Navbar />

            {/* Careers Hero */}
            <section className="bg-gradient-to-r from-[#3F4A5A] to-[#5B5F73] pt-32 pb-24 relative overflow-hidden">
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
                        <span className="text-primary-orange font-black text-[10px] uppercase tracking-[0.5em] mb-6 block">Join Our Mission</span>
                        <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter mb-8 leading-none drop-shadow-sm">
                            Shape the <br />
                            <span className="text-[#F28C28]">Future with Us</span>
                        </h1>
                        <div className="h-1 w-24 bg-[#F28C28] mx-auto rounded-full mb-8"></div>
                        <p className="text-gray-400 font-bold text-xs md:text-sm tracking-[0.4em] uppercase max-w-2xl mx-auto">
                            Build your career at the intersection of Engineering, Technology, and Excellence.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Why Greyland? */}
            <section className="py-24 md:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-sm font-black text-primary-orange uppercase tracking-[0.3em] mb-4">Core Principles</h2>
                        <h3 className="text-3xl md:text-4xl font-black text-primary-dark uppercase tracking-tight">Why Greyland Investment Ltd?</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center group"
                            >
                                <div className="w-16 h-16 bg-orange-50 text-primary-orange rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 group-hover:scale-110 group-hover:bg-primary-orange group-hover:text-white transition-all duration-300">
                                    {value.icon}
                                </div>
                                <h4 className="text-lg font-black text-primary-dark mb-4 uppercase tracking-tight">{value.title}</h4>
                                <p className="text-gray-600 font-medium text-sm leading-relaxed">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Open Positions */}
            <section className="py-24 md:py-32 bg-[#F8FAFC]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-black text-primary-dark uppercase tracking-tight mb-4">Current <span className="text-primary-orange">Openings</span></h2>
                            <p className="text-gray-600 font-bold text-xs md:text-sm uppercase tracking-widest">Explore and find your role in our growing team.</p>
                        </div>
                        <div className="bg-white px-8 py-4 rounded-xl shadow-sm border border-gray-100">
                            <span className="text-primary-dark font-black text-sm">{filteredJobs.length} Active Roles</span>
                        </div>
                    </div>

                    {/* Search & Filters */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl mb-12 flex flex-col md:flex-row gap-6">
                        <div className="flex-1 relative">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                            <input
                                type="text"
                                placeholder="Search by job title or keyword..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-[#F8FAFC] border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-orange/20 font-medium text-primary-dark"
                            />
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <select
                                value={filters.department}
                                onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                                className="px-6 py-4 bg-[#F8FAFC] border border-gray-100 rounded-xl focus:outline-none font-black text-[10px] uppercase tracking-widest text-primary-dark cursor-pointer"
                            >
                                <option disabled>Department</option>
                                {departments.map(d => <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>)}
                            </select>
                            <select
                                value={filters.location}
                                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                className="px-6 py-4 bg-[#F8FAFC] border border-gray-100 rounded-xl focus:outline-none font-black text-[10px] uppercase tracking-widest text-primary-dark cursor-pointer"
                            >
                                <option disabled>Location</option>
                                {locations.map(l => <option key={l} value={l}>{l === 'All' ? 'All Locations' : l}</option>)}
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="py-20 text-center">
                            <div className="w-12 h-12 border-4 border-primary-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest">Hydrating Opportunities...</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
                                <AnimatePresence mode="popLayout">
                                    {filteredJobs.length > 0 ? (
                                        filteredJobs.map((job, index) => (
                                            <JobCard key={job.id} index={index} {...job} />
                                        ))
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200"
                                        >
                                            <p className="text-gray-400 font-black text-sm uppercase tracking-widest">No matching roles found.</p>
                                            <button
                                                onClick={() => { setSearchTerm(''); setFilters({ department: 'All', location: 'All', type: 'All' }) }}
                                                className="mt-6 text-primary-orange font-black text-[10px] uppercase tracking-[0.2em] hover:underline"
                                            >
                                                Clear all filters
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </>
                    )}

                    {/* Talent Pool CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="mt-32 p-12 md:p-20 bg-[#0F1C2E] rounded-3xl text-center relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-primary-orange/5 opacity-30"></div>
                        <div className="relative z-10">
                            <h3 className="text-2xl md:text-4xl font-black text-white uppercase mb-6">Didn't find a matching role?</h3>
                            <p className="text-gray-400 font-bold text-sm uppercase tracking-widest mb-10 max-w-xl mx-auto">We're always looking for exceptional talent. Join our talent pool for future opportunities.</p>
                            <a href="/contact" className="inline-block bg-primary-orange hover:bg-white hover:text-primary-orange text-white font-black px-12 py-5 rounded-sm uppercase tracking-widest text-[10px] transition-all transform hover:scale-105 active:scale-95 shadow-2xl">
                                Join Talent Pool
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
