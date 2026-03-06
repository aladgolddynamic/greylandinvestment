import React from 'react';
import { motion } from 'framer-motion';

interface AboutHeroProps {
    title: string;
    subtitle: string;
}

export default function AboutHero({ title, subtitle }: AboutHeroProps) {
    return (
        <section className="relative py-24 md:py-32 bg-gradient-to-r from-[#3F4A5A] to-[#5B5F73] overflow-hidden border-b border-white/5 shadow-inner">
            {/* Technical Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-sm whitespace-pre-line">
                        {title.split('. ').map((part, i, arr) => (
                            <React.Fragment key={i}>
                                {i === arr.length - 1 ? (
                                    <span className="text-[#F28C28]">{part}</span>
                                ) : (
                                    <>{part}. <br /></>
                                )}
                            </React.Fragment>
                        ))}
                    </h1>
                    <div className="mt-8 h-1 w-24 bg-[#F28C28] mx-auto rounded-full"></div>
                    <p className="mt-8 text-sm md:text-base text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
                        {subtitle}
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
