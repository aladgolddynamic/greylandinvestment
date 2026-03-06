'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaEnvelope, FaUsers, FaPlus, FaSearch, FaEdit, FaTrash,
    FaPaperPlane, FaDownload, FaCopy, FaEye, FaCheck,
    FaExclamationTriangle, FaSave, FaTimes, FaFileAlt,
    FaToggleOn, FaToggleOff, FaInbox, FaBullhorn, FaNewspaper
} from 'react-icons/fa';
import {
    getSubscribersAction,
    addSubscriberAction,
    updateSubscriberStatusAction,
    removeSubscriberAction,
    getCampaignsAction,
    createCampaignAction,
    updateCampaignAction,
    sendCampaignAction,
    deleteCampaignAction,
    duplicateCampaignAction,
    exportCSVAction
} from '@/lib/actions/newsletterActions';
import {
    Subscriber, SubscriberStatus, SubscriptionSource,
    Campaign, CampaignStatus
} from '@/types/newsletter';
import ImageUploadField from '@/components/Admin/ImageUploadField';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
function relativeDate(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
}

// ─── Badges ───────────────────────────────────────────────────────────────────
function SubscriberBadge({ status }: { status: SubscriberStatus }) {
    const active = status === 'SUBSCRIBED';
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'
            }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-green-500' : 'bg-gray-400'}`} />
            {active ? 'Subscribed' : 'Unsubscribed'}
        </span>
    );
}

function CampaignBadge({ status }: { status: CampaignStatus }) {
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${status === 'SENT'
            ? 'bg-blue-50 text-blue-700 border-blue-200'
            : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
            {status === 'SENT' ? <FaPaperPlane size={8} /> : <FaFileAlt size={8} />}
            {status}
        </span>
    );
}

function SourceBadge({ source }: { source: SubscriptionSource }) {
    const map = { FOOTER: 'Footer', NEWS_PAGE: 'News Page', MANUAL: 'Manual' };
    return (
        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded">
            {map[source]}
        </span>
    );
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────
function ConfirmDialog({ title, message, confirmLabel, danger, onConfirm, onCancel, isLoading }: {
    title: string; message: string; confirmLabel: string;
    danger?: boolean; onConfirm: () => void; onCancel: () => void; isLoading: boolean;
}) {
    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full z-10"
            >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${danger ? 'bg-red-50' : 'bg-amber-50'}`}>
                    <FaExclamationTriangle className={danger ? 'text-red-500' : 'text-amber-500'} size={20} />
                </div>
                <h3 className="text-lg font-black text-primary-dark mb-2">{title}</h3>
                <p className="text-sm text-gray-500 font-medium mb-8">{message}</p>
                <div className="flex gap-3">
                    <button onClick={onCancel} className="flex-1 py-3 rounded-xl border border-gray-200 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-all">Cancel</button>
                    <button onClick={onConfirm} disabled={isLoading} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all disabled:opacity-50 ${danger ? 'bg-red-500 hover:bg-red-600' : 'bg-primary-orange hover:bg-orange-600'}`}>
                        {isLoading ? 'Processing...' : confirmLabel}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message }: { message: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-[400] bg-primary-dark text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest"
        >
            <FaCheck className="text-green-400" /> {message}
        </motion.div>
    );
}

