'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
    FaPlus, FaSave, FaEye, FaRocket, FaChevronLeft, FaChevronRight,
    FaCheckCircle, FaTrash, FaEdit, FaImage, FaLayerGroup, FaIcons,
    FaCode, FaCogs, FaProjectDiagram, FaShieldAlt, FaChartBar, FaNetworkWired,
    FaBuilding, FaHardHat, FaTools, FaTruckLoading, FaDesktop, FaBoxOpen,
    FaWarehouse, FaClipboardCheck, FaChartPie, FaUserShield, FaSearchPlus,
    FaFileAlt, FaLock, FaTasks, FaGraduationCap, FaArrowRight, FaTimes
} from 'react-icons/fa';
import {
    serviceCategoryService,
    serviceStyleService
} from '@/services/serviceService';
import { ServiceFeature, ServiceItem } from '@/types/service';
import { createServiceAction, updateServiceAction } from '@/lib/actions/serviceActions';
import ImageUploadField from '@/components/Admin/ImageUploadField';
import ServiceGridItem from '@/components/Services/ServiceGridItem';
import { slugify } from '@/utils/slugify';

// ─── Constants ────────────────────────────────────────────────────────────────

const ICON_COMPONENTS: Record<string, React.ReactNode> = {
    FaCode: <FaCode />,
    FaCogs: <FaCogs />,
    FaProjectDiagram: <FaProjectDiagram />,
    FaShieldAlt: <FaShieldAlt />,
    FaChartBar: <FaChartBar />,
    FaNetworkWired: <FaNetworkWired />,
    FaBuilding: <FaBuilding />,
    FaHardHat: <FaHardHat />,
    FaTools: <FaTools />,
    FaTruckLoading: <FaTruckLoading />,
    FaDesktop: <FaDesktop />,
    FaBoxOpen: <FaBoxOpen />,
    FaWarehouse: <FaWarehouse />,
    FaClipboardCheck: <FaClipboardCheck />,
    FaChartPie: <FaChartPie />,
    FaUserShield: <FaUserShield />,
    FaSearchPlus: <FaSearchPlus />,
    FaFileAlt: <FaFileAlt />,
    FaLock: <FaLock />,
    FaTasks: <FaTasks />,
    FaGraduationCap: <FaGraduationCap />,
    FaCheckCircle: <FaCheckCircle />
};

type TabId = 'meta' | 'features' | 'media' | 'preview' | 'publish';

// ─── Components ───────────────────────────────────────────────────────────────

