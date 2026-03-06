'use client';

import React, { useState, useEffect } from 'react';
import {
    getApplicationsAction,
    updateApplicationStatusAction,
    deleteApplicationAction
} from '@/lib/actions/applicationActions';
import { JobApplication } from '@/types/application';
import {
    FaSearch,
    FaTrash,
    FaEye,
    FaEnvelope,
    FaPhone,
    FaFileDownload,
    FaUserGraduate,
    FaCheckCircle,
    FaTimesCircle,
    FaClock,
    FaEnvelopeOpenText,
    FaLink,
    FaFilter
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function ApplicationsDashboard() {
    const [applications, setApplications] = useState<JobApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | JobApplication['status']>('ALL');
    const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);

    const fetchApplications = async () => {
        setLoading(true);
        const data = await getApplicationsAction();
        setApplications(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const updateStatus = async (id: string, status: JobApplication['status']) => {
        await updateApplicationStatusAction(id, status);
        fetchApplications();
    };

    const deleteApp = async (id: string) => {
        if (confirm('Are you sure you want to delete this application?')) {
            await deleteApplicationAction(id);
            fetchApplications();
            if (selectedApp?.id === id) setSelectedApp(null);
        }
    };

    const filteredApps = applications.filter(app => {
        const matchesSearch = app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const statusColors: Record<JobApplication['status'], string> = {
        'NEW': 'bg-blue-50 text-blue-600 border-blue-100',
        'REVIEWED': 'bg-purple-50 text-purple-600 border-purple-100',
        'SHORTLISTED': 'bg-green-50 text-green-600 border-green-100',
        'REJECTED': 'bg-red-50 text-red-600 border-red-100'
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-primary-dark uppercase tracking-tighter">Applications Dashboard</h1>
                    <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.3em] mt-1">Review and manage candidate submissions</p>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl flex flex-col md:flex-row gap-6">
                <div className="flex-1 relative">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input
                        type="text"
                        placeholder="Search by name, job, or email..."
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
                        <option value="NEW">New</option>
                        <option value="REVIEWED">Reviewed</option>
                        <option value="SHORTLISTED">Shortlisted</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* List Table */}
                <div className="lg:col-span-8 bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-primary-dark text-white">
                                    <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest">Candidate</th>
                                    <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-center">Applied For</th>
                                    <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-center">Status</th>
                                    <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-20 text-center">
                                            <div className="w-10 h-10 border-4 border-primary-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                        </td>
                                    </tr>
                                ) : filteredApps.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-20 text-center">
                                            <p className="text-gray-400 font-black text-sm uppercase tracking-widest">No applications found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredApps.map((app) => (
                                        <tr
                                            key={app.id}
                                            onClick={() => setSelectedApp(app)}
                                            className={`hover:bg-gray-50 transition-colors group cursor-pointer ${selectedApp?.id === app.id ? 'bg-orange-50/50' : ''}`}
                                        >
                                            <td className="px-6 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-primary-dark uppercase tracking-tight group-hover:text-primary-orange transition-colors">
                                                        {app.fullName}
                                                    </span>
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">{app.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 text-center">
                                                <span className="text-[9px] font-black text-primary-dark uppercase tracking-widest bg-gray-100 px-3 py-1.5 rounded-full inline-block">
                                                    {app.jobTitle}
                                                </span>
                                            </td>
                                            <td className="px-6 py-6 text-center">
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${statusColors[app.status]}`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex items-center justify-end gap-2 text-gray-300">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); deleteApp(app.id); }}
                                                        className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all"
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

                {/* Detail Panel */}
                <div className="lg:col-span-4">
                    <AnimatePresence mode="wait">
                        {selectedApp ? (
                            <motion.div
                                key={selectedApp.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-white rounded-3xl border border-gray-100 shadow-2xl p-8 sticky top-8 space-y-8"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="w-16 h-16 bg-primary-orange/10 text-primary-orange rounded-2xl flex items-center justify-center text-2xl font-black">
                                        {selectedApp.fullName.charAt(0)}
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Applied On</span>
                                        <span className="text-[11px] font-black text-primary-dark uppercase">{new Date(selectedApp.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-black text-primary-dark uppercase tracking-tighter leading-tight">{selectedApp.fullName}</h2>
                                    <p className="text-primary-orange font-bold text-[10px] uppercase tracking-widest mt-1">Applicant for {selectedApp.jobTitle}</p>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="flex items-center gap-3 text-xs font-bold text-gray-600">
                                        <FaEnvelope className="text-primary-orange shrink-0" />
                                        <span>{selectedApp.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs font-bold text-gray-600">
                                        <FaPhone className="text-primary-orange shrink-0" />
                                        <span>{selectedApp.phone}</span>
                                    </div>
                                    {selectedApp.portfolioLink && (
                                        <a href={selectedApp.portfolioLink} target="_blank" className="flex items-center gap-3 text-xs font-bold text-primary-orange hover:underline">
                                            <FaLink className="shrink-0" />
                                            <span>Portfolio / Profile</span>
                                        </a>
                                    )}
                                </div>

                                <div className="pt-6 border-t border-gray-50">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                                        <FaEnvelopeOpenText /> Cover Letter
                                    </h3>
                                    <p className="text-sm text-gray-600 leading-relaxed italic bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        "{selectedApp.coverLetter || 'No cover letter provided.'}"
                                    </p>
                                </div>

                                <div className="pt-6 border-t border-gray-50 flex flex-col gap-4">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Application Status</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {(['NEW', 'REVIEWED', 'SHORTLISTED', 'REJECTED'] as const).map(status => (
                                            <button
                                                key={status}
                                                onClick={() => updateStatus(selectedApp.id, status)}
                                                className={`px-3 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${selectedApp.status === status
                                                    ? 'bg-primary-dark text-white border-primary-dark'
                                                    : 'bg-gray-50 text-gray-400 border-gray-100 hover:border-primary-orange/30'
                                                    } border`}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-6">
                                    {selectedApp.cvFile?.data ? (
                                        <a
                                            href={selectedApp.cvFile.data}
                                            download={selectedApp.cvFile.name}
                                            className="w-full flex items-center justify-center gap-3 bg-primary-dark text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary-orange transition-all shadow-lg"
                                        >
                                            <FaFileDownload size={14} /> Download CV ({selectedApp.cvFile.name})
                                        </a>
                                    ) : (
                                        <button
                                            disabled
                                            className="w-full flex items-center justify-center gap-3 bg-gray-100 text-gray-400 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest cursor-not-allowed"
                                        >
                                            <FaFileDownload size={14} /> CV Not Available
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <div className="bg-orange-50/50 rounded-3xl border border-dashed border-orange-200 p-12 text-center sticky top-8">
                                <FaUserGraduate className="text-orange-200 text-5xl mx-auto mb-4" />
                                <p className="text-orange-500 font-black text-xs uppercase tracking-[0.2em]">Select an application to view details</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
