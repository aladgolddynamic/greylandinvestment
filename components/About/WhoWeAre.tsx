'use client';

import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';

interface WhoWeAreProps {
    content: string;
}

export default function WhoWeAre({ content }: WhoWeAreProps) {
    const priorities = [
        "Transparent processes",
        "Clear communication",
        "Quality workmanship",
        "Timely delivery",
        "Cost-conscious execution"
    ];

    return (
        <section id="about" className="py-20 md:py-28 bg-[#F2F2F2]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Left: Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-[2px] w-12 bg-primary-orange"></div>
                            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary-dark">Who We Are</h2>
                        </div>

                        <div className="space-y-6 text-gray-600">
                            <p className="text-lg md:text-xl font-bold text-primary-dark leading-relaxed">
                                {content}
                            </p>
                            <p className="leading-relaxed">
                                At our core, we are problem-solvers. From infrastructure development to technical installations, we approach every assignment with precision, integrity, and responsibility.
                            </p>
                            <p className="leading-relaxed">
                                We are a team of professionals driven by excellence, efficiency, and accountability. Our operations combine technical expertise with practical execution, ensuring that every project receives the attention it deserves.
                            </p>
                            <p className="italic font-medium text-primary-orange">
                                "We don’t just complete projects — we build lasting partnerships."
                            </p>
                        </div>
                    </motion.div>

                    {/* Right: Priorities & Values */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="bg-white p-10 md:p-12 rounded-sm shadow-xl border-l-4 border-primary-orange"
                    >
                        <h3 className="text-xl font-extrabold text-primary-dark mb-8">Why We Are Trusted</h3>
                        <div className="space-y-5">
                            {priorities.map((item, index) => (
                                <div key={index} className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-primary-orange group-hover:bg-primary-orange group-hover:text-white transition-all duration-300">
                                        <FaCheckCircle size={18} />
                                    </div>
                                    <span className="font-bold text-gray-700 uppercase tracking-wider text-xs md:text-sm">
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
