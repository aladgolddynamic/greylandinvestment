'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
    FaEye, FaArrowLeft, FaSave, FaCheck, FaExclamationTriangle,
    FaPaperPlane, FaImage, FaQuoteLeft, FaBold, FaItalic, FaUnderline,
    FaListUl, FaListOl, FaHeading, FaAlignJustify, FaLightbulb,
    FaParagraph, FaTimes, FaCalendarAlt, FaClock, FaTag
} from 'react-icons/fa';
import { NewsBlock, BlockType, NewsArticle } from '@/types/news';
import { createArticleAction, updateArticleAction } from '@/lib/actions/newsActions';
import {
    ArticleH2,
    ArticleH3,
    ArticleP,
    ArticleQuote,
    ArticleCallout,
    ArticleList,
} from '@/components/News/ArticleElements';
import ImageUploadField from '@/components/Admin/ImageUploadField';
import { slugify } from '@/utils/slugify';

// ─── Block Types ──────────────────────────────────────────────────────────────
interface LocalBlock extends NewsBlock { }

const uid = () => `blk-${Math.random().toString(36).slice(2)}`;

// ─── Block Config ─────────────────────────────────────────────────────────────
const BLOCK_LABELS: Record<BlockType, string> = {
    paragraph: 'Paragraph',
    h2: 'Section Heading',
    h3: 'Sub-heading',
    quote: 'Pull Quote',
    callout: 'Callout Box',
    'bullet-list': 'Bullet List',
    'number-list': 'Numbered List',
    divider: 'Divider',
};

// ─── Live Preview of a single block ──────────────────────────────────────────
function LocalBlockPreview({ block }: { block: LocalBlock }) {
    const lines = block.content.split('\n').filter(l => l.trim());
    switch (block.type) {
        case 'h2':
            return <ArticleH2>{block.content || 'Section Heading'}</ArticleH2>;
        case 'h3':
            return <ArticleH3>{block.content || 'Sub-heading'}</ArticleH3>;
        case 'paragraph':
            return <ArticleP>{block.content || 'Start writing your paragraph…'}</ArticleP>;
        case 'quote':
            return <ArticleQuote>{block.content || 'Your pull quote here…'}</ArticleQuote>;
        case 'callout':
            return (
                <ArticleCallout title={block.calloutTitle || 'Key Insight'}>
                    <p className="m-0">{block.content || 'Callout body text…'}</p>
                </ArticleCallout>
            );
        case 'bullet-list':
            return <ArticleList type="bullet" items={lines.length ? lines : ['List item']} />;
        case 'number-list':
            return <ArticleList type="number" items={lines.length ? lines : ['List item']} />;
        case 'divider':
            return <hr className="my-16 border-t-2 border-gray-100" />;
        default:
            return null;
    }
}

