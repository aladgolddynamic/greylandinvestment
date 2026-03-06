export interface Project {
    title: string;
    industry: string;
    duration: string;
    location: string;
    description: string;
    deliverables: string[];
    image: string;
}

export interface ProjectSection {
    id: string;
    number: string;
    title: string;
    themeStatement: string;
    badgeText: string;
    projects: Project[];
}

export const projectData: ProjectSection[] = [
    {
        id: "tech-digital",
        number: "01",
        title: "Technology & Digital",
        themeStatement: "Delivering secure, scalable, and performance-driven digital systems.",
        badgeText: "Innovation Active",
        projects: [
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
                image: "/projects/tech_erp.png"
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
                image: "/projects/tech_security.png"
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
                image: "/projects/tech_bi.png"
            }
        ]
    },
    {
        id: "engineering-execution",
        number: "02",
        title: "Engineering & Execution",
        themeStatement: "Delivering structural integrity and disciplined execution.",
        badgeText: "Structural Integrity",
        projects: [
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
                image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop"
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
                image: "https://images.unsplash.com/photo-1541913057-07447195c960?q=80&w=1200&auto=format&fit=crop"
            },
            {
                title: "Infrastructure Rehabilitation",
                industry: "State-Level",
                duration: "8 Months",
                location: "Ogun State",
                description: "Managed rehabilitation and upgrade of critical infrastructure systems.",
                deliverables: [
                    "Risk management",
                    "On-time delivery execution"
                ],
                image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1200&auto=format&fit=crop"
            }
        ]
    },
    {
        id: "procurement-support",
        number: "03",
        title: "Procurement & Support",
        themeStatement: "Ensuring operational efficiency through structured systems.",
        badgeText: "Operational Excellence",
        projects: [
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
                image: "https://images.unsplash.com/photo-1558489580-f8ca7800052a?q=80&w=1200&auto=format&fit=crop"
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
                image: "https://images.unsplash.com/photo-1579412691970-d9d300057018?q=80&w=1200&auto=format&fit=crop"
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
                image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop"
            }
        ]
    },
    {
        id: "compliance-audit",
        number: "04",
        title: "Data Protection & Compliance Audit",
        themeStatement: "Ensuring regulatory adherence and robust data governance.",
        badgeText: "Compliance Ready",
        projects: [
            {
                title: "Data Privacy Compliance Audit",
                industry: "Healthcare Sector",
                duration: "5 Months",
                location: "Lagos, Nigeria",
                description: "Conducted a comprehensive audit of data handling processes to ensure GDPR and local privacy compliance.",
                deliverables: [
                    "Compliance gap report",
                    "Privacy impact assessment",
                    "Framework implementation"
                ],
                image: "/projects/compliance_audit.png"
            },
            {
                title: "Security Risk & Vulnerability Assessment",
                industry: "Energy Sector",
                duration: "3 Months",
                location: "Port Harcourt",
                description: "Executed a deep-dive security assessment of critical industrial control systems.",
                deliverables: [
                    "Vulnerability mapping",
                    "Threat modeling",
                    "Mitigation roadmap"
                ],
                image: "/projects/compliance_risk.png"
            },
            {
                title: "Policy & Governance Framework",
                industry: "Multi-national Corp",
                duration: "6 Months",
                location: "Abuja, FCT",
                description: "Developed and deployed enterprise-wide data governance and security policies.",
                deliverables: [
                    "Custom policy documentation",
                    "Stakeholder alignment",
                    "Compliance monitoring setup"
                ],
                image: "/projects/compliance_gap.png"
            }
        ]
    }
];
