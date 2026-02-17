'use client';

import { motion } from 'framer-motion';
import { FaCheckCircle, FaArrowRight } from 'react-icons/fa';

interface ServiceGridItemProps {
    title: string;
    category: string;
    bullets: string[];
    icon: React.ReactNode;
    index: number;
}

export default function ServiceGridItem({ title, category, bullets, icon, index }: ServiceGridItemProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="group relative bg-white/70 backdrop-blur-md rounded-2xl p-8 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden"
        >
            {/* Animated Mesh Gradient Background (Subtle) */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary-orange blur-[120px] rounded-full animate-pulse"></div>
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-[#0F1C2E] blur-[120px] rounded-full"></div>
            </div>

            {/* Floating Icon */}
            <div className="mb-8 relative">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-primary-orange text-3xl transform group-hover:-translate-y-2 group-hover:rotate-6 transition-all duration-500 ring-4 ring-orange-50">
                    {icon}
                </div>
                <div className="absolute -z-10 top-4 left-4 w-16 h-16 bg-primary-orange/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
            </div>

            {/* Content */}
            <div className="relative z-10">
                <span className="text-primary-orange font-black text-[9px] uppercase tracking-[0.3em] mb-3 block opacity-80 group-hover:opacity-100 transition-opacity">
                    {category}
                </span>
                <h3 className="text-xl md:text-2xl font-black text-primary-dark mb-6 leading-tight transition-colors">
                    {title}
                </h3>

                <div className="space-y-4 mb-8">
                    {bullets.map((bullet, idx) => (
                        <div key={idx} className="flex items-start gap-4">
                            <div className="mt-1 flex-shrink-0 text-primary-orange opacity-40 group-hover:opacity-100 transition-opacity">
                                <FaCheckCircle size={14} />
                            </div>
                            <p className="text-gray-600 text-sm font-medium leading-relaxed group-hover:text-primary-dark transition-colors">
                                {bullet}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Dynamic CTA Link (Subtle) */}
                <div className="flex items-center gap-2 text-primary-orange font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-500">
                    Learn More <FaArrowRight />
                </div>
            </div>

            {/* Glassy Border Glow */}
            <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary-orange/20 transition-colors pointer-events-none"></div>
        </motion.div>
    );
}
