'use client';

import { motion } from 'framer-motion';
import { FaCogs, FaHardHat, FaTruckLoading, FaBuilding } from 'react-icons/fa';

export default function AboutWhatWeDo() {
    const competencies = [
        {
            icon: <FaCogs />,
            title: 'Engineering & Technical',
            desc: 'Professional project execution, system installations, and specialized technical support.'
        },
        {
            icon: <FaHardHat />,
            title: 'General Contracting',
            desc: 'End-to-end management covering planning, procurement, and execution across civil and structural works.'
        },
        {
            icon: <FaTruckLoading />,
            title: 'Procurement & Supply',
            desc: 'Reliable sourcing and delivery of equipment and materials that meet operational requirements.'
        },
        {
            icon: <FaBuilding />,
            title: 'Construction & Infra',
            desc: 'Execution of building projects, renovations, and facility development with emphasis on durability.'
        }
    ];

    return (
        <section className="py-20 md:py-28 bg-[#0F1C2E]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">What We Do</h2>
                    <span className="text-primary-orange font-black text-[10px] uppercase tracking-[0.4em]">Our Core Competencies</span>
                    <div className="mt-6 h-1 w-20 bg-primary-orange mx-auto opacity-50"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {competencies.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white/5 border border-white/10 p-8 rounded-sm hover:border-primary-orange/50 transition-all duration-300 group text-center"
                        >
                            <div className="w-16 h-16 bg-primary-orange/10 rounded-full flex items-center justify-center text-primary-orange text-3xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                {item.icon}
                            </div>
                            <h3 className="text-lg font-black text-white uppercase tracking-wider mb-4 group-hover:text-primary-orange transition-colors">
                                {item.title}
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
