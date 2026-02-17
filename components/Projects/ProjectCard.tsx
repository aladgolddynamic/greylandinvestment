'use client';

import { motion } from 'framer-motion';
import { FaCheckCircle, FaArrowRight, FaMapMarkerAlt, FaCalendarAlt, FaBriefcase } from 'react-icons/fa';

interface ProjectCardProps {
    title: string;
    industry: string;
    duration: string;
    location: string;
    description: string;
    deliverables: string[];
    image: string;
    index: number;
}

export default function ProjectCard({
    title,
    industry,
    duration,
    location,
    description,
    deliverables,
    image,
    index
}: ProjectCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500"
        >
            {/* Project Image */}
            <div className="relative h-64 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${image})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-6">
                    <span className="bg-primary-orange text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-sm">
                        Featured Project
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-8">
                {/* Metadata Pill */}
                <div className="flex flex-wrap items-center gap-4 mb-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                        <FaBriefcase className="text-primary-orange" />
                        {industry}
                    </div>
                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    <div className="flex items-center gap-1.5">
                        <FaCalendarAlt className="text-primary-orange" />
                        {duration}
                    </div>
                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    <div className="flex items-center gap-1.5">
                        <FaMapMarkerAlt className="text-primary-orange" />
                        {location}
                    </div>
                </div>

                <h3 className="text-2xl font-black text-primary-dark mb-4 leading-tight group-hover:text-primary-orange transition-colors">
                    {title}
                </h3>

                <p className="text-gray-600 text-sm font-medium mb-8 leading-relaxed">
                    {description}
                </p>

                <div className="space-y-3 mb-10">
                    <h4 className="text-primary-dark font-black text-[10px] uppercase tracking-widest opacity-60">Deliverables / Scope:</h4>
                    {deliverables.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                            <FaCheckCircle className="mt-0.5 text-primary-orange text-xs" />
                            <span className="text-gray-700 text-sm font-semibold">{item}</span>
                        </div>
                    ))}
                </div>

                <a
                    href="/contact"
                    className="inline-flex items-center gap-3 text-primary-orange font-black text-[10px] uppercase tracking-[0.2em] group-hover:gap-5 transition-all"
                >
                    View Case Study <FaArrowRight />
                </a>
            </div>
        </motion.div>
    );
}
