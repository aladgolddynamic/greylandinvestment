'use client';

import React, { useState, useEffect } from 'react';
import { authService, AdminUser } from '@/services/authService';
import {
    updateUserAction,
    changePasswordAction,
    verifyCredentialsAction
} from '@/lib/actions/userActions';
import {
    FaUser,
    FaLock,
    FaBell,
    FaShieldAlt,
    FaCog,
    FaCheck,
    FaExclamationTriangle,
    FaSave
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

type SettingsTab = 'profile' | 'security' | 'preferences';

export default function SettingsManager() {
    const [user, setUser] = useState<AdminUser | null>(null);
    const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Profile State
    const [profileData, setProfileData] = useState({ name: '', email: '' });

    // Security State
    const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });

    useEffect(() => {
        const currentUser = authService.getUser();
        if (currentUser) {
            setUser(currentUser);
            setProfileData({ name: currentUser.name, email: currentUser.email });
        }
    }, []);

    const handleProfileSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setIsSaving(true);
        setError(null);
        try {
            const updatedUser = await updateUserAction(user.id, profileData);
            // Sync with local authService for session management
            authService.setUser({
                ...user,
                name: updatedUser.name,
                email: updatedUser.email
            });
            setUser(authService.getUser());
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            setError('New passwords do not match.');
            return;
        }
        if (!user) return;
        setIsSaving(true);
        setError(null);
        try {
            // Verify old password first using server action
            const isVerified = await verifyCredentialsAction(user.email, passwords.old);
            if (!isVerified) {
                throw new Error('Invalid existing credentials.');
            }
            // If verification succeeds, update to new password
            await changePasswordAction(user.id, passwords.new);
            setSaveSuccess(true);
            setPasswords({ old: '', new: '', confirm: '' });
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (!user) return null;

    const tabs: { id: SettingsTab; label: string; icon: any }[] = [
        { id: 'profile', label: 'Admin Profile', icon: FaUser },
        { id: 'security', label: 'Security & Auth', icon: FaShieldAlt },
        { id: 'preferences', label: 'System Prefs', icon: FaCog },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-primary-dark uppercase tracking-tighter mb-2">
                        System <span className="text-primary-orange">Governance</span>
                    </h1>
                    <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                        Manage Admin Credentials, Security Protocols, and Personal Workspace
                    </p>
                </div>
            </div>

            {/* Content Container */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">
                {/* Sidebar Nav */}
                <div className="w-full md:w-64 bg-[#F8FAFC] border-b md:border-b-0 md:border-r border-gray-100 p-6 flex flex-row md:flex-col gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 md:shrink ${activeTab === tab.id
                                ? 'bg-white text-primary-orange shadow-md border border-gray-100'
                                : 'text-gray-400 hover:text-primary-dark'
                                }`}
                        >
                            <tab.icon size={14} /> {tab.label}
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-8 md:p-12">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {/* Profile Tab */}
                            {activeTab === 'profile' && (
                                <form onSubmit={handleProfileSave} className="space-y-8">
                                    <div className="flex flex-col gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">Administrator Full Name</label>
                                            <input
                                                type="text"
                                                value={profileData.name}
                                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-4 px-6 text-sm font-bold text-primary-dark focus:outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">Official Email Address</label>
                                            <input
                                                type="email"
                                                value={profileData.email}
                                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                                className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-4 px-6 text-sm font-bold text-primary-dark focus:outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">Current Role Status</label>
                                            <div className="bg-primary-orange/5 border border-primary-orange/10 rounded-xl py-4 px-6">
                                                <span className="text-[10px] font-black text-primary-orange uppercase tracking-widest">{user.role.replace('_', ' ')}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-10 border-t border-gray-50 flex flex-col gap-6">
                                        {error && (
                                            <div className="flex items-center gap-3 text-red-500 bg-red-50 p-4 rounded-xl">
                                                <FaExclamationTriangle size={14} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">{error}</span>
                                            </div>
                                        )}
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className={`flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl ${saveSuccess
                                                ? 'bg-green-500 text-white'
                                                : 'bg-primary-dark hover:bg-primary-orange text-white'
                                                } disabled:opacity-50`}
                                        >
                                            {isSaving ? 'Processing...' : saveSuccess ? <><FaCheck /> Profile Updated</> : <><FaSave /> Commit Profile Changes</>}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Security Tab */}
                            {activeTab === 'security' && (
                                <form onSubmit={handlePasswordUpdate} className="space-y-8">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">Current Security Code</label>
                                            <input
                                                type="password"
                                                value={passwords.old}
                                                onChange={(e) => setPasswords({ ...passwords, old: e.target.value })}
                                                className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-4 px-6 text-sm font-bold text-primary-dark focus:outline-none"
                                            />
                                        </div>
                                        <div className="h-[2px] bg-gray-50 my-4"></div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">New Access Keyword</label>
                                            <input
                                                type="password"
                                                value={passwords.new}
                                                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                                className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-4 px-6 text-sm font-bold text-primary-dark focus:outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">Confirm Access Keyword</label>
                                            <input
                                                type="password"
                                                value={passwords.confirm}
                                                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                                className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-4 px-6 text-sm font-bold text-primary-dark focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-10 border-t border-gray-50 flex flex-col gap-6">
                                        {error && (
                                            <div className="flex items-center gap-3 text-red-500 bg-red-50 p-4 rounded-xl">
                                                <FaExclamationTriangle size={14} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">{error}</span>
                                            </div>
                                        )}
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className={`flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl ${saveSuccess
                                                ? 'bg-green-500 text-white'
                                                : 'bg-primary-dark hover:bg-primary-orange text-white'
                                                } disabled:opacity-50`}
                                        >
                                            {isSaving ? 'Updating...' : saveSuccess ? <><FaCheck /> Keyword Updated</> : <><FaLock /> Update Security Access</>}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Preferences Tab */}
                            {activeTab === 'preferences' && (
                                <div className="space-y-8">
                                    <div className="p-8 bg-[#F8FAFC] rounded-2xl border border-gray-100">
                                        <h3 className="text-[10px] font-black text-primary-dark uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                            <FaBell className="text-primary-orange" /> Notification Tunnels
                                        </h3>
                                        <div className="space-y-6">
                                            <PreferenceToggle label="Email Transmission on Comments" checked={true} />
                                            <PreferenceToggle label="Critical Security Alerts" checked={true} />
                                            <PreferenceToggle label="Media Upload Completion Logs" checked={false} />
                                        </div>
                                    </div>

                                    <div className="p-8 bg-[#F8FAFC] rounded-2xl border border-gray-100">
                                        <h3 className="text-[10px] font-black text-primary-dark uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                            <FaCog className="text-primary-orange" /> Interface Configurations
                                        </h3>
                                        <div className="space-y-6">
                                            <PreferenceToggle label="Enable High-Performance Mode (Reduced Motion)" checked={false} />
                                            <PreferenceToggle label="Auto-Save Content Drafts" checked={true} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function PreferenceToggle({ label, checked }: { label: string; checked: boolean }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{label}</span>
            <div className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${checked ? 'bg-primary-orange' : 'bg-gray-200'}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${checked ? 'left-6' : 'left-1'}`}></div>
            </div>
        </div>
    );
}
