'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { getArticlesAction } from '@/lib/actions/newsActions';
import { getProjectsAction } from '@/lib/actions/projectActions';
import { getCompanyInfoAction } from '@/lib/actions/companyActions';
import { getAllCommentsAdminAction } from '@/lib/actions/commentActions';
import { getJobsAction } from '@/lib/actions/careersActions';
import { NewsArticle } from '@/types/news';
import { Project } from '@/types/project';
import { CompanyInfo } from '@/types/company';
import { Comment } from '@/types/comment';
import { Job } from '@/types/careers';
import {
    FaFileAlt,
    FaComments,
    FaProjectDiagram,
    FaBuilding,
    FaCheckCircle,
    FaClock,
    FaExclamationTriangle,
    FaBriefcase
} from 'react-icons/fa';

export default function DashboardOverview() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        news: [] as NewsArticle[],
        projects: [] as Project[],
        comments: [] as Comment[],
        company: null as CompanyInfo | null,
        jobs: [] as Job[],
        loading: true
    });

    useEffect(() => {
        const fetchData = async () => {
            const [news, projects, comments, company, jobs] = await Promise.all([
                getArticlesAction(),
                getProjectsAction(),
                getAllCommentsAdminAction(),
                getCompanyInfoAction(),
                getJobsAction()
            ]);
            setStats({ news, projects, comments, company, jobs, loading: false });
        };
        fetchData();
    }, []);

    if (stats.loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary-orange/20 border-t-primary-orange rounded-full animate-spin"></div>
            </div>
        );
    }

    const pendingComments = stats.comments.filter(c => c.status === 'PENDING');
    const featuredProjects = stats.projects.filter(p => p.featured);
    const activeJobs = stats.jobs.length;

    return (
        <div className="space-y-10">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-primary-dark uppercase tracking-tighter mb-2">
                        Operational <span className="text-primary-orange">Intelligence</span>
                    </h1>
                    <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                        Welcome back, {user?.name} &bull; Remote Terminal Active
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] font-black text-primary-dark uppercase tracking-widest">System Status: Optimal</span>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={FaFileAlt}
                    label="Active Briefs"
                    value={stats.news.length}
                    detail="Live Articles"
                />
                <StatCard
                    icon={FaComments}
                    label="Pending Review"
                    value={pendingComments.length}
                    detail="Moderation Required"
                    alert={pendingComments.length > 0}
                />
                <StatCard
                    icon={FaProjectDiagram}
                    label="Live Projects"
                    value={stats.projects.length}
                    detail="Portfolio Size"
                />
                <StatCard
                    icon={FaBriefcase}
                    label="Open Positions"
                    value={activeJobs}
                    detail="Active Recruitment"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Recent Activity */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-xl relative overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-sm font-black text-primary-dark uppercase tracking-widest">Recent Engagement</h2>
                            <a href="/admin/dashboard/comments" className="text-[10px] font-black text-primary-orange uppercase tracking-widest hover:underline">View All</a>
                        </div>

                        <div className="space-y-4">
                            {stats.comments.slice(0, 5).map((comment) => (
                                <ActivityRow
                                    key={comment.id}
                                    title={comment.fullName}
                                    desc={comment.text}
                                    time={comment.createdAt}
                                    status={comment.status}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* System Integrity & Quick Actions */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-primary-dark rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-orange/10 rounded-bl-full transform translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform" />
                        <h3 className="text-xl font-black uppercase tracking-tighter mb-6 relative z-10">Company <br /><span className="text-primary-orange">Identity</span></h3>

                        <div className="space-y-6 relative z-10">
                            <IdentityCheck label="Logo & Branding" active={!!stats.company?.branding.logo} />
                            <IdentityCheck label="Contact Information" active={!!stats.company?.phones && stats.company.phones.length > 0} />
                            <IdentityCheck label="Social Connectivity" active={Object.keys(stats.company?.socials || {}).length > 0} />
                            <IdentityCheck label="Mission & Vision" active={!!stats.company?.metadata.mission} />
                        </div>

                        <a
                            href="/admin/dashboard/company"
                            className="w-full mt-10 block text-center bg-white/5 hover:bg-white/10 border border-white/10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                        >
                            Refine Profile
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface StatCardProps {
    icon: React.ElementType;
    label: string;
    value: React.ReactNode;
    detail: string;
    alert?: boolean;
}

function StatCard({ icon: Icon, label, value, detail, alert = false }: StatCardProps) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group"
        >
            <div className={`absolute top-0 right-0 w-24 h-24 ${alert ? 'bg-red-500/5' : 'bg-primary-orange/5'} rounded-bl-full transition-transform group-hover:scale-110`} />
            <div className={`${alert ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-primary-orange'} w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <Icon size={20} />
            </div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-4xl font-black text-primary-dark tracking-tighter mb-2">{value}</p>
            <p className={`text-[9px] font-bold ${alert ? 'text-red-500' : 'text-gray-400'} uppercase tracking-widest`}>{detail}</p>
        </motion.div>
    );
}

function ActivityRow({ title, desc, time, status }: any) {
    const statusConfig: any = {
        PENDING: { icon: FaClock, color: 'text-yellow-500', bg: 'bg-yellow-50' },
        APPROVED: { icon: FaCheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
        REJECTED: { icon: FaExclamationTriangle, color: 'text-red-500', bg: 'bg-red-50' }
    };
    const config = statusConfig[status] || statusConfig.PENDING;

    return (
        <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0 group">
            <div className="flex items-center gap-4 min-w-0">
                <div className={`w-10 h-10 rounded-xl ${config.bg} ${config.color} flex items-center justify-center shrink-0`}>
                    <config.icon size={16} />
                </div>
                <div className="truncate">
                    <p className="text-xs font-black text-primary-dark uppercase truncate">{title}</p>
                    <p className="text-[10px] text-gray-400 font-medium truncate italic">"{desc}"</p>
                </div>
            </div>
            <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest shrink-0 ml-4">{time}</span>
        </div>
    );
}

function IdentityCheck({ label, active }: { label: string, active: boolean }) {
    return (
        <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${active ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                {active ? <FaCheckCircle size={10} /> : <FaExclamationTriangle size={10} />}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${active ? 'text-gray-300' : 'text-gray-500'}`}>{label}</span>
        </div>
    );
}
