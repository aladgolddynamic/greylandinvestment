'use client';

import { useState } from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaChevronRight } from 'react-icons/fa';

export default function Footer() {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Newsletter signup:', email);
        setEmail('');
    };

    const techSolutions = [
        'Software Development',
        'Digital Transformation',
        'IT Strategy & Audit',
        'Managed IT Services',
    ];

    const engineeringWorks = [
        'Civil Engineering',
        'General Contracting',
        'Road Infrastructure',
        'Project Management',
    ];

    const consultancyServices = [
        'Hardware Procurement',
        'Networking Equipment',
        'IT Infrastructure',
        'Supply Chain Solutions',
    ];

    return (
        <footer className="bg-[#0F1C2E] text-[#D1D5DB] pt-12 pb-8 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Upper Footer: Logo and Newsletter */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 mb-10 md:mb-12 items-start">
                    <div>
                        <img src="/logo.png" alt="Greyland" className="h-10 w-auto mb-6" />
                        <p className="text-sm md:text-base max-w-sm leading-relaxed text-[#D1D5DB]/70 font-medium">
                            Innovative Technology & Infrastructure Solutions across public and private sectors.
                        </p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-lg border border-white/5">
                        <h3 className="text-lg md:text-xl font-bold text-white mb-2 uppercase tracking-wide">Subscribe to our newsletter</h3>
                        <p className="text-[10px] md:text-xs text-white/40 mb-6 font-medium">Stay updated with our latest news and services.</p>
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-2">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email Address"
                                required
                                className="flex-1 bg-transparent border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary-orange transition-all font-medium"
                            />
                            <button
                                type="submit"
                                className="bg-primary-orange hover:bg-[#D9771B] text-white font-bold py-3 px-8 rounded-sm text-sm transition-all shadow-lg whitespace-nowrap"
                            >
                                Join Now
                            </button>
                        </form>
                    </div>
                </div>

                {/* Middle Footer: Links Grid */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 mb-10 md:mb-12">
                    <div>
                        <h4 className="text-white font-black text-[9px] md:text-xs mb-5 md:mb-6 uppercase tracking-[0.2em] opacity-80 text-nowrap">Quick Links</h4>
                        <ul className="space-y-3 text-xs md:sm font-bold">
                            <li><a href="/" className="hover:text-primary-orange transition-colors">Home</a></li>
                            <li><a href="/careers" className="hover:text-primary-orange transition-colors">Careers</a></li>
                            <li><a href="/contact" className="hover:text-primary-orange transition-colors">Contact</a></li>
                            <li><a href="/projects" className="hover:text-primary-orange transition-colors">Projects</a></li>
                            <li><a href="/news" className="hover:text-primary-orange transition-colors">Latest News</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-black text-[9px] md:text-xs mb-5 md:mb-6 uppercase tracking-[0.2em] opacity-80 text-nowrap">Enterprise & IT</h4>
                        <ul className="space-y-3 text-xs md:sm font-bold">
                            <li><a href="/#services" className="hover:text-primary-orange transition-colors">ERP Solutions</a></li>
                            <li><a href="/#services" className="hover:text-primary-orange transition-colors">Cybersecurity</a></li>
                            <li><a href="/#services" className="hover:text-primary-orange transition-colors">IT Consultancy</a></li>
                            <li><a href="/#services" className="hover:text-primary-orange transition-colors">Data Protection</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-black text-[9px] md:text-xs mb-5 md:mb-6 uppercase tracking-[0.2em] opacity-80 text-nowrap">Data & Management</h4>
                        <ul className="space-y-3 text-xs md:sm font-bold">
                            <li><a href="/#services" className="hover:text-primary-orange transition-colors">Data Analytics</a></li>
                            <li><a href="/#services" className="hover:text-primary-orange transition-colors">Business Intelligence</a></li>
                            <li><a href="/#services" className="hover:text-primary-orange transition-colors">Project Management</a></li>
                            <li><a href="/#services" className="hover:text-primary-orange transition-colors">Performance Audit</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-black text-[9px] md:text-xs mb-5 md:mb-6 uppercase tracking-[0.2em] opacity-80 text-nowrap">Infra & Supply</h4>
                        <ul className="space-y-3 text-xs md:sm font-bold">
                            <li><a href="/#services" className="hover:text-primary-orange transition-colors">Networking</a></li>
                            <li><a href="/#services" className="hover:text-primary-orange transition-colors">Data Centers</a></li>
                            <li><a href="/#services" className="hover:text-primary-orange transition-colors">General Contracting</a></li>
                            <li><a href="/#services" className="hover:text-primary-orange transition-colors">Supply & Procurement</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Footer: Social & Copyright */}
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 text-center md:text-left">
                    <p className="text-[10px] font-bold text-text-white/30 uppercase tracking-widest order-2 md:order-1">
                        &copy; {new Date().getFullYear()} Greyland Investment Ltd. All rights reserved.
                    </p>
                    <div className="flex gap-4 order-1 md:order-2">
                        {[FaFacebook, FaTwitter, FaLinkedin, FaInstagram].map((Icon, i) => (
                            <a
                                key={i}
                                href="#"
                                className="w-9 h-9 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-primary-orange hover:text-white transition-all text-text-white/40 shadow-sm"
                            >
                                <Icon size={14} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
