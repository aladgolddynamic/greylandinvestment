import React from 'react';
import { 
    ArticleH2, 
    ArticleH3, 
    ArticleP, 
    ArticleList 
} from '@/components/News/ArticleElements';

export interface Job {
    slug: string;
    title: string;
    department: string;
    location: string;
    type: string;
    excerpt: string;
    content: React.ReactNode;
}

export const careerListings: Job[] = [
    {
        slug: "senior-structural-engineer",
        title: "Senior Structural Engineer",
        department: "Engineering",
        location: "Abuja, FCT",
        type: "Full-Time",
        excerpt: "Join our Engineering & Execution pillar to oversee structural design and integrity for high-impact urban development projects.",
        content: (
            <>
                <ArticleP>
                    As a Senior Structural Engineer at Greyland Investment Ltd, you will be at the forefront of designing the backbone of Nigeria's modern infrastructure. You will lead complex engineering projects from conception through to execution, ensuring the highest standards of safety, durability, and efficiency.
                </ArticleP>
                
                <ArticleH2>Key Responsibilities</ArticleH2>
                <ArticleList items={[
                    "Lead the structural analysis and design of complex buildings and civil infrastructure projects.",
                    "Review and approve structural drawings, specifications, and calculation reports.",
                    "Provide technical leadership and mentorship to junior engineering staff.",
                    "Collaborate with architects, project managers, and contractors to ensure design intent and integrity.",
                    "Oversee on-site inspections and quality control assessments during construction phases.",
                    "Ensure compliance with Nigerian and International Building Codes and safety regulations."
                ]} />

                <ArticleH2>Requirements & Qualifications</ArticleH2>
                <ArticleList items={[
                    "Bachelor’s degree in Civil or Structural Engineering (Master’s preferred).",
                    "COREN registration and relevant professional certifications.",
                    "Minimum of 8-10 years of experience in structural design and site supervision.",
                    "Proficiency in engineering software such as AutoCAD, Revit, ETABS, or STAAD.Pro.",
                    "Proven track record of managing large-scale infrastructure or commercial projects.",
                    "Strong analytical, problem-solving, and communication skills."
                ]} />

                <ArticleH2>What We Offer</ArticleH2>
                <ArticleList items={[
                    "Competitive salary and performance-based bonuses.",
                    "Opportunity to work on landmark projects that shape the national landscape.",
                    "Comprehensive health insurance and retirement plans.",
                    "Continuous professional development and training opportunities.",
                    "Collaborative and innovative work environment."
                ]} />
            </>
        )
    },
    {
        slug: "full-stack-software-architect",
        title: "Full-Stack Software Architect",
        department: "Technology",
        location: "Lagos / Hybrid",
        type: "Full-Time",
        excerpt: "Lead the development of scalable enterprise ERP solutions and secure digital infrastructure for our private and public sector clients.",
        content: (
            <>
                <ArticleP>
                    We are seeking a visionary Full-Stack Software Architect to drive our digital transformation initiatives. In this role, you will define the technical architecture for our enterprise-grade ERP solutions and lead a high-performing team of developers to build secure, scalable, and efficient software.
                </ArticleP>

                <ArticleH2>Core Responsibilities</ArticleH2>
                <ArticleList items={[
                    "Architect and design end-to-end full-stack applications using modern frameworks and cloud technologies.",
                    "Lead the development of complex ERP systems, ensuring high performance and security.",
                    "Establish coding standards, best practices, and CI/CD pipelines.",
                    "Collaborate with stakeholders to translate business requirements into technical blueprints.",
                    "Evaluate and integrate third-party APIs and services.",
                    "Mentor and provide technical guidance to front-end and back-end developers."
                ]} />

                <ArticleH2>Technical Requirements</ArticleH2>
                <ArticleList items={[
                    "B.Sc/M.Sc in Computer Science, Software Engineering, or related field.",
                    "Proven experience as a Software Architect or Lead Developer.",
                    "Deep expertise in React, Next.js, Node.js, and TypeScript.",
                    "Strong knowledge of database design (PostgreSQL/MongoDB) and cloud infrastructure (AWS/Azure).",
                    "Experience with microservices architecture and containerization (Docker/Kubernetes).",
                    "Excellent understanding of cybersecurity best practices in software development."
                ]} />

                <ArticleH2>Benefits</ArticleH2>
                <ArticleList items={[
                    "Hybrid work flexibility and professional equipment stipend.",
                    "Stock options and equity participation opportunities.",
                    "Access to global tech conferences and advanced certifications.",
                    "Annual performance reviews and clear career progression paths.",
                    "Dynamic and tech-driven corporate culture."
                ]} />
            </>
        )
    },
    {
        slug: "procurement-specialist",
        title: "Procurement Specialist",
        department: "Procurement",
        location: "Nationwide",
        type: "Contract",
        excerpt: "Manage strategic sourcing and supply chain logistics for high-value ICT equipment and heavy operational tools.",
        content: (
            <>
                <ArticleP>
                    The Procurement Specialist at Greyland is responsible for managing the end-to-end supply chain for high-value assets across our diverse projects. You will be tasked with strategic sourcing, vendor management, and ensuring the timely delivery of critical equipment while maintaining cost-efficiency and quality.
                </ArticleP>

                <ArticleH2>Key Responsibilities</ArticleH2>
                <ArticleList items={[
                    "Develop and implement strategic sourcing plans for ICT equipment and heavy machinery.",
                    "Identify, vet, and manage relationships with local and international suppliers.",
                    "Negotiate high-value contracts and service level agreements (SLAs).",
                    "Manage procurement logistics, including shipping, customs clearance, and inventory.",
                    "Ensure all procurement activities comply with company policy and regulatory standards.",
                    "Conduct market analysis to identify cost-saving opportunities and supply chain risks."
                ]} />

                <ArticleH2>Required Experience</ArticleH2>
                <ArticleList items={[
                    "Degree in Supply Chain Management, Business Administration, or related field.",
                    "Professional certification (e.g., CIPS) is a significant advantage.",
                    "At least 5 years of experience in technical procurement or supply chain management.",
                    "Strong negotiation skills and experience managing six-figure contracts.",
                    "Ability to travel nationwide to coordinate with site teams and vendors.",
                    "Proficiency in ERP procurement modules and inventory management software."
                ]} />

                <ArticleH2>Greyland Commitment</ArticleH2>
                <ArticleList items={[
                    "Exposure to large-scale, nationwide supply chain operations.",
                    "Opportunity to work with top-tier international OEMs and vendors.",
                    "Competitive contract rates and travel allowances.",
                    "Career advancement within our Procurement & Logistics pillar."
                ]} />
            </>
        )
    },
    {
        slug: "project-management-lead",
        title: "Project Management Lead",
        department: "Project Execution",
        location: "Port Harcourt",
        type: "Full-Time",
        excerpt: "Drive disciplined execution and risk management across diverse infrastructure and facility management contracts.",
        content: (
            <>
                <ArticleP>
                    We are looking for a highly disciplined Project Management Lead to oversee the execution of multiple high-profile infrastructure and facility management projects. You will be responsible for ensuring that all projects are delivered on time, within budget, and to the exacting standards of our clients.
                </ArticleP>

                <ArticleH2>Core Responsibilities</ArticleH2>
                <ArticleList items={[
                    "Supervise the full project lifecycle from planning and budgeting to delivery and close-out.",
                    "Manage multi-disciplinary teams of engineers, contractors, and technology experts.",
                    "Develop detailed project schedules, resource plans, and risk mitigation strategies.",
                    "Monitor project performance using modern project management tools and KPIs.",
                    "Direct communication with clients, providing regular progress reports and updates.",
                    "Oversee site operations to ensure safety compliance and quality control."
                ]} />

                <ArticleH2>Qualifications</ArticleH2>
                <ArticleList items={[
                    "Bachelor’s degree in Engineering, Project Management, or a related field.",
                    "PMP or PRINCE2 certification is mandatory.",
                    "Minimum of 7 years of leadership experience in project management.",
                    "Excellent stakeholder management and communication skills.",
                    "Strong proficiency in MS Project, Primavera, or similar software.",
                    "Experience managing large-scale civil construction or facility management contracts."
                ]} />

                <ArticleH2>Benefits</ArticleH2>
                <ArticleList items={[
                    "Comprehensive leadership training and executive coaching.",
                    "Competitive compensation package with site-based allowances.",
                    "Health and wellness benefits for you and your family.",
                    "Impactful work that builds critical national infrastructure."
                ]} />
            </>
        )
    },
    {
        slug: "cybersecurity-analyst",
        title: "Cybersecurity Analyst",
        department: "Technology",
        location: "Remote / Abuja",
        type: "Hybrid",
        excerpt: "Strengthen our digital security posture by performing vulnerability assessments and managing incident response for government agencies.",
        content: (
            <>
                <ArticleP>
                    As a Cybersecurity Analyst at Greyland, you will play a critical role in protecting our clients' digital assets. You will be responsible for identifying vulnerabilities, managing incident responses, and implementing security frameworks for high-security environments, including government agencies and financial institutions.
                </ArticleP>

                <ArticleH2>Key Responsibilities</ArticleH2>
                <ArticleList items={[
                    "Perform regular vulnerability assessments and penetration testing on enterprise systems.",
                    "Monitor security logs and investigate potential security incidents.",
                    "Develop and implement robust security policies and incident response plans.",
                    "Conduct security awareness training for internal teams and clients.",
                    "Ensure compliance with global security standards (ISO 27001, NIST, etc.).",
                    "Configure and manage firewalls, IDS/IPS, and endpoint protection solutions."
                ]} />

                <ArticleH2>Technical Requirements</ArticleH2>
                <ArticleList items={[
                    "Degree in Cybersecurity, IT, or a related field.",
                    "Relevant certifications: CEH, CompTIA Security+, or CISM.",
                    "At least 4 years of experience in a security operations center (SOC) or security role.",
                    "Strong knowledge of network security protocols and cryptographic methods.",
                    "Experience with security monitoring tools like SIEM (Splunk/ELK).",
                    "Proficiency in scripting languages (Python/Bash) for security automation."
                ]} />

                <ArticleH2>What We Offer</ArticleH2>
                <ArticleList items={[
                    "Access to state-of-the-art security tools and technologies.",
                    "Flexible hybrid work model.",
                    "Sponsorship for advanced cybersecurity certifications.",
                    "Performance-based growth into Security Leadership roles.",
                    "Opportunity to protect critical national digital infrastructure."
                ]} />
            </>
        )
    },
    {
        slug: "facility-operations-manager",
        title: "Facility Operations Manager",
        department: "Support Services",
        location: "Lagos, Nigeria",
        type: "Full-Time",
        excerpt: "Oversee operational efficiency and preventive maintenance for large-scale commercial and institutional complexes.",
        content: (
            <>
                <ArticleP>
                    Greyland is seeking a Proactive Facility Operations Manager to lead the maintenance and operational management of our client's large-scale complexes. Your goal is to ensure maximum operational efficiency, safety, and comfort for all occupants while optimizing maintenance costs.
                </ArticleP>

                <ArticleH2>Core Responsibilities</ArticleH2>
                <ArticleList items={[
                    "Develop and execute preventive maintenance schedules for mechanical, electrical, and plumbing (MEP) systems.",
                    "Manage on-site facility teams, janitorial services, and security personnel.",
                    "Oversee vendor contracts and performance for facility-related services.",
                    "Manage facility budgets, ensuring cost-effective operations and utility management.",
                    "Ensure compliance with health, safety, and environmental (HSE) standards.",
                    "Develop emergency response and business continuity plans for the facility."
                ]} />

                <ArticleH2>Qualifications</ArticleH2>
                <ArticleList items={[
                    "Degree in Facility Management, Estate Management, or Engineering.",
                    "FMP or relevant professional membership (IFMA).",
                    "Minimum of 6 years of experience in managing high-rise or large-scale complexes.",
                    "Strong leadership and vendor management skills.",
                    "Excellent problem-solving skills and attention to detail.",
                    "Proficiency in CAFM (Computer-Aided Facility Management) software."
                ]} />

                <ArticleH2>Benefits</ArticleH2>
                <ArticleList items={[
                    "Stable and professional corporate career path.",
                    "Comprehensive health and life insurance.",
                    "Site-based allowances and professional membership sponsorship.",
                    "Collaborative work environment with expert support teams."
                ]} />
            </>
        )
    }
];
