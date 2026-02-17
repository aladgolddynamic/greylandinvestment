'use client';

import { motion } from 'framer-motion';
import ContactInfo from './ContactInfo';
import ContactForm from './ContactForm';
import ContactMap from './ContactMap';

export default function ContactSection() {
    return (
        <section id="contact" className="bg-[#F2F2F2]">
            {/* Header Content */}
            <div className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
                    <div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-[2px] w-12 bg-primary-orange"></div>
                            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary-dark">Contact Us</h2>
                        </div>
                        <h3 className="text-3xl md:text-5xl font-extrabold text-primary-dark max-w-lg leading-tight">
                            Partner with us for world-class solutions.
                        </h3>
                    </div>
                    <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-sm border border-gray-100 shadow-sm">
                        <div className="w-8 h-8 rounded-full bg-primary-orange flex items-center justify-center text-white text-sm font-black">G</div>
                        <span className="text-primary-dark font-black tracking-widest text-[10px] uppercase">Greyland investment Ltd</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16">
                    {/* Left: Info Cards */}
                    <div className="lg:col-span-5">
                        <ContactInfo />
                    </div>

                    {/* Right: Form */}
                    <div className="lg:col-span-7">
                        <ContactForm />
                    </div>
                </div>
            </div>

            {/* Bottom: Map */}
            <ContactMap />
        </section>
    );
}
