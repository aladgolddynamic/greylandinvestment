'use client';

import { motion } from 'framer-motion';
import { FaBullseye, FaBinoculars } from 'react-icons/fa';

interface MissionVisionProps {
    mission: string;
    vision: string;
}

export default function MissionVision({ mission, vision }: MissionVisionProps) {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Mission */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="p-10 bg-gray-50 border border-gray-100 rounded-lg"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-primary-orange rounded flex items-center justify-center text-white shadow-lg">
                                <FaBullseye size={24} />
                            </div>
                            <h3 className="text-2xl font-black text-primary-dark uppercase tracking-tight">Our Mission</h3>
                        </div>
                        <p className="text-gray-600 leading-relaxed font-medium">
                            {mission}
                        </p>
                    </motion.div>

                    {/* Vision */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="p-10 bg-primary-dark border border-primary-dark rounded-lg text-white shadow-2xl"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-primary-orange rounded flex items-center justify-center text-white shadow-lg">
                                <FaBinoculars size={24} />
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tight">Our Vision</h3>
                        </div>
                        <p className="text-gray-300 leading-relaxed font-medium">
                            {vision}
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