function TabButton({ id, label, active, onClick, icon: Icon, completed }: {
    id: TabId, label: string, active: boolean, onClick: () => void, icon: any, completed: boolean
}) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-3 px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${active
                ? 'bg-primary-dark text-white shadow-xl shadow-primary-dark/20'
                : 'bg-white text-gray-400 hover:text-primary-dark hover:border-gray-200 border border-gray-100'
                }`}
        >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] ${active ? 'bg-primary-orange text-white' : completed ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                {completed && !active ? '✓' : <Icon size={10} />}
            </div>
            {label}
        </button>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface ServiceFormProps {
    initialData?: ServiceItem;
    isEdit?: boolean;
}

export default function ServiceForm({ initialData, isEdit = false }: ServiceFormProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabId>('meta');
    const [isSaving, setIsSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    // Form State
    const [form, setForm] = useState<ServiceItem>({
        id: initialData?.id || '',
        title: initialData?.title || '',
        category: initialData?.category || 'TECHNOLOGY',
        icon: initialData?.icon || 'FaTools',
        bullets: initialData?.bullets || ['High scalability for organizacional growth.', 'Robust security protocols.', 'Expert technical support.'],
        slug: initialData?.slug || '',
        shortDescription: initialData?.shortDescription || '',
        fullDescription: initialData?.fullDescription || '',
        features: initialData?.features || [],
        media: initialData?.media || {
            banner: '',
            illustrations: []
        },
        featured: initialData?.featured || false,
        order: initialData?.order || 0,
        status: initialData?.status || 'DRAFT',
        createdAt: initialData?.createdAt,
        updatedAt: initialData?.updatedAt,
    });

    // Auto-generate slug from title ONLY if not editing or if slug is empty
    useEffect(() => {
        if (!isEdit && (!form.slug || form.slug === slugify(form.title).slice(0, -1))) {
            setForm((prev: ServiceItem) => ({ ...prev, slug: slugify(prev.title) }));
        }
    }, [form.title, isEdit]);

    const categories = serviceCategoryService.getCategories();
    const iconList = serviceStyleService.getIconList();

    // ─── Handlers ─────────────────────────────────────────────────────────────

    const handleBack = () => router.back();

    const handleFeatureAdd = () => {
        const newFeature: ServiceFeature = {
            id: `feat-${Date.now()}`,
            title: 'New Value Proposition',
            description: 'Explain the core benefit of this feature or capability.',
            icon: 'FaCheckCircle'
        };
        setForm({ ...form, features: [...form.features, newFeature] });
    };

    const handleFeatureRemove = (id: string) => {
        setForm({ ...form, features: form.features.filter((f: ServiceFeature) => f.id !== id) });
    };

    const handleFeatureUpdate = (id: string, updates: Partial<ServiceFeature>) => {
        setForm({
            ...form,
            features: form.features.map((f: ServiceFeature) => f.id === id ? { ...f, ...updates } : f)
        });
    };

    const handlePublish = async () => {
        setIsSaving(true);
        try {
            if (isEdit && form.id) {
                await updateServiceAction(form.id, { ...form, status: 'PUBLISHED' });
            } else {
                await createServiceAction({ ...form, status: 'PUBLISHED' });
            }
            setSuccess(true);
            setTimeout(() => router.push('/admin/dashboard/services'), 1500);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveDraft = async () => {
        setIsSaving(true);
        try {
            if (isEdit && form.id) {
                await updateServiceAction(form.id, { ...form, status: 'DRAFT' });
            } else {
                await createServiceAction({ ...form, status: 'DRAFT' });
            }
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                if (!isEdit) {
                    router.push('/admin/dashboard/services');
                }
            }, 1000);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    }

    // ─── Validation ───────────────────────────────────────────────────────────
    const isMetaValid = form.title.length > 3 && form.slug.length > 2;
    const isFeaturesValid = form.features.length >= 2;
    const isPublishReady = isMetaValid && isFeaturesValid;

    return (
        <div className="min-h-screen space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <button onClick={handleBack} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary-dark transition-colors mb-4">
                        <FaChevronLeft size={10} /> Back to Services
                    </button>
                    <h1 className="text-3xl font-black text-primary-dark uppercase tracking-tighter">
                        {isEdit ? 'Modify' : 'Deploy'} <span className="text-primary-orange">{isEdit ? 'Service Details' : 'New Service'}</span>
                    </h1>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setActiveTab('preview')} className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 hover:border-primary-orange text-primary-dark rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">
                        <FaEye size={12} /> Preview Mode
                    </button>
                    <button
                        onClick={handleSaveDraft}
                        disabled={!isPublishReady || isSaving}
                        className="flex items-center gap-2 px-8 py-3 bg-[#F8FAFC] text-gray-400 hover:text-primary-dark rounded-xl font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-50"
                    >
                        {isSaving ? 'Saving...' : <><FaSave size={12} /> Save Draft</>}
                    </button>
                    <button
                        onClick={handlePublish}
                        disabled={!isPublishReady || isSaving}
                        className="flex items-center gap-2 px-8 py-3 bg-primary-dark hover:bg-primary-orange text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-primary-orange/20 disabled:opacity-50"
                    >
                        {isSaving ? (isEdit ? 'Updating...' : 'Deploying...') : <><FaRocket size={12} /> {isEdit ? 'Update Service' : 'Deploy Service'}</>}
                    </button>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 p-1.5 bg-[#F8FAFC] border border-gray-100 rounded-2xl w-fit">
                <TabButton id="meta" label="Service Identity" active={activeTab === 'meta'} onClick={() => setActiveTab('meta')} icon={FaLayerGroup} completed={isMetaValid} />
                <TabButton id="features" label="Value Blocks" active={activeTab === 'features'} onClick={() => setActiveTab('features')} icon={FaPlus} completed={isFeaturesValid} />
                <TabButton id="media" label="Media & Layout" active={activeTab === 'media'} onClick={() => setActiveTab('media')} icon={FaImage} completed={!!form.media.banner} />
                <TabButton id="preview" label="Style Preview" active={activeTab === 'preview'} onClick={() => setActiveTab('preview')} icon={FaEye} completed={true} />
                <TabButton id="publish" label="Deployment" active={activeTab === 'publish'} onClick={() => setActiveTab('publish')} icon={FaRocket} completed={isPublishReady} />
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl p-10 min-h-[600px]">
                <AnimatePresence mode="wait">
                    {/* ── META TAB ── */}
                    {activeTab === 'meta' && (
                        <motion.div key="meta" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-4xl space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">Service Designation</label>
                                    <input
                                        type="text"
                                        value={form.title}
                                        onChange={e => setForm({ ...form, title: e.target.value })}
                                        placeholder="e.g. Smart Infrastructure Analytics"
                                        className="w-full bg-[#F8FAFC] border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-orange/10 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">Strategic Category</label>
                                    <select
                                        value={form.category}
                                        onChange={e => setForm({ ...form, category: e.target.value as any })}
                                        className="w-full bg-[#F8FAFC] border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-orange/10 appearance-none"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">Deployment Slug (URL)</label>
                                    <div className="flex items-center bg-[#F8FAFC] border border-gray-100 rounded-2xl px-6">
                                        <span className="text-gray-400 text-xs font-bold py-4">greyland.com/services/</span>
                                        <input
                                            type="text"
                                            value={form.slug}
                                            onChange={e => setForm({ ...form, slug: e.target.value })}
                                            className="bg-transparent border-none py-4 text-sm font-bold text-primary-dark focus:outline-none flex-1"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">Service Icon</label>
                                    <div className="p-4 bg-[#F8FAFC] border border-gray-100 rounded-2xl max-h-[180px] overflow-y-auto grid grid-cols-6 gap-3">
                                        {iconList.map(iconName => (
                                            <button
                                                key={iconName}
                                                onClick={() => setForm({ ...form, icon: iconName })}
                                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${form.icon === iconName ? 'bg-primary-orange text-white shadow-lg' : 'bg-white text-gray-400 hover:text-primary-dark'
                                                    }`}
                                            >
                                                {ICON_COMPONENTS[iconName] || <FaTools />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">Short Value Proposition (Excerpts)</label>
                                <textarea
                                    rows={3}
                                    value={form.shortDescription}
                                    onChange={e => setForm({ ...form, shortDescription: e.target.value })}
                                    placeholder="Briefly state why this service is essential..."
                                    className="w-full bg-[#F8FAFC] border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-orange/10 transition-all"
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* ── FEATURES TAB ── */}
                    {activeTab === 'features' && (
                        <motion.div key="features" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <h3 className="text-lg font-black text-primary-dark uppercase tracking-tight">Feature Blocks</h3>
                                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Define at least 2 core capabilities</p>
                                </div>
                                <button onClick={handleFeatureAdd} className="flex items-center gap-3 px-6 py-3 bg-primary-dark text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-orange transition-all">
                                    <FaPlus size={10} /> Add Capability
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {form.features.map((feat: ServiceFeature, idx: number) => (
                                    <div key={feat.id} className="p-6 bg-[#F8FAFC] border border-gray-100 rounded-3xl relative group">
                                        <button
                                            onClick={() => handleFeatureRemove(feat.id)}
                                            className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <FaTrash size={12} />
                                        </button>
                                        <div className="flex gap-4 mb-4">
                                            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm text-primary-orange flex items-center justify-center shrink-0">
                                                {ICON_COMPONENTS[feat.icon] || <FaCheckCircle />}
                                            </div>
                                            <div className="flex-1 space-y-4">
                                                <input
                                                    value={feat.title}
                                                    onChange={e => handleFeatureUpdate(feat.id, { title: e.target.value })}
                                                    className="w-full bg-transparent border-b border-gray-200 focus:border-primary-orange py-1 text-sm font-black text-primary-dark focus:outline-none"
                                                    placeholder="Feature Title"
                                                />
                                                <textarea
                                                    value={feat.description}
                                                    onChange={e => handleFeatureUpdate(feat.id, { description: e.target.value })}
                                                    className="w-full bg-transparent text-[11px] font-medium text-gray-500 focus:outline-none"
                                                    rows={2}
                                                    placeholder="Describe the benefit..."
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-2 p-2 bg-white rounded-xl border border-gray-100 overflow-x-auto">
                                            {['FaCheckCircle', 'FaShieldAlt', 'FaTools', 'FaBoxOpen', 'FaCogs'].map(iconName => (
                                                <button key={iconName} onClick={() => handleFeatureUpdate(feat.id, { icon: iconName })}
                                                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] transition-all ${feat.icon === iconName ? 'bg-primary-orange text-white' : 'text-gray-300 hover:text-primary-dark'}`}>
                                                    {ICON_COMPONENTS[iconName]}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                {form.features.length === 0 && (
                                    <div className="col-span-full py-16 text-center border-2 border-dashed border-gray-100 rounded-[2rem]">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">No features defined yet.</p>
                                        <button onClick={handleFeatureAdd} className="px-6 py-3 bg-white border border-gray-200 text-[10px] font-black rounded-xl hover:border-primary-orange transition-all">Start Adding Features</button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* ── MEDIA TAB ── */}
                    {activeTab === 'media' && (
                        <motion.div key="media" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <div className="p-8 bg-primary-dark rounded-[2rem] text-white">
                                        <h3 className="text-lg font-black uppercase tracking-tight mb-2">Service Banner</h3>
                                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-8">Used in detail pages and high-tier cards</p>
                                        <ImageUploadField
                                            label=""
                                            value={form.media.banner}
                                            onChange={v => setForm({ ...form, media: { ...form.media, banner: v } })}
                                            previewHeightClass="h-64"
                                            placeholder="Upload banner image..."
                                        />
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <h3 className="text-lg font-black text-primary-dark uppercase tracking-tight">Display Hierarchy</h3>
                                    <div className="p-8 bg-[#F8FAFC] border border-gray-100 rounded-[2rem] space-y-6">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black text-primary-dark uppercase tracking-widest">Featured on Homepage</span>
                                            <button
                                                onClick={() => setForm({ ...form, featured: !form.featured })}
                                                className={`w-12 h-6 rounded-full transition-all relative ${form.featured ? 'bg-primary-orange' : 'bg-gray-200'}`}
                                            >
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${form.featured ? 'left-7' : 'left-1'}`} />
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">Display Order Weight</label>
                                            <input
                                                type="number"
                                                value={form.order}
                                                onChange={e => setForm({ ...form, order: parseInt(e.target.value) })}
                                                className="w-full bg-white border border-gray-100 rounded-xl py-3 px-5 text-sm font-bold text-primary-dark focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ── PREVIEW TAB ── */}
                    {activeTab === 'preview' && (
                        <motion.div key="preview" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-10">
                            <div className="text-center max-w-2xl mx-auto space-y-4 mb-10">
                                <span className="text-primary-orange font-black text-[10px] uppercase tracking-[0.4em]">Integrated Preview Engine</span>
                                <h3 className="text-2xl font-black text-primary-dark uppercase tracking-tight">Vantage Point: Service Card</h3>
                                <p className="text-gray-400 text-xs font-medium">This is how your service will appear on the main listing page. Consistency is automatically enforced.</p>
                            </div>

                            <div className="flex justify-center max-w-sm mx-auto">
                                <ServiceGridItem
                                    title={form.title || 'Untitled Service Offering'}
                                    category={categories.find(c => c.id === form.category)?.label || 'TECHNOLOGY'}
                                    bullets={form.features.length > 0 ? form.features.map((f: ServiceFeature) => f.title) : form.bullets}
                                    icon={ICON_COMPONENTS[form.icon] || <FaTools />}
                                    index={0}
                                />
                            </div>

                            <div className="p-8 bg-blue-50 border border-blue-100 rounded-[2rem] flex flex-col items-center gap-4 text-center">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-500 shadow-sm">
                                    <FaRocket size={14} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-black text-blue-900 uppercase tracking-widest">Detail Page Ready</p>
                                    <p className="text-[10px] font-medium text-blue-700 max-w-xs">Detailed landing page will be automatically generated at /services/{form.slug}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ── PUBLISH TAB ── */}
                    {activeTab === 'publish' && (
                        <motion.div key="publish" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center justify-center py-10 space-y-8">
                            <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${isPublishReady ? 'bg-green-50 text-green-500' : 'bg-gray-50 text-gray-200'}`}>
                                <FaRocket size={40} className={isPublishReady ? 'animate-bounce' : ''} />
                            </div>

                            <div className="text-center space-y-4 max-w-md">
                                <h3 className="text-2xl font-black text-primary-dark uppercase tracking-tight">{isEdit ? 'Ready to Update?' : 'Ready for Deployment?'}</h3>
                                <p className="text-sm font-medium text-gray-400">Review your checklist before finalizing the integration.</p>
                            </div>

                            <div className="w-full max-w-md space-y-4">
                                <div className="flex items-center gap-4 p-5 bg-[#F8FAFC] border border-gray-100 rounded-2xl">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white ${isMetaValid ? 'bg-green-500' : 'bg-gray-200'}`}>
                                        {isMetaValid && <FaCheckCircle size={10} />}
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${isMetaValid ? 'text-primary-dark' : 'text-gray-400'}`}>Service Meta Information</span>
                                </div>
                                <div className="flex items-center gap-4 p-5 bg-[#F8FAFC] border border-gray-100 rounded-2xl">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white ${isFeaturesValid ? 'bg-green-500' : 'bg-gray-200'}`}>
                                        {isFeaturesValid && <FaCheckCircle size={10} />}
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${isFeaturesValid ? 'text-primary-dark' : 'text-gray-400'}`}>Value Proposition Blocks (Min 2)</span>
                                </div>
                                <div className="flex items-center gap-4 p-5 bg-[#F8FAFC] border border-gray-100 rounded-2xl">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white ${form.media.banner ? 'bg-green-500' : 'bg-orange-400'}`}>
                                        {form.media.banner ? <FaCheckCircle size={10} /> : '!'}
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${form.media.banner ? 'text-primary-dark' : 'text-orange-600'}`}>
                                        {form.media.banner ? 'Cover Artwork Uploaded' : 'Missing Cover Artwork (Recommended)'}
                                    </span>
                                </div>
                            </div>

                            <div className="pt-8">
                                <button
                                    onClick={handlePublish}
                                    disabled={!isPublishReady || isSaving}
                                    className="px-12 py-5 bg-primary-dark hover:bg-primary-orange text-white rounded-2xl font-black text-sm uppercase tracking-[.2em] transition-all shadow-2xl shadow-primary-orange/20 disabled:opacity-50 group flex items-center gap-4"
                                >
                                    {isSaving ? (isEdit ? 'Updating Service...' : 'Processing Deployment...') : success ? (isEdit ? 'Successfully Updated!' : 'Successfully Deployed!') : (isEdit ? 'Confirm Update' : 'Confirm Deployment')}
                                    <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
