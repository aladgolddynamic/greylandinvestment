'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    getAssetsAction,
    uploadAssetAction,
    deleteAssetAction
} from '@/lib/actions/mediaActions';
import { MediaAsset } from '@/types/media';
import {
    FaPlus,
    FaSearch,
    FaTrash,
    FaCloudUploadAlt,
    FaFileAlt,
    FaEye,
    FaCopy,
    FaCheck,
    FaFilter,
    FaThLarge,
    FaList
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function MediaLibrary() {
    const [assets, setAssets] = useState<MediaAsset[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isUploading, setIsUploading] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchAssets();
    }, []);

    const fetchAssets = async () => {
        setLoading(true);
        const data = await getAssetsAction();
        setAssets(data);
        setLoading(false);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            await uploadAssetAction(formData);
            await fetchAssets();
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Permanently remove this asset? This may break links if in use.')) {
            await deleteAssetAction(id);
            await fetchAssets();
        }
    };

    const copyToClipboard = (url: string, id: string) => {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const filteredAssets = assets.filter(asset =>
        asset.filename.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-primary-dark uppercase tracking-tighter mb-2">
                        Media <span className="text-primary-orange">Vault</span>
                    </h1>
                    <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                        Centralized Asset Repository and Secure Content Storage
                    </p>
                </div>
                <div className="flex gap-4">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                        accept="image/*,application/pdf"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="flex items-center gap-3 px-8 py-4 bg-primary-dark hover:bg-primary-orange text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-primary-orange/20 disabled:opacity-50"
                    >
                        {isUploading ? (
                            <>
                                <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                Uploading Asset...
                            </>
                        ) : (
                            <>
                                <FaCloudUploadAlt size={16} /> Secure Upload
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <FaSearch size={14} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by Filename or Asset Class..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-gray-100 rounded-xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-orange/10 focus:border-primary-orange transition-all shadow-sm"
                    />
                </div>
                <div className="flex bg-white border border-gray-100 rounded-xl p-1 shadow-sm">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-3 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-primary-orange text-white shadow-md' : 'text-gray-400 hover:text-primary-dark'}`}
                    >
                        <FaThLarge size={14} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-3 rounded-lg transition-all ${viewMode === 'list' ? 'bg-primary-orange text-white shadow-md' : 'text-gray-400 hover:text-primary-dark'}`}
                    >
                        <FaList size={14} />
                    </button>
                </div>
            </div>

            {/* Content View */}
            {loading ? (
                <div className="py-40 text-center">
                    <div className="inline-block w-8 h-8 border-4 border-primary-orange/20 border-t-primary-orange rounded-full animate-spin"></div>
                </div>
            ) : filteredAssets.length === 0 ? (
                <div className="py-40 text-center bg-white rounded-[2rem] border border-gray-100">
                    <FaCloudUploadAlt size={48} className="mx-auto text-gray-100 mb-6" />
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Repository is currently empty.</p>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {filteredAssets.map((asset) => (
                        <motion.div
                            key={asset.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden group hover:border-primary-orange/20 transition-all flex flex-col"
                        >
                            <div className="aspect-square bg-[#F8FAFC] relative overflow-hidden flex items-center justify-center p-4">
                                {asset.type === 'IMAGE' ? (
                                    <img src={asset.url} alt={asset.filename} className="w-full h-full object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                                ) : (
                                    <FaFileAlt size={48} className="text-gray-200 group-hover:text-primary-orange transition-colors" />
                                )}

                                {/* Overlay Controls */}
                                <div className="absolute inset-0 bg-primary-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <button
                                        onClick={() => window.open(asset.url, '_blank')}
                                        className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-md transition-all"
                                    >
                                        <FaEye size={14} />
                                    </button>
                                    <button
                                        onClick={() => copyToClipboard(asset.url, asset.id)}
                                        className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-md transition-all"
                                    >
                                        {copiedId === asset.id ? <FaCheck size={14} className="text-green-500" /> : <FaCopy size={14} />}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(asset.id)}
                                        className="p-3 bg-white/10 hover:bg-red-500 text-white rounded-xl backdrop-blur-md transition-all"
                                    >
                                        <FaTrash size={14} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4 bg-white border-t border-gray-50">
                                <p className="text-[10px] font-black text-primary-dark uppercase truncate mb-1">{asset.filename}</p>
                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{asset.size} &bull; {asset.type}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[#F8FAFC] border-b border-gray-100">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Asset Reference</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Class</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Capacity</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Timelog</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredAssets.map((asset) => (
                                <tr key={asset.id} className="hover:bg-[#F8FAFC] transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                                                {asset.type === 'IMAGE' ? (
                                                    <img src={asset.url} alt={asset.filename} className="w-full h-full object-cover rounded-lg grayscale group-hover:grayscale-0 transition-all" />
                                                ) : <FaFileAlt className="text-gray-300" />}
                                            </div>
                                            <span className="text-xs font-black text-primary-dark uppercase truncate max-w-xs">{asset.filename}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-[9px] font-black text-primary-orange uppercase tracking-widest">{asset.type}</span>
                                    </td>
                                    <td className="px-8 py-6 text-[9px] font-bold text-gray-400 uppercase tracking-widest">{asset.size}</td>
                                    <td className="px-8 py-6 text-[9px] font-bold text-gray-400 uppercase tracking-widest">{new Date(asset.uploadedAt).toLocaleDateString()}</td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-end gap-3 text-gray-400">
                                            <button
                                                onClick={() => copyToClipboard(asset.url, asset.id)}
                                                className="hover:text-primary-orange transition-colors"
                                            >
                                                {copiedId === asset.id ? <FaCheck className="text-green-500" /> : <FaCopy size={12} />}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(asset.id)}
                                                className="hover:text-red-500 transition-colors"
                                            >
                                                <FaTrash size={12} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
