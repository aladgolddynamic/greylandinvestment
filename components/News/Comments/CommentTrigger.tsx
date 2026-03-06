'use client';

import React from 'react';
import { FaPlus, FaCommentAlt } from 'react-icons/fa';

interface CommentTriggerProps {
    onClick: () => void;
    isActive: boolean;
}

export default function CommentTrigger({ onClick, isActive }: CommentTriggerProps) {
    if (isActive) return null;

    return (
        <button 
            onClick={onClick}
            className="group flex items-center gap-4 px-8 py-5 rounded-2xl bg-white border border-gray-100 shadow-xl hover:shadow-2xl hover:border-primary-orange transition-all transform hover:-translate-y-1"
        >
            <div className="w-12 h-12 rounded-xl bg-primary-orange text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <FaPlus size={16} />
            </div>
            <div className="text-left">
                <span className="block text-[11px] font-black uppercase tracking-[0.2em] text-primary-dark mb-0.5">
                    Share Insight
                </span>
                <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    Drop a professional comment
                </span>
            </div>
        </button>
    );
}
