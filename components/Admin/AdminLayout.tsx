'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import {
    FaChartBar,
    FaFileAlt,
    FaComments,
    FaProjectDiagram,
    FaTools,
    FaImages,
    FaBuilding,
    FaCog,
    FaSignOutAlt,
    FaBars,
    FaTimes,
    FaBriefcase,
    FaParagraph,
    FaUsers,
    FaEnvelope
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarItemProps {
    icon: any;
    label: string;
    href: string;
    active: boolean;
    collapsed: boolean;
    onClick?: () => void;
}

const SidebarItem = ({ icon: Icon, label, href, active, collapsed, onClick }: SidebarItemProps) => {
    return (
        <a
            href={href}
            onClick={onClick}
            className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group relative ${active
                    ? 'bg-primary-orange text-white shadow-lg shadow-primary-orange/20'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
        >
            <Icon size={18} className="shrink-0" />
            {!collapsed && (
                <span className="text-[10px] font-black uppercase tracking-widest truncate">
                    {label}
                </span>
            )}
            {collapsed && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-primary-dark border border-white/10 rounded text-[9px] font-bold uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                    {label}
                </div>
            )}
        </a>
    );
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, logout, isAuthenticated, isLoading } = useAuth();
    const displayName: string = user?.user_metadata?.name ?? user?.email ?? 'Admin';
    const displayRole: string = (user?.user_metadata?.role ?? 'ADMIN') as string;
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const menuItems = [
        { icon: FaChartBar, label: 'Overview', href: '/admin/dashboard' },
        { icon: FaFileAlt, label: 'News Manager', href: '/admin/dashboard/news' },
        { icon: FaComments, label: 'Moderation', href: '/admin/dashboard/comments' },
        { icon: FaProjectDiagram, label: 'Projects', href: '/admin/dashboard/projects' },
        { icon: FaTools, label: 'Services', href: '/admin/dashboard/services' },
        { icon: FaBriefcase, label: 'Careers', href: '/admin/dashboard/careers' },
        { icon: FaUsers, label: 'Applications', href: '/admin/dashboard/applications' },
        { icon: FaImages, label: 'Media Library', href: '/admin/dashboard/media' },
        { icon: FaParagraph, label: 'Site Content', href: '/admin/dashboard/content' },
        { icon: FaUsers, label: 'Users', href: '/admin/dashboard/users' },
        { icon: FaEnvelope, label: 'Newsletter', href: '/admin/dashboard/newsletter' },
        { icon: FaBuilding, label: 'Company Info', href: '/admin/dashboard/company' },
        { icon: FaCog, label: 'Settings', href: '/admin/dashboard/settings' },
    ];

    // Close mobile menu on mount and route change
    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    // Force close mobile menu when screen size becomes large
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMobileOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (isLoading) return null;
    if (!isAuthenticated) return <>{children}</>;

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
            {/* Desktop Sidebar */}
            <aside
                className={`hidden lg:flex flex-col bg-primary-dark text-white p-6 transition-all duration-300 shrink-0 sticky top-0 h-screen ${isCollapsed ? 'w-24' : 'w-72'
                    }`}
            >
                <div className="flex items-center justify-between mb-12">
                    {!isCollapsed && (
                        <div className="flex flex-col">
                            <img src="/logo.png" alt="Greyland" className="h-7 w-auto mb-1 grayscale invert opacity-80" />
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary-orange">Control Center</span>
                        </div>
                    )}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={`p-2 rounded-lg hover:bg-white/5 transition-colors ${isCollapsed ? 'mx-auto' : ''}`}
                    >
                        <FaBars size={14} className="text-gray-400" />
                    </button>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                    {menuItems.map((item) => (
                        <SidebarItem
                            key={item.href}
                            {...item}
                            active={pathname === item.href}
                            collapsed={isCollapsed}
                        />
                    ))}
                </nav>

                <div className="pt-6 border-t border-white/5 space-y-3 shrink-0">
                    {!isCollapsed && (
                        <div className="flex items-center gap-3 px-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-primary-orange/20 flex items-center justify-center text-primary-orange text-[10px] font-black">
                                {displayName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col truncate">
                                <span className="text-[10px] font-black uppercase tracking-widest truncate">{displayName}</span>
                                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest truncate">{displayRole.replace('_', ' ')}</span>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={logout}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white transition-all w-full font-black text-[10px] uppercase tracking-widest shadow-lg relative group ${isCollapsed ? 'justify-center' : ''
                            }`}
                    >
                        <FaSignOutAlt size={15} />
                        {!isCollapsed && <span>Sign Out</span>}
                        {isCollapsed && (
                            <div className="absolute left-full ml-4 px-2 py-1 bg-red-600 rounded text-[9px] font-bold uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                                Sign Out
                            </div>
                        )}
                    </button>
                </div>
            </aside>

            {/* Mobile Header & Sidebar */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-primary-dark text-white px-6 flex items-center justify-between z-[100]">
                <img src="/logo.png" alt="Greyland" className="h-6 w-auto grayscale invert opacity-80" />
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="p-2 text-gray-400"
                >
                    <FaBars size={20} />
                </button>
            </header>

            <AnimatePresence>
                {isMobileOpen && (
                    <div className="lg:hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileOpen(false)}
                            className="fixed inset-0 bg-primary-dark/60 backdrop-blur-sm z-[110]"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 bottom-0 w-4/5 max-w-sm bg-primary-dark text-white p-8 z-[120] flex flex-col"
                        >
                            <div className="flex items-center justify-between mb-12">
                                <div className="flex flex-col">
                                    <header className="flex flex-col">
                                        <img src="/logo.png" alt="Greyland" className="h-7 w-auto mb-1 grayscale invert opacity-80" />
                                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary-orange">Control Center</span>
                                    </header>
                                </div>
                                <button onClick={() => setIsMobileOpen(false)} className="p-2 text-gray-400">
                                    <FaTimes size={20} />
                                </button>
                            </div>
                            <nav className="flex-1 space-y-2">
                                {menuItems.map((item) => (
                                    <SidebarItem
                                        key={item.href}
                                        {...item}
                                        active={pathname === item.href}
                                        collapsed={false}
                                        onClick={() => setIsMobileOpen(false)}
                                    />
                                ))}
                            </nav>
                            <div className="pt-8 border-t border-white/10 mt-auto">
                                <button
                                    onClick={logout}
                                    className="flex items-center gap-4 px-4 py-4 rounded-xl bg-red-500/10 text-red-500 transition-all w-full font-black text-[10px] uppercase tracking-widest"
                                >
                                    <FaSignOutAlt size={18} /> Exit Portal
                                </button>
                            </div>
                        </motion.aside>
                    </div>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <main className="flex-1 p-6 lg:p-10 pt-24 lg:pt-10">
                    {children}
                </main>
            </div>
        </div>
    );
}
