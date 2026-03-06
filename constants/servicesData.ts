export interface ServiceItem {
    id: string;
    title: string;
    category: 'TECHNOLOGY' | 'AUDIT & PROTECTION' | 'ENGINEERING' | 'PROCUREMENT';
    iconName: string; // Storing icon name as string for serializability
    bullets: string[];
}

export const servicesData: ServiceItem[] = [
    // Technology Services
    {
        id: "software-development",
        title: "Software Development",
        category: "TECHNOLOGY",
        iconName: "FaCode",
        bullets: [
            "Customized software solutions for specific business workflows.",
            "High scalability for organizational growth and data volume.",
            "Robust security protecting intellectual property and data."
        ]
    },
    {
        id: "erp-solutions",
        title: "ERP Solutions",
        category: "TECHNOLOGY",
        iconName: "FaCogs",
        bullets: [
            "Cloud-based and on-premise ERP implementations.",
            "Modules for Finance, HR, and Supply Chain Management.",
            "Real-time data integration and BI reporting."
        ]
    },
    {
        id: "it-consultancy",
        title: "IT Consultancy",
        category: "TECHNOLOGY",
        iconName: "FaProjectDiagram",
        bullets: [
            "Structured IT strategies aligned with business goals.",
            "Cloud migration and infrastructure optimization.",
            "Cybersecurity implementation roadmaps."
        ]
    },
    {
        id: "security-compliance",
        title: "Security & Compliance",
        category: "TECHNOLOGY",
        iconName: "FaShieldAlt",
        bullets: [
            "Comprehensive risk assessments and gap analysis.",
            "Ensuring adherence to data protection regulations.",
            "Actionable recommendations for security posture."
        ]
    },
    {
        id: "cybersecurity",
        title: "Cybersecurity",
        category: "TECHNOLOGY",
        iconName: "FaShieldAlt",
        bullets: [
            "Vulnerability identification and security controls.",
            "Ongoing monitoring to protect systems from threats.",
            "Business continuity and regulatory compliance."
        ]
    },
    {
        id: "data-analytics",
        title: "Data Analytics",
        category: "TECHNOLOGY",
        iconName: "FaChartBar",
        bullets: [
            "Business intelligence converting raw data into insights.",
            "Performance tracking and visualization dashboards.",
            "Strategic decision-making support."
        ]
    },
    {
        id: "infra-networking",
        title: "Infra & Networking",
        category: "TECHNOLOGY",
        iconName: "FaNetworkWired",
        bullets: [
            "Enterprise-grade LAN/WAN system deployment.",
            "Data center solutions and secure server infrastructure.",
            "Network security and proactive monitoring."
        ]
    },
    // Audit & Protection
    {
        id: "data-protection",
        title: "Data Protection",
        category: "AUDIT & PROTECTION",
        iconName: "FaUserShield",
        bullets: [
            "Cloud-based and on-premise data protection implementations.",
            "Adherence to global and local data regulations (GDPR, NDPB).",
            "Robust privacy frameworks for organizational data."
        ]
    },
    {
        id: "compliance-audit",
        title: "Compliance Audit",
        category: "AUDIT & PROTECTION",
        iconName: "FaClipboardCheck",
        bullets: [
            "Systematic review of internal controls and standards.",
            "Verification of adherence to internal standards and external laws.",
            "Detailed reports for stakeholders."
        ]
    },
    {
        id: "gap-analysis",
        title: "Gap Analysis",
        category: "AUDIT & PROTECTION",
        iconName: "FaSearchPlus",
        bullets: [
            "Comparison of actual performance with potential performance.",
            "Identification of sub-optimal processes.",
            "Strategic planning for improvement."
        ]
    },
    {
        id: "security-risk-assessment",
        title: "Security Risk Assessment",
        category: "AUDIT & PROTECTION",
        iconName: "FaLock",
        bullets: [
            "Systematic identification of security vulnerabilities.",
            "Evaluation of potential impacts.",
            "Development of mitigation strategies."
        ]
    },
    {
        id: "policy-development",
        title: "Policy Development",
        category: "AUDIT & PROTECTION",
        iconName: "FaFileAlt",
        bullets: [
            "Creation of robust internal operational policies.",
            "Alignment with regulatory requirements.",
            "Implementation of best practices."
        ]
    },
    {
        id: "staff-training",
        title: "Staff Training",
        category: "AUDIT & PROTECTION",
        iconName: "FaGraduationCap",
        bullets: [
            "Development of technical competency mapping.",
            "Delivery of professional seminars and workshops.",
            "Performance monitoring and evaluation."
        ]
    },
    // Engineering
    {
        id: "construction-services",
        title: "Construction Services",
        category: "ENGINEERING",
        iconName: "FaBuilding",
        bullets: [
            "Residential, commercial, and institutional projects.",
            "Emphasis on structural integrity and safety standards.",
            "Technical precision combined with disciplined supervision."
        ]
    },
    {
        id: "general-contracting",
        title: "General Contracting",
        category: "ENGINEERING",
        iconName: "FaHardHat",
        bullets: [
            "Full-scope contracting including planning and coordination.",
            "Procurement and supervision across civil and structural works.",
            "Execution of large-scale infrastructure developments."
        ]
    },
    {
        id: "project-management",
        title: "Project Management",
        category: "ENGINEERING",
        iconName: "FaTools",
        bullets: [
            "End-to-end management from planning to monitoring.",
            "Risk mitigation and budgeting to ensure delivery.",
            "Strict adherence to project scope, cost, and timelines."
        ]
    },
    // Procurement
    {
        id: "equipment-procurement",
        title: "Equipment Procurement",
        category: "PROCUREMENT",
        iconName: "FaTruckLoading",
        bullets: [
            "Sourcing of high-quality equipment tailored to needs.",
            "Compliance with industry standards and cost-efficiency.",
            "Logistics ensuring timely delivery of critical tools."
        ]
    },
    {
        id: "ict-equipment-supply",
        title: "ICT Equipment Supply",
        category: "PROCUREMENT",
        iconName: "FaDesktop",
        bullets: [
            "Supply of enterprise-grade ICT hardware and accessories.",
            "Servers, networking devices, and scalable storage.",
            "Technological resources for secure operations."
        ]
    },
    {
        id: "general-supplies",
        title: "General Supplies",
        category: "PROCUREMENT",
        iconName: "FaBoxOpen",
        bullets: [
            "Comprehensive supply services across multiple sectors.",
            "Access to essential materials and operational resources.",
            "Streamlined procurement for smooth execution."
        ]
    },
    {
        id: "facility-management",
        title: "Facility Management",
        category: "PROCUREMENT",
        iconName: "FaWarehouse",
        bullets: [
            "Services focused on maintaining operational efficiency.",
            "Asset longevity, safety compliance, and optimization.",
            "Support for commercial and institutional environments."
        ]
    }
];
