'use client';

import { useState } from 'react';

export default function CTA() {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Email submitted:', email);
        setEmail('');
    };

    return (
        <section className="py-16 md:py-24 bg-primary-orange">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 leading-tight">
                    Start Your Transformation
                </h2>
                <p className="text-white/90 text-sm md:text-base mb-10 md:mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
                    Whether it's a digital overhaul or a large-scale construction, we have the expertise to deliver.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="/contact" className="bg-white text-primary-orange hover:bg-gray-50 hover:scale-105 hover:shadow-2xl font-bold px-10 md:px-12 py-3.5 md:py-4 rounded-sm transition-all duration-300 shadow-xl text-sm active:scale-95">
                        Contact Us
                    </a>
                    <a href="/projects" className="bg-transparent border border-white/60 text-white hover:bg-white/10 hover:scale-105 hover:border-white font-bold px-10 md:px-12 py-3.5 md:py-4 rounded-sm transition-all duration-300 text-sm active:scale-95">
                        View Projects
                    </a>
                </div>
            </div>
        </section>
    );
}
