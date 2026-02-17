import FeatureCard from './FeatureCard';
import {
    FaNetworkWired,
    FaShieldAlt,
    FaChartBar,
    FaProjectDiagram,
    FaLaptopCode,
    FaUserTie,
    FaLock,
    FaTools
} from 'react-icons/fa';

export default function HybridExcellence() {
    const features = [
        {
            icon: <FaLaptopCode />,
            title: 'ERP / Enterprise Solutions',
            description: 'Cloud-based and on-premise ERP systems that streamline finance, HR, operations, and supply chain processes with real-time data.',
        },
        {
            icon: <FaUserTie />,
            title: 'IT Consultancy',
            description: 'Structured IT strategies aligned with business goals, covering cloud migration, infra optimization, and digital transformation.',
        },
        {
            icon: <FaLock />,
            title: 'Data Protection & Compliance',
            description: 'Risk assessments and gap analysis to ensure adherence to data regulations and strengthen security posture.',
        },
        {
            icon: <FaShieldAlt />,
            title: 'Cybersecurity Services',
            description: 'Vulnerability identification and robust security controls to protect systems from threats and ensure continuity.',
        },
        {
            icon: <FaTools />,
            title: 'General Contracting & Supply',
            description: 'Professional general contracting, project delivery, and supply chain solutions tailored for complex infrastructure.',
        },
        {
            icon: <FaChartBar />,
            title: 'Data Analytics',
            description: 'Business intelligence and analytics services that convert raw data into actionable insights for strategic decision-making.',
        },
        {
            icon: <FaNetworkWired />,
            title: 'IT Infrastructure & more',
            description: 'Enterprise-grade LAN/WAN, data centers, server infra, and network monitoring for high operational efficiency.',
        },
        {
            icon: <FaProjectDiagram />,
            title: 'Project Management',
            description: 'End-to-end management covering planning, budgeting, risk mitigation, and performance monitoring for successful delivery.',
        },
    ];

    return (
        <section id="services" className="py-16 md:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 md:mb-16">
                    <span className="text-primary-orange font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] mb-3 block">CORE CAPABILITIES</span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-primary-dark mb-4 md:mb-6 leading-tight">
                        Our Comprehensive Services
                    </h2>
                    <p className="text-gray-500 text-sm md:text-base max-w-3xl mx-auto leading-relaxed font-medium">
                        Multidisciplinary expertise delivering excellence across technology, infrastructure, and project management.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
