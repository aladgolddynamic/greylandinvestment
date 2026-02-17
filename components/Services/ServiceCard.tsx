'use client';

import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';

interface ServiceCardProps {
    title: string;
    category: string;
    bullets: string[];
    image: string;
    index: number;
}

export default function ServiceCard({ title, category, bullets, image, index }: ServiceCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="relative w-full min-h-[400px] md:min-h-[450px] rounded-xl overflow-hidden shadow-2xl group border border-white/5"
        >
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${image})` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40"></div>

            {/* Content Container */}
            <div className="relative h-full flex flex-col justify-end p-8 md:p-12">
                <div className="max-w-2xl">
                    <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wider mb-6 leading-tight group-hover:text-primary-orange transition-colors duration-300">
                        {title}
                    </h3>

                    <div className="mb-8">
                        <span className="text-primary-orange font-black text-[10px] md:text-xs uppercase tracking-[0.3em] bg-primary-orange/10 px-3 py-1 rounded-sm border border-primary-orange/20">
                            {category}
                        </span>
                    </div>

                    <div className="space-y-4">
                        {bullets.map((bullet, idx) => (
                            <div key={idx} className="flex items-start gap-4">
                                <div className="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-primary-orange/20 flex items-center justify-center text-primary-orange">
                                    <FaCheckCircle size={12} />
                                </div>
                                <p className="text-white/80 text-sm md:text-base font-medium leading-relaxed">
                                    {bullet}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Subtle Border Glow on Hover */}
            <div className="absolute inset-0 border-2 border-primary-orange opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none rounded-xl"></div>
        </motion.div>
    );
}
