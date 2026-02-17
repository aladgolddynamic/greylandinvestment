'use client';

import { motion } from 'framer-motion';
import { FaPaperPlane } from 'react-icons/fa';

export default function ContactForm() {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white p-8 md:p-12 rounded-xl border border-gray-100 shadow-2xl"
        >
            <h3 className="text-2xl font-extrabold text-primary-dark mb-10">Get in Touch</h3>

            <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-primary-dark font-black text-[10px] uppercase tracking-widest opacity-60">Full Name</label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            className="w-full bg-[#F9FAFB] border border-gray-200 rounded-sm px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-orange/20 focus:border-primary-orange transition-all font-medium"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-primary-dark font-black text-[10px] uppercase tracking-widest opacity-60">Organization</label>
                        <input
                            type="text"
                            placeholder="Company Ltd"
                            className="w-full bg-[#F9FAFB] border border-gray-200 rounded-sm px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-orange/20 focus:border-primary-orange transition-all font-medium"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-primary-dark font-black text-[10px] uppercase tracking-widest opacity-60">Email Address</label>
                    <input
                        type="email"
                        placeholder="john@example.com"
                        className="w-full bg-[#F9FAFB] border border-gray-200 rounded-sm px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-orange/20 focus:border-primary-orange transition-all font-medium"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-primary-dark font-black text-[10px] uppercase tracking-widest opacity-60">Message</label>
                    <textarea
                        rows={5}
                        placeholder="Briefly describe your project requirements..."
                        className="w-full bg-[#F9FAFB] border border-gray-200 rounded-sm px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-orange/20 focus:border-primary-orange transition-all font-medium resize-none"
                    ></textarea>
                </div>

                <button
                    type="submit"
                    className="w-full bg-primary-orange hover:bg-primary-orange/90 text-white font-black py-5 rounded-sm flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-lg uppercase tracking-widest text-xs"
                >
                    <FaPaperPlane size={14} />
                    Send Message
                </button>
            </form>
        </motion.div>
    );
}
