'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaUsers, FaPlus, FaSearch, FaEdit, FaTrash, FaKey,
    FaCheck, FaTimes, FaShieldAlt, FaUserCog, FaExclamationTriangle,
    FaToggleOn, FaToggleOff, FaFilter, FaUser, FaClock, FaCalendarAlt, FaSave
} from 'react-icons/fa';
import {
    getUsersAction,
    createUserAction,
    updateUserAction,
    toggleUserStatusAction,
    deleteUserAction,
    changePasswordAction
} from '@/lib/actions/userActions';
import { DashboardUser, UserRole, UserStatus, CreateUserPayload } from '@/types/user';

// ─── Role Config ─────────────────────────────────────────────────────────────
const ROLE_CONFIG: Record<UserRole, { label: string; color: string; bg: string }> = {
    SUPER_ADMIN: { label: 'Super Admin', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' },
    EDITOR: { label: 'Editor', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
    MODERATOR: { label: 'Moderator', color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
};

const ALL_ROLES: UserRole[] = ['SUPER_ADMIN', 'EDITOR', 'MODERATOR'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(iso: string | null) {
    if (!iso) return 'Never';
    return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
function formatRelative(iso: string | null) {
    if (!iso) return 'Never';
    const diff = Date.now() - new Date(iso).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
}
function getInitials(name: string) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: UserStatus }) {
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${status === 'ACTIVE'
            ? 'bg-green-50 text-green-700 border-green-200'
            : 'bg-gray-100 text-gray-500 border-gray-200'
            }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-400'}`} />
            {status === 'ACTIVE' ? 'Active' : 'Disabled'}
        </span>
    );
}

// ─── Role Badge ───────────────────────────────────────────────────────────────
function RoleBadge({ role }: { role: UserRole }) {
    const cfg = ROLE_CONFIG[role];
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${cfg.color} ${cfg.bg}`}>
            <FaShieldAlt size={8} /> {cfg.label}
        </span>
    );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ user, size = 'md' }: { user: DashboardUser; size?: 'sm' | 'md' | 'lg' }) {
    const dims = size === 'sm' ? 'w-8 h-8 text-[10px]' : size === 'lg' ? 'w-16 h-16 text-lg' : 'w-10 h-10 text-xs';
    return user.profileImage
        ? <img src={user.profileImage} alt={user.name} className={`${dims} rounded-full object-cover`} />
        : (
            <div className={`${dims} rounded-full bg-gradient-to-br from-primary-orange to-orange-400 flex items-center justify-center text-white font-black`}>
                {getInitials(user.name)}
            </div>
        );
}

// ─── Confirmation Dialog ──────────────────────────────────────────────────────
function ConfirmDialog({
    title, message, confirmLabel, danger, onConfirm, onCancel, isLoading
}: {
    title: string; message: string; confirmLabel: string;
    danger?: boolean; onConfirm: () => void; onCancel: () => void; isLoading: boolean;
}) {
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full z-10"
            >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${danger ? 'bg-red-50' : 'bg-orange-50'}`}>
                    <FaExclamationTriangle className={danger ? 'text-red-500' : 'text-primary-orange'} size={20} />
                </div>
                <h3 className="text-lg font-black text-primary-dark mb-2">{title}</h3>
                <p className="text-sm text-gray-500 font-medium mb-8">{message}</p>
                <div className="flex gap-3">
                    <button onClick={onCancel} className="flex-1 py-3 rounded-xl border border-gray-200 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-all">
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all disabled:opacity-50 ${danger ? 'bg-red-500 hover:bg-red-600' : 'bg-primary-orange hover:bg-orange-600'}`}
                    >
                        {isLoading ? 'Processing...' : confirmLabel}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

// ─── Role Selector ────────────────────────────────────────────────────────────
function RoleSelector({ value, onChange }: { value: UserRole; onChange: (r: UserRole) => void }) {
    return (
        <div className="grid grid-cols-3 gap-2">
            {ALL_ROLES.map(role => {
                const cfg = ROLE_CONFIG[role];
                return (
                    <button
                        key={role}
                        type="button"
                        onClick={() => onChange(role)}
                        className={`py-3 px-2 rounded-xl border-2 text-[9px] font-black uppercase tracking-widest transition-all ${value === role
                            ? `${cfg.bg} ${cfg.color} border-current`
                            : 'bg-[#F8FAFC] text-gray-400 border-gray-100 hover:border-gray-200'
                            }`}
                    >
                        {cfg.label}
                    </button>
                );
            })}
        </div>
    );
}

// ─── User Form (Create / Edit) ────────────────────────────────────────────────
function UserForm({
    initial, onSave, onCancel, isEdit
}: {
    initial?: DashboardUser;
    onSave: (data: any) => Promise<void>;
    onCancel: () => void;
    isEdit: boolean;
}) {
    const [form, setForm] = useState({
        name: initial?.name || '',
        email: initial?.email || '',
        username: initial?.username || '',
        role: (initial?.role || 'EDITOR') as UserRole,
        status: (initial?.status || 'ACTIVE') as UserStatus,
        password: '',
        profileImage: initial?.profileImage || '',
    });
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        try {
            await onSave(form);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const field = (label: string, key: keyof typeof form, type = 'text', placeholder = '') => (
        <div className="space-y-2">
            <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">{label}</label>
            <input
                type={type}
                value={form[key] as string}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder}
                className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-3.5 px-5 text-sm font-bold text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-orange/20 focus:border-primary-orange transition-all"
            />
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {field('Full Name', 'name', 'text', 'Jane Doe')}
                {field('Username', 'username', 'text', 'janedoe')}
                {field('Email Address', 'email', 'email', 'jane@greyland.com')}
                {!isEdit && field('Password', 'password', 'password', 'Min 8 characters')}
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">Assign Role</label>
                <RoleSelector value={form.role} onChange={r => setForm({ ...form, role: r })} />
            </div>

            {isEdit && (
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">Account Status</label>
                    <div className="flex gap-3">
                        {(['ACTIVE', 'DISABLED'] as UserStatus[]).map(s => (
                            <button
                                key={s} type="button"
                                onClick={() => setForm({ ...form, status: s })}
                                className={`flex-1 py-3 rounded-xl border-2 text-[9px] font-black uppercase tracking-widest transition-all ${form.status === s
                                    ? s === 'ACTIVE' ? 'bg-green-50 text-green-700 border-green-300' : 'bg-gray-100 text-gray-600 border-gray-300'
                                    : 'bg-[#F8FAFC] text-gray-400 border-gray-100'
                                    }`}
                            >
                                {s === 'ACTIVE' ? '✓ Active' : '✗ Disabled'}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {error && (
                <div className="flex items-center gap-3 text-red-500 bg-red-50 p-4 rounded-xl">
                    <FaExclamationTriangle size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{error}</span>
                </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-gray-50">
                <button type="button" onClick={onCancel} className="flex-1 py-3.5 rounded-xl border border-gray-200 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-all">
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSaving || success}
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all disabled:opacity-60 ${success ? 'bg-green-500' : 'bg-primary-dark hover:bg-primary-orange'}`}
                >
                    {isSaving ? 'Saving...' : success ? <><FaCheck /> Saved</> : <><FaSave /> {isEdit ? 'Update User' : 'Create User'}</>}
                </button>
            </div>
        </form>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
type DialogState =
    | { type: 'delete'; user: DashboardUser }
    | { type: 'password'; user: DashboardUser }
    | null;

type PanelState =
    | { type: 'create' }
    | { type: 'edit'; user: DashboardUser }
    | { type: 'preview'; user: DashboardUser }
    | null;

export default function UsersManager() {
    const [users, setUsers] = useState<DashboardUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<UserRole | 'ALL'>('ALL');
    const [statusFilter, setStatusFilter] = useState<UserStatus | 'ALL'>('ALL');
    const [panel, setPanel] = useState<PanelState>(null);
    const [dialog, setDialog] = useState<DialogState>(null);
    const [dialogLoading, setDialogLoading] = useState(false);
    const [toastMsg, setToastMsg] = useState<string | null>(null);

    const loadUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getUsersAction();
            setUsers(data);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { loadUsers(); }, [loadUsers]);

    const toast = (msg: string) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(null), 3500);
    };

    // ── Filtering ──
    const filtered = users.filter(u => {
        const q = searchQuery.toLowerCase();
        const matchQ = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.username.toLowerCase().includes(q);
        const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
        const matchStatus = statusFilter === 'ALL' || u.status === statusFilter;
        return matchQ && matchRole && matchStatus;
    });

    // ── Actions ──
    const handleCreate = async (data: CreateUserPayload) => {
        await createUserAction(data);
        await loadUsers();
        setPanel(null);
        toast('User created successfully.');
    };

    const handleEdit = async (user: DashboardUser, data: Partial<DashboardUser>) => {
        await updateUserAction(user.id, data);
        await loadUsers();
        setPanel(null);
        toast('User updated successfully.');
    };

    const handleToggleStatus = async (user: DashboardUser) => {
        await toggleUserStatusAction(user.id);
        await loadUsers();
        toast(`User ${user.status === 'ACTIVE' ? 'disabled' : 'activated'}.`);
    };

    const handleDelete = async () => {
        if (!dialog || dialog.type !== 'delete') return;
        setDialogLoading(true);
        try {
            await deleteUserAction(dialog.user.id);
            await loadUsers();
            if (panel && 'user' in panel && panel.user.id === dialog.user.id) setPanel(null);
            toast('User deleted.');
        } finally {
            setDialogLoading(false);
            setDialog(null);
        }
    };

    const handleChangePassword = async (newPassword: string) => {
        if (!dialog || dialog.type !== 'password' || !newPassword) return;
        setDialogLoading(true);
        try {
            await changePasswordAction(dialog.user.id, newPassword);
            toast('Password updated successfully.');
            setDialog(null);
        } catch (err: any) {
            toast('Error: ' + err.message);
        } finally {
            setDialogLoading(false);
        }
    };

    const stats = {
        total: users.length,
        active: users.filter(u => u.status === 'ACTIVE').length,
        superAdmins: users.filter(u => u.role === 'SUPER_ADMIN').length,
    };

    return (
        <div className="space-y-8">
            {/* Toast */}
            <AnimatePresence>
                {toastMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        className="fixed top-6 right-6 z-[300] bg-primary-dark text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest"
                    >
                        <FaCheck className="text-green-400" /> {toastMsg}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Dialogs */}
            {dialog?.type === 'delete' && (
                <ConfirmDialog
                    title="Delete User"
                    message={`Permanently delete "${dialog.user.name}"? This action cannot be undone.`}
                    confirmLabel="Delete User"
                    danger
                    onConfirm={handleDelete}
                    onCancel={() => setDialog(null)}
                    isLoading={dialogLoading}
                />
            )}
            {dialog?.type === 'password' && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDialog(null)} />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="relative bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full z-10"
                    >
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6 text-blue-500">
                            <FaKey size={20} />
                        </div>
                        <h3 className="text-lg font-black text-primary-dark mb-2">Change Password</h3>
                        <p className="text-sm text-gray-500 font-medium mb-6">Update password for <strong>{dialog.user.name}</strong></p>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            handleChangePassword(formData.get('password') as string);
                        }}>
                            <div className="space-y-4 mb-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">New Password</label>
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        placeholder="Min 8 characters"
                                        autoFocus
                                        className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-3.5 px-5 text-sm font-bold text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-orange/20 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button type="button" onClick={() => setDialog(null)} className="flex-1 py-3 rounded-xl border border-gray-200 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-all">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={dialogLoading}
                                    className="flex-1 py-3 rounded-xl bg-primary-dark hover:bg-primary-orange text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-lg disabled:opacity-50"
                                >
                                    {dialogLoading ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-primary-dark uppercase tracking-tighter mb-2">
                        User <span className="text-primary-orange">Management</span>
                    </h1>
                    <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                        Admin Roster · Access Control · Role Governance
                    </p>
                </div>
                <button
                    onClick={() => setPanel({ type: 'create' })}
                    className="flex items-center gap-3 bg-primary-dark hover:bg-primary-orange text-white px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg"
                >
                    <FaPlus size={12} /> New User
                </button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-3 gap-5">
                {[
                    { label: 'Total Users', value: stats.total, icon: FaUsers, color: 'text-primary-orange' },
                    { label: 'Active', value: stats.active, icon: FaToggleOn, color: 'text-green-500' },
                    { label: 'Super Admins', value: stats.superAdmins, icon: FaShieldAlt, color: 'text-purple-600' },
                ].map((s, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400">{s.label}</span>
                            <s.icon className={s.color} size={16} />
                        </div>
                        <span className="text-3xl font-black text-primary-dark">{s.value}</span>
                    </motion.div>
                ))}
            </div>

            {/* Main Panel */}
            <div className="flex gap-6">
                {/* Table Section */}
                <div className="flex-1 min-w-0">
                    {/* Search & Filter */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4 shadow-sm flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={13} />
                            <input
                                type="text"
                                placeholder="Search by name, email, or username..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-[#F8FAFC] border border-gray-100 rounded-xl text-sm font-bold text-primary-dark focus:outline-none"
                            />
                        </div>
                        <div className="flex gap-3 shrink-0">
                            <select
                                value={roleFilter}
                                onChange={e => setRoleFilter(e.target.value as any)}
                                className="bg-[#F8FAFC] border border-gray-100 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest text-primary-dark focus:outline-none"
                            >
                                <option value="ALL">All Roles</option>
                                {ALL_ROLES.map(r => <option key={r} value={r}>{ROLE_CONFIG[r].label}</option>)}
                            </select>
                            <select
                                value={statusFilter}
                                onChange={e => setStatusFilter(e.target.value as any)}
                                className="bg-[#F8FAFC] border border-gray-100 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest text-primary-dark focus:outline-none"
                            >
                                <option value="ALL">All Status</option>
                                <option value="ACTIVE">Active</option>
                                <option value="DISABLED">Disabled</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        {/* Table Header */}
                        <div className="grid grid-cols-[auto_1fr_1fr_auto_auto_auto] gap-4 px-6 py-4 bg-[#F8FAFC] border-b border-gray-100">
                            {['User', 'Email', 'Role', 'Status', 'Last Login', 'Actions'].map(h => (
                                <span key={h} className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">{h}</span>
                            ))}
                        </div>

                        {isLoading ? (
                            <div className="py-20 text-center">
                                <div className="w-8 h-8 border-2 border-primary-orange border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading users...</p>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="py-20 text-center">
                                <FaUsers className="text-gray-200 mx-auto mb-4" size={48} />
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">No users match your search</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {filtered.map((user, i) => (
                                    <motion.div
                                        key={user.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.04 }}
                                        className="grid grid-cols-[auto_1fr_1fr_auto_auto_auto] gap-4 px-6 py-4 items-center hover:bg-[#FAFAFA] transition-colors group"
                                    >
                                        {/* Avatar + Name */}
                                        <button
                                            onClick={() => setPanel({ type: 'preview', user })}
                                            className="flex items-center gap-3 text-left"
                                        >
                                            <Avatar user={user} size="md" />
                                            <div>
                                                <p className="text-xs font-black text-primary-dark group-hover:text-primary-orange transition-colors leading-tight">{user.name}</p>
                                                <p className="text-[9px] font-bold text-gray-400">@{user.username}</p>
                                            </div>
                                        </button>

                                        {/* Email */}
                                        <p className="text-[11px] font-bold text-gray-500 truncate">{user.email}</p>

                                        {/* Role */}
                                        <div><RoleBadge role={user.role} /></div>

                                        {/* Status */}
                                        <div><StatusBadge status={user.status} /></div>

                                        {/* Last Login */}
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400">{formatRelative(user.lastLogin)}</p>
                                            <p className="text-[9px] font-bold text-gray-300">{formatDate(user.lastLogin)}</p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-1.5">
                                            <ActionButton icon={FaEdit} tip="Edit" onClick={() => setPanel({ type: 'edit', user })} />
                                            <ActionButton
                                                icon={user.status === 'ACTIVE' ? FaToggleOn : FaToggleOff}
                                                tip={user.status === 'ACTIVE' ? 'Disable' : 'Activate'}
                                                onClick={() => handleToggleStatus(user)}
                                                color={user.status === 'ACTIVE' ? 'text-green-500' : 'text-gray-400'}
                                            />
                                            <ActionButton icon={FaKey} tip="Change Password" onClick={() => setDialog({ type: 'password', user })} color="text-blue-400" />
                                            <ActionButton icon={FaTrash} tip="Delete" onClick={() => setDialog({ type: 'delete', user })} color="text-red-400" />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        <div className="px-6 py-4 border-t border-gray-100 bg-[#F8FAFC]">
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                                Showing {filtered.length} of {users.length} users
                            </p>
                        </div>
                    </div>
                </div>

                {/* Side Panel */}
                <AnimatePresence mode="wait">
                    {panel && (
                        <motion.div
                            key={panel.type + ('user' in panel ? panel.user.id : '')}
                            initial={{ opacity: 0, x: 30, width: 0 }}
                            animate={{ opacity: 1, x: 0, width: '380px' }}
                            exit={{ opacity: 0, x: 30, width: 0 }}
                            className="shrink-0 overflow-hidden"
                            style={{ width: 380 }}
                        >
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-y-auto max-h-[calc(100vh-10rem)] sticky top-10">
                                {/* Panel Header */}
                                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-primary-dark">
                                        {panel.type === 'create' ? 'New User' : panel.type === 'edit' ? 'Edit User' : 'User Profile'}
                                    </h3>
                                    <button onClick={() => setPanel(null)} className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-primary-dark transition-colors">
                                        <FaTimes size={14} />
                                    </button>
                                </div>

                                <div className="p-6">
                                    {/* Preview */}
                                    {panel.type === 'preview' && (
                                        <div className="space-y-6">
                                            <div className="flex flex-col items-center text-center py-4">
                                                <Avatar user={panel.user} size="lg" />
                                                <h4 className="mt-4 text-lg font-black text-primary-dark">{panel.user.name}</h4>
                                                <p className="text-sm text-gray-400 font-bold">@{panel.user.username}</p>
                                                <div className="flex gap-2 mt-3 flex-wrap justify-center">
                                                    <RoleBadge role={panel.user.role} />
                                                    <StatusBadge status={panel.user.status} />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                {[
                                                    { icon: FaUser, label: 'Email', value: panel.user.email },
                                                    { icon: FaClock, label: 'Last Login', value: formatDate(panel.user.lastLogin) },
                                                    { icon: FaCalendarAlt, label: 'Member Since', value: formatDate(panel.user.dateCreated) },
                                                ].map(row => (
                                                    <div key={row.label} className="flex items-center gap-4 p-4 bg-[#F8FAFC] rounded-xl">
                                                        <row.icon className="text-primary-orange shrink-0" size={14} />
                                                        <div>
                                                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">{row.label}</p>
                                                            <p className="text-xs font-bold text-primary-dark mt-0.5">{row.value}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
                                                <button onClick={() => setPanel({ type: 'edit', user: panel.user })} className="w-full py-3 rounded-xl bg-primary-dark hover:bg-primary-orange text-white text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                                                    <FaEdit size={11} /> Edit User
                                                </button>
                                                <button onClick={() => setDialog({ type: 'password', user: panel.user })} className="w-full py-3 rounded-xl border border-blue-200 text-blue-500 hover:bg-blue-50 text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                                                    <FaKey size={11} /> Change Password
                                                </button>
                                                <button onClick={() => setDialog({ type: 'delete', user: panel.user })} className="w-full py-3 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                                                    <FaTrash size={11} /> Delete User
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Create */}
                                    {panel.type === 'create' && (
                                        <UserForm
                                            isEdit={false}
                                            onSave={handleCreate}
                                            onCancel={() => setPanel(null)}
                                        />
                                    )}

                                    {/* Edit */}
                                    {panel.type === 'edit' && (
                                        <UserForm
                                            isEdit
                                            initial={panel.user}
                                            onSave={data => handleEdit(panel.user, data)}
                                            onCancel={() => setPanel(null)}
                                        />
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

// ─── Action Icon Button ───────────────────────────────────────────────────────
function ActionButton({ icon: Icon, tip, onClick, color }: {
    icon: any; tip: string; onClick: () => void; color?: string;
}) {
    return (
        <button
            onClick={onClick}
            title={tip}
            className={`w-8 h-8 rounded-lg bg-[#F8FAFC] hover:bg-gray-100 flex items-center justify-center transition-all ${color || 'text-gray-400 hover:text-primary-dark'}`}
        >
            <Icon size={12} />
        </button>
    );
}