// ─── Simple Rich Text Toolbar ─────────────────────────────────────────────────
function RichTextEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    const ref = useRef<HTMLDivElement>(null);

    const exec = (cmd: string, val?: string) => {
        document.execCommand(cmd, false, val);
        if (ref.current) onChange(ref.current.innerHTML);
    };

    return (
        <div className="border border-gray-100 rounded-xl overflow-hidden">
            <div className="flex flex-wrap gap-1 p-3 bg-[#F8FAFC] border-b border-gray-100">
                {[
                    { label: 'B', cmd: 'bold', title: 'Bold' },
                    { label: 'I', cmd: 'italic', title: 'Italic' },
                    { label: 'U', cmd: 'underline', title: 'Underline' },
                ].map(b => (
                    <button key={b.cmd} type="button" title={b.title} onMouseDown={e => { e.preventDefault(); exec(b.cmd); }}
                        className="w-8 h-8 bg-white border border-gray-200 rounded-lg text-xs font-black text-primary-dark hover:bg-primary-orange hover:text-white hover:border-primary-orange transition-all">
                        {b.label}
                    </button>
                ))}
                <div className="w-px h-8 bg-gray-200 mx-1" />
                {[
                    { label: 'H2', cmd: 'formatBlock', val: 'h2', title: 'Heading 2' },
                    { label: 'H3', cmd: 'formatBlock', val: 'h3', title: 'Heading 3' },
                    { label: 'P', cmd: 'formatBlock', val: 'p', title: 'Paragraph' },
                ].map(b => (
                    <button key={b.label} type="button" title={b.title} onMouseDown={e => { e.preventDefault(); exec(b.cmd, b.val); }}
                        className="px-3 h-8 bg-white border border-gray-200 rounded-lg text-[9px] font-black text-primary-dark hover:bg-primary-orange hover:text-white hover:border-primary-orange transition-all">
                        {b.label}
                    </button>
                ))}
                <div className="w-px h-8 bg-gray-200 mx-1" />
                {[
                    { label: 'UL', cmd: 'insertUnorderedList', title: 'Bullet List' },
                    { label: 'OL', cmd: 'insertOrderedList', title: 'Numbered List' },
                ].map(b => (
                    <button key={b.label} type="button" title={b.title} onMouseDown={e => { e.preventDefault(); exec(b.cmd); }}
                        className="px-3 h-8 bg-white border border-gray-200 rounded-lg text-[9px] font-black text-primary-dark hover:bg-primary-orange hover:text-white hover:border-primary-orange transition-all">
                        {b.label}
                    </button>
                ))}
            </div>
            <div
                ref={ref}
                contentEditable
                suppressContentEditableWarning
                onInput={() => { if (ref.current) onChange(ref.current.innerHTML); }}
                dangerouslySetInnerHTML={{ __html: value }}
                className="min-h-[280px] p-5 text-sm text-primary-dark font-medium focus:outline-none prose prose-sm max-w-none"
                style={{ lineHeight: '1.7' }}
            />
        </div>
    );
}

