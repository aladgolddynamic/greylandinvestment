'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    getProjectsAction,
    deleteProjectAction,
    updateProjectAction
} from '@/lib/actions/projectActions';
import { Project, ProjectStatus } from '@/services/projectService';
import { useDebounce } from '@/utils/useDebounce';
import {
    FaPlus,
    FaSearch,
    FaEdit,
    FaTrash,
    FaStar,
    FaRegStar,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaImages
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProjectsManager() {
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedQuery = useDebounce(searchQuery, 300);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        setLoading(true);
        const data = await getProjectsAction();
        setProjects(data);
        setLoading(false);
    };

    const handleToggleFeatured = async (id: string, current: boolean) => {
        await updateProjectAction(id, { featured: !current });
        fetchProjects();
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to terminate this project record?')) {
            await deleteProjectAction(id);
            fetchProjects();
        }
    };

    const filteredProjects = projects.filter(project => {
        return project.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
            project.category.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
            project.industry.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
            project.location.toLowerCase().includes(debouncedQuery.toLowerCase());
    });

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-primary-dark uppercase tracking-tighter mb-2">
                        Project <span className="text-primary-orange">Portfolio</span>
                    </h1>
                    <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                        Manage Corporate Infrastructure Projects and Global Showcase
                    </p>
                </div>
                <button
                    onClick={() => router.push('/admin/dashboard/projects/initialize')}
                    className="flex items-center gap-3 px-8 py-4 bg-primary-dark hover:bg-primary-orange text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-primary-orange/20">
                    <FaPlus /> Initialize New Project
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <FaSearch size={14} />
                </div>
                <input
                    type="text"
                    placeholder="Search by Title, Category, Client, or Location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-gray-100 rounded-xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-orange/10 focus:border-primary-orange transition-all shadow-sm"
                />
            </div>

            {/* Project Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {loading ? (
                    <div className="col-span-full py-20 text-center">
                        <div className="inline-block w-8 h-8 border-4 border-primary-orange/20 border-t-primary-orange rounded-full animate-spin"></div>
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border border-gray-100">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No project records discovered.</p>
                    </div>
                ) : (
                    filteredProjects.map((project) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden group hover:border-primary-orange/20 transition-all flex flex-col"
                        >
                            {/* Project Image */}
                            <div className="aspect-[16/10] relative overflow-hidden bg-gray-100">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-0 md:grayscale group-hover:grayscale-0"
                                />
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button
                                        onClick={() => project.id && handleToggleFeatured(project.id, !!project.featured)}
                                        className={`p-3 rounded-full backdrop-blur-md transition-all ${project.featured ? 'bg-primary-orange text-white' : 'bg-black/20 text-white hover:bg-black/40'}`}
                                    >
                                        {project.featured ? <FaStar size={14} /> : <FaRegStar size={14} />}
                                    </button>
                                </div>
                                <div className="absolute bottom-4 left-4">
                                    <span className="text-[8px] font-black text-white uppercase tracking-[0.2em] bg-primary-orange px-3 py-1.5 rounded-full shadow-lg">
                                        {project.category}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8 flex-1 flex flex-col">
                                <h3 className="text-sm font-black text-primary-dark uppercase tracking-tight mb-4 group-hover:text-primary-orange transition-colors">
                                    {project.title}
                                </h3>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="flex items-center gap-2">
                                        <FaMapMarkerAlt size={10} className="text-gray-300" />
                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest truncate">{project.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaCalendarAlt size={10} className="text-gray-300" />
                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{project.duration}</span>
                                    </div>
                                    {project.updatedAt && (
                                        <div className="flex items-center gap-2 col-span-2">
                                            <FaCalendarAlt size={10} className="text-primary-orange" />
                                            <span className="text-[9px] font-bold text-primary-orange uppercase tracking-widest">
                                                Updated: {new Date(project.updatedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <p className="text-[10px] text-gray-500 font-medium leading-relaxed line-clamp-2 mb-8 italic">
                                    "{project.description}"
                                </p>

                                <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-300">
                                        <FaImages size={12} />
                                        <span className="text-[10px] font-black tracking-widest uppercase">{project.deliverables.length} Deliverables</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <a href={`/admin/dashboard/projects/edit/${project.id}`} title="Edit Project" className="p-3 bg-[#F8FAFC] text-gray-400 hover:text-primary-orange rounded-xl transition-all block">
                                            <FaEdit size={12} />
                                        </a>
                                        <button
                                            onClick={() => project.id && handleDelete(project.id)}
                                            title="Delete"
                                            className="p-3 bg-[#F8FAFC] text-gray-400 hover:text-red-500 rounded-xl transition-all"
                                        >
                                            <FaTrash size={12} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