// ─── LocalBlock Editor ─────────────────────────────────────────────────────────────
function LocalBlockEditor({
    block, onChange, onDelete, onMoveUp, onMoveDown,
    isFirst, isLast,
}: {
    block: LocalBlock;
    onChange: (b: LocalBlock) => void;
    onDelete: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    isFirst: boolean;
    isLast: boolean;
}) {
    const labelColor: Record<BlockType, string> = {
        paragraph: 'text-gray-400',
        h2: 'text-primary-dark',
        h3: 'text-primary-orange',
        quote: 'text-blue-500',
        callout: 'text-purple-600',
        'bullet-list': 'text-green-600',
        'number-list': 'text-green-600',
        divider: 'text-gray-300',
    };

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const autoResize = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    if (block.type === 'divider') {
        return (
            <div className="group relative flex items-center gap-3 py-2">
                <hr className="flex-1 border-t-2 border-dashed border-gray-200" />
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-300">Divider</span>
                <hr className="flex-1 border-t-2 border-dashed border-gray-200" />
                <LocalBlockActions onDelete={onDelete} onMoveUp={onMoveUp} onMoveDown={onMoveDown} isFirst={isFirst} isLast={isLast} />
            </div>
        );
    }

    return (
        <div className="group relative rounded-2xl border border-gray-100 bg-white overflow-visible hover:border-primary-orange/20 hover:shadow-sm transition-all">
            <div className="flex items-center justify-between px-4 pt-3 pb-1">
                <span className={`text-[9px] font-black uppercase tracking-[0.25em] ${labelColor[block.type]}`}>
                    {BLOCK_LABELS[block.type]}
                </span>
                <LocalBlockActions onDelete={onDelete} onMoveUp={onMoveUp} onMoveDown={onMoveDown} isFirst={isFirst} isLast={isLast} />
            </div>

            <div className="px-4 pb-4 space-y-2">
                {block.type === 'callout' && (
                    <input
                        type="text"
                        value={block.calloutTitle || ''}
                        onChange={e => onChange({ ...block, calloutTitle: e.target.value })}
                        placeholder="Callout title (e.g. Key Insight)"
                        className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl px-4 py-2.5 text-[11px] font-black uppercase tracking-widest text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    />
                )}
                <textarea
                    ref={textareaRef}
                    value={block.content}
                    onChange={e => { onChange({ ...block, content: e.target.value }); autoResize(); }}
                    onFocus={autoResize}
                    rows={block.type === 'paragraph' ? 3 : 2}
                    placeholder={
                        block.type === 'paragraph' ? 'Write your paragraph text here…' :
                            block.type === 'h2' ? 'Section heading…' :
                                block.type === 'h3' ? 'Sub-section heading…' :
                                    block.type === 'quote' ? 'Write a powerful pull quote…' :
                                        block.type === 'callout' ? 'Key message or insight to highlight…' :
                                            'One item per line…'
                    }
                    className={`w-full resize-none bg-transparent border-none focus:outline-none font-bold text-primary-dark leading-relaxed overflow-hidden
                        ${block.type === 'h2' ? 'text-2xl font-black uppercase tracking-tight' : ''}
                        ${block.type === 'h3' ? 'text-xl font-black text-primary-orange' : ''}
                        ${block.type === 'paragraph' ? 'text-base leading-[1.8] text-gray-700' : ''}
                        ${block.type === 'quote' ? 'text-xl italic text-primary-dark' : ''}
                        ${block.type === 'callout' ? 'text-base text-white/90' : ''}
                        ${block.type === 'bullet-list' || block.type === 'number-list' ? 'text-base text-gray-700 font-mono' : ''}
                    `}
                />
            </div>
        </div>
    );
}

// ─── LocalBlock Actions (move / delete) ───────────────────────────────────────────
function LocalBlockActions({ onDelete, onMoveUp, onMoveDown, isFirst, isLast }:
    { onDelete: () => void; onMoveUp: () => void; onMoveDown: () => void; isFirst: boolean; isLast: boolean }
) {
    return (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {!isFirst && (
                <button onClick={onMoveUp} className="w-7 h-7 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-primary-dark text-[10px] font-black transition-all flex items-center justify-center" title="Move up">↑</button>
            )}
            {!isLast && (
                <button onClick={onMoveDown} className="w-7 h-7 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-primary-dark text-[10px] font-black transition-all flex items-center justify-center" title="Move down">↓</button>
            )}
            <button onClick={onDelete} className="w-7 h-7 bg-red-50 hover:bg-red-100 rounded-lg text-red-400 flex items-center justify-center transition-all" title="Delete block">
                <FaTimes size={10} />
            </button>
        </div>
    );
}

