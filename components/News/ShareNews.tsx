'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaLinkedinIn,
    FaTwitter,
    FaFacebookF,
    FaWhatsapp,
    FaEnvelope,
    FaLink,
    FaShareAlt,
    FaTimes
} from 'react-icons/fa';

interface ShareNewsProps {
    title: string;
    url?: string;
    summary?: string;
    mode: 'inline' | 'floating' | 'footer';
}

export default function ShareNews({ title, url, summary, mode }: ShareNewsProps) {
    const [copied, setCopied] = useState(false);
    const [currentUrl, setCurrentUrl] = useState('');
    const [isMounted, setIsMounted] = useState(false);
    const [showMobileModal, setShowMobileModal] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        setCurrentUrl(url || window.location.href);
    }, [url]);

    const shareLinks = {
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
        whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + currentUrl)}`,
        email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent('Check out this article: ' + currentUrl + '\n\n' + (summary || ''))}`
    };

    const copyToClipboard = async () => {
        if (typeof window === 'undefined') return;

        const handleSuccess = () => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        };

        // Try modern Clipboard API first
        if (navigator.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(currentUrl);
                handleSuccess();
                return;
            } catch (err) {
                console.error('Modern clipboard API failed, trying fallback...', err);
            }
        }

        // Fallback: Use a temporary textarea for older browsers or non-secure contexts
        try {
            const textArea = document.createElement("textarea");
            textArea.value = currentUrl;

            // Ensure the textarea is not visible but still part of the DOM
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            textArea.style.top = "0";
            document.body.appendChild(textArea);

            textArea.focus();
            textArea.select();

            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);

            if (successful) {
                handleSuccess();
            } else {
                throw new Error('execCommand copy returned false');
            }
        } catch (err) {
            console.error('Fallback clipboard copy failed:', err);
        }
    };

    if (!isMounted) return null;

    const ShareButton = ({ icon: Icon, onClick, href, label, color }: any) => {
        const content = (
            <div className={`w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-all transform hover:-translate-y-1 active:scale-95 shadow-sm group relative ${color} text-white`}>
                <Icon size={16} />
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary-dark text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap font-bold">
                    {label}
                </span>
            </div>
        );

        if (href) {
            return (
                <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                    {content}
                </a>
            );
        }

        return (
            <button onClick={onClick} aria-label={label}>
                {content}
            </button>
        );
    };

    // --- Inline Mode (Below Title) ---
    if (mode === 'inline') {
        return (
            <div className="flex items-center gap-4 py-8 border-y border-gray-100/50 mb-12">
                <span className="text-gray-400 font-black text-[9px] uppercase tracking-[0.2em] mr-2">Share Engagement:</span>
                <div className="flex gap-3">
                    <ShareButton icon={FaLinkedinIn} href={shareLinks.linkedin} label="LinkedIn" color="bg-[#0077b5] hover:shadow-[#0077b5]/30" />
                    <ShareButton icon={FaTwitter} href={shareLinks.twitter} label="X (Twitter)" color="bg-black hover:shadow-black/30" />
                    <ShareButton icon={FaWhatsapp} href={shareLinks.whatsapp} label="WhatsApp" color="bg-[#25D366] hover:shadow-[#25D366]/30" />
                    <ShareButton
                        icon={FaLink}
                        onClick={copyToClipboard}
                        label={copied ? "Copied!" : "Copy Link"}
                        color={copied ? "bg-primary-orange" : "bg-gray-400 hover:shadow-gray-400/30"}
                    />
                </div>
            </div>
        );
    }

    // --- Floating Mode (Desktop Only Sticky) ---
    if (mode === 'floating') {
        return (
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden lg:flex fixed left-8 top-1/2 -translate-y-1/2 flex-col gap-4 z-50"
            >
                <div className="w-px h-12 bg-gray-200 mx-auto mb-2" />
                <ShareButton icon={FaLinkedinIn} href={shareLinks.linkedin} label="LinkedIn" color="bg-[#0077b5] shadow-lg" />
                <ShareButton icon={FaTwitter} href={shareLinks.twitter} label="X (Twitter)" color="bg-black shadow-lg" />
                <ShareButton icon={FaFacebookF} href={shareLinks.facebook} label="Facebook" color="bg-[#1877f2] shadow-lg" />
                <ShareButton icon={FaWhatsapp} href={shareLinks.whatsapp} label="WhatsApp" color="bg-[#25D366] shadow-lg" />
                <ShareButton icon={FaEnvelope} href={shareLinks.email} label="Email" color="bg-gray-700 shadow-lg" />
                <ShareButton
                    icon={FaLink}
                    onClick={copyToClipboard}
                    label={copied ? "Copied!" : "Copy Link"}
                    color={copied ? "bg-primary-orange" : "bg-gray-400 shadow-lg"}
                />
                <div className="w-px h-12 bg-gray-200 mx-auto mt-2" />
            </motion.div>
        );
    }

    // --- Footer Mode (End of Article) ---
    return (
        <div className="mt-20 py-16 px-8 md:px-12 bg-white rounded-3xl border border-gray-100 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-orange/5 rounded-bl-full transform translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                    <h4 className="text-2xl md:text-3xl font-black text-primary-dark uppercase tracking-tighter mb-2">Did you find this insightful?</h4>
                    <p className="text-gray-500 font-medium">Share this article with your professional network.</p>
                </div>

                <div className="flex flex-wrap justify-center md:justify-end gap-3 md:gap-4">
                    <ShareButton icon={FaLinkedinIn} href={shareLinks.linkedin} label="LinkedIn" color="bg-[#0077b5] md:w-12 md:h-12" />
                    <ShareButton icon={FaTwitter} href={shareLinks.twitter} label="X (Twitter)" color="bg-black md:w-12 md:h-12" />
                    <ShareButton icon={FaWhatsapp} href={shareLinks.whatsapp} label="WhatsApp" color="bg-[#25D366] md:w-12 md:h-12" />
                    <button
                        onClick={() => setShowMobileModal(true)}
                        className="lg:hidden w-10 h-10 rounded-full bg-primary-orange text-white flex items-center justify-center shadow-lg active:scale-95"
                    >
                        <FaShareAlt size={16} />
                    </button>
                    <button
                        onClick={copyToClipboard}
                        className="hidden lg:flex items-center gap-2 px-6 py-3 rounded-full bg-gray-100 text-primary-dark font-black text-[10px] uppercase tracking-widest hover:bg-primary-dark hover:text-white transition-all shadow-sm"
                    >
                        <FaLink /> {copied ? "Link Copied" : "Copy Link"}
                    </button>
                </div>
            </div>

            {/* Mobile Share Modal */}
            <AnimatePresence>
                {showMobileModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowMobileModal(false)}
                            className="fixed inset-0 bg-primary-dark/60 backdrop-blur-sm z-[1000] lg:hidden"
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] p-8 pb-12 z-[1001] lg:hidden shadow-[0_-20px_50px_rgba(0,0,0,0.1)]"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h5 className="text-xl font-black text-primary-dark uppercase tracking-tighter">Share Insight</h5>
                                <button onClick={() => setShowMobileModal(false)} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                                    <FaTimes />
                                </button>
                            </div>

                            <div className="grid grid-cols-4 gap-6 mb-10">
                                <MobileShareItem icon={FaLinkedinIn} href={shareLinks.linkedin} label="LinkedIn" color="bg-[#0077b5]" />
                                <MobileShareItem icon={FaTwitter} href={shareLinks.twitter} label="X" color="bg-black" />
                                <MobileShareItem icon={FaFacebookF} href={shareLinks.facebook} label="Facebook" color="bg-[#1877f2]" />
                                <MobileShareItem icon={FaWhatsapp} href={shareLinks.whatsapp} label="WhatsApp" color="bg-[#25D366]" />
                                <MobileShareItem icon={FaEnvelope} href={shareLinks.email} label="Email" color="bg-gray-600" />
                                <MobileShareItem icon={FaLink} onClick={copyToClipboard} label="Copy Link" color="bg-primary-orange" />
                            </div>

                            <button
                                onClick={() => setShowMobileModal(false)}
                                className="w-full py-4 bg-gray-100 rounded-xl text-primary-dark font-black text-xs uppercase tracking-widest"
                            >
                                Done
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

function MobileShareItem({ icon: Icon, href, onClick, label, color }: any) {
    const content = (
        <div className="flex flex-col items-center gap-2">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-90 transition-transform ${color}`}>
                <Icon size={20} />
            </div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{label}</span>
        </div>
    );

    if (href) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer" className="flex justify-center">
                {content}
            </a>
        );
    }

    return (
        <button onClick={onClick} className="flex justify-center">
            {content}
        </button>
    );
}
