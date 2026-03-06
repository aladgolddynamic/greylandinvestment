'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer/Footer';
import CTA from '@/components/CTA';
import { getServiceBySlugAction } from '@/lib/actions/serviceActions';
import { ServiceItem, ServiceFeature } from '@/types/service';
// ... (omitting react-icons imports for brevity in targetContent match if needed, but I'll use exact match)
// Wait, I'll just target the lines specifically.

import {
    FaCode, FaCogs, FaProjectDiagram, FaShieldAlt, FaChartBar, FaNetworkWired,
    FaBuilding, FaHardHat, FaTools, FaTruckLoading, FaDesktop, FaBoxOpen,
    FaWarehouse, FaClipboardCheck, FaChartPie, FaUserShield, FaSearchPlus,
    FaFileAlt, FaLock, FaTasks, FaGraduationCap, FaCheckCircle, FaArrowRight,
    FaChevronLeft
} from 'react-icons/fa';

const ICON_COMPONENTS: Record<string, React.ReactNode> = {
    FaCode: <FaCode />,
    FaCogs: <FaCogs />,
    FaProjectDiagram: <FaProjectDiagram />,
    FaShieldAlt: <FaShieldAlt />,
    FaChartBar: <FaChartBar />,
    FaNetworkWired: <FaNetworkWired />,
    FaBuilding: <FaBuilding />,
    FaHardHat: <FaHardHat />,
    FaTools: <FaTools />,
    FaTruckLoading: <FaTruckLoading />,
    FaDesktop: <FaDesktop />,
    FaBoxOpen: <FaBoxOpen />,
    FaWarehouse: <FaWarehouse />,
    FaClipboardCheck: <FaClipboardCheck />,
    FaChartPie: <FaChartPie />,
    FaUserShield: <FaUserShield />,
    FaSearchPlus: <FaSearchPlus />,
    FaFileAlt: <FaFileAlt />,
    FaLock: <FaLock />,
    FaTasks: <FaTasks />,
    FaGraduationCap: <FaGraduationCap />,
    FaCheckCircle: <FaCheckCircle />
};

export default function ServiceDetail() {
    const { slug } = useParams();
    const router = useRouter();
    const [service, setService] = useState<ServiceItem | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchService = async () => {
            if (typeof slug === 'string') {
                const data = await getServiceBySlugAction(slug);
                setService(data || null);
                setLoading(false);
            }
        };
        fetchService();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary-orange/20 border-t-primary-orange rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!service) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-8 text-center">
                <h1 className="text-4xl font-black text-primary-dark mb-4">Service Not Found</h1>
                <p className="text-gray-500 mb-8">The requested service configuration does not exist or has been decommissioned.</p>
                <button onClick={() => router.push('/services')} className="px-8 py-4 bg-primary-dark text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary-orange transition-all">
                    Return to Services
                </button>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#F8FAFC]">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 overflow-hidden bg-primary-dark text-white">
                <div
                    className="absolute inset-0 opacity-20 bg-cover bg-center"
                    style={{ backgroundImage: `url(${service.media.banner || 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop'})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary-dark/80 to-transparent"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl"
                    >
                        <button onClick={() => router.push('/services')} className="flex items-center gap-2 text-primary-orange text-[10px] font-black uppercase tracking-[0.3em] mb-8 hover:gap-4 transition-all group">
                            <FaChevronLeft size={10} /> All Services
                        </button>
                        <span className="inline-block px-3 py-1 bg-primary-orange/20 border border-primary-orange/30 rounded-sm text-primary-orange text-[10px] font-black uppercase tracking-widest mb-6">
                            {service.category}
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 leading-none">
                            {service.title}
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 font-medium leading-relaxed mb-10 max-w-2xl">
                            {service.shortDescription}
                        </p>
                    </motion.div>
                </div>

                <div className="absolute bottom-0 right-0 w-1/3 h-full hidden lg:block">
                    <div className="w-full h-full bg-gradient-to-l from-primary-dark to-transparent opacity-80"></div>
                </div>
            </section>

            {/* Main Content & Features */}
            <section className="py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                        {/* Left: Detailed Text */}
                        <div className="lg:col-span-12">
                            <div className="mb-20">
                                <h2 className="text-primary-orange font-black text-[10px] uppercase tracking-[0.5em] mb-4 block">Deployment Overview</h2>
                                <div
                                    className="prose prose-lg max-w-4xl text-gray-600 font-medium leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: service.fullDescription }}
                                />
                            </div>

                            {/* Feature Grid */}
                            <div className="space-y-12">
                                <div className="max-w-2xl">
                                    <h2 className="text-3xl font-black text-primary-dark uppercase tracking-tight mb-4">Core Capabilities</h2>
                                    <p className="text-gray-500 text-sm font-medium">Engineered for architectural integrity and organizational efficiency.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {service.features.map((feature: ServiceFeature, idx: number) => (
                                        <motion.div
                                            key={feature.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl group hover:border-primary-orange/20 transition-all"
                                        >
                                            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-primary-orange flex items-center justify-center text-2xl mb-6 group-hover:bg-primary-orange group-hover:text-white transition-all">
                                                {ICON_COMPONENTS[feature.icon] || <FaCheckCircle />}
                                            </div>
                                            <h4 className="text-lg font-black text-primary-dark uppercase tracking-tight mb-4 group-hover:text-primary-orange transition-colors">
                                                {feature.title}
                                            </h4>
                                            <p className="text-sm text-gray-500 font-medium leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-[20%] right-0 w-96 h-96 bg-primary-orange/5 blur-[120px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-[10%] left-0 w-80 h-80 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none"></div>
            </section>

            {/* Illustration Gallery (If any) */}
            {service.media.illustrations && service.media.illustrations.length > 0 && (
                <section className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mb-16 text-center">
                            <h2 className="text-3xl font-black text-primary-dark uppercase tracking-tight mb-4">Visual Documentation</h2>
                            <div className="h-1 w-16 bg-primary-orange mx-auto rounded-full"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {service.media.illustrations.map((url: string, i: number) => (
                                <div key={i} className="aspect-video rounded-[2rem] overflow-hidden border border-gray-100 shadow-lg">
                                    <img src={url} alt={`Illustration ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <CTA />
            <Footer />
        </main>
    );
}
