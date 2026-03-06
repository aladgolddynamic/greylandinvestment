'use client';

import React, { useState, useEffect } from 'react';
import {
    getCompanyInfoAction,
    updateCompanyInfoAction
} from '@/lib/actions/companyActions';
import { CompanyInfo } from '@/types/company';
import {
    FaSave,
    FaBuilding,
    FaPalette,
    FaAddressBook,
    FaInfoCircle,
    FaGlobe,
    FaFacebook,
    FaTwitter,
    FaLinkedin,
    FaInstagram,
    FaCheck,
    FaMapMarkedAlt
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

type TabType = 'general' | 'branding' | 'contact' | 'metadata' | 'location';

export default function CompanyDetailsManager() {
    const [info, setInfo] = useState<CompanyInfo | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>('general');
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        const fetchInfo = async () => {
            const data = await getCompanyInfoAction();
            setInfo(data);
        };
        fetchInfo();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!info) return;

        setIsSaving(true);
        try {
            await updateCompanyInfoAction(info);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            console.error('Save failed:', error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!info) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary-orange/20 border-t-primary-orange rounded-full animate-spin"></div>
            </div>
        );
    }

    const tabs: { id: TabType; label: string; icon: any }[] = [
        { id: 'general', label: 'General', icon: FaBuilding },
        { id: 'branding', label: 'Branding', icon: FaPalette },
        { id: 'contact', label: 'Contact', icon: FaAddressBook },
        { id: 'metadata', label: 'Metadata', icon: FaInfoCircle },
        { id: 'location', label: 'Location', icon: FaMapMarkedAlt },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-primary-dark uppercase tracking-tighter mb-2">
                        Company <span className="text-primary-orange">Identity</span>
                    </h1>
                    <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                        Manage Corporate Branding, Metadata, and Connectivity
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
                            Processing...
                        </>
                    ) : saveSuccess ? (
                        <>
                            <FaCheck /> Changes Persisted
                        </>
                    ) : (
                        <>
                            <FaSave /> Save Changes
                        </>
                    )}
                </button>
            </div>

            {/* Main Editor Card */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden min-h-[600px] flex flex-col md:flex-row">
                {/* Tab Navigation */}
                <div className="w-full md:w-64 bg-[#F8FAFC] border-b md:border-b-0 md:border-r border-gray-100 p-6 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible">
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

                {/* Tab Content */}
                <div className="flex-1 p-8 md:p-12 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === 'general' && (
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">Legal Entity Name</label>
                                            <input
                                                type="text"
                                                value={info.name}
                                                onChange={(e) => setInfo({ ...info, name: e.target.value })}
                                                className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-4 px-6 text-sm font-bold text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-orange/10 focus:border-primary-orange transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">Corporate Tagline</label>
                                            <input
                                                type="text"
                                                value={info.tagline}
                                                onChange={(e) => setInfo({ ...info, tagline: e.target.value })}
                                                className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-4 px-6 text-sm font-bold text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-orange/10 focus:border-primary-orange transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">Mission Statement</label>
                                            <textarea
                                                rows={4}
                                                value={info.description}
                                                onChange={(e) => setInfo({ ...info, description: e.target.value })}
                                                className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-4 px-6 text-sm font-medium leading-relaxed text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-orange/10 focus:border-primary-orange transition-all resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'branding' && (
                                <div className="space-y-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">Primary Corporate Logo</label>
                                            <div className="bg-[#F8FAFC] border-2 border-dashed border-gray-200 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 group hover:border-primary-orange transition-colors cursor-pointer">
                                                <img src={info.branding.logo} alt="Logo" className="h-12 w-auto grayscale opacity-40 group-hover:opacity-100 transition-all" />
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest group-hover:text-primary-orange">Change Master Logo</span>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">System Favicon</label>
                                            <div className="bg-[#F8FAFC] border-2 border-dashed border-gray-200 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 group hover:border-primary-orange transition-colors cursor-pointer">
                                                <img src={info.branding.favicon} alt="Favicon" className="h-8 w-8 grayscale opacity-40 group-hover:opacity-100 transition-all" />
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest group-hover:text-primary-orange">Update Favicon</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-50">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">Primary Color (HEX)</label>
                                            <div className="flex gap-4">
                                                <div className="w-14 h-14 rounded-xl shadow-lg border border-white" style={{ backgroundColor: info.branding.primaryColor }}></div>
                                                <input
                                                    type="text"
                                                    value={info.branding.primaryColor}
                                                    onChange={(e) => setInfo({ ...info, branding: { ...info.branding, primaryColor: e.target.value } })}
                                                    className="flex-1 bg-[#F8FAFC] border border-gray-100 rounded-xl py-4 px-6 text-sm font-black text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-orange/10 focus:border-primary-orange transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">Secondary Color (HEX)</label>
                                            <div className="flex gap-4">
                                                <div className="w-14 h-14 rounded-xl shadow-lg border border-white" style={{ backgroundColor: info.branding.secondaryColor }}></div>
                                                <input
                                                    type="text"
                                                    value={info.branding.secondaryColor}
                                                    onChange={(e) => setInfo({ ...info, branding: { ...info.branding, secondaryColor: e.target.value } })}
                                                    className="flex-1 bg-[#F8FAFC] border border-gray-100 rounded-xl py-4 px-6 text-sm font-black text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-orange/10 focus:border-primary-orange transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'contact' && (
                                <div className="space-y-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">Public Emails (Comma separated)</label>
                                            <input
                                                type="text"
                                                value={info.emails?.join(', ') || ''}
                                                onChange={(e) => setInfo({ ...info, emails: e.target.value.split(',').map(s => s.trim()) })}
                                                className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-4 px-6 text-sm font-bold text-primary-dark focus:outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">Primary Hotlines (Comma separated)</label>
                                            <input
                                                type="text"
                                                value={info.phones?.join(', ') || ''}
                                                onChange={(e) => setInfo({ ...info, phones: e.target.value.split(',').map(s => s.trim()) })}
                                                className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-4 px-6 text-sm font-bold text-primary-dark focus:outline-none"
                                            />
                                        </div>
                                        <div className="col-span-1 md:col-span-2 space-y-2">
                                            <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">Headquarters Address</label>
                                            <input
                                                type="text"
                                                value={info.address}
                                                onChange={(e) => setInfo({ ...info, address: e.target.value })}
                                                className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-4 px-6 text-sm font-bold text-primary-dark focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-gray-50">
                                        <h3 className="text-[10px] font-black text-primary-dark uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                                            <FaGlobe className="text-primary-orange" /> Social Connectivity
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <SocialInput icon={FaFacebook} label="Facebook" value={info.socials.facebook} onChange={(v: string) => setInfo({ ...info, socials: { ...info.socials, facebook: v } })} />
                                            <SocialInput icon={FaTwitter} label="Twitter / X" value={info.socials.twitter} onChange={(v: string) => setInfo({ ...info, socials: { ...info.socials, twitter: v } })} />
                                            <SocialInput icon={FaLinkedin} label="LinkedIn" value={info.socials.linkedin} onChange={(v: string) => setInfo({ ...info, socials: { ...info.socials, linkedin: v } })} />
                                            <SocialInput icon={FaInstagram} label="Instagram" value={info.socials.instagram} onChange={(v: string) => setInfo({ ...info, socials: { ...info.socials, instagram: v } })} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'metadata' && (
                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">Operating Hours</label>
                                        <input
                                            type="text"
                                            value={info.metadata.operatingHours}
                                            onChange={(e) => setInfo({ ...info, metadata: { ...info.metadata, operatingHours: e.target.value } })}
                                            className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-4 px-6 text-sm font-bold text-primary-dark focus:outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">Core Mission Statement</label>
                                        <textarea
                                            rows={4}
                                            value={info.metadata.mission}
                                            onChange={(e) => setInfo({ ...info, metadata: { ...info.metadata, mission: e.target.value } })}
                                            className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-4 px-6 text-sm font-medium leading-relaxed text-primary-dark focus:outline-none resize-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">Strategic Vision</label>
                                        <textarea
                                            rows={4}
                                            value={info.metadata.vision}
                                            onChange={(e) => setInfo({ ...info, metadata: { ...info.metadata, vision: e.target.value } })}
                                            className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-4 px-6 text-sm font-medium leading-relaxed text-primary-dark focus:outline-none resize-none"
                                        />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'location' && (
                                <div className="space-y-10">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">Latitude</label>
                                            <input
                                                type="number"
                                                step="any"
                                                value={info.location.lat}
                                                onChange={(e) => setInfo({ ...info, location: { ...info.location, lat: parseFloat(e.target.value) } })}
                                                className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-4 px-6 text-sm font-bold text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-orange/10 focus:border-primary-orange transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">Longitude</label>
                                            <input
                                                type="number"
                                                step="any"
                                                value={info.location.lng}
                                                onChange={(e) => setInfo({ ...info, location: { ...info.location, lng: parseFloat(e.target.value) } })}
                                                className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-4 px-6 text-sm font-bold text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-orange/10 focus:border-primary-orange transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">Zoom Level</label>
                                            <input
                                                type="number"
                                                value={info.location.zoom}
                                                onChange={(e) => setInfo({ ...info, location: { ...info.location, zoom: parseInt(e.target.value) } })}
                                                className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-4 px-6 text-sm font-bold text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-orange/10 focus:border-primary-orange transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-gray-50">
                                        <h3 className="text-[10px] font-black text-primary-dark uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                                            <FaMapMarkedAlt className="text-primary-orange" /> Location Preview
                                        </h3>
                                        <div className="relative aspect-video w-full rounded-[2rem] overflow-hidden border border-gray-100 shadow-inner bg-gray-50">
                                            <iframe
                                                width="100%"
                                                height="100%"
                                                style={{ border: 0 }}
                                                loading="lazy"
                                                allowFullScreen
                                                src={`https://maps.google.com/maps?q=${info.location.lat},${info.location.lng}&z=${info.location.zoom}&output=embed`}
                                            ></iframe>
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                {!info.location.lat && (
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Awaiting valid coordinates...</span>
                                                )}
                                            </div>
                                        </div>
                                        <p className="mt-4 text-[9px] text-gray-400 font-bold italic">
                                            * Preview uses coordinates and zoom level provided above. Ensure accuracy for the public contact page.
                                        </p>
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

interface SocialInputProps {
    icon: React.ElementType;
    label: string;
    value?: string;
    onChange: (value: string) => void;
}

function SocialInput({ icon: Icon, label, value, onChange }: SocialInputProps) {
    return (
        <div className="space-y-2">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Icon size={14} />
                </div>
                <input
                    type="text"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={`https://${label.toLowerCase()}.com/greyland`}
                    className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-3.5 pl-12 pr-4 text-[11px] font-bold text-primary-dark focus:outline-none focus:border-primary-orange transition-all placeholder:text-gray-300"
                />
            </div>
        </div>
    );
}
