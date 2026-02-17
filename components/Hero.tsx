'use client';

import { motion } from 'framer-motion';

export default function Hero() {
    return (
        <section
            id="home"
            className="relative min-h-[85vh] md:min-h-[90vh] flex items-center justify-center bg-gradient-to-r from-[#3F4A5A] to-[#5B5F73] pt-24 md:pt-20 overflow-hidden"
        >
            {/* Background overlay with subtle animation */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.25 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0 bg-black z-0"
            ></motion.div>

            {/* Content Container */}
            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 md:pt-10">
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white mb-6 md:mb-8 leading-tight max-w-4xl mx-auto drop-shadow-sm">
                        Innovative Technology
                        <br />
                        <span className="text-[#F28C28]">Infrastructure Solutions</span>
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="text-sm md:text-lg text-[#E5E7EB] mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed font-medium"
                >
                    Delivering enterprise digital transformation alongside engineering, contracting, and supply services across public and private sectors.
                </motion.p>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center"
                >
                    <motion.button
                        whileHover={{ scale: 1.1, translateY: -2 }}
                        whileTap={{ scale: 0.96 }}
                        className="bg-[#F28C28] hover:bg-[#D9771B] text-white font-black px-10 md:px-12 py-3.5 md:py-4 rounded-sm transition-colors duration-300 shadow-xl hover:shadow-2xl uppercase tracking-widest text-[10px] md:text-xs"
                    >
                        Explore Solutions
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1, translateY: -2, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                        whileTap={{ scale: 0.96 }}
                        className="bg-transparent text-white font-black px-10 md:px-12 py-3.5 md:py-4 rounded-sm border border-white/60 transition-colors duration-300 shadow-lg hover:shadow-xl uppercase tracking-widest text-[10px] md:text-xs"
                    >
                        View Projects
                    </motion.button>
                </motion.div>
            </div>

            {/* Scroll indicator with animation */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
            >
                <div className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center p-1.5 opacity-60">
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        className="w-1 h-2 bg-[#F28C28] rounded-full"
                    />
                </div>
            </motion.div>
        </section>
    );
}
