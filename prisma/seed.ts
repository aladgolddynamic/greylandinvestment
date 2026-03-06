import { PrismaClient } from '@prisma/client';
import "dotenv/config";
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting comprehensive seed...');

  // 1. Create Admin User
  const hashedPassword = await bcrypt.hash('password123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@greyland.com' },
    update: {
      password: hashedPassword
    },
    create: {
      email: 'admin@greyland.com',
      name: 'Super Admin',
      username: 'admin',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
    },
  });
  console.log('Admin user created/updated');

  // 2. Services — 4+ per category
  const servicesData = [
    // ── TECHNOLOGY ─────────────────────────────────────────────────────────
    {
      slug: "software-development",
      title: "Software Development",
      category: "TECHNOLOGY",
      icon: "FaCode",
      shortDescription: "Bespoke software engineered around your exact business workflows.",
      fullDescription: "We design and build scalable, secure software systems tailored to your organization's operational DNA. From enterprise portals to complex data platforms, our solutions grow with your business.",
      features: [
        { title: "Custom Workflow Solutions", description: "Software shaped around your specific processes, not generic templates.", icon: "FaCheckCircle" },
        { title: "High Scalability", description: "Architectures that handle increasing data volumes and user loads without friction.", icon: "FaArrowUp" },
        { title: "Robust Security", description: "End-to-end encryption, access control, and security-first design.", icon: "FaLock" },
        { title: "API Integration", description: "Seamless connectivity with third-party platforms and government systems.", icon: "FaNetworkWired" }
      ]
    },
    {
      slug: "erp-solutions",
      title: "ERP Solutions",
      category: "TECHNOLOGY",
      icon: "FaCogs",
      shortDescription: "Cloud-based and on-premise ERP systems integrating your entire operation.",
      fullDescription: "We deliver comprehensive ERP implementations that unify Finance, HR, Procurement, and Supply Chain into a single intelligent platform, with real-time analytics and BI reporting.",
      features: [
        { title: "Unified Business Modules", description: "Finance, HR, procurement, and supply chain — all in one system.", icon: "FaLayerGroup" },
        { title: "Cloud & On-Premise", description: "Flexible deployment on cloud infrastructure or your own servers.", icon: "FaCloud" },
        { title: "Real-Time BI Reporting", description: "Live dashboards and reports driven by your operational data.", icon: "FaChartBar" },
        { title: "Data Migration", description: "Safe, accurate migration of your existing records to the new system.", icon: "FaDatabase" }
      ]
    },
    {
      slug: "it-consultancy",
      title: "IT Consultancy",
      category: "TECHNOLOGY",
      icon: "FaProjectDiagram",
      shortDescription: "Strategic technology roadmaps aligned with your business objectives.",
      fullDescription: "Our IT consultants bridge the gap between your vision and technical execution — from cloud migration strategies and cybersecurity frameworks to organizational digital transformation plans.",
      features: [
        { title: "Digital Strategy", description: "Structured IT roadmaps tied directly to measurable business outcomes.", icon: "FaTasks" },
        { title: "Cloud Migration", description: "Phased migration to AWS, Azure, or Google Cloud with zero disruption.", icon: "FaCloud" },
        { title: "Cybersecurity Roadmaps", description: "Layered security implementation plans for regulatory compliance.", icon: "FaShieldAlt" },
        { title: "Technology Audits", description: "Current-state assessment of your technical infrastructure.", icon: "FaSearchPlus" }
      ]
    },
    {
      slug: "network-infrastructure",
      title: "Network Infrastructure",
      category: "TECHNOLOGY",
      icon: "FaNetworkWired",
      shortDescription: "Reliable, high-performance network design and deployment.",
      fullDescription: "We design, install, and manage enterprise-grade network infrastructure — from structured cabling and switching to wireless networks and NOC monitoring — ensuring maximum uptime and performance.",
      features: [
        { title: "Structured Cabling", description: "Cat6A/fiber cabling installations compliant with TIA-568 standards.", icon: "FaNetworkWired" },
        { title: "Wireless Networks", description: "High-density Wi-Fi 6 deployments for offices, warehouses, and campuses.", icon: "FaDesktop" },
        { title: "NOC Monitoring", description: "24/7 network operations center monitoring and incident response.", icon: "FaChartPie" },
        { title: "Firewall & VPN", description: "Enterprise firewall setup and secure remote access configuration.", icon: "FaShieldAlt" }
      ]
    },

    // ── AUDIT & PROTECTION ─────────────────────────────────────────────────
    {
      slug: "data-protection",
      title: "Data Protection",
      category: "AUDIT & PROTECTION",
      icon: "FaUserShield",
      shortDescription: "Protecting sensitive organizational and customer data from unauthorized access.",
      fullDescription: "We implement comprehensive data protection frameworks that encompass classification, encryption, access management, and data loss prevention — ensuring your organization meets NDPR, GDPR, and ISO 27001 requirements.",
      features: [
        { title: "Data Classification", description: "Categorize data by sensitivity level to apply appropriate controls.", icon: "FaFileAlt" },
        { title: "Encryption Solutions", description: "At-rest and in-transit encryption for all critical data assets.", icon: "FaLock" },
        { title: "Access Control Management", description: "Role-based permissions and least-privilege access policies.", icon: "FaUserShield" },
        { title: "Data Loss Prevention", description: "DLP tools and policies that prevent unauthorized data exfiltration.", icon: "FaShieldAlt" }
      ]
    },
    {
      slug: "compliance-audit",
      title: "Compliance Audit",
      category: "AUDIT & PROTECTION",
      icon: "FaClipboardCheck",
      shortDescription: "Thorough compliance reviews against NDPR, GDPR, ISO 27001, and sector regulations.",
      fullDescription: "Our compliance audits provide a structured, evidence-based evaluation of your organization's adherence to data protection laws and industry standards, resulting in a detailed findings report and remediation plan.",
      features: [
        { title: "Regulatory Mapping", description: "Map your controls against NDPR, GDPR, ISO 27001, and sector frameworks.", icon: "FaClipboardCheck" },
        { title: "Evidence Collection", description: "Structured interviews and document reviews to build an evidence base.", icon: "FaFileAlt" },
        { title: "Findings & Gap Report", description: "Detailed audit report identifying non-conformities and risk levels.", icon: "FaChartBar" },
        { title: "Remediation Planning", description: "Prioritized action plan to close identified compliance gaps.", icon: "FaTasks" }
      ]
    },
    {
      slug: "gap-analysis",
      title: "Gap Analysis",
      category: "AUDIT & PROTECTION",
      icon: "FaSearchPlus",
      shortDescription: "Assessing the distance between your current security posture and required standards.",
      fullDescription: "Our gap analysis service benchmarks your current controls, processes, and policies against target frameworks. You receive a clear, prioritized view of what needs to change and in what order to optimize your compliance investment.",
      features: [
        { title: "Baseline Assessment", description: "Establish your current security and compliance posture in detail.", icon: "FaSearchPlus" },
        { title: "Framework Benchmarking", description: "Measure deviations against ISO 27001, NDPR, NIST, or custom standards.", icon: "FaChartBar" },
        { title: "Priority Scoring", description: "Risk-weighted scoring to identify which gaps to close first.", icon: "FaTasks" },
        { title: "Roadmap to Compliance", description: "Actionable, sequenced improvement roadmap with milestones.", icon: "FaProjectDiagram" }
      ]
    },
    {
      slug: "security-risk-assessment",
      title: "Security Risk Assessment",
      category: "AUDIT & PROTECTION",
      icon: "FaShieldAlt",
      shortDescription: "Identifying, quantifying, and prioritizing information security risks.",
      fullDescription: "We conduct rigorous security risk assessments that identify threats and vulnerabilities across your people, processes, and technology. Our risk register and heat maps give leadership clear visibility into your security exposure.",
      features: [
        { title: "Threat Identification", description: "Catalogue internal and external threats to your information assets.", icon: "FaShieldAlt" },
        { title: "Vulnerability Analysis", description: "Technical and process-level vulnerability discovery across systems.", icon: "FaSearchPlus" },
        { title: "Risk Quantification", description: "Assign likelihood and impact scores to produce a prioritized risk register.", icon: "FaChartBar" },
        { title: "Mitigation Controls", description: "Recommend technical and procedural controls for each identified risk.", icon: "FaLock" }
      ]
    },

    // ── ENGINEERING ────────────────────────────────────────────────────────
    {
      slug: "civil-construction",
      title: "Civil Construction",
      category: "ENGINEERING",
      icon: "FaBuilding",
      shortDescription: "Residential, commercial, and institutional building projects delivered on time.",
      fullDescription: "Our construction practice combines structural precision with rigorous site supervision to deliver buildings that meet the highest safety standards. We handle everything from design coordination through to completion and handover.",
      banner: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop",
      features: [
        { title: "Structural Integrity", description: "Design and execution focused on long-term structural performance.", icon: "FaBuilding" },
        { title: "Multi-Sector Projects", description: "Residential, commercial, institutional, and government builds.", icon: "FaCity" },
        { title: "Safety Compliance", description: "Adherence to SON, COREN, and site safety standards throughout.", icon: "FaHardHat" },
        { title: "Project Supervision", description: "Full-time resident engineers ensuring quality at every milestone.", icon: "FaClipboardCheck" }
      ]
    },
    {
      slug: "infrastructure-rehabilitation",
      title: "Infrastructure Rehabilitation",
      category: "ENGINEERING",
      icon: "FaTools",
      shortDescription: "Restoring and upgrading ageing civil infrastructure to modern standards.",
      fullDescription: "We assess, design, and execute rehabilitation programs for roads, bridges, water infrastructure, and public facilities — extending asset lifespans and meeting contemporary performance requirements.",
      banner: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=1600&auto=format&fit=crop",
      features: [
        { title: "Condition Assessment", description: "Detailed structural surveys and material testing of existing assets.", icon: "FaSearchPlus" },
        { title: "Structural Repair", description: "Reinforcement, restoration, and waterproofing of civil structures.", icon: "FaBuilding" },
        { title: "Roads & Drainage", description: "Pavement rehabilitation, drainage upgrades, and road markings.", icon: "FaTools" },
        { title: "Quality Assurance", description: "Material testing and third-party inspection at all phases.", icon: "FaClipboardCheck" }
      ]
    },
    {
      slug: "project-management",
      title: "Engineering Project Management",
      category: "ENGINEERING",
      icon: "FaTasks",
      shortDescription: "End-to-end management of complex engineering projects from concept to commissioning.",
      fullDescription: "Our licensed project managers apply PMI and FIDIC methodologies to control cost, schedule, and quality across large-scale engineering projects. We act as owners' representatives, ensuring your interests are protected at every stage.",
      banner: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1600&auto=format&fit=crop",
      features: [
        { title: "Scope & Schedule Control", description: "Detailed WBS, milestone tracking, and critical path management.", icon: "FaTasks" },
        { title: "Cost Management", description: "Budget development, cost control, and change order management.", icon: "FaChartBar" },
        { title: "Stakeholder Coordination", description: "Management of contractors, consultants, and regulatory bodies.", icon: "FaProjectDiagram" },
        { title: "Risk Management", description: "Site risk registers and proactive mitigation throughout the project life.", icon: "FaShieldAlt" }
      ]
    },
    {
      slug: "mep-engineering",
      title: "MEP Engineering",
      category: "ENGINEERING",
      icon: "FaHardHat",
      shortDescription: "Mechanical, electrical, and plumbing system design and installation.",
      fullDescription: "We deliver integrated MEP engineering services covering HVAC, electrical power distribution, lighting, plumbing, and fire suppression systems — coordinated with structural and architectural design for seamless installation.",
      banner: "https://images.unsplash.com/photo-1558489580-f8ca7800052a?q=80&w=1600&auto=format&fit=crop",
      features: [
        { title: "HVAC Design", description: "Energy-efficient heating, ventilation, and air-conditioning systems.", icon: "FaTools" },
        { title: "Electrical Systems", description: "HV/LV power distribution, lighting design, and earthing systems.", icon: "FaDesktop" },
        { title: "Plumbing & Drainage", description: "Potable water, sanitary drainage, and storm water systems.", icon: "FaWarehouse" },
        { title: "Fire Protection", description: "Sprinkler systems, fire detection, and suppression system design.", icon: "FaShieldAlt" }
      ]
    },

    // ── PROCUREMENT ────────────────────────────────────────────────────────
    {
      slug: "equipment-procurement",
      title: "Equipment Procurement",
      category: "PROCUREMENT",
      icon: "FaTruckLoading",
      shortDescription: "Sourcing of high-quality equipment tailored to needs.",
      fullDescription: "We specialize in the end-to-end procurement of high-quality equipment tailored to meet specific operational requirements. Our process ensures that every tool and machine sourced aligns with the highest performance and safety standards.",
      banner: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1600&auto=format&fit=crop",
      features: [
        { title: "Industry Compliance", description: "Compliance with industry standards and cost-efficiency.", icon: "FaClipboardCheck" },
        { title: "Timely Logistics", description: "Logistics ensuring timely delivery of critical tools to project sites.", icon: "FaTruck" }
      ]
    },
    {
      slug: "ict-equipment-supply",
      title: "ICT Equipment Supply",
      category: "PROCUREMENT",
      icon: "FaDesktop",
      shortDescription: "Supply of enterprise-grade ICT hardware and accessories.",
      fullDescription: "From high-performance servers to networking devices and scalable storage, we provide enterprise-grade ICT hardware designed to support robust and secure digital operations.",
      banner: "https://images.unsplash.com/photo-1558489580-f8ca7800052a?q=80&w=1600&auto=format&fit=crop",
      features: [
        { title: "Infrastructure Supply", description: "Servers, networking devices, and scalable storage systems.", icon: "FaServer" },
        { title: "Secure Operations", description: "Technological resources tailored for secure and efficient operations.", icon: "FaShieldAlt" }
      ]
    },
    {
      slug: "general-supplies",
      title: "General Supplies",
      category: "PROCUREMENT",
      icon: "FaBoxOpen",
      shortDescription: "Comprehensive supply services across multiple sectors.",
      fullDescription: "Our general supply team ensures seamless access to essential materials and operational resources across various industries, enabling project continuity and operational success.",
      banner: "https://images.unsplash.com/photo-1579412691970-d9d300057018?q=80&w=1600&auto=format&fit=crop",
      features: [
        { title: "Essential Materials", description: "Access to essential materials and operational resources at scale.", icon: "FaBoxes" },
        { title: "Smooth Execution", description: "Streamlined procurement processes for smooth project execution.", icon: "FaCheckCircle" }
      ]
    },
    {
      slug: "facility-management-procurement",
      title: "Facility Management",
      category: "PROCUREMENT",
      icon: "FaTools",
      shortDescription: "Services focused on maintaining operational efficiency.",
      fullDescription: "We provide structured procurement support for facility management, focusing on asset longevity, safety compliance, and operational optimization for both commercial and institutional environments.",
      banner: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1600&auto=format&fit=crop",
      features: [
        { title: "Operational Excellence", description: "Asset longevity, safety compliance, and performance optimization.", icon: "FaChargingStation" },
        { title: "Institutional Support", description: "Tailored support for commercial and institutional facility environments.", icon: "FaBuilding" }
      ]
    },
  ];

  for (const s of servicesData) {
    const existing = await prisma.service.findUnique({ where: { slug: s.slug } });
    const updateData: any = {
      title: s.title,
      category: s.category as any,
      icon: s.icon,
      shortDescription: s.shortDescription,
      fullDescription: s.fullDescription,
      status: "PUBLISHED" as any,
      banner: (s as any).banner,
    };

    if (existing) {
      // Clear features and illustrations and recreate
      await prisma.serviceFeature.deleteMany({ where: { serviceId: existing.id } });
      await prisma.serviceIllustration.deleteMany({ where: { serviceId: existing.id } });

      await prisma.service.update({
        where: { id: existing.id },
        data: {
          ...updateData,
          features: {
            create: s.features
          },
          illustrations: {
            create: ((s as any).illustrations || []).map((url: string) => ({ url }))
          }
        }
      });
    } else {
      await prisma.service.create({
        data: {
          ...updateData,
          slug: s.slug,
          features: {
            create: s.features
          },
          illustrations: {
            create: ((s as any).illustrations || []).map((url: string) => ({ url }))
          }
        }
      });
    }
  }
  console.log('Services seeded (16 total across 4 categories)');

  // 3. News Articles
  const newsData = [
    {
      slug: "future-of-enterprise-erp",
      title: "Future of Enterprise ERP: Cloud-First Strategies",
      category: "Technology",
      date: "Feb 15, 2026",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop",
      excerpt: "How modern organizations are leveraging cloud-based ERP systems to streamline HR, finance, and supply chain operations.",
      status: "PUBLISHED",
      contentBlocks: [
        { id: 'b1', type: 'paragraph', content: 'The landscape of Enterprise Resource Planning (ERP) is undergoing a seismic shift. Traditionally, ERP systems were massive, on-premise installations that required years to deploy, millions in maintenance, and a small army of technicians just to keep the lights on. Today, the cloud-first approach has redefined what is possible for the modern enterprise, offering a level of scalability and intelligence that was previously unimaginable.' },
        { id: 'b2', type: 'h2', content: 'The Agility Advantage' },
        { id: 'b3', type: 'paragraph', content: 'One of the primary drivers of cloud ERP adoption is agility. Cloud-native platforms allow for rapid deployment and updates without the traditional downtime associated with legacy on-premise systems. This means businesses can react faster to market changes, regulatory updates, and internal reorganization. In a volatile global economy, the ability to pivot your financial reporting or supply chain tracking in days rather than months is a significant competitive edge.' },
        { id: 'b4', type: 'callout', calloutTitle: 'Key Insight', content: 'Organizations that migrate to cloud ERP see an average 20% reduction in operational costs within the first 18 months, primarily due to reduced infrastructure and IT staffing requirements. Furthermore, the shift from CAPEX to OPEX allows for better cash flow management and more predictable budgeting cycles.' },
        { id: 'b5', type: 'h3', content: 'Integrating Artificial Intelligence' },
        { id: 'b6', type: 'paragraph', content: 'The next frontier is AI-driven automation within the ERP suite. By leveraging machine learning models directly on the transaction layer, modern ERPs can now perform predictive finance—forecasting cash flow with 95% accuracy by analyzing historical patterns and market signals. HR modules are also evolving, using AI to automate complex workflows like talent gap analysis.' },
        { id: 'b7', type: 'bullet-list', content: 'Real-time data visibility across departments, eliminating data silos that hinder decision-making.\nSeamless integration with third-party SaaS tools via robust API ecosystems.\nAutomatic regulatory compliance updates, ensuring your business stays ahead of tax and labor law changes.\nScalable architecture that supports global expansion without requiring new physical data centers.' },
        { id: 'b8', type: 'paragraph', content: 'As we look toward 2027, the emphasis will shift from mere data storage to data intelligence. The successful enterprise will not be the one with the most data, but the one that can extract actionable insights from its ERP system in real-time. Greyland Investment is at the forefront of this transition.' }
      ]
    },
    {
      slug: "edge-computing-west-africa",
      title: "The Rise of Edge Computing in West Africa",
      category: "Technology",
      date: "Mar 02, 2026",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc48?q=80&w=1000&auto=format&fit=crop",
      excerpt: "How localized data processing is revolutionizing industrial automation and reducing latency for regional enterprises.",
      status: "PUBLISHED",
      contentBlocks: [
        { id: 'b1', type: 'paragraph', content: 'Edge computing is bringing processing power closer to the source of data, reducing the need for long-distance communication with centralized data centers. In the context of West Africa, where bandwidth can be expensive and international fiber-optic latency remains a challenge for real-time applications, this shift is more than just a trend—it is transformative infrastructure.' },
        { id: 'b2', type: 'h2', content: 'Scaling Industrial Growth' },
        { id: 'b3', type: 'paragraph', content: 'In manufacturing hubs across Lagos and Port Harcourt, edge nodes are enabling real-time monitoring of machinery and energy consumption. Instead of sending terabytes of raw telemetry data to a remote cloud server in Europe or North America, localized gateways process the data instantly, alerting engineers to potential failures before they happen.' },
        { id: 'b4', type: 'quote', content: 'The promise of the Fourth Industrial Revolution can only be realized if the data processing happens at the speed of the machine. In West Africa, edge computing is the bridge that makes this possible.' },
        { id: 'b5', type: 'bullet-list', content: 'Lower Latency: Decisions made in milliseconds rather than seconds.\nImproved Data Privacy: Sensitive industrial data stays on-site, reducing the exposure surface for cyberattacks.\nReduced Bandwidth Costs: Only essential metadata and high-level reports are synced to the cloud, saving massive amounts on data transit.\nEnhanced Reliability: Operations continue autonomously even during broad internet outages or fiber breaks.' },
        { id: 'b6', type: 'paragraph', content: 'As we move deeper into 2026, the convergence of 5G and edge computing will further accelerate the digital transformation of the regional energy and manufacturing sectors. We are already seeing successful pilot programs.' }
      ]
    },
    {
      slug: "ndpr-compliance-guide",
      title: "Navigating NDPR: What Your Business Needs to Know",
      category: "Audit & Protection",
      date: "Mar 05, 2026",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop",
      excerpt: "A comprehensive look at the Nigerian Data Protection Regulation and the steps required for organizational compliance.",
      status: "PUBLISHED",
      contentBlocks: [
        { id: 'b1', type: 'paragraph', content: 'Compliance with the Nigeria Data Protection Regulation (NDPR) is no longer a "nice-to-have" option for businesses operating in Nigeria. It is a critical component of institutional trust and a prerequisite for doing business with global partners. As the Nigeria Data Protection Commission (NDPC) ramps up enforcement, the risks of non-compliance—both financial and reputational—have never been higher.' },
        { id: 'b2', type: 'quote', content: 'Data is the new oil, and trust is the refinery. Without compliance, you have neither the energy to grow nor the permission to operate in the modern digital economy.' },
        { id: 'b3', type: 'h2', content: 'Core Pillars of Compliance' },
        { id: 'b4', type: 'paragraph', content: 'Businesses must focus on a structured approach to data governance. This begins with a thorough data discovery process: identifying what data is being collected, why it is being collected, and where it is being stored. Many organizations are surprised to find that personal data is scattered across legacy systems and unmanaged SaaS tools.' },
        { id: 'b5', type: 'bullet-list', content: 'Data Mapping: A full audit of personal data flow within the organization from collection to disposal.\nPrivacy Impact Assessments (PIA): Evaluating the risk of new projects or technologies before they go live.\nSecurity Audits: Regular technical verification of data protection controls, including encryption and access management.\nStaff Training: Ensuring every employee—from the front desk to the boardroom—understands their role in privacy.' },
        { id: 'b6', type: 'paragraph', content: 'Failure to comply can result in significant fines—up to 2% of annual gross revenue—and more importantly, a permanent loss of customer confidence. Greyland Investment provides the technical and procedural audit services necessary.' }
      ]
    },
    {
      slug: "safety-standards-infrastructure",
      title: "Safety Standards in Modern Infrastructure Rehab",
      category: "Engineering",
      date: "Feb 12, 2026",
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=1000&auto=format&fit=crop",
      excerpt: "A look at the innovative safety protocols being implemented across our major structural rehabilitation projects.",
      status: "PUBLISHED",
      contentBlocks: [
        { id: 'b1', type: 'paragraph', content: 'Infrastructure rehabilitation is more than just repair; it\'s a commitment to longevity and public safety. When working on high-traffic bridges, aging power substations, or heavy industrial facilities, the margin for error is effectively zero. At Greyland, our approach to engineering starts and ends with safety—not just as a checkbox, but as a design philosophy.' },
        { id: 'b2', type: 'h2', content: 'Innovative Safety Protocols' },
        { id: 'b3', type: 'paragraph', content: 'Modern engineering requires modern safety. We have moved beyond basic PPE into real-time site monitoring and predictive hazard analysis. By using IoT sensors embedded in structural supports, we can monitor stress levels during the rehabilitation process itself. This real-time feedback loop informs our engineers if a particular structural adjustment is causing unforeseen stresses elsewhere.' },
        { id: 'b4', type: 'paragraph', content: 'This data-driven approach allows site managers to halt operations if structural integrity deviates by even a fraction of a percent, protecting both the workforce and the long-term viability of the asset. Furthermore, we employ drone-based thermal imaging to inspect welds and pours.' },
        { id: 'b5', type: 'quote', content: 'Every worker should return home in the same condition they arrived. Safety is not a cost of doing business; it is the foundation of engineering excellence and the true measure of a project\'s success.' }
      ]
    },
    {
      slug: "sustainable-building-materials",
      title: "Sustainable Materials in Nigerian Construction",
      category: "Engineering",
      date: "Mar 01, 2026",
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1000&auto=format&fit=crop",
      excerpt: "Exploring eco-friendly alternatives to traditional concrete and steel for the next generation of skyscrapers.",
      status: "PUBLISHED",
      contentBlocks: [
        { id: 'b1', type: 'paragraph', content: 'Sustainability is becoming a core pillar of modern engineering projects. As the global construction industry looks to reduce its massive carbon footprint, Nigeria is seeing a surge in interest for eco-friendly building materials. This isn\'t just about "green-washing"—it is a practical response to resource scarcity and the rising cost of traditional carbon-intensive materials like standard Portland cement and virgin steel.' },
        { id: 'b2', type: 'h3', content: 'The Future of Green Steel' },
        { id: 'b3', type: 'paragraph', content: 'By utilizing green steel produced with renewable energy and recycled components, we can significantly reduce the carbon footprint of future infrastructure. While the upfront material costs are currently higher, the long-term lifecycle savings and the ability to meet international green building certification standards (like LEED or EDGE) are making it an increasingly attractive option for institutional investors and multi-national tenants.' },
        { id: 'b4', type: 'callout', calloutTitle: 'Material Spotlight', content: 'Recycled Aggregate Concrete (RAC) is being tested for use in non-structural elements of urban skyscrapers across Lagos. This technology allows for the reuse of demolition waste, potentially diverting thousands of tons of construction debris from landfills while maintaining structural requirements for specific use-cases.' },
        { id: 'b5', type: 'paragraph', content: 'However, adopting these materials requires a shift in procurement strategy and a deep understanding of structural performance under local climate conditions. High humidity and saline environments in coastal cities like Lagos require specific coatings and additives even for sustainable materials. Greyland is leading the research into how these eco-friendly options perform over decade-long cycles.' },
        { id: 'b6', type: 'paragraph', content: 'The next five years will be defined by the "Green Transition" in Nigerian real estate. Developers who embrace these materials early will find themselves better positioned to attract high-value tenants and institutional capital that is increasingly tied to ESG (Environmental, Social, and Governance) targets.' }
      ]
    },
    {
      slug: "supply-chain-resilience-2026",
      title: "Supply Chain Resilience in the Industrial Sector",
      category: "Procurement",
      date: "Feb 28, 2026",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1000&auto=format&fit=crop",
      excerpt: "How strategic procurement and diversified sourcing are mitigating global logistics disruptions for local projects.",
      status: "PUBLISHED",
      contentBlocks: [
        { id: 'b1', type: 'paragraph', content: 'Procurement is the backbone of any large-scale infrastructure project. In 2026, resilience has firmly replaced cost-optimization as the top priority for procurement officers. The lessons of the past few years have taught us that the "cheapest" supplier is often the most expensive when they fail to deliver during a global supply chain shock or local logistical bottleneck.' },
        { id: 'b2', type: 'h2', content: 'Strategic Sourcing in a Volatile World' },
        { id: 'b3', type: 'paragraph', content: 'Diversifying suppliers across multiple geographic regions ensures that local projects are not stalled by international logistics bottlenecks or regional trade disputes. We are seeing a move away from the traditional "Just-in-Time" delivery toward a more conservative "Just-in-Case" inventory management for critical long-lead items like specialized turbines and heavy electrical switchgear.' },
        { id: 'b4', type: 'bullet-list', content: 'Regional Sourcing Hubs: Establishing relationships with suppliers in neighboring economic zones (ECOWAS) to reduce dependence on single-country exports.\nDigital Procurement Portals: Implementing real-time tracking of order status, logistics, and vendor performance history.\nSupplier Risk Scoring: Evaluating partners not just on price, but on financial stability, ethical compliance, and environmental footprint.\nStrategic Stockpiling: Maintaining controlled reserves of critical consumables to buffer against sudden port closures or currency fluctuations.' },
        { id: 'b5', type: 'paragraph', content: 'A resilient supply chain is the only way to ensure that multi-year engineering projects stay on schedule and within budget. At Greyland, we leverage our global network to provide our clients with a diversified procurement pipeline that can withstand the unexpected. In 2026, the real value of a procurement partner is their ability to guarantee availability when everyone else is facing delays.' }
      ]
    },
    {
      slug: "iso-27001-certification-benefits",
      title: "Why ISO 27001 is the Gold Standard for Security",
      category: "Audit & Protection",
      date: "Mar 04, 2026",
      image: "https://images.unsplash.com/photo-1510511459019-5dee99c48db8?q=80&w=1000&auto=format&fit=crop",
      excerpt: "Understanding the competitive advantage and internal security benefits of achieving ISO 27001 certification in 2026.",
      status: "PUBLISHED",
      contentBlocks: [
        { id: 'b1', type: 'paragraph', content: 'ISO 27001 is more than a certificate to hang in the lobby; it is a comprehensive framework for operational excellence. It establishes a robust Information Security Management System (ISMS) that scales with your organization, moving security from a technical "IT problem" to a core business discipline that protects your most valuable intellectual assets.' },
        { id: 'b2', type: 'h2', content: 'Building a Culture of Security' },
        { id: 'b3', type: 'paragraph', content: 'The true value of ISO 27001 lies in its holistic approach. It doesn\'t just look at firewalls and encryption; it looks at human behavior, physical security of office spaces, and business continuity planning. By mandating a risk-based approach, it ensures that security spend is directed toward the threats that actually matter to your specific business model, rather than chasing every new headline.' },
        { id: 'b4', type: 'bullet-list', content: 'Risk-Based Thinking: Stop chasing every new threat and focus resources on the risks that pose the greatest impact on your business operations.\nLegal Compliance: ISO 27001 automatically aligns with many international and local data laws, including NDPR and GDPR, simplifying legal audits.\nEnhanced Reputation: It provides an independent, third-party validation that you take client data seriously, a key factor in winning enterprise contracts.\nOperational Consistency: By standardizing security processes across all departments, you reduce the "silo" effect that often leads to security gaps.' },
        { id: 'b5', type: 'paragraph', content: 'In an era where cyber threats are becoming more sophisticated, ISO 27001 provides the blueprint for building a resilient organization. It is the foundation upon which long-term client trust is built. Greyland specializes in guiding organizations through the rigorous audit process to achieve and maintain this prestigious certification.' }
      ]
    },
    {
      slug: "digital-procurement-transformation",
      title: "Digital Transformation in General Supplies",
      category: "Procurement",
      date: "Mar 03, 2026",
      image: "https://images.unsplash.com/photo-1512418490979-92798ccc13a0?q=80&w=1000&auto=format&fit=crop",
      excerpt: "How cloud-based procurement portals are improving transparency and speed for general facility management supplies.",
      status: "PUBLISHED",
      contentBlocks: [
        { id: 'b1', type: 'paragraph', content: 'The shift from paper-based to digital procurement is accelerating delivery timelines and dramatically reducing errors in the supply chain for essential commercial materials. For general facility management and supplies, where the volume of transactions is high but individual item cost can be low, the administrative overhead of traditional procurement often eats into the operating margins.' },
        { id: 'b2', type: 'h3', content: 'Automating the Request-to-Receipt Cycle' },
        { id: 'b3', type: 'paragraph', content: 'By digitizing the entire procurement lifecycle—from the initial requisition via a mobile app to the final digital inspection at the loading dock—organizations can eliminate human bottlenecks and gain unprecedented visibility into their spending patterns. Digital portals allow for automated price comparisons across a pre-vetted vendor list, ensuring that every Naira spent is optimized for value.' },
        { id: 'b4', type: 'quote', content: 'Transparency is the enemy of waste. Digital portals ensure that every purchase is authorized, tracked, and verified, making the procurement office a center for value creation rather than a gatekeeper.' },
        { id: 'b5', type: 'paragraph', content: 'For facility management and general supplies, the efficiency gains from digital transformation can translate into millions in annual savings. Moreover, the data generated allows for predictive reordering—knowing exactly when to restock consumables based on real-time usage data rather than arbitrary calendars.' },
        { id: 'b6', type: 'paragraph', content: 'As we assist our clients in implementing these digital systems, we focus on user adoption. Our strategy involves integrated training and intuitive interfaces that make corporate procurement as simple as consumer e-commerce, ensuring a smooth transition to a more modern, efficient operation.' }
      ]
    }
  ];

  for (const n of newsData) {
    await prisma.newsArticle.upsert({
      where: { slug: n.slug },
      update: {
        title: n.title,
        category: n.category,
        date: n.date,
        image: n.image,
        excerpt: n.excerpt,
        status: n.status as any,
        contentBlocks: n.contentBlocks as any
      },
      create: {
        title: n.title,
        slug: n.slug,
        category: n.category,
        date: n.date,
        image: n.image,
        excerpt: n.excerpt,
        status: n.status as any,
        contentBlocks: n.contentBlocks as any
      }
    });
  }
  console.log('News articles seeded');

  // 4. Careers
  const careersData = [
    {
      slug: "senior-structural-engineer",
      title: "Senior Structural Engineer",
      department: "Engineering",
      location: "Abuja, FCT",
      employmentType: "Full-Time",
      experienceLevel: "Senior",
      deadline: new Date("2026-04-30"),
      excerpt: "Join our Engineering & Execution pillar to oversee structural design and integrity for high-impact urban development projects.",
      status: "PUBLISHED",
      responsibilities: [
        "Lead the structural analysis and design of complex buildings",
        "Review and approve structural drawings",
        "Provide technical leadership"
      ],
      requirements: [
        "Bachelor’s degree in Civil or Structural Engineering",
        "COREN registration",
        "Minimum of 8-10 years experience"
      ]
    },
    {
      slug: "full-stack-software-architect",
      title: "Full-Stack Software Architect",
      department: "Technology",
      location: "Lagos / Hybrid",
      employmentType: "Full-Time",
      experienceLevel: "Expert",
      deadline: new Date("2026-05-15"),
      excerpt: "Lead the development of scalable enterprise ERP solutions and secure digital infrastructure.",
      status: "PUBLISHED",
      responsibilities: [
        "Architect and design end-to-end full-stack applications",
        "Lead development of complex ERP systems",
        "Establish coding standards"
      ],
      requirements: [
        "B.Sc/M.Sc in Computer Science",
        "Proven experience as a Software Architect",
        "Expertise in React, Next.js, Node.js"
      ]
    }
  ];

  for (const c of careersData) {
    await prisma.career.upsert({
      where: { slug: c.slug },
      update: {
        title: c.title,
        department: c.department,
        location: c.location,
        employmentType: c.employmentType,
        experienceLevel: c.experienceLevel,
        deadline: c.deadline,
        excerpt: c.excerpt,
        status: c.status as any,
        responsibilities: c.responsibilities as any,
        requirements: c.requirements as any
      },
      create: {
        slug: c.slug,
        title: c.title,
        department: c.department,
        location: c.location,
        employmentType: c.employmentType,
        experienceLevel: c.experienceLevel,
        deadline: c.deadline,
        excerpt: c.excerpt,
        status: c.status as any,
        responsibilities: c.responsibilities as any,
        requirements: c.requirements as any
      }
    });
  }
  console.log('Careers seeded');

  // 5. Projects — 4 per category
  const projectsData = [
    // ── TECHNOLOGY ─────────────────────────────────────────────────────────
    {
      title: "Enterprise ERP Deployment",
      industry: "Financial Services",
      duration: "6 Months",
      location: "Lagos, Nigeria",
      description: "Implemented a cloud-based ERP system integrating finance, HR, and procurement operations.",
      deliverables: ["Custom workflow automation", "Data migration & integration", "User training & compliance setup"],
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop",
      category: "tech-digital",
      status: "Completed",
      publicationStatus: "PUBLISHED"
    },
    {
      title: "Cybersecurity Infrastructure Upgrade",
      industry: "Government Agency",
      duration: "4 Months",
      location: "Abuja, FCT",
      description: "Strengthened digital security posture through vulnerability assessment and firewall architecture redesign.",
      deliverables: ["Risk assessment & penetration testing", "Network segmentation", "Continuous monitoring deployment"],
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop",
      category: "tech-digital",
      status: "Completed",
      publicationStatus: "PUBLISHED"
    },
    {
      title: "Business Intelligence Dashboard",
      industry: "Private Sector",
      duration: "3 Months",
      location: "Remote/Port Harcourt",
      description: "Developed executive dashboards converting operational data into real-time insights.",
      deliverables: ["KPI visualization", "Performance analytics", "Cloud deployment"],
      image: "https://images.unsplash.com/photo-1551288049-bbda38a10ad1?q=80&w=1000&auto=format&fit=crop",
      category: "tech-digital",
      status: "Completed",
      publicationStatus: "PUBLISHED"
    },
    {
      title: "Cloud Migration Strategy",
      industry: "Telecom",
      duration: "5 Months",
      location: "Lagos / Hybrid",
      description: "Executing a phased migration of legacy on-premise infrastructure to a secure hybrid cloud environment.",
      deliverables: ["Infrastructure audit", "Migration roadmap", "Cloud security layering"],
      image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1000&auto=format&fit=crop",
      category: "tech-digital",
      status: "Ongoing",
      publicationStatus: "PUBLISHED"
    },

    // ── COMPLIANCE ─────────────────────────────────────────────────────────
    {
      title: "Data Privacy Compliance Audit",
      industry: "Healthcare Sector",
      duration: "5 Months",
      location: "Lagos, Nigeria",
      description: "Conducted a comprehensive audit of data handling processes to ensure GDPR and local privacy compliance.",
      deliverables: ["Compliance gap report", "Privacy impact assessment", "Framework implementation"],
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1000&auto=format&fit=crop",
      category: "compliance-audit",
      status: "Completed",
      publicationStatus: "PUBLISHED"
    },
    {
      title: "Security Risk & Vulnerability Assessment",
      industry: "Energy Sector",
      duration: "3 Months",
      location: "Port Harcourt",
      description: "Executed a deep-dive security assessment of critical industrial control systems.",
      deliverables: ["Vulnerability mapping", "Threat modeling", "Mitigation roadmap"],
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000&auto=format&fit=crop",
      category: "compliance-audit",
      status: "Completed",
      publicationStatus: "PUBLISHED"
    },
    {
      title: "Policy & Governance Framework",
      industry: "Multi-national Corp",
      duration: "6 Months",
      location: "Abuja, FCT",
      description: "Developed and deployed enterprise-wide data governance and security policies.",
      deliverables: ["Custom policy documentation", "Stakeholder alignment", "Compliance monitoring setup"],
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1000&auto=format&fit=crop",
      category: "compliance-audit",
      status: "Completed",
      publicationStatus: "PUBLISHED"
    },
    {
      title: "Regulatory Gap Analysis",
      industry: "Banking Sector",
      duration: "2 Months",
      location: "Lagos, Nigeria",
      description: "Mapping existing technical controls against the latest Central Bank regulatory frameworks.",
      deliverables: ["Control mapping", "Non-conformity register", "Remediation plan"],
      image: "https://images.unsplash.com/photo-1554224155-1696413575b3?q=80&w=1000&auto=format&fit=crop",
      category: "compliance-audit",
      status: "Ongoing",
      publicationStatus: "PUBLISHED"
    },

    // ── ENGINEERING ────────────────────────────────────────────────────────
    {
      title: "Commercial Office Complex",
      industry: "Urban Development",
      duration: "12 Months",
      location: "Abuja, Nigeria",
      description: "Executed full-scope construction including civil works, structural framework, and finishing.",
      deliverables: ["Structural engineering", "Project supervision", "Regulatory compliance management"],
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop",
      category: "engineering-execution",
      status: "Completed",
      publicationStatus: "PUBLISHED"
    },
    {
      title: "Institutional Facility Construction",
      industry: "Public Sector",
      duration: "10 Months",
      location: "Kano State",
      description: "Delivered a durable institutional facility aligned with safety and infrastructure standards.",
      deliverables: ["Civil & structural works", "Mechanical & electrical integration", "Quality assurance monitoring"],
      image: "https://images.unsplash.com/photo-1517089596392-db9a5e9428b6?q=80&w=1000&auto=format&fit=crop",
      category: "engineering-execution",
      status: "Completed",
      publicationStatus: "PUBLISHED"
    },
    {
      title: "Infrastructure Rehabilitation",
      industry: "State-Level",
      duration: "8 Months",
      location: "Ogun State",
      description: "Managed rehabilitation and upgrade of critical infrastructure systems.",
      deliverables: ["Structural restoration", "Drainage system upgrade", "On-time delivery execution"],
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=1000&auto=format&fit=crop",
      category: "engineering-execution",
      status: "Completed",
      publicationStatus: "PUBLISHED"
    },
    {
      title: "Luxury Residential Estate",
      industry: "Real Estate",
      duration: "18 Months",
      location: "Lagos, Nigeria",
      description: "Premium residential development featuring integrated smart home technology and sustainable infrastructure.",
      deliverables: ["Site preparation", "Structural execution", "Smart system integration"],
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000&auto=format&fit=crop",
      category: "engineering-execution",
      status: "Ongoing",
      publicationStatus: "PUBLISHED"
    },

    // ── PROCUREMENT ────────────────────────────────────────────────────────
    {
      title: "Enterprise ICT Equipment Supply",
      industry: "Telecom Sector",
      duration: "3 Months",
      location: "Nationwide",
      description: "Supplied and deployed enterprise-grade servers, networking devices, and storage systems.",
      deliverables: ["Hardware sourcing", "Installation & configuration", "Post-deployment support"],
      image: "https://images.unsplash.com/photo-1558489580-f8ca7800052a?q=80&w=1000&auto=format&fit=crop",
      category: "procurement-support",
      status: "Completed",
      publicationStatus: "PUBLISHED"
    },
    {
      title: "Large-Scale Equipment Procurement",
      industry: "Construction Sector",
      duration: "Ongoing",
      location: "Regional",
      description: "Coordinated sourcing and delivery of heavy-duty operational equipment.",
      deliverables: ["Vendor evaluation", "Cost optimization", "Compliance assurance"],
      image: "https://images.unsplash.com/photo-1531834350110-8025287f620f?q=80&w=1000&auto=format&fit=crop",
      category: "procurement-support",
      status: "Ongoing",
      publicationStatus: "PUBLISHED"
    },
    {
      title: "Facility Management Contract",
      industry: "Commercial Complex",
      duration: "24 Months",
      location: "Victoria Island, Lagos",
      description: "Provided structured facility management services for operational sustainability.",
      deliverables: ["Preventive maintenance", "Safety compliance audits", "Asset performance monitoring"],
      image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1000&auto=format&fit=crop",
      category: "procurement-support",
      status: "Ongoing",
      publicationStatus: "PUBLISHED"
    },
    {
      title: "Strategic Sourcing Partnership",
      industry: "Industrial Sector",
      duration: "12 Months",
      location: "Lagos / Ogun",
      description: "Managing long-term supply chain partnerships for critical industrial consumables.",
      deliverables: ["Supplier vetting", "Just-in-time delivery setup", "Logistics optimization"],
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1000&auto=format&fit=crop",
      category: "procurement-support",
      status: "Ongoing",
      publicationStatus: "PUBLISHED"
    }
  ];

  for (const p of projectsData) {
    const slug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    await prisma.project.upsert({
      where: { slug },
      update: {
        industry: p.industry,
        duration: p.duration,
        location: p.location,
        description: p.description,
        deliverables: p.deliverables as any,
        image: p.image,
        category: p.category,
        status: p.status as any,
        publicationStatus: p.publicationStatus as any
      },
      create: {
        title: p.title,
        slug: slug,
        industry: p.industry,
        duration: p.duration,
        location: p.location,
        description: p.description,
        deliverables: p.deliverables as any,
        image: p.image,
        category: p.category,
        status: p.status as any,
        publicationStatus: p.publicationStatus as any
      }
    });
  }
  console.log('Projects seeded');

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
