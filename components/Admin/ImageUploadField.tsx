'use client';

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCloudUploadAlt, FaLink, FaTimes, FaImage, FaSpinner } from 'react-icons/fa';
import { mediaService } from '@/services/mediaService';

interface ImageUploadFieldProps {
    /** Current image URL (controlled) */
    value: string;
    /** Called whenever the URL changes (upload or manual URL) */
    onChange: (url: string) => void;
    /** Preview height class, default h-44 */
    previewHeightClass?: string;
    /** Label shown above the field */
    label?: string;
    /** Placeholder text for the URL input */
    placeholder?: string;
}

/**
 * ImageUploadField
 * Dual-mode image input: local file upload OR manual URL entry.
 * Used across all admin forms that accept images.
 * Integrates with mediaService for local upload handling.
 */
export default function ImageUploadField({
    value,
    onChange,
    previewHeightClass = 'h-44',
    label,
    placeholder = 'https://… or /images/filename.jpg',
}: ImageUploadFieldProps) {
    const [mode, setMode] = useState<'upload' | 'url'>('upload');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const processFile = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            setUploadError('Please select an image file.');
            return;
        }
        setUploadError(null);
        setIsUploading(true);
        try {
            const asset = await mediaService.uploadAsset(file);
            onChange(asset.url);
        } catch {
            setUploadError('Upload failed. Please try again or use a URL instead.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
        // Reset input so same file can be re-selected
        e.target.value = '';
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) processFile(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => setIsDragOver(false);

    const clearImage = () => onChange('');

    return (
        <div className="space-y-3">
            {label && (
                <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1 block">
                    {label}
                </label>
            )}

            {/* Mode Toggle */}
            <div className="flex gap-1 bg-[#F0F2F5] p-1 rounded-xl w-fit">
                <button
                    type="button"
                    onClick={() => setMode('upload')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${mode === 'upload'
                            ? 'bg-white text-primary-orange shadow-sm border border-gray-100'
                            : 'text-gray-400 hover:text-primary-dark'
                        }`}
                >
                    <FaCloudUploadAlt size={11} /> Local Upload
                </button>
                <button
                    type="button"
                    onClick={() => setMode('url')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${mode === 'url'
                            ? 'bg-white text-primary-orange shadow-sm border border-gray-100'
                            : 'text-gray-400 hover:text-primary-dark'
                        }`}
                >
                    <FaLink size={10} /> Enter URL
                </button>
            </div>

            <AnimatePresence mode="wait">
                {mode === 'upload' ? (
                    <motion.div
                        key="upload"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                    >
                        {/* Hidden file input */}
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />

                        {/* Drop zone */}
                        <div
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onClick={() => { if (!isUploading) fileRef.current?.click(); }}
                            className={`relative border-2 border-dashed rounded-xl transition-all cursor-pointer ${isDragOver
                                    ? 'border-primary-orange bg-primary-orange/5'
                                    : isUploading
                                        ? 'border-primary-orange/40 bg-primary-orange/5'
                                        : 'border-gray-200 bg-[#F8FAFC] hover:border-primary-orange/60 hover:bg-primary-orange/5'
                                }`}
                        >
                            <div className="flex flex-col items-center justify-center py-10 px-4 text-center pointer-events-none">
                                {isUploading ? (
                                    <>
                                        <FaSpinner size={28} className="text-primary-orange animate-spin mb-3" />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary-orange">Uploading…</p>
                                    </>
                                ) : (
                                    <>
                                        <FaCloudUploadAlt size={28} className={`mb-3 transition-colors ${isDragOver ? 'text-primary-orange' : 'text-gray-300'}`} />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                                            {isDragOver ? 'Drop to upload' : 'Click or drag & drop'}
                                        </p>
                                        <p className="text-[9px] text-gray-300 font-bold">JPG, PNG, WebP, GIF — max 10MB</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="url"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="flex items-center gap-2"
                    >
                        <div className="flex-1 relative">
                            <FaLink size={11} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                            <input
                                type="text"
                                value={value}
                                onChange={e => onChange(e.target.value)}
                                placeholder={placeholder}
                                className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-3.5 pl-10 pr-4 text-sm font-bold text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-orange/20 transition-all"
                            />
                        </div>
                        {value && (
                            <button
                                type="button"
                                onClick={clearImage}
                                className="p-3 text-gray-300 hover:text-red-400 transition-colors rounded-xl hover:bg-red-50 shrink-0"
                            >
                                <FaTimes size={13} />
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Upload error */}
            <AnimatePresence>
                {uploadError && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1"
                    >
                        {uploadError}
                    </motion.p>
                )}
            </AnimatePresence>

            {/* Live image preview */}
            <AnimatePresence>
                {value && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        className={`relative ${previewHeightClass} w-full rounded-xl overflow-hidden border border-gray-100 shadow-sm group`}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={value}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <button
                            type="button"
                            onClick={clearImage}
                            className="absolute top-2 right-2 p-2 bg-black/40 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
                        >
                            <FaTimes size={11} />
                        </button>
                        <div className="absolute bottom-2 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[9px] font-black uppercase tracking-widest bg-black/40 text-white px-2 py-1 rounded backdrop-blur-sm">
                                <FaImage className="inline mr-1" size={8} />Preview
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
