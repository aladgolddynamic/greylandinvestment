'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer/Footer';
import ProjectCard from '@/components/Projects/ProjectCard';
import { motion } from 'framer-motion';

export default function ProjectsPage() {
    const techProjects = [
        {
            title: "Enterprise ERP Deployment",
            industry: "Financial Services",
            duration: "6 Months",
            location: "Lagos, Nigeria",
            description: "Implemented a cloud-based ERP system integrating finance, HR, and procurement operations.",
            deliverables: [
                "Custom workflow automation",
                "Data migration & integration",
                "User training & compliance setup"
            ],
            image: "https://images.unsplash.com/photo-1551288049-bbbda536639a?q=80&w=1000&auto=format&fit=crop"
        },
        {
            title: "Cybersecurity Infrastructure Upgrade",
            industry: "Government Agency",
            duration: "4 Months",
            location: "Abuja, FCT",
            description: "Strengthened digital security posture through vulnerability assessment and firewall architecture redesign.",
            deliverables: [
                "Risk assessment & penetration testing",
                "Network segmentation",
                "Continuous monitoring deployment"
            ],
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop"
        },
        {
            title: "Business Intelligence Dashboard",
            industry: "Private Sector",
            duration: "3 Months",
            location: "Remote/Port Harcourt",
            description: "Developed executive dashboards converting operational data into real-time insights.",
            deliverables: [
                "KPI visualization",
                "Performance analytics",
                "Cloud deployment"
            ],
            image: "https://images.unsplash.com/photo-1551288049-bbbda536639a?q=80&w=1000&auto=format&fit=crop"
        }
    ];

    const engineeringProjects = [
        {
            title: "Commercial Office Complex",
            industry: "Urban Development",
            duration: "12 Months",
            location: "Abuja, Nigeria",
            description: "Executed full-scope construction including civil works, structural framework, and finishing.",
            deliverables: [
                "Structural engineering",
                "Project supervision",
                "Regulatory compliance management"
            ],
            image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop"
        },
        {
            title: "Institutional Facility Construction",
            industry: "Public Sector",
            duration: "10 Months",
            location: "Kano State",
            description: "Delivered a durable institutional facility aligned with safety and infrastructure standards.",
            deliverables: [
                "Civil & structural works",
                "Mechanical & electrical integration",
                "Quality assurance monitoring"
            ],
            image: "https://images.unsplash.com/photo-1503387762-592dea58ef21?q=80&w=1000&auto=format&fit=crop"
        },
        {
            title: "Infrastructure Rehabilitation",
            industry: "State-Level",
            duration: "8 Months",
            location: "Ogun State",
            description: "Managed rehabilitation and upgrade of critical infrastructure systems.",
            deliverables: [
                "Procurement coordination",
                "Risk management",
                "On-time delivery execution"
            ],
            image: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=1000&auto=format&fit=crop"
        }
    ];

    const procurementProjects = [
        {
            title: "Enterprise ICT Equipment Supply",
            industry: "Telecom Sector",
            duration: "3 Months",
            location: "Nationwide",
            description: "Supplied and deployed enterprise-grade servers, networking devices, and storage systems.",
            deliverables: [
                "Hardware sourcing",
                "Installation & configuration",
                "Post-deployment support"
            ],
            image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc4b?q=80&w=1000&auto=format&fit=crop"
        },
        {
            title: "Large-Scale Equipment Procurement",
            industry: "Construction Sector",
            duration: "Ongoing",
            location: "Regional",
            description: "Coordinated sourcing and delivery of heavy-duty operational equipment.",
            deliverables: [
                "Vendor evaluation",
                "Cost optimization",
                "Compliance assurance"
            ],
            image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1000&auto=format&fit=crop"
        },
        {
            title: "Facility Management Contract",
            industry: "Commercial Complex",
            duration: "24 Months",
            location: "Victoria Island, Lagos",
            description: "Provided structured facility management services for operational sustainability.",
            deliverables: [
                "Preventive maintenance",
                "Safety compliance audits",
                "Asset performance monitoring"
            ],
            image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1000&auto=format&fit=crop"
        }
    ];

    return (
        <main className="min-h-screen bg-[#F2F2F2]">
            <Navbar />

            {/* Projects Hero */}
            <section className="bg-gradient-to-r from-[#3F4A5A] to-[#5B5F73] pt-32 pb-24 relative overflow-hidden shadow-lg">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-orange blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl mx-auto"
                    >
                        <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter mb-6 drop-shadow-sm">
                            Project <br />
                            <span className="text-[#F28C28]">Showcase</span>
                        </h1>
                        <div className="h-1 w-24 bg-[#F28C28] mx-auto rounded-full mb-8"></div>
                        <p className="text-gray-400 font-bold text-sm md:text-lg tracking-widest uppercase mx-auto max-w-xl">
                            A portfolio of technical excellence, structural integrity, and operational efficiency.
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="py-20 space-y-32">
                {/* Technology Pillar */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <div className="h-[2px] w-12 bg-primary-orange"></div>
                            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary-dark">01. Technology & Digital</h2>
                            <div className="h-[2px] w-12 bg-primary-orange"></div>
                        </div>
                        <h3 className="text-3xl md:text-5xl font-extrabold text-primary-dark leading-tight mb-6">
                            Delivering secure, scalable, and performance-driven digital systems.
                        </h3>
                        <div className="inline-block bg-white px-6 py-2 rounded-full border border-gray-100 shadow-sm">
                            <span className="text-primary-dark font-black text-[10px] uppercase tracking-widest">Innovation Active</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {techProjects.map((project, index) => (
                            <ProjectCard key={index} index={index} {...project} />
                        ))}
                    </div>
                </section>

                {/* Engineering Pillar */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <div className="h-[2px] w-12 bg-primary-orange"></div>
                            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary-dark">02. Engineering & Execution</h2>
                            <div className="h-[2px] w-12 bg-primary-orange"></div>
                        </div>
                        <h3 className="text-3xl md:text-5xl font-extrabold text-primary-dark leading-tight">
                            Delivering structural integrity and disciplined execution.
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {engineeringProjects.map((project, index) => (
                            <ProjectCard key={index} index={index} {...project} />
                        ))}
                    </div>
                </section>

                {/* Procurement Pillar */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <div className="h-[2px] w-12 bg-primary-orange"></div>
                            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary-dark">03. Procurement & Support</h2>
                            <div className="h-[2px] w-12 bg-primary-orange"></div>
                        </div>
                        <h3 className="text-3xl md:text-5xl font-extrabold text-primary-dark leading-tight">
                            Ensuring operational efficiency through structured systems.
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {procurementProjects.map((project, index) => (
                            <ProjectCard key={index} index={index} {...project} />
                        ))}
                    </div>
                </section>
            </div>

            <Footer />
        </main>
    );
}
