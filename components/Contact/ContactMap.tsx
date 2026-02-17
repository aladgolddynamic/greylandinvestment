'use client';

import { motion } from 'framer-motion';
import { FaMapMarkerAlt } from 'react-icons/fa';

export default function ContactMap() {
    return (
        <section className="py-20 bg-gray-50 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                    <h3 className="text-2xl font-extrabold text-primary-dark mb-2">Our Location</h3>
                    <div className="h-1 w-12 bg-primary-orange"></div>
                </div>

                <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden border border-gray-200 shadow-xl group">
                    {/* Placeholder for Interactive Map with styled overlay */}
                    <div className="absolute inset-0 bg-[#D9EEEA] flex items-center justify-center overflow-hidden">
                        {/* Abstract Map Background Pattern */}
                        <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/grid.png')]"></div>
                        <svg className="absolute w-[120%] h-[120%] opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0,50 Q25,25 50,50 T100,50" fill="none" stroke="#2D6A4F" strokeWidth="0.5" />
                            <path d="M0,30 Q25,10 50,30 T100,30" fill="none" stroke="#2D6A4F" strokeWidth="0.5" />
                            <path d="M0,70 Q25,50 50,70 T100,70" fill="none" stroke="#2D6A4F" strokeWidth="0.5" />
                        </svg>

                        {/* Map Pin Shadow/Effect */}
                        <div className="relative">
                            <motion.div
                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.2, 0.5] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-primary-orange rounded-full"
                            ></motion.div>
                            <div className="relative z-10 w-12 h-12 bg-primary-orange rounded-full flex items-center justify-center text-white text-2xl shadow-2xl ring-4 ring-white">
                                <FaMapMarkerAlt />
                            </div>
                        </div>
                    </div>

                    {/* HQ Floating Info Box */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="absolute bottom-10 left-4 md:left-10 right-4 md:right-auto bg-white/95 backdrop-blur-md p-6 rounded-lg border border-gray-200 shadow-2xl max-w-sm"
                    >
                        <h4 className="text-primary-orange font-black text-[10px] uppercase tracking-widest mb-3">HEADQUARTERS</h4>
                        <p className="text-primary-dark font-bold text-sm leading-tight mb-1">Lugbe District, Abuja-FCT</p>
                        <p className="text-gray-500 text-xs font-medium">Federal Capital Territory, Nigeria</p>
                    </motion.div>

                    {/* Map Instructions / Aesthetic Layer */}
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black text-primary-dark uppercase tracking-widest shadow-sm">
                            Interactive Map Loading...
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
