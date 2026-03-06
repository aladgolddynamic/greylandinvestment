'use client';

import React, { useState, useEffect } from 'react';
import {
    getJobsAction,
    deleteJobAction,
    updateJobAction
} from '@/lib/actions/careersActions';
import { Job } from '@/types/careers';
import { useDebounce } from '@/utils/useDebounce';
import {
    FaPlus,
    FaSearch,
    FaFilter,
    FaEllipsisV,
    FaTrash,
    FaEdit,
    FaEye,
    FaCheckCircle,
    FaTimesCircle,
    FaBriefcase,
    FaMapMarkerAlt
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function CareerManagementPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPEN' | 'CLOSED'>('ALL');

    const fetchJobs = async () => {
        setLoading(true);
        const data = await getJobsAction();
        setJobs(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const toggleStatus = async (job: Job) => {
        const newStatus = job.status === 'OPEN' ? 'CLOSED' : 'OPEN';
        await updateJobAction(job.id, { status: newStatus });
        fetchJobs();
    };

    const deleteJob = async (id: string) => {
        if (confirm('Are you sure you want to delete this job opening? This action cannot be undone.')) {
            await deleteJobAction(id);
            fetchJobs();
        }
    };

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            job.department.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || job.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-primary-dark uppercase tracking-tighter">Career Management</h1>
                    <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.3em] mt-1">Manage talent opportunities and job openings</p>
                </div>
                <a
                    href="/admin/dashboard/careers/create"
                    className="flex items-center gap-3 bg-primary-orange text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary-dark transition-all transform hover:-translate-y-1 shadow-lg shadow-primary-orange/20"
                >
                    <FaPlus /> Post New Opening
                </a>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <span className="text-gray-400 font-black text-[9px] uppercase tracking-widest block mb-2">Total Openings</span>
                    <span className="text-3xl font-black text-primary-dark">{jobs.length}</span>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <span className="text-gray-400 font-black text-[9px] uppercase tracking-widest block mb-2">Open Positions</span>
                    <span className="text-3xl font-black text-green-500">{jobs.filter(j => j.status === 'OPEN').length}</span>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <span className="text-gray-400 font-black text-[9px] uppercase tracking-widest block mb-2">Applications Received</span>
                    <span className="text-3xl font-black text-primary-orange">--</span>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl flex flex-col md:flex-row gap-6">
                <div className="flex-1 relative">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input
                        type="text"
                        placeholder="Search openings..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-[#F8FAFC] border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-orange/20 font-medium text-primary-dark"
                    />
                </div>
                <div className="flex gap-4">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="px-6 py-4 bg-[#F8FAFC] border border-gray-100 rounded-xl focus:outline-none font-black text-[10px] uppercase tracking-widest text-primary-dark cursor-pointer"
                    >
                        <option value="ALL">All Status</option>
                        <option value="OPEN">Open</option>
                        <option value="CLOSED">Closed</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-primary-dark text-white">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">Job Title & Pillar</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-center">Location</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-center">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-center">Modified</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="w-10 h-10 border-4 border-primary-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                        <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest">Fetching Careers...</p>
                                    </td>
                                </tr>
                            ) : filteredJobs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <p className="text-gray-400 font-black text-sm uppercase tracking-widest">No matching jobs found</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredJobs.map((job) => (
                                    <tr key={job.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-primary-dark uppercase tracking-tight group-hover:text-primary-orange transition-colors">
                                                    {job.title}
                                                </span>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{job.department}</span>
                                                    <span className="text-gray-300">•</span>
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{job.employmentType}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className="text-[10px] font-black text-primary-dark uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">
                                                {job.location}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <button
                                                onClick={() => toggleStatus(job)}
                                                className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${job.status === 'OPEN'
                                                    ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                                    : 'bg-red-100 text-red-600 hover:bg-red-200'
                                                    }`}
                                            >
                                                {job.status}
                                            </button>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                {new Date(job.updatedAt).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-end gap-3 text-gray-400">
                                                <a
                                                    href={`/careers/${job.slug}`}
                                                    target="_blank"
                                                    className="p-2 hover:bg-orange-50 hover:text-primary-orange rounded-lg transition-all"
                                                    title="View Public Link"
                                                >
                                                    <FaEye size={14} />
                                                </a>
                                                <a
                                                    href={`/admin/dashboard/careers/edit/${job.id}`}
                                                    className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all"
                                                    title="Edit Post"
                                                >
                                                    <FaEdit size={14} />
                                                </a>
                                                <button
                                                    onClick={() => deleteJob(job.id)}
                                                    className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all"
                                                    title="Delete Post"
                                                >
                                                    <FaTrash size={14} />
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
        </div>
    );
}
