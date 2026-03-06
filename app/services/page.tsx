'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer/Footer';
import ServiceGridItem from '@/components/Services/ServiceGridItem';
import { motion } from 'framer-motion';
import {
    FaCode, FaCogs, FaProjectDiagram, FaShieldAlt, FaChartBar, FaNetworkWired,
    FaBuilding, FaHardHat, FaTools, FaTruckLoading, FaDesktop, FaBoxOpen, FaWarehouse, FaClipboardCheck,
    FaChartPie, FaUserShield, FaSearchPlus, FaFileAlt, FaLock, FaTasks, FaGraduationCap
} from 'react-icons/fa';
import { getServicesAction } from '@/lib/actions/serviceActions';
import { ServiceItem } from '@/types/service';
import React, { useState, useEffect } from 'react';

const iconMap: Record<string, React.ReactNode> = {
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
    FaGraduationCap: <FaGraduationCap />
};

export default function ServicesPage() {
    const [services, setServices] = useState<ServiceItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            const data = await getServicesAction();
            // Filter only published services for public view
            setServices(data.filter(s => s.status === 'PUBLISHED'));
            setLoading(false);
        };
        fetchServices();
    }, []);

    const getServicesByCategory = (category: ServiceItem['category']) => {
        return services
            .filter(s => s.category === category)
            .map(s => ({
                ...s,
                icon: iconMap[s.icon] || <FaTools />
            }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary-orange/20 border-t-primary-orange rounded-full animate-spin"></div>
            </div>
        );
    }

    const technologyServices = getServicesByCategory('TECHNOLOGY');
    const dataProtectionServices = getServicesByCategory('AUDIT & PROTECTION');
    const engineeringServices = getServicesByCategory('ENGINEERING');
    const procurementServices = getServicesByCategory('PROCUREMENT');

    return (
        <main className="min-h-screen bg-[#F8FAFC]">
            <Navbar />

            {/* Redesigned Hero with Mesh Gradient */}
            <section className="relative bg-gradient-to-r from-[#3F4A5A] to-[#5B5F73] pt-32 pb-32 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-orange blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-400 blur-[130px] rounded-full -translate-x-1/2 translate-y-1/2"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter mb-8">
                            Integrated Solutions <br />
                            <span className="text-[#F28C28]">Portfolio</span>
                        </h1>
                        <div className="h-1 w-24 bg-primary-orange mx-auto rounded-full mb-8"></div>
                        <p className="text-gray-400 font-bold text-xs md:text-sm tracking-[0.4em] uppercase max-w-2xl mx-auto">
                            Technical excellence in Engineering, Technology, and Infrastructure.
                        </p>
                    </motion.div>
                </div>

                {/* Ambient Grid Pattern */}
                <div className="absolute inset-0 z-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px]"></div>
            </section>

            {/* Categorized Services - Modern Grid Layout */}
            <div className="relative py-24 space-y-32">
                {/* Tech Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-primary-orange font-black text-[10px] uppercase tracking-[0.5em] mb-4 block">Technology & Digital</span>
                        <h2 className="text-3xl font-black text-primary-dark uppercase tracking-tight">Enterprise Infrastructure</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {technologyServices.map((service, index) => (
                            <ServiceGridItem
                                key={index}
                                index={index}
                                {...service}
                            />
                        ))}
                    </div>
                </section>

                {/* Data Protection & Audit Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-primary-orange font-black text-[10px] uppercase tracking-[0.5em] mb-4 block">Compliance & Insights</span>
                        <h2 className="text-3xl font-black text-primary-dark uppercase tracking-tight">Data Protection & Compliance Audit</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {dataProtectionServices.map((service, index) => (
                            <ServiceGridItem
                                key={index}
                                index={index}
                                {...service}
                            />
                        ))}
                    </div>
                </section>

                {/* Engineering Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-primary-orange font-black text-[10px] uppercase tracking-[0.5em] mb-4 block">Engineering & Execution</span>
                        <h2 className="text-3xl font-black text-primary-dark uppercase tracking-tight">Civil & Structural Works</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {engineeringServices.map((service, index) => (
                            <ServiceGridItem
                                key={index}
                                index={index}
                                {...service}
                            />
                        ))}
                    </div>
                </section>

                {/* Procurement Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-primary-orange font-black text-[10px] uppercase tracking-[0.5em] mb-4 block">Procurement & Support</span>
                        <h2 className="text-3xl font-black text-primary-dark uppercase tracking-tight">Strategic Supply Chain</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {procurementServices.map((service, index) => (
                            <ServiceGridItem
                                key={index}
                                index={index}
                                {...service}
                            />
                        ))}
                    </div>
                </section>

                {/* Background Decorations */}
                <div className="absolute top-[20%] left-0 w-96 h-96 bg-primary-orange/5 blur-[100px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-[20%] right-0 w-96 h-96 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none"></div>
            </div>

            <Footer />
        </main>
    );
}
