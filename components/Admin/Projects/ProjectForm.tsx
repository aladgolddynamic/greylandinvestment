'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaArrowLeft, FaPlus, FaTimes, FaStar, FaRegStar,
    FaImage, FaCheckCircle, FaArrowRight, FaListUl,
    FaCode, FaTrophy, FaBullseye, FaMapMarkerAlt,
    FaCalendarAlt, FaBriefcase, FaCheck, FaEye,
    FaExclamationTriangle, FaSave, FaRocket, FaLayerGroup,
    FaGripLines, FaInfoCircle
} from 'react-icons/fa';
import { projectStyleService } from '@/services/projectService';
import { Project, ProjectStatus } from '@/types/project';
import { createProjectAction, updateProjectAction } from '@/lib/actions/projectActions';
import ProjectCard from '@/components/Projects/ProjectCard';
import ImageUploadField from '@/components/Admin/ImageUploadField';

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = 'details' | 'media' | 'preview' | 'publish';

interface GalleryImage {
    url: string;
    caption: string;
}

interface FormState {
    id?: string;
    title: string;
    industry: string;
    duration: string;
    location: string;
    description: string;
    deliverables: string[];
    image: string;
    category: string;
    featured: boolean;
    status: ProjectStatus;
    startDate: string;
    endDate: string;
    client: string;
    objectives: string[];
    technologies: string[];
    achievements: string[];
    gallery: GalleryImage[];
    publicationStatus: 'DRAFT' | 'PUBLISHED';
    slug: string;
    updatedAt?: string;
}

