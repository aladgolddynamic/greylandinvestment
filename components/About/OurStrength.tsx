'use client';

import { motion } from 'framer-motion';
import { FaChartLine, FaUsers, FaShieldVirus, FaGlobe, FaHandshake, FaLayerGroup } from 'react-icons/fa';

export default function OurStrength() {
    const strengths = [
        { icon: <FaLayerGroup />, text: "Structured project execution" },
        { icon: <FaUsers />, text: "Skilled workforce" },
        { icon: <FaShieldVirus />, text: "Industry-aligned standards" },
        { icon: <FaGlobe />, text: "Adaptive service delivery" },
        { icon: <FaHandshake />, text: "Strong procurement networks" },
        { icon: <FaChartLine />, text: "Client-centered approach" }
    ];

    return (
        <section className="py-20 md:py-28 bg-[#F2F2F2]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-extrabold text-primary-dark mb-4">Our Strength</h2>
                    <p className="text-primary-orange font-bold uppercase tracking-widest text-xs">What sets us apart is commitment</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {strengths.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center gap-6 bg-white p-6 rounded-sm shadow-sm hover:shadow-md transition-all border-b-2 border-transparent hover:border-primary-orange group"
                        >
                            <div className="text-primary-orange text-2xl group-hover:scale-110 transition-transform">
                                {item.icon}
                            </div>
                            <span className="font-bold text-primary-dark uppercase tracking-wide text-xs md:text-sm">
                                {item.text}
                            </span>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <p className="text-xl md:text-2xl font-black text-primary-dark italic">
                        "We believe that excellence is not an option — it is a standard."
                    </p>
                </div>
            </div>
        </section>
    );
}
