'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer/Footer';
import ServiceGridItem from '@/components/Services/ServiceGridItem';
import { motion } from 'framer-motion';
import {
    FaCode, FaCogs, FaProjectDiagram, FaShieldAlt, FaChartBar, FaNetworkWired,
    FaBuilding, FaHardHat, FaTools, FaTruckLoading, FaDesktop, FaBoxOpen, FaWarehouse, FaClipboardCheck
} from 'react-icons/fa';

export default function ServicesPage() {
    const technologyServices = [
        {
            title: "Software Development",
            category: "TECHNOLOGY",
            icon: <FaCode />,
            bullets: [
                "Customized software solutions for specific business workflows.",
                "High scalability for organizational growth and data volume.",
                "Robust security protecting intellectual property and data."
            ]
        },
        {
            title: "ERP Solutions",
            category: "TECHNOLOGY",
            icon: <FaCogs />,
            bullets: [
                "Cloud-based and on-premise ERP implementations.",
                "Modules for Finance, HR, and Supply Chain Management.",
                "Real-time data integration and BI reporting."
            ]
        },
        {
            title: "IT Consultancy",
            category: "TECHNOLOGY",
            icon: <FaProjectDiagram />,
            bullets: [
                "Structured IT strategies aligned with business goals.",
                "Cloud migration and infrastructure optimization.",
                "Cybersecurity implementation roadmaps."
            ]
        },
        {
            title: "Security & Compliance",
            category: "TECHNOLOGY",
            icon: <FaShieldAlt />,
            bullets: [
                "Comprehensive risk assessments and gap analysis.",
                "Ensuring adherence to data protection regulations.",
                "Actionable recommendations for security posture."
            ]
        },
        {
            title: "Cybersecurity",
            category: "TECHNOLOGY",
            icon: <FaShieldAlt />,
            bullets: [
                "Vulnerability identification and security controls.",
                "Ongoing monitoring to protect systems from threats.",
                "Business continuity and regulatory compliance."
            ]
        },
        {
            title: "Data Analytics",
            category: "TECHNOLOGY",
            icon: <FaChartBar />,
            bullets: [
                "Business intelligence converting raw data into insights.",
                "Performance tracking and visualization dashboards.",
                "Strategic decision-making support."
            ]
        },
        {
            title: "Infra & Networking",
            category: "TECHNOLOGY",
            icon: <FaNetworkWired />,
            bullets: [
                "Enterprise-grade LAN/WAN system deployment.",
                "Data center solutions and secure server infrastructure.",
                "Network security and proactive monitoring."
            ]
        }
    ];

    const engineeringServices = [
        {
            title: "Construction Services",
            category: "ENGINEERING",
            icon: <FaBuilding />,
            bullets: [
                "Residential, commercial, and institutional projects.",
                "Emphasis on structural integrity and safety standards.",
                "Technical precision combined with disciplined supervision."
            ]
        },
        {
            title: "General Contracting",
            category: "ENGINEERING",
            icon: <FaHardHat />,
            bullets: [
                "Full-scope contracting including planning and coordination.",
                "Procurement and supervision across civil and structural works.",
                "Execution of large-scale infrastructure developments."
            ]
        },
        {
            title: "Project Management",
            category: "ENGINEERING",
            icon: <FaTools />,
            bullets: [
                "End-to-end management from planning to monitoring.",
                "Risk mitigation and budgeting to ensure delivery.",
                "Strict adherence to project scope, cost, and timelines."
            ]
        }
    ];

    const procurementServices = [
        {
            title: "Equipment Procurement",
            category: "PROCUREMENT",
            icon: <FaTruckLoading />,
            bullets: [
                "Sourcing of high-quality equipment tailored to needs.",
                "Compliance with industry standards and cost-efficiency.",
                "Logistics ensuring timely delivery of critical tools."
            ]
        },
        {
            title: "ICT Equipment Supply",
            category: "PROCUREMENT",
            icon: <FaDesktop />,
            bullets: [
                "Supply of enterprise-grade ICT hardware and accessories.",
                "Servers, networking devices, and scalable storage.",
                "Technological resources for secure operations."
            ]
        },
        {
            title: "General Supplies",
            category: "PROCUREMENT",
            icon: <FaBoxOpen />,
            bullets: [
                "Comprehensive supply services across multiple sectors.",
                "Access to essential materials and operational resources.",
                "Streamlined procurement for smooth execution."
            ]
        },
        {
            title: "Facility Management",
            category: "PROCUREMENT",
            icon: <FaWarehouse />,
            bullets: [
                "Services focused on maintaining operational efficiency.",
                "Asset longevity, safety compliance, and optimization.",
                "Support for commercial and institutional environments."
            ]
        }
    ];

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
                            <ServiceGridItem key={index} index={index} {...service} />
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
                            <ServiceGridItem key={index} index={index} {...service} />
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
                            <ServiceGridItem key={index} index={index} {...service} />
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