const getDefaultForm = (initialData?: Project): FormState => {
    if (initialData) {
        return {
            id: initialData.id,
            title: initialData.title || '',
            industry: initialData.industry || '',
            duration: initialData.duration || '',
            location: initialData.location || '',
            description: initialData.description || '',
            deliverables: initialData.deliverables?.length ? initialData.deliverables : [''],
            image: initialData.image || '',
            category: initialData.category || '',
            featured: initialData.featured || false,
            status: initialData.status || 'Planned',
            startDate: initialData.startDate || '',
            endDate: initialData.endDate || '',
            client: initialData.client || '',
            objectives: initialData.objectives?.length ? initialData.objectives : [''],
            technologies: initialData.technologies?.length ? initialData.technologies : [''],
            achievements: initialData.achievements?.length ? initialData.achievements : [''],
            gallery: initialData.gallery?.map(g => ({ url: g.url, caption: g.caption || '' })) || [],
            publicationStatus: initialData.publicationStatus || 'DRAFT',
            slug: initialData.slug || '',
            updatedAt: initialData.updatedAt
        };
    }

    return {
        title: '',
        industry: '',
        duration: '',
        location: '',
        description: '',
        deliverables: [''],
        image: '',
        category: '',
        featured: false,
        status: 'Planned',
        startDate: '',
        endDate: '',
        client: '',
        objectives: [''],
        technologies: [''],
        achievements: [''],
        gallery: [],
        publicationStatus: 'DRAFT',
        slug: '',
    };
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const TABS: { id: Tab; label: string }[] = [
    { id: 'details', label: 'Details' },
    { id: 'media', label: 'Media' },
    { id: 'preview', label: 'Preview' },
    { id: 'publish', label: 'Publish' },
];

const STATUS_COLORS: Record<ProjectStatus, string> = {
    Ongoing: 'bg-green-50 text-green-700 border-green-200',
    Completed: 'bg-blue-50 text-blue-700 border-blue-200',
    Planned: 'bg-amber-50 text-amber-700 border-amber-200',
};

// ─── Reusable UI Atoms ────────────────────────────────────────────────────────
function FieldLabel({ children }: { children: React.ReactNode }) {
    return (
        <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1 block mb-2">
            {children}
        </label>
    );
}

function TextInput({ value, onChange, placeholder, type = 'text' }: {
    value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
    return (
        <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-3.5 px-5 text-sm font-bold text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-orange/20 transition-all"
        />
    );
}

function TextareaInput({ value, onChange, placeholder, rows = 4 }: {
    value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
    return (
        <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-3.5 px-5 text-sm font-bold text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-orange/20 transition-all resize-none"
        />
    );
}

function DynamicList({ items, onChange, placeholder, icon: Icon }: {
    items: string[];
    onChange: (items: string[]) => void;
    placeholder: string;
    icon: React.ElementType;
}) {
    const update = (idx: number, val: string) => {
        const next = [...items];
        next[idx] = val;
        onChange(next);
    };
    const remove = (idx: number) => onChange(items.filter((_, i) => i !== idx));
    const add = () => onChange([...items, '']);

    return (
        <div className="space-y-2">
            {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                    <Icon size={12} className="text-primary-orange shrink-0" />
                    <input
                        value={item}
                        onChange={e => update(idx, e.target.value)}
                        placeholder={`${placeholder} ${idx + 1}`}
                        className="flex-1 bg-[#F8FAFC] border border-gray-100 rounded-xl py-3 px-4 text-sm font-bold text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-orange/20 transition-all"
                    />
                    {items.length > 1 && (
                        <button
                            type="button"
                            onClick={() => remove(idx)}
                            className="p-2 text-gray-300 hover:text-red-400 transition-colors rounded-lg hover:bg-red-50"
                        >
                            <FaTimes size={12} />
                        </button>
                    )}
                </div>
            ))}
            <button
                type="button"
                onClick={add}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary-orange hover:text-orange-600 transition-colors mt-1"
            >
                <FaPlus size={9} /> Add {placeholder}
            </button>
        </div>
    );
}

function SectionCard({ title, icon: Icon, children, defaultOpen = true }: {
    title: string; icon: React.ElementType; children: React.ReactNode; defaultOpen?: boolean;
}) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between px-6 py-5 hover:bg-[#F8FAFC] transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-orange/10 flex items-center justify-center">
                        <Icon size={14} className="text-primary-orange" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary-dark">{title}</span>
                </div>
                <FaGripLines size={12} className={`text-gray-300 transition-transform ${open ? '' : 'rotate-90'}`} />
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 pb-6 space-y-5 border-t border-gray-50">
                            <div className="pt-4">{children}</div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function Toast({ message, type = 'success' }: { message: string; type?: 'success' | 'error' }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            className={`fixed top-6 right-6 z-[400] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white ${type === 'error' ? 'bg-red-600' : 'bg-primary-dark'
                }`}
        >
            {type === 'error' ? <FaExclamationTriangle className="text-red-300" /> : <FaCheck className="text-green-400" />}
            {message}
        </motion.div>
    );
}

// ─── Tab: Details ─────────────────────────────────────────────────────────────
function DetailsTab({ form, setForm }: { form: FormState; setForm: React.Dispatch<React.SetStateAction<FormState>> }) {
    const categories = projectStyleService.getCategories();
    const statusOptions = projectStyleService.getStatusOptions();

    return (
        <div className="space-y-5">
            <div className="flex items-start gap-3 bg-primary-orange/5 border border-primary-orange/20 rounded-xl p-4">
                <FaInfoCircle size={14} className="text-primary-orange mt-0.5 shrink-0" />
                <p className="text-[10px] font-bold text-primary-dark leading-relaxed">
                    <span className="font-black">Style Schema Detected.</span> All fields are mapped directly to the public <span className="text-primary-orange">ProjectCard</span> component. Projects created here will appear identically on the public <span className="text-primary-orange">/projects</span> page.
                </p>
            </div>

            <SectionCard title="Project Identity" icon={FaLayerGroup}>
                <div className="space-y-4">
                    <div>
                        <FieldLabel>Project Title *</FieldLabel>
                        <TextInput value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} placeholder="e.g. Enterprise ERP Deployment" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <FieldLabel>Industry / Sector *</FieldLabel>
                            <TextInput value={form.industry} onChange={v => setForm(f => ({ ...f, industry: v }))} placeholder="e.g. Financial Services" />
                        </div>
                        <div>
                            <FieldLabel>Client / Organization</FieldLabel>
                            <TextInput value={form.client} onChange={v => setForm(f => ({ ...f, client: v }))} placeholder="e.g. Zenith Bank Plc (optional)" />
                        </div>
                    </div>
                    <div>
                        <FieldLabel>Location</FieldLabel>
                        <TextInput value={form.location} onChange={v => setForm(f => ({ ...f, location: v }))} placeholder="e.g. Lagos, Nigeria" />
                    </div>
                </div>
            </SectionCard>

            <SectionCard title="Category & Status" icon={FaBriefcase}>
                <div className="space-y-4">
                    <div>
                        <FieldLabel>Pillar Category *</FieldLabel>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setForm(f => ({ ...f, category: cat.id }))}
                                    className={`text-left px-4 py-3.5 rounded-xl border transition-all ${form.category === cat.id
                                        ? 'bg-primary-dark text-white border-primary-dark shadow-lg'
                                        : 'bg-[#F8FAFC] text-primary-dark border-gray-100 hover:border-primary-orange/40'
                                        }`}
                                >
                                    <p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-60">
                                        {form.category === cat.id ? '✓ Selected' : cat.badge}
                                    </p>
                                    <p className="text-[11px] font-black">{cat.label}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <FieldLabel>Project Status *</FieldLabel>
                        <div className="flex flex-wrap gap-3">
                            {statusOptions.map(s => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setForm(f => ({ ...f, status: s }))}
                                    className={`px-5 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${form.status === s
                                        ? STATUS_COLORS[s]
                                        : 'bg-[#F8FAFC] text-gray-400 border-gray-100 hover:border-primary-orange/30'
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center justify-between bg-[#F8FAFC] rounded-xl px-5 py-4">
                        <div>
                            <p className="text-[10px] font-black text-primary-dark uppercase tracking-widest">Featured Project</p>
                            <p className="text-[9px] text-gray-400 font-bold mt-0.5">Highlighted with a star badge in admin view</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setForm(f => ({ ...f, featured: !f.featured }))}
                            className={`p-3 rounded-xl transition-all ${form.featured ? 'bg-primary-orange text-white shadow-lg' : 'bg-white text-gray-300 border border-gray-100'}`}
                        >
                            {form.featured ? <FaStar size={16} /> : <FaRegStar size={16} />}
                        </button>
                    </div>
                </div>
            </SectionCard>

            <SectionCard title="Timeline" icon={FaCalendarAlt}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <FieldLabel>Duration (Display) *</FieldLabel>
                        <TextInput value={form.duration} onChange={v => setForm(f => ({ ...f, duration: v }))} placeholder="e.g. 6 Months" />
                    </div>
                    <div>
                        <FieldLabel>Start Date</FieldLabel>
                        <TextInput type="date" value={form.startDate} onChange={v => setForm(f => ({ ...f, startDate: v }))} />
                    </div>
                    <div>
                        <FieldLabel>Completion Date</FieldLabel>
                        <TextInput type="date" value={form.endDate} onChange={v => setForm(f => ({ ...f, endDate: v }))} />
                    </div>
                </div>
            </SectionCard>

            <SectionCard title="Project Description" icon={FaInfoCircle}>
                <div>
                    <FieldLabel>Short Description * (shown on card)</FieldLabel>
                    <TextareaInput
                        value={form.description}
                        onChange={v => setForm(f => ({ ...f, description: v }))}
                        placeholder="A concise, 1-2 sentence summary shown directly on the public project card."
                        rows={3}
                    />
                    <p className="text-[9px] text-gray-400 font-bold mt-2 ml-1">This text maps directly to the <span className="text-primary-orange">ProjectCard</span> body paragraph.</p>
                </div>
            </SectionCard>

            <SectionCard title="Deliverables / Scope" icon={FaCheckCircle}>
                <div>
                    <p className="text-[9px] text-gray-400 font-bold mb-4 leading-relaxed">
                        These items appear as a checklist on the public project card under "Deliverables / Scope". Each entry renders with an orange checkmark icon.
                    </p>
                    <DynamicList
                        items={form.deliverables}
                        onChange={v => setForm(f => ({ ...f, deliverables: v }))}
                        placeholder="Deliverable"
                        icon={FaCheckCircle}
                    />
                </div>
            </SectionCard>

            <SectionCard title="Objectives" icon={FaBullseye} defaultOpen={false}>
                <DynamicList items={form.objectives} onChange={v => setForm(f => ({ ...f, objectives: v }))} placeholder="Objective" icon={FaBullseye} />
            </SectionCard>

            <SectionCard title="Technologies Used" icon={FaCode} defaultOpen={false}>
                <DynamicList items={form.technologies} onChange={v => setForm(f => ({ ...f, technologies: v }))} placeholder="Technology" icon={FaCode} />
            </SectionCard>

            <SectionCard title="Key Achievements" icon={FaTrophy} defaultOpen={false}>
                <DynamicList items={form.achievements} onChange={v => setForm(f => ({ ...f, achievements: v }))} placeholder="Achievement" icon={FaTrophy} />
            </SectionCard>
        </div>
    );
}

// ─── Tab: Media ───────────────────────────────────────────────────────────────
function MediaTab({ form, setForm }: { form: FormState; setForm: React.Dispatch<React.SetStateAction<FormState>> }) {
    const addGalleryImage = () => {
        setForm(f => ({ ...f, gallery: [...f.gallery, { url: '', caption: '' }] }));
    };
    const updateGallery = (idx: number, field: keyof GalleryImage, val: string) => {
        setForm(f => {
            const next = [...f.gallery];
            next[idx] = { ...next[idx], [field]: val };
            return { ...f, gallery: next };
        });
    };
    const removeGallery = (idx: number) => {
        setForm(f => ({ ...f, gallery: f.gallery.filter((_, i) => i !== idx) }));
    };

    return (
        <div className="space-y-5">
            <SectionCard title="Cover Image" icon={FaImage}>
                <div className="space-y-3">
                    <ImageUploadField
                        value={form.image}
                        onChange={v => setForm(f => ({ ...f, image: v }))}
                        placeholder="https://... or /projects/image.png"
                        previewHeightClass="h-52"
                    />
                    <p className="text-[9px] text-gray-400 font-bold ml-1">
                        This image fills the <span className="text-primary-orange">16:10 card header</span> with a zoom-on-hover effect, matching the public project card exactly.
                    </p>
                </div>
            </SectionCard>

            <SectionCard title="Gallery Images" icon={FaListUl} defaultOpen={false}>
                <div className="space-y-4">
                    <p className="text-[9px] text-gray-400 font-bold leading-relaxed">
                        Additional images for the detailed project view. Order determines display sequence.
                    </p>

                    {form.gallery.length === 0 && (
                        <div className="border-2 border-dashed border-gray-100 rounded-xl py-10 text-center">
                            <FaImage size={24} className="text-gray-200 mx-auto mb-3" />
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">No gallery images yet</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        {form.gallery.map((img, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-[#F8FAFC] rounded-xl p-4 border border-gray-100 space-y-3"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                                        Image {idx + 1}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => removeGallery(idx)}
                                        className="p-1.5 text-gray-300 hover:text-red-400 transition-colors rounded-lg hover:bg-red-50"
                                    >
                                        <FaTimes size={10} />
                                    </button>
                                </div>
                                <ImageUploadField
                                    value={img.url}
                                    onChange={v => updateGallery(idx, 'url', v)}
                                    placeholder="/projects/image.jpg or https://..."
                                    previewHeightClass="h-32"
                                />
                                <TextInput
                                    value={img.caption}
                                    onChange={v => updateGallery(idx, 'caption', v)}
                                    placeholder="Image caption (optional)"
                                />
                            </motion.div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={addGalleryImage}
                        className="w-full py-3 border-2 border-dashed border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:border-primary-orange/40 hover:text-primary-orange transition-all flex items-center justify-center gap-2"
                    >
                        <FaPlus size={10} /> Add Gallery Image
                    </button>
                </div>
            </SectionCard>
        </div>
    );
}

// ─── Tab: Preview ─────────────────────────────────────────────────────────────
function PreviewTab({ form }: { form: FormState }) {
    const hasMinimumData = form.title && form.image && form.description;

    if (!hasMinimumData) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
                <FaEye size={36} className="text-gray-200 mx-auto mb-4" />
                <h3 className="text-sm font-black text-primary-dark uppercase tracking-tighter mb-2">Preview Unavailable</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    Fill in <span className="text-primary-orange">Title</span>, <span className="text-primary-orange">Description</span>, and <span className="text-primary-orange">Cover Image</span> to see a live preview.
                </p>
            </div>
        );
    }

    const previewProject = {
        title: form.title || 'Project Title',
        industry: form.industry || 'Industry',
        duration: form.duration || 'Duration',
        location: form.location || 'Location',
        description: form.description,
        deliverables: form.deliverables.filter(Boolean),
        image: form.image,
        index: 0,
    };

    return (
        <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                        <FaCheck size={16} className="text-green-600" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary-dark mb-1">Live Style Preview</p>
                        <p className="text-[10px] text-gray-400 font-bold leading-relaxed">
                            This is the <span className="text-primary-orange font-black">exact</span> <code className="bg-gray-100 px-1.5 py-0.5 rounded text-[9px]">ProjectCard</code> component — the same one rendered on the public <span className="text-primary-orange font-black">/projects</span> page. No simulated styling.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-sm mx-auto">
                <ProjectCard {...previewProject} slug="preview-slug" />
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-[#F8FAFC] border-b border-gray-100">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Project Schema Summary</span>
                </div>
                <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-5">
                    {[
                        { label: 'Category', value: form.category || '—' },
                        { label: 'Status', value: form.status },
                        { label: 'Industry', value: form.industry || '—' },
                        { label: 'Location', value: form.location || '—' },
                        { label: 'Duration', value: form.duration || '—' },
                        { label: 'Deliverables', value: `${form.deliverables.filter(Boolean).length} items` },
                        { label: 'Objectives', value: `${form.objectives.filter(Boolean).length} items` },
                        { label: 'Technologies', value: `${form.technologies.filter(Boolean).length} tagged` },
                        { label: 'Featured', value: form.featured ? 'Yes ★' : 'No' },
                    ].map(item => (
                        <div key={item.label}>
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">{item.label}</p>
                            <p className="text-[11px] font-black text-primary-dark truncate">{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Tab: Publish ─────────────────────────────────────────────────────────────
function PublishTab({
    form, onSaveDraft, onPublish, isSaving, isPublishing, isEdit
}: {
    form: FormState;
    onSaveDraft: () => Promise<void>;
    onPublish: () => Promise<void>;
    isSaving: boolean;
    isPublishing: boolean;
    isEdit: boolean;
}) {
    const issues: string[] = [];
    if (!form.title) issues.push('Project title is required');
    if (!form.category) issues.push('Pillar category must be selected');
    if (!form.description) issues.push('Short description is required');
    if (!form.image) issues.push('Cover image URL is required');
    if (!form.industry) issues.push('Industry / Sector is required');
    if (!form.duration) issues.push('Duration is required');

    const ready = issues.length === 0;

    return (
        <div className="space-y-5">
            <div className={`rounded-2xl border p-6 ${ready ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${ready ? 'bg-green-100' : 'bg-amber-100'}`}>
                        {ready
                            ? <FaCheck size={16} className="text-green-600" />
                            : <FaExclamationTriangle size={16} className="text-amber-600" />
                        }
                    </div>
                    <div>
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${ready ? 'text-green-700' : 'text-amber-700'}`}>
                            {ready ? (isEdit ? 'Ready to Update' : 'Ready to Publish') : `${issues.length} Required Field${issues.length > 1 ? 's' : ''} Missing`}
                        </p>
                        {!ready && (
                            <ul className="space-y-1">
                                {issues.map(i => (
                                    <li key={i} className="flex items-center gap-2 text-[10px] font-bold text-amber-800">
                                        <span className="w-1 h-1 rounded-full bg-amber-500" /> {i}
                                    </li>
                                ))}
                            </ul>
                        )}
                        {ready && (
                            <p className="text-[10px] font-bold text-green-700">
                                All required fields are complete. The project will appear immediately on the public /projects page.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-[#F8FAFC] border-b border-gray-100 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Publication Summary</span>
                    {form.updatedAt && (
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 text-right">
                            Last Updated: {new Date(form.updatedAt).toLocaleTimeString()}
                        </span>
                    )}
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex items-start gap-4">
                        {form.image && (
                            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${form.image})` }} />
                            </div>
                        )}
                        <div>
                            <h3 className="text-sm font-black text-primary-dark mb-1">{form.title || '(Untitled Project)'}</h3>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {form.category && (
                                    <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 bg-primary-orange text-white rounded-full">
                                        {form.category.split('&')[0].trim()}
                                    </span>
                                )}
                                <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${STATUS_COLORS[form.status]}`}>
                                    {form.status}
                                </span>
                                {form.featured && (
                                    <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full flex items-center gap-1">
                                        <FaStar size={8} /> Featured
                                    </span>
                                )}
                            </div>
                            <p className="text-[10px] text-gray-500 font-medium line-clamp-2">{form.description}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-50">
                        <div className="text-center">
                            <p className="text-xl font-black text-primary-dark">{form.deliverables.filter(Boolean).length}</p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Deliverables</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xl font-black text-primary-dark">{form.gallery.filter(g => g.url).length}</p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Gallery Images</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xl font-black text-primary-dark">{form.technologies.filter(Boolean).length}</p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Technologies</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        type="button"
                        onClick={onSaveDraft}
                        disabled={isSaving || isPublishing}
                        className="flex-1 flex items-center justify-center gap-3 py-4 rounded-xl border-2 border-primary-dark text-primary-dark hover:bg-primary-dark hover:text-white text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                    >
                        {isSaving ? (
                            <><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> Saving…</>
                        ) : (
                            <><FaSave size={13} /> {isEdit ? 'Save Changes as Draft' : 'Save as Draft'}</>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={onPublish}
                        disabled={!ready || isSaving || isPublishing}
                        className="flex-1 flex items-center justify-center gap-3 py-4 rounded-xl bg-primary-orange hover:bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-40 shadow-xl shadow-primary-orange/30"
                    >
                        {isPublishing ? (
                            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> {isEdit ? 'Updating…' : 'Publishing…'}</>
                        ) : (
                            <><FaRocket size={13} /> {isEdit ? 'Update & Publish' : 'Publish to Portfolio'}</>
                        )}
                    </button>
                </div>
                <p className="text-[9px] text-gray-400 font-bold text-center mt-4 uppercase tracking-widest">
                    Published projects appear immediately on the public&nbsp;
                    <span className="text-primary-orange">/projects</span>&nbsp;page
                </p>
            </div>
        </div>
    );
}

// ─── Main Form Component ──────────────────────────────────────────────────────
interface ProjectFormProps {
    initialData?: Project;
    isEdit?: boolean;
}

export default function ProjectForm({ initialData, isEdit = false }: ProjectFormProps) {
    const router = useRouter();
    const [tab, setTab] = useState<Tab>('details');
    const [form, setForm] = useState<FormState>(getDefaultForm(initialData));
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const buildProject = (): Omit<Project, 'id'> => ({
        title: form.title,
        industry: form.industry,
        duration: form.duration,
        location: form.location,
        description: form.description,
        deliverables: form.deliverables.filter(Boolean),
        image: form.image,
        category: form.category,
        featured: form.featured,
        status: form.status,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
        client: form.client || undefined,
        objectives: form.objectives.filter(Boolean),
        technologies: form.technologies.filter(Boolean),
        achievements: form.achievements.filter(Boolean),
        gallery: form.gallery.filter(g => g.url),
        publicationStatus: form.publicationStatus,
        slug: form.slug || (form.title ? form.title.toLowerCase().replace(/ /g, '-') : ''),
    });

    const handleSaveDraft = async () => {
        setIsSaving(true);
        try {
            const projectData = buildProject();
            projectData.publicationStatus = 'DRAFT';
            if (isEdit && form.id) {
                await updateProjectAction(form.id, projectData);
                showToast('Draft updated successfully.');
            } else {
                await createProjectAction(projectData as any);
                showToast('Draft saved successfully.');
            }
        } catch {
            showToast('Failed to save draft.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handlePublish = async () => {
        setIsPublishing(true);
        try {
            const projectData = buildProject();
            projectData.publicationStatus = 'PUBLISHED';
            if (isEdit && form.id) {
                await updateProjectAction(form.id, projectData);
                showToast('Project updated successfully!');
            } else {
                await createProjectAction(projectData as any);
                showToast('Project published to portfolio!');
            }
            setTimeout(() => router.push('/admin/dashboard/projects'), 1000);
        } catch {
            showToast('Failed to publish project.', 'error');
            setIsPublishing(false);
        }
    };

    const tabIndex = TABS.findIndex(t => t.id === tab);

    return (
        <div className="space-y-8 pb-16">
            <AnimatePresence>
                {toast && <Toast message={toast.msg} type={toast.type} />}
            </AnimatePresence>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <button
                        onClick={() => router.push('/admin/dashboard/projects')}
                        className="p-3 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-primary-dark hover:border-gray-200 transition-all shadow-sm"
                    >
                        <FaArrowLeft size={14} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-primary-dark uppercase tracking-tighter mb-1">
                            {isEdit ? 'Edit' : 'Initialize'} <span className="text-primary-orange">Project</span>
                        </h1>
                        <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                            Style-Aware Project {isEdit ? 'Editor' : 'Creation'} · Portfolio System
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {TABS.map((t, i) => (
                        <React.Fragment key={t.id}>
                            <button
                                onClick={() => setTab(t.id)}
                                className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${tab === t.id
                                    ? 'bg-primary-dark text-white'
                                    : i < tabIndex
                                        ? 'bg-primary-orange/10 text-primary-orange'
                                        : 'bg-white text-gray-300 border border-gray-100'
                                    }`}
                            >
                                {i < tabIndex && '✓ '}{t.label}
                            </button>
                            {i < TABS.length - 1 && (
                                <div className={`w-8 h-[2px] transition-colors ${i < tabIndex ? 'bg-primary-orange' : 'bg-gray-100'}`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={tab}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                >
                    {tab === 'details' && <DetailsTab form={form} setForm={setForm} />}
                    {tab === 'media' && <MediaTab form={form} setForm={setForm} />}
                    {tab === 'preview' && <PreviewTab form={form} />}
                    {tab === 'publish' && (
                        <PublishTab
                            form={form}
                            onSaveDraft={handleSaveDraft}
                            onPublish={handlePublish}
                            isSaving={isSaving}
                            isPublishing={isPublishing}
                            isEdit={isEdit}
                        />
                    )}
                </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <button
                    onClick={() => setTab(TABS[Math.max(0, tabIndex - 1)].id)}
                    disabled={tabIndex === 0}
                    className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-100 text-primary-dark rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:border-gray-200 transition-all shadow-sm"
                >
                    <FaArrowLeft size={10} /> Previous
                </button>
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-300">
                    Step {tabIndex + 1} of {TABS.length}
                </span>
                {tabIndex < TABS.length - 1 ? (
                    <button
                        onClick={() => setTab(TABS[tabIndex + 1].id)}
                        className="flex items-center gap-3 px-6 py-3 bg-primary-dark hover:bg-primary-orange text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg"
                    >
                        Next <FaArrowRight size={10} />
                    </button>
                ) : (
                    <button
                        onClick={handlePublish}
                        disabled={isPublishing || isSaving}
                        className="flex items-center gap-3 px-6 py-3 bg-primary-orange hover:bg-orange-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg disabled:opacity-50"
                    >
                        <FaRocket size={10} /> {isEdit ? 'Update' : 'Publish'}
                    </button>
                )}
            </div>
        </div>
    );
}