// ─── LocalBlock Inserter ───────────────────────────────────────────────────────────
function LocalBlockInserter({ onAdd }: { onAdd: (type: BlockType) => void }) {
    const [open, setOpen] = useState(false);

    const blockOptions: { type: BlockType; icon: any; label: string; desc: string; color: string }[] = [
        { type: 'paragraph', icon: FaParagraph, label: 'Paragraph', desc: 'Body text (21px / justify)', color: 'text-gray-500' },
        { type: 'h2', icon: FaHeading, label: 'Section Heading', desc: 'H2 — Bold uppercase, large', color: 'text-primary-dark' },
        { type: 'h3', icon: FaHeading, label: 'Sub-heading', desc: 'H3 — Orange accent heading', color: 'text-primary-orange' },
        { type: 'quote', icon: FaQuoteLeft, label: 'Pull Quote', desc: 'Orange left-border italic', color: 'text-blue-500' },
        { type: 'callout', icon: FaLightbulb, label: 'Callout Box', desc: 'Dark bg + orange border panel', color: 'text-purple-600' },
        { type: 'bullet-list', icon: FaListUl, label: 'Bullet List', desc: 'Orange marker list', color: 'text-green-600' },
        { type: 'number-list', icon: FaListOl, label: 'Numbered List', desc: 'Orange number list', color: 'text-green-600' },
        { type: 'divider', icon: FaAlignJustify, label: 'Divider', desc: 'Horizontal section break', color: 'text-gray-300' },
    ];

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-center gap-3 py-3 border-2 border-dashed border-gray-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:border-primary-orange hover:text-primary-orange transition-all group"
            >
                <span className="w-6 h-6 rounded-full bg-gray-100 group-hover:bg-primary-orange group-hover:text-white flex items-center justify-center text-sm font-black transition-all">+</span>
                Add Content Block
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        className="absolute bottom-full mb-2 left-0 right-0 bg-white rounded-2xl border border-gray-100 shadow-2xl p-4 z-20 grid grid-cols-2 gap-2"
                    >
                        {blockOptions.map(opt => (
                            <button
                                key={opt.type}
                                onClick={() => { onAdd(opt.type); setOpen(false); }}
                                className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#F8FAFC] text-left transition-all group/btn"
                            >
                                <opt.icon className={`${opt.color} mt-0.5 shrink-0`} size={14} />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary-dark group-hover/btn:text-primary-orange transition-colors">{opt.label}</p>
                                    <p className="text-[9px] font-medium text-gray-400 mt-0.5">{opt.desc}</p>
                                </div>
                            </button>
                        ))}
                        <button onClick={() => setOpen(false)} className="col-span-2 text-center text-[9px] font-black uppercase tracking-widest text-gray-300 hover:text-gray-400 py-1">Dismiss</button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── Slug generator ───────────────────────────────────────────────────────────
const toSlug = (title: string) => slugify(title);

interface NewsFormProps {
    initialData?: NewsArticle;
    isEdit?: boolean;
}

// ─── Main Form Component ────────────────────────────────────────────────────────
export default function NewsForm({ initialData, isEdit = false }: NewsFormProps) {
    const router = useRouter();

    const [meta, setMeta] = useState({
        title: initialData?.title || '',
        category: initialData?.category || '',
        excerpt: initialData?.excerpt || '',
        image: initialData?.image || '',
        featured: initialData?.featured || false,
        slug: initialData?.slug || '', // Option B: Preserve explicitly unless auto-generating
    });

    const [blocks, setLocalBlocks] = useState<LocalBlock[]>(
        initialData?.contentBlocks || [{ id: uid(), type: 'paragraph', content: '' }]
    );
    const [showPreview, setShowPreview] = useState(false);
    const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>(initialData?.status || 'DRAFT');
    const [isSaving, setIsSaving] = useState(false);
    const [saveState, setSaveState] = useState<'idle' | 'success' | 'error'>('idle');
    const [saveMsg, setSaveMsg] = useState('');

    // Auto-save logic
    useEffect(() => {
        if (!isEdit || !meta.title.trim()) return;

        const interval = setInterval(() => {
            // Silently save draft if we haven't explicitely been saving
            if (!isSaving && saveState !== 'error') {
                handleSave(status, true);
            }
        }, 30000); // 30s auto-save

        return () => clearInterval(interval);
    }, [meta, blocks, status, isSaving, saveState, isEdit]);

    // ── LocalBlock operations ──
    const updateLocalBlock = useCallback((id: string, updated: LocalBlock) => {
        setLocalBlocks(prev => prev.map(b => b.id === id ? updated : b));
    }, []);

    const addLocalBlock = useCallback((type: BlockType, afterId?: string) => {
        const newLocalBlock: LocalBlock = { id: uid(), type, content: '' };
        setLocalBlocks(prev => {
            if (!afterId) return [...prev, newLocalBlock];
            const idx = prev.findIndex(b => b.id === afterId);
            const next = [...prev];
            next.splice(idx + 1, 0, newLocalBlock);
            return next;
        });
    }, []);

    const deleteLocalBlock = useCallback((id: string) => {
        setLocalBlocks(prev => prev.length > 1 ? prev.filter(b => b.id !== id) : prev);
    }, []);

    const moveLocalBlock = useCallback((id: string, dir: -1 | 1) => {
        setLocalBlocks(prev => {
            const idx = prev.findIndex(b => b.id === id);
            const nextIdx = idx + dir;
            if (nextIdx < 0 || nextIdx >= prev.length) return prev;
            const next = [...prev];
            [next[idx], next[nextIdx]] = [next[nextIdx], next[idx]];
            return next;
        });
    }, []);

    // ── Save ──
    const handleSave = async (publishStatus: 'DRAFT' | 'PUBLISHED', isAutoSave = false) => {
        if (!meta.title.trim()) {
            if (!isAutoSave) {
                setSaveMsg('Please add an article title.');
                setSaveState('error');
            }
            return;
        }

        if (!isAutoSave) setIsSaving(true);
        if (!isAutoSave) setSaveState('idle');

        try {
            const now = new Date();
            const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const wordCount = blocks.filter(b => b.type === 'paragraph').reduce((acc, b) => acc + b.content.split(' ').length, 0);
            const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

            // For edits, we preserve the original slug unless it's empty
            const currentSlug = isEdit && meta.slug ? meta.slug : toSlug(meta.title);

            const payload = {
                title: meta.title,
                category: meta.category || 'General',
                date: initialData?.date || dateStr,
                readTime,
                image: meta.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000',
                excerpt: meta.excerpt,
                slug: currentSlug,
                contentBlocks: blocks,
                featured: meta.featured,
                status: publishStatus,
            };

            if (isEdit && initialData?.id) {
                await updateArticleAction(initialData.id, payload);
            } else {
                await createArticleAction(payload as any);
                if (!isAutoSave) {
                    setTimeout(() => router.push('/admin/dashboard/news'), 1000);
                }
            }

            if (!isAutoSave) {
                setSaveState('success');
                setSaveMsg(publishStatus === 'PUBLISHED' ?
                    (isEdit ? 'Changes published successfully!' : 'Article published successfully!') :
                    'Draft saved successfully!');
            }
            setStatus(publishStatus);
            if (!isEdit && !isAutoSave) {
                // Keep the slug state updated if auto-generated on creation
                setMeta(prev => ({ ...prev, slug: currentSlug }));
            }

        } catch (err: any) {
            if (!isAutoSave) {
                setSaveState('error');
                setSaveMsg(err.message || 'Save failed.');
            }
        } finally {
            if (!isAutoSave) setIsSaving(false);
        }
    };

    // ── Computed preview ──
    const displaySlug = isEdit && meta.slug ? meta.slug : toSlug(meta.title || 'untitled-article');
    const wordCount = blocks.filter(b => b.type === 'paragraph').reduce((sum, b) => sum + b.content.split(' ').length, 0);
    const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

    return (
        <div className="space-y-0">
            {/* ── Top Bar ── */}
            <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                    <a href="/admin/dashboard/news"
                        className="flex items-center gap-2 text-gray-400 hover:text-primary-dark text-[10px] font-black uppercase tracking-widest transition-colors">
                        <FaArrowLeft size={11} /> News Manager
                    </a>
                    <div className="w-px h-5 bg-gray-200" />
                    <h1 className="text-xl font-black text-primary-dark uppercase tracking-tight">
                        {isEdit ? 'Edit' : 'New'} <span className="text-primary-orange">Article</span>
                        {initialData?.updatedAt && (
                            <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                                Last updated: {new Date(initialData.updatedAt).toLocaleTimeString()}
                            </span>
                        )}
                    </h1>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${showPreview ? 'bg-primary-dark text-white border-primary-dark' : 'border-gray-200 text-gray-500 hover:border-primary-dark'}`}
                    >
                        <FaEye size={11} /> {showPreview ? 'Hide Preview' : 'Preview'}
                    </button>
                    <button
                        onClick={() => handleSave('DRAFT')}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 text-primary-dark hover:bg-gray-50 text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                    >
                        <FaSave size={11} /> {isEdit ? 'Save Changes (Draft)' : 'Save Draft'}
                    </button>
                    <button
                        onClick={() => handleSave('PUBLISHED')}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary-orange hover:bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-lg disabled:opacity-50"
                    >
                        {isSaving ? 'Publishing…' : saveState === 'success' && status === 'PUBLISHED' ? <><FaCheck size={11} /> Published</> : <><FaPaperPlane size={11} /> {isEdit ? 'Update & Publish' : 'Publish'}</>}
                    </button>
                </div>
            </div>

            {/* Save feedback */}
            <AnimatePresence>
                {saveState !== 'idle' && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className={`flex items-center gap-3 px-5 py-4 rounded-xl mb-6 text-[10px] font-black uppercase tracking-widest ${saveState === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}
                    >
                        {saveState === 'success' ? <FaCheck size={12} /> : <FaExclamationTriangle size={12} />}
                        {saveMsg}
                        <button className="ml-auto" onClick={() => setSaveState('idle')}><FaTimes size={10} /></button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Split Layout ── */}
            <div className={`flex gap-6 items-start ${showPreview ? 'flex-row' : ''}`}>

                {/* ── EDITOR PANEL ── */}
                <div className={`${showPreview ? 'w-1/2' : 'max-w-3xl w-full mx-auto'} space-y-6`}>

                    {/* Meta fields */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Article Metadata</h2>
                            <span className={`px-2 py-1 rounded-sm text-[8px] font-black uppercase tracking-widest ${status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                Current Status: {status}
                            </span>
                        </div>

                        {/* Title */}
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary-dark ml-1 mb-2 block">Title *</label>
                            <input
                                type="text"
                                value={meta.title}
                                onChange={e => setMeta({ ...meta, title: e.target.value })}
                                placeholder="Write a powerful article title…"
                                className="w-full text-xl font-black text-primary-dark bg-[#F8FAFC] border border-gray-100 rounded-xl py-3.5 px-5 focus:outline-none focus:ring-2 focus:ring-primary-orange/20 transition-all leading-tight tracking-tighter"
                            />
                            {isEdit ? (
                                <div className="mt-1.5 flex items-center gap-2">
                                    <label className="text-[9px] text-gray-400 font-bold ml-1">Slug:</label>
                                    <input
                                        type="text"
                                        value={meta.slug}
                                        onChange={e => setMeta({ ...meta, slug: slugify(e.target.value) })}
                                        className="bg-transparent border-b border-gray-200 text-[10px] font-bold text-primary-orange focus:outline-none focus:border-primary-orange w-64 px-1"
                                    />
                                    <span className="text-[8px] italic text-gray-400">(Edit carefully! May break old links)</span>
                                </div>
                            ) : (
                                <p className="text-[9px] text-gray-400 font-bold mt-1.5 ml-1">Slug: <span className="text-primary-orange">/news/{displaySlug}</span></p>
                            )}
                        </div>

                        {/* Excerpt */}
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary-dark ml-1 mb-2 block">Excerpt / Summary</label>
                            <textarea
                                rows={2}
                                value={meta.excerpt}
                                onChange={e => setMeta({ ...meta, excerpt: e.target.value })}
                                placeholder="Short summary shown on news cards and SEO…"
                                className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-3.5 px-5 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-orange/20 transition-all resize-none leading-relaxed"
                            />
                        </div>

                        {/* Category + Featured + Read time */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary-dark ml-1 mb-2 block"><FaTag className="inline mr-1.5 text-primary-orange" size={9} />Category</label>
                                <input
                                    type="text"
                                    value={meta.category}
                                    onChange={e => setMeta({ ...meta, category: e.target.value })}
                                    placeholder="Technology · Engineering · News…"
                                    className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-3 px-5 text-sm font-bold text-primary-dark focus:outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary-dark ml-1 mb-2 block"><FaClock className="inline mr-1.5 text-primary-orange" size={9} />Est. Read Time</label>
                                <div className="bg-[#F8FAFC] border border-gray-100 rounded-xl py-3 px-5 text-sm font-bold text-gray-400">
                                    {readTime} <span className="text-[9px]">({wordCount} words)</span>
                                </div>
                            </div>
                        </div>

                        {/* Featured Image */}
                        <div>
                            <ImageUploadField
                                label="Featured Image"
                                value={meta.image}
                                onChange={v => setMeta({ ...meta, image: v })}
                                placeholder="https://… or /media/filename.jpg"
                                previewHeightClass="h-44"
                            />
                        </div>

                        {/* Featured toggle */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary-dark">Feature This Article</p>
                                <p className="text-[9px] font-bold text-gray-400 mt-0.5">Pinned to top of the news listing</p>
                            </div>
                            <button
                                onClick={() => setMeta({ ...meta, featured: !meta.featured })}
                                className={`w-12 h-6 rounded-full relative transition-colors ${meta.featured ? 'bg-primary-orange' : 'bg-gray-200'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${meta.featured ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>

                    {/* Content LocalBlocks */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between mb-1">
                            <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Article Body</h2>
                            <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">{blocks.length} block{blocks.length !== 1 ? 's' : ''}</span>
                        </div>

                        {blocks.map((block, i) => (
                            <LocalBlockEditor
                                key={block.id}
                                block={block}
                                onChange={updated => updateLocalBlock(block.id, updated)}
                                onDelete={() => deleteLocalBlock(block.id)}
                                onMoveUp={() => moveLocalBlock(block.id, -1)}
                                onMoveDown={() => moveLocalBlock(block.id, 1)}
                                isFirst={i === 0}
                                isLast={i === blocks.length - 1}
                            />
                        ))}

                        <LocalBlockInserter onAdd={(t) => addLocalBlock(t)} />
                    </div>
                </div>

                {/* ── LIVE PREVIEW PANEL ── */}
                {showPreview && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                        className="w-1/2 sticky top-8 max-h-[calc(100vh-6rem)] overflow-y-auto"
                    >
                        <div className="bg-[#F8FAFC] rounded-2xl border border-gray-100 overflow-hidden shadow-xl">
                            {/* Preview header */}
                            <div className="bg-primary-dark px-5 py-3 flex items-center justify-between">
                                <span className="text-[9px] font-black uppercase tracking-widest text-primary-orange">Live Preview · Public View</span>
                                <div className="flex gap-1.5">
                                    {['bg-red-500', 'bg-amber-400', 'bg-green-500'].map(c => (
                                        <div key={c} className={`w-2.5 h-2.5 rounded-full ${c}`} />
                                    ))}
                                </div>
                            </div>

                            {/* Article shell — mirrors [slug]/page.tsx exactly */}
                            <div className="bg-[#F8FAFC] py-8 px-6">
                                {/* Meta row */}
                                <div className="flex flex-wrap items-center gap-4 mb-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    <span className="bg-primary-orange text-white px-3 py-1 rounded-sm shadow">
                                        {meta.category || 'Category'}
                                    </span>
                                    <span className="flex items-center gap-1.5"><FaCalendarAlt className="text-primary-orange" size={10} />{initialData?.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    <span className="flex items-center gap-1.5"><FaClock className="text-primary-orange" size={10} />{readTime}</span>
                                </div>

                                {/* H1 */}
                                <h1 className="text-2xl lg:text-3xl font-black text-primary-dark tracking-tighter mb-6 leading-[1.15]">
                                    {meta.title || 'Article Title Will Appear Here'}
                                </h1>

                                {/* Featured image */}
                                {meta.image && (
                                    <div className="relative w-full h-48 rounded-[1.5rem] overflow-hidden mb-8 shadow-xl">
                                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${meta.image})` }} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                    </div>
                                )}

                                {/* Body */}
                                <div className="max-w-none">
                                    {blocks.map(block => (
                                        <LocalBlockPreview key={block.id} block={block} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
