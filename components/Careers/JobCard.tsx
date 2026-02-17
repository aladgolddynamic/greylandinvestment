'use client';

import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaBriefcase, FaClock, FaArrowRight } from 'react-icons/fa';

interface JobCardProps {
    title: string;
    department: string;
    location: string;
    type: string;
    excerpt: string;
    index: number;
}

export default function JobCard({ title, department, location, type, excerpt, index }: JobCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group bg-white p-8 rounded-2xl border border-gray-100 shadow-lg hover:shadow-2xl hover:border-primary-orange/20 transition-all duration-300"
        >
            <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="bg-orange-50 text-primary-orange text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-orange-100">
                    {department}
                </span>
                <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                    <FaMapMarkerAlt className="text-primary-orange/60" />
                    {location}
                </div>
            </div>

            <h3 className="text-xl md:text-2xl font-black text-primary-dark mb-4 leading-tight group-hover:text-primary-orange transition-colors">
                {title}
            </h3>

            <p className="text-gray-600 text-sm font-medium mb-8 leading-relaxed line-clamp-2">
                {excerpt}
            </p>

            <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <div className="flex items-center gap-2 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                    <FaClock className="text-primary-orange/60" />
                    {type}
                </div>

                <a
                    href="/contact"
                    className="inline-flex items-center gap-2 text-primary-orange font-black text-[10px] uppercase tracking-[0.2em] group-hover:gap-4 transition-all"
                >
                    Apply Now <FaArrowRight />
                </a>
            </div>
        </motion.div>
    );
}