// ─── Campaign Preview Modal ───────────────────────────────────────────────────
function CampaignPreview({ campaign, onClose }: { campaign: Campaign; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <motion.div
                initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto z-10"
            >
                <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between">
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Email Preview</p>
                        <h3 className="text-sm font-black text-primary-dark">{campaign.subject}</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"><FaTimes size={16} /></button>
                </div>
                {/* Simulated email shell */}
                <div className="p-8">
                    <div className="bg-[#F8FAFC] rounded-xl overflow-hidden border border-gray-100">
                        <div className="bg-primary-dark py-6 px-8">
                            <img src="/logo.png" alt="Greyland" className="h-8 w-auto grayscale invert opacity-80" />
                        </div>
                        {campaign.featuredImage && (
                            <img src={campaign.featuredImage} alt="Featured" className="w-full h-48 object-cover" />
                        )}
                        <div className="p-8 bg-white">
                            <div
                                className="prose prose-sm max-w-none text-primary-dark"
                                dangerouslySetInnerHTML={{ __html: campaign.content }}
                            />
                        </div>
                        <div className="bg-[#F8FAFC] px-8 py-6 text-center">
                            <p className="text-[9px] text-gray-400 font-medium">
                                © {new Date().getFullYear()} Greyland Investment Ltd · Abuja, Nigeria<br />
                                <span className="hover:text-primary-orange cursor-pointer">Unsubscribe</span>
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

// ─── Campaign Editor Panel ────────────────────────────────────────────────────
function CampaignEditor({
    initial, onSave, onCancel,
}: {
    initial?: Campaign;
    onSave: (data: any, send?: boolean) => Promise<void>;
    onCancel: () => void;
}) {
    const [form, setForm] = useState({
        title: initial?.title || '',
        subject: initial?.subject || '',
        content: initial?.content || '<p>Dear Subscriber,</p><p>We have exciting updates to share with you...</p>',
        featuredImage: initial?.featuredImage || '',
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const handleSave = async (send = false) => {
        setError(null);
        if (send) setIsSending(true); else setIsSaving(true);
        try {
            await onSave(form, send);
            setSuccess(true);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsSaving(false);
            setIsSending(false);
        }
    };

    const previewCampaign: Campaign = {
        ...(initial || {} as Campaign),
        ...form,
        id: initial?.id || 'preview',
        status: 'DRAFT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    return (
        <div className="space-y-6">
            {showPreview && <CampaignPreview campaign={previewCampaign} onClose={() => setShowPreview(false)} />}

            <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-primary-dark">
                    {initial ? 'Edit Campaign' : 'New Campaign'}
                </h3>
                <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
                    <FaTimes size={14} />
                </button>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">Campaign Title (Internal)</label>
                    <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                        placeholder="Q2 2026 Company Update"
                        className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-3.5 px-5 text-sm font-bold text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-orange/20 transition-all" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">Email Subject Line</label>
                    <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                        placeholder="Subject the subscriber will see in their inbox"
                        className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-3.5 px-5 text-sm font-bold text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-orange/20 transition-all" />
                </div>
                <div className="space-y-4">
                    <ImageUploadField
                        label="Featured Image (Optional)"
                        value={form.featuredImage}
                        onChange={v => setForm({ ...form, featuredImage: v })}
                        placeholder="https://... or /media/image.jpg"
                        previewHeightClass="h-40"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">Email Content</label>
                    <RichTextEditor value={form.content} onChange={v => setForm({ ...form, content: v })} />
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-3 text-red-500 bg-red-50 p-4 rounded-xl">
                    <FaExclamationTriangle size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{error}</span>
                </div>
            )}

            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowPreview(true)}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-all">
                    <FaEye size={11} /> Preview
                </button>
                <button type="button" onClick={() => handleSave(false)} disabled={isSaving || success}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl border border-primary-dark text-primary-dark hover:bg-primary-dark hover:text-white text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50">
                    {isSaving ? 'Saving...' : success ? <><FaCheck size={11} /> Saved</> : <><FaSave size={11} /> Save Draft</>}
                </button>
                <button type="button" onClick={() => handleSave(true)} disabled={isSending}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-primary-orange hover:bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 ml-auto">
                    {isSending ? 'Sending...' : <><FaPaperPlane size={11} /> Send Newsletter</>}
                </button>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
type PageTab = 'subscribers' | 'campaigns';

export default function NewsletterManager() {
    const [tab, setTab] = useState<PageTab>('subscribers');
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<SubscriberStatus | 'ALL'>('ALL');
    const [toastMsg, setToastMsg] = useState<string | null>(null);

    // Modals
    const [editingSub, setEditingSub] = useState<Subscriber | null>(null);
    const [deleteSub, setDeleteSub] = useState<Subscriber | null>(null);
    const [deleteCamp, setDeleteCamp] = useState<Campaign | null>(null);
    const [sendCamp, setSendCamp] = useState<Campaign | null>(null);
    const [previewCamp, setPreviewCamp] = useState<Campaign | null>(null);
    const [editorTarget, setEditorTarget] = useState<Campaign | 'new' | null>(null);
    const [dialogLoading, setDialogLoading] = useState(false);

    // Add subscriber form
    const [addForm, setAddForm] = useState({ email: '', name: '' });
    const [addError, setAddError] = useState<string | null>(null);
    const [addLoading, setAddLoading] = useState(false);

    const toast = (msg: string) => { setToastMsg(msg); setTimeout(() => setToastMsg(null), 3500); };

    const load = useCallback(async () => {
        setIsLoading(true);
        const [subs, camps] = await Promise.all([getSubscribersAction(), getCampaignsAction()]);
        setSubscribers(subs);
        setCampaigns(camps);
        setIsLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    // ── Subscribers ──
    const filteredSubs = subscribers.filter(s => {
        const q = searchQuery.toLowerCase();
        const matchQ = !q || s.email.toLowerCase().includes(q) || (s.name || '').toLowerCase().includes(q);
        const matchSt = statusFilter === 'ALL' || s.status === statusFilter;
        return matchQ && matchSt;
    });

    const handleAddSub = async (e: React.FormEvent) => {
        e.preventDefault();
        setAddError(null);
        setAddLoading(true);
        try {
            await addSubscriberAction(addForm.email, addForm.name || undefined, 'MANUAL');
            await load();
            setAddForm({ email: '', name: '' });
            toast('Subscriber added.');
        } catch (err: any) {
            setAddError(err.message);
        } finally {
            setAddLoading(false);
        }
    };

    const handleToggleSub = async (sub: Subscriber) => {
        const newStatus: SubscriberStatus = sub.status === 'SUBSCRIBED' ? 'UNSUBSCRIBED' : 'SUBSCRIBED';
        await updateSubscriberStatusAction(sub.id, newStatus);
        await load();
        toast(`Subscriber ${newStatus === 'SUBSCRIBED' ? 'reactivated' : 'unsubscribed'}.`);
    };

    const handleDeleteSub = async () => {
        if (!deleteSub) return;
        setDialogLoading(true);
        await removeSubscriberAction(deleteSub.id);
        await load();
        setDeleteSub(null);
        setDialogLoading(false);
        toast('Subscriber removed.');
    };

    const handleExport = async () => {
        const csv = await exportCSVAction();
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'greyland-subscribers.csv'; a.click();
        URL.revokeObjectURL(url);
        toast('Exported CSV.');
    };

    // ── Campaigns ──
    const handleSaveCampaign = async (data: any, send = false) => {
        if (editorTarget === 'new') {
            const created = await createCampaignAction(data);
            if (send) await sendCampaignAction(created.id);
        } else if (editorTarget) {
            await updateCampaignAction(editorTarget.id, data);
            if (send) await sendCampaignAction(editorTarget.id);
        }
        await load();
        setEditorTarget(null);
        toast(send ? 'Newsletter sent!' : 'Draft saved.');
    };

    const handleSendConfirm = async () => {
        if (!sendCamp) return;
        setDialogLoading(true);
        await sendCampaignAction(sendCamp.id);
        await load();
        setSendCamp(null);
        setDialogLoading(false);
        toast('Newsletter sent!');
    };

    const handleDuplicate = async (camp: Campaign) => {
        await duplicateCampaignAction(camp.id);
        await load();
        toast('Campaign duplicated.');
    };

    const handleDeleteCamp = async () => {
        if (!deleteCamp) return;
        setDialogLoading(true);
        await deleteCampaignAction(deleteCamp.id);
        await load();
        setDeleteCamp(null);
        setDialogLoading(false);
        toast('Campaign deleted.');
    };

    const stats = {
        total: subscribers.length,
        active: subscribers.filter(s => s.status === 'SUBSCRIBED').length,
        newThisWeek: subscribers.filter(s => Date.now() - new Date(s.dateSubscribed).getTime() < 7 * 86400000).length,
        lastSent: campaigns.filter(c => c.status === 'SENT').sort((a, b) => new Date(b.sentAt!).getTime() - new Date(a.sentAt!).getTime())[0],
    };

    return (
        <div className="space-y-8">
            {/* Toast */}
            <AnimatePresence>{toastMsg && <Toast message={toastMsg} />}</AnimatePresence>

            {/* Confirm Dialogs */}
            {deleteSub && <ConfirmDialog title="Remove Subscriber" message={`Remove ${deleteSub.email} from the list?`} confirmLabel="Remove" danger onConfirm={handleDeleteSub} onCancel={() => setDeleteSub(null)} isLoading={dialogLoading} />}
            {deleteCamp && <ConfirmDialog title="Delete Campaign" message={`Delete "${deleteCamp.title}"? This cannot be undone.`} confirmLabel="Delete" danger onConfirm={handleDeleteCamp} onCancel={() => setDeleteCamp(null)} isLoading={dialogLoading} />}
            {sendCamp && (
                <ConfirmDialog
                    title="Send Newsletter"
                    message={`Send "${sendCamp.title}" to ${stats.active} active subscriber${stats.active !== 1 ? 's' : ''}?`}
                    confirmLabel="Send Now"
                    onConfirm={handleSendConfirm}
                    onCancel={() => setSendCamp(null)}
                    isLoading={dialogLoading}
                />
            )}
            {previewCamp && <CampaignPreview campaign={previewCamp} onClose={() => setPreviewCamp(null)} />}

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-primary-dark uppercase tracking-tighter mb-2">
                        Newsletter <span className="text-primary-orange">Manager</span>
                    </h1>
                    <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                        Subscribers · Campaigns · Delivery
                    </p>
                </div>
                <div className="flex gap-3">
                    <button onClick={handleExport} className="flex items-center gap-2 bg-white border border-gray-200 hover:border-primary-orange text-primary-dark px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                        <FaDownload size={11} /> Export CSV
                    </button>
                    <button onClick={() => { setTab('campaigns'); setEditorTarget('new'); }} className="flex items-center gap-3 bg-primary-dark hover:bg-primary-orange text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg">
                        <FaPlus size={11} /> New Campaign
                    </button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                    { label: 'Total Subscribers', value: stats.total, icon: FaUsers, color: 'text-primary-orange' },
                    { label: 'Active', value: stats.active, icon: FaToggleOn, color: 'text-green-500' },
                    { label: 'New (7 days)', value: stats.newThisWeek, icon: FaNewspaper, color: 'text-blue-500' },
                    { label: 'Campaigns Sent', value: campaigns.filter(c => c.status === 'SENT').length, icon: FaPaperPlane, color: 'text-purple-500' },
                ].map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                        className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400">{s.label}</span>
                            <s.icon className={s.color} size={15} />
                        </div>
                        <span className="text-3xl font-black text-primary-dark">{s.value}</span>
                        {s.label === 'Campaigns Sent' && stats.lastSent && (
                            <p className="text-[9px] text-gray-400 font-bold mt-1">Last: {relativeDate(stats.lastSent.sentAt!)}</p>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Tab Nav */}
            <div className="flex gap-1 bg-[#F8FAFC] p-1 rounded-xl border border-gray-100 w-fit">
                {(['subscribers', 'campaigns'] as PageTab[]).map(t => (
                    <button key={t} onClick={() => setTab(t)}
                        className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${tab === t ? 'bg-white text-primary-orange shadow-sm border border-gray-100' : 'text-gray-400 hover:text-primary-dark'}`}>
                        {t === 'subscribers' ? <><FaUsers className="inline mr-2" size={11} />Subscribers</> : <><FaBullhorn className="inline mr-2" size={11} />Campaigns</>}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {/* ── SUBSCRIBERS TAB ── */}
                {tab === 'subscribers' && (
                    <motion.div key="subs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                        {/* Add Subscriber */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-primary-dark mb-4 flex items-center gap-2"><FaPlus size={11} className="text-primary-orange" /> Add Subscriber Manually</h3>
                            <form onSubmit={handleAddSub} className="flex flex-col md:flex-row gap-3 items-start">
                                <input type="email" required value={addForm.email} onChange={e => setAddForm({ ...addForm, email: e.target.value })}
                                    placeholder="Email address *"
                                    className="flex-1 bg-[#F8FAFC] border border-gray-100 rounded-xl py-3 px-5 text-sm font-bold text-primary-dark focus:outline-none" />
                                <input type="text" value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })}
                                    placeholder="Name (optional)"
                                    className="flex-1 bg-[#F8FAFC] border border-gray-100 rounded-xl py-3 px-5 text-sm font-bold text-primary-dark focus:outline-none" />
                                <button type="submit" disabled={addLoading}
                                    className="px-6 py-3 bg-primary-dark hover:bg-primary-orange text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap disabled:opacity-50">
                                    {addLoading ? 'Adding...' : 'Add Subscriber'}
                                </button>
                            </form>
                            {addError && <p className="text-red-500 text-[10px] font-black mt-3">{addError}</p>}
                        </div>

                        {/* Search + Filter */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={12} />
                                <input type="text" placeholder="Search by email or name..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-[#F8FAFC] border border-gray-100 rounded-xl text-sm font-bold text-primary-dark focus:outline-none" />
                            </div>
                            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)}
                                className="bg-[#F8FAFC] border border-gray-100 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest text-primary-dark focus:outline-none">
                                <option value="ALL">All Status</option>
                                <option value="SUBSCRIBED">Subscribed</option>
                                <option value="UNSUBSCRIBED">Unsubscribed</option>
                            </select>
                        </div>

                        {/* Table */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="grid grid-cols-[1fr_1fr_auto_auto_auto_auto] gap-4 px-6 py-4 bg-[#F8FAFC] border-b border-gray-100">
                                {['Email', 'Name', 'Source', 'Status', 'Subscribed', 'Actions'].map(h =>
                                    <span key={h} className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">{h}</span>
                                )}
                            </div>
                            {isLoading ? (
                                <div className="py-16 text-center">
                                    <div className="w-7 h-7 border-2 border-primary-orange border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading…</p>
                                </div>
                            ) : filteredSubs.length === 0 ? (
                                <div className="py-16 text-center">
                                    <FaInbox className="text-gray-200 mx-auto mb-3" size={40} />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">No subscribers found</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-50">
                                    {filteredSubs.map((sub, i) => (
                                        <motion.div key={sub.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                                            className="grid grid-cols-[1fr_1fr_auto_auto_auto_auto] gap-4 px-6 py-4 items-center hover:bg-[#FAFAFA] transition-colors">
                                            <p className="text-[11px] font-bold text-primary-dark truncate">{sub.email}</p>
                                            <p className="text-[11px] text-gray-400 font-bold truncate">{sub.name || '—'}</p>
                                            <SourceBadge source={sub.source} />
                                            <SubscriberBadge status={sub.status} />
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400">{relativeDate(sub.dateSubscribed)}</p>
                                                <p className="text-[9px] text-gray-300 font-bold">{formatDate(sub.dateSubscribed)}</p>
                                            </div>
                                            <div className="flex gap-1.5">
                                                <button onClick={() => handleToggleSub(sub)} title={sub.status === 'SUBSCRIBED' ? 'Unsubscribe' : 'Reactivate'}
                                                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${sub.status === 'SUBSCRIBED' ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}>
                                                    {sub.status === 'SUBSCRIBED' ? <FaToggleOn size={13} /> : <FaToggleOff size={13} />}
                                                </button>
                                                <button onClick={() => setDeleteSub(sub)} title="Remove" className="w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center transition-all">
                                                    <FaTrash size={11} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                            <div className="px-6 py-4 border-t border-gray-100 bg-[#F8FAFC]">
                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                                    Showing {filteredSubs.length} of {subscribers.length} subscribers
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ── CAMPAIGNS TAB ── */}
                {tab === 'campaigns' && (
                    <motion.div key="camps" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                        {/* Campaign Editor */}
                        {editorTarget && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                                <CampaignEditor
                                    initial={editorTarget === 'new' ? undefined : editorTarget}
                                    onSave={handleSaveCampaign}
                                    onCancel={() => setEditorTarget(null)}
                                />
                            </div>
                        )}

                        {/* Campaign List */}
                        {!editorTarget && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-[#F8FAFC] flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">All Campaigns</span>
                                </div>
                                {isLoading ? (
                                    <div className="py-16 text-center">
                                        <div className="w-7 h-7 border-2 border-primary-orange border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                                    </div>
                                ) : campaigns.length === 0 ? (
                                    <div className="py-20 text-center">
                                        <FaBullhorn className="text-gray-200 mx-auto mb-4" size={40} />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">No campaigns yet</p>
                                        <button onClick={() => setEditorTarget('new')} className="bg-primary-dark text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-orange transition-all">
                                            Create First Campaign
                                        </button>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-50">
                                        {campaigns.map((camp, i) => (
                                            <motion.div key={camp.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                                                className="px-6 py-5 hover:bg-[#FAFAFA] transition-colors flex items-start gap-5">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${camp.status === 'SENT' ? 'bg-blue-50' : 'bg-amber-50'}`}>
                                                    {camp.status === 'SENT' ? <FaPaperPlane className="text-blue-500" size={14} /> : <FaFileAlt className="text-amber-500" size={14} />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                                                        <h4 className="text-sm font-black text-primary-dark">{camp.title}</h4>
                                                        <CampaignBadge status={camp.status} />
                                                    </div>
                                                    <p className="text-[11px] text-gray-500 font-bold mb-1 truncate">{camp.subject}</p>
                                                    <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">
                                                        {camp.status === 'SENT'
                                                            ? `Sent ${relativeDate(camp.sentAt!)} · ${camp.recipientCount} recipients`
                                                            : `Draft · Updated ${relativeDate(camp.updatedAt)}`}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    <button onClick={() => setPreviewCamp(camp)} title="Preview" className="w-8 h-8 bg-[#F8FAFC] rounded-lg text-gray-400 hover:text-primary-dark hover:bg-gray-100 flex items-center justify-center transition-all"><FaEye size={11} /></button>
                                                    {camp.status === 'DRAFT' && <button onClick={() => setEditorTarget(camp)} title="Edit" className="w-8 h-8 bg-[#F8FAFC] rounded-lg text-gray-400 hover:text-primary-dark hover:bg-gray-100 flex items-center justify-center transition-all"><FaEdit size={11} /></button>}
                                                    {camp.status === 'DRAFT' && <button onClick={() => setSendCamp(camp)} title="Send" className="w-8 h-8 bg-primary-orange/10 rounded-lg text-primary-orange hover:bg-primary-orange hover:text-white flex items-center justify-center transition-all"><FaPaperPlane size={11} /></button>}
                                                    <button onClick={() => handleDuplicate(camp)} title="Duplicate" className="w-8 h-8 bg-[#F8FAFC] rounded-lg text-gray-400 hover:text-primary-dark hover:bg-gray-100 flex items-center justify-center transition-all"><FaCopy size={11} /></button>
                                                    <button onClick={() => setDeleteCamp(camp)} title="Delete" className="w-8 h-8 bg-red-50 rounded-lg text-red-400 hover:bg-red-100 flex items-center justify-center transition-all"><FaTrash size={11} /></button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
