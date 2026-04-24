import { PrismaClient } from '@prisma/client';
import "dotenv/config";
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting full data population (Task 1 & 2)...');

  // Clear existing data to ensure clean slate
  await prisma.project.deleteMany();
  await prisma.newsArticle.deleteMany();
  console.log('✔ Existing projects and news articles cleared');

  // 1. Create Admin User
  const hashedPassword = await bcrypt.hash('Password123!', 10);
  await prisma.user.upsert({
    where: { email: 'admin@greyland.com' },
    update: { password: hashedPassword },
    create: {
      email: 'admin@greyland.com',
      name: 'Super Admin',
      username: 'admin',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
    },
  });
  console.log('✔ Admin user seeded');

  // 2. Company Info
  await prisma.companyInfo.upsert({
    where: { id: 'singleton' },
    update: {
      name: 'Greyland Investment Ltd',
      tagline: 'Innovative Technical Solutions & Infrastructure',
      description: 'Greyland Investment Ltd is a premier multisectoral firm providing cutting-edge solutions across Engineering, Technology, and Infrastructure.',
      email: 'info@greylandinvestment.com',
      phone: '+234 (0) 803 123 4567',
      address: 'Suite 302, Engineering Plaza, Airport Road, Lugbe, Abuja, Nigeria',
      socialLinks: [
        { platform: 'facebook', url: 'https://facebook.com/greyland' },
        { platform: 'twitter', url: 'https://twitter.com/greyland' },
        { platform: 'linkedin', url: 'https://linkedin.com/company/greyland' },
        { platform: 'instagram', url: 'https://instagram.com/greyland' }
      ],
    },
    create: {
      id: 'singleton',
      name: 'Greyland Investment Ltd',
      tagline: 'Innovative Technical Solutions & Infrastructure',
      description: 'Greyland Investment Ltd is a premier multisectoral firm providing cutting-edge solutions across Engineering, Technology, and Infrastructure.',
      email: 'info@greylandinvestment.com',
      phone: '+234 (0) 803 123 4567',
      address: 'Suite 302, Engineering Plaza, Airport Road, Lugbe, Abuja, Nigeria',
      socialLinks: [
        { platform: 'facebook', url: 'https://facebook.com/greyland' },
        { platform: 'twitter', url: 'https://twitter.com/greyland' },
        { platform: 'linkedin', url: 'https://linkedin.com/company/greyland' },
        { platform: 'instagram', url: 'https://instagram.com/greyland' }
      ],
    },
  });

  // 3. Page Content
  await prisma.pageContent.upsert({
    where: { id: 'homepage' },
    update: {
      data: {
        heroTitle: 'Innovative Technology\nInfrastructure Solutions',
        heroSubtitle: 'Delivering enterprise digital transformation alongside engineering, contracting, and supply services across public and private sectors.',
        featuredNewsId: 'news-1',
        stats: [
          { label: 'Projects Completed', value: '150+' },
          { label: 'Technical Experts', value: '45+' },
          { label: 'Offices Nationwide', value: '4' },
          { label: 'Years of Excellence', value: '12' }
        ]
      }
    },
    create: {
      id: 'homepage',
      data: {
        heroTitle: 'Innovative Technology\nInfrastructure Solutions',
        heroSubtitle: 'Delivering enterprise digital transformation alongside engineering, contracting, and supply services across public and private sectors.',
        featuredNewsId: 'news-1',
        stats: [
          { label: 'Projects Completed', value: '150+' },
          { label: 'Technical Experts', value: '45+' },
          { label: 'Offices Nationwide', value: '4' },
          { label: 'Years of Excellence', value: '12' }
        ]
      }
    },
  });

  // 4. Projects (Task 1) - Standardized IDs and High Quality Images
  const projectsData = [
    // 01. Technology & Digital
    {
      title: "Enterprise ERP Deployment",
      slug: "enterprise-erp-deployment",
      industry: "Financial Services",
      duration: "6 Months",
      location: "Lagos, Nigeria",
      description: "Implemented a cloud-based ERP system integrating finance, HR, and procurement operations.",
      deliverables: ["Custom workflow automation", "Data migration & integration", "User training & compliance setup"],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
      category: "TECHNOLOGY_DIGITAL",
      status: "Completed",
      featured: true,
      publicationStatus: "PUBLISHED"
    },
    {
      title: "Cybersecurity Infrastructure Upgrade",
      slug: "cybersecurity-upgrade-gov",
      industry: "Government Agency",
      duration: "4 Months",
      location: "Abuja, FCT",
      description: "Strengthened digital security posture through vulnerability assessment and firewall architecture redesign.",
      deliverables: ["Risk assessment & penetration testing", "Network segmentation", "Continuous monitoring deployment"],
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop",
      category: "TECHNOLOGY_DIGITAL",
      status: "Completed",
      featured: true,
      publicationStatus: "PUBLISHED"
    },
    {
      title: "Business Intelligence Dashboard",
      slug: "bi-dashboard-executive",
      industry: "Private Sector",
      duration: "3 Months",
      location: "Remote/Port Harcourt",
      description: "Developed executive dashboards converting operational data into real-time insights.",
      deliverables: ["KPI visualization", "Performance analytics", "Cloud deployment"],
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
      category: "TECHNOLOGY_DIGITAL",
      status: "Completed",
      featured: true,
      publicationStatus: "PUBLISHED"
    },
    // 02. Engineering & Execution
    {
      title: "Commercial Office Complex",
      slug: "commercial-office-complex-abuja",
      industry: "Urban Development",
      duration: "12 Months",
      location: "Abuja, Nigeria",
      description: "Executed full-scope construction including civil works, structural framework, and finishing.",
      deliverables: ["Structural engineering", "Project supervision", "Regulatory compliance management"],
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
      category: "ENGINEERING_EXECUTION",
      status: "Completed",
      featured: true,
      publicationStatus: "PUBLISHED"
    },
    {
      title: "Institutional Facility Construction",
      slug: "institutional-facility-kano",
      industry: "Public Sector",
      duration: "10 Months",
      location: "Kano State",
      description: "Delivered a durable institutional facility aligned with safety and infrastructure standards.",
      deliverables: ["Civil & structural works", "Mechanical & electrical integration", "Quality assurance monitoring"],
      image: "https://images.unsplash.com/photo-1503387762-592dea58ef21?q=80&w=1200&auto=format&fit=crop",
      category: "ENGINEERING_EXECUTION",
      status: "Completed",
      featured: true,
      publicationStatus: "PUBLISHED"
    },
    {
      title: "Infrastructure Rehabilitation",
      slug: "infrastructure-rehab-ogun",
      industry: "State-Level",
      duration: "8 Months",
      location: "Ogun State",
      description: "Managed rehabilitation and upgrade of critical infrastructure systems.",
      deliverables: ["Procurement coordination", "Risk management", "On-time delivery execution"],
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=1200&auto=format&fit=crop",
      category: "ENGINEERING_EXECUTION",
      status: "Completed",
      featured: true,
      publicationStatus: "PUBLISHED"
    },
    // 03. Procurement & Support
    {
      title: "Enterprise ICT Equipment Supply",
      slug: "enterprise-ict-supply",
      industry: "Telecom Sector",
      duration: "3 Months",
      location: "Nationwide",
      description: "Supplied and deployed enterprise-grade servers, networking devices, and storage systems.",
      deliverables: ["Hardware sourcing", "Installation & configuration", "Post-deployment support"],
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=1200&auto=format&fit=crop",
      category: "PROCUREMENT_SUPPORT",
      status: "Completed",
      featured: true,
      publicationStatus: "PUBLISHED"
    },
    {
      title: "Large-Scale Equipment Procurement",
      slug: "large-scale-procurement",
      industry: "Construction Sector",
      duration: "Ongoing",
      location: "Regional",
      description: "Coordinated sourcing and delivery of heavy-duty operational equipment.",
      deliverables: ["Vendor evaluation", "Cost optimization", "Compliance assurance"],
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1200&auto=format&fit=crop",
      category: "PROCUREMENT_SUPPORT",
      status: "Ongoing",
      featured: true,
      publicationStatus: "PUBLISHED"
    },
    {
      title: "Facility Management Contract",
      slug: "facility-management-vi",
      industry: "Commercial Complex",
      duration: "24 Months",
      location: "Victoria Island, Lagos",
      description: "Provided structured facility management services for operational sustainability.",
      deliverables: ["Preventive maintenance", "Safety compliance audits", "Asset performance monitoring"],
      image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop",
      category: "PROCUREMENT_SUPPORT",
      status: "Completed",
      featured: true,
      publicationStatus: "PUBLISHED"
    }
  ];

  for (const p of projectsData) {
    await prisma.project.create({
      data: p
    });
  }
  console.log('✔ 9 Projects (Task 1) seeded successfully');

  // 5. News (Task 2)
  const newsData = [
    {
      slug: "future-of-enterprise-erp",
      title: "Future of Enterprise ERP: Cloud-First Strategies",
      category: "Technology",
      date: "Feb 15, 2026",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop",
      excerpt: "How modern organizations are leveraging cloud-based ERP systems to streamline HR, finance, and supply chain operations while reducing overhead costs.",
      status: "PUBLISHED",
      contentBlocks: [
        { id: 'b1', type: 'paragraph', content: 'The landscape of Enterprise Resource Planning (ERP) is undergoing a seismic shift. Traditionally anchored by heavy on-premise installations, the modern ERP is now predominantly cloud-first.' },
        { id: 'b2', type: 'h2', content: 'The Agility Advantage' },
        { id: 'b3', type: 'paragraph', content: 'One of the primary drivers of cloud ERP adoption is agility. Cloud-based systems allow organizations to scale their operations almost instantaneously, without the need for significant capital expenditure in hardware.' },
        { id: 'b4', type: 'quote', content: 'The move to cloud ERP is no longer a luxury—it is a foundational requirement for any enterprise seeking operational efficiency in the 2020s.' }
      ]
    },
    {
      slug: "safety-standards-infrastructure",
      title: "Safety Standards in Modern Infrastructure Rehab",
      category: "Engineering",
      date: "Feb 12, 2026",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=1000&auto=format&fit=crop",
      excerpt: "A look at the innovative safety protocols being implemented across our major structural rehabilitation projects to ensure long-term durability and worker safety.",
      status: "PUBLISHED",
      contentBlocks: [
        { id: 'b1', type: 'paragraph', content: 'Infrastructure rehabilitation is more than just repair; it\'s a commitment to longevity and public safety.' },
        { id: 'b2', type: 'h2', content: 'Zero Harm Policy' },
        { id: 'b3', type: 'paragraph', content: 'At Greyland, our approach to engineering starts and ends with safety. We have implemented a Zero Harm policy across all our sites, supported by real-time safety monitoring technology.' }
      ]
    },
    {
      slug: "nationwide-ict-supply-expansion",
      title: "Greyland's Nationwide ICT Supply Expansion",
      category: "Procurement",
      date: "Feb 08, 2026",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=1000&auto=format&fit=crop",
      excerpt: "Greyland Investment Ltd announces a significant expansion in our ICT equipment supply chain, now reaching telecom hubs in all 36 states.",
      status: "PUBLISHED",
      contentBlocks: [
        { id: 'b1', type: 'paragraph', content: 'We are proud to announce that our ICT procurement and supply division has achieved nationwide coverage.' },
        { id: 'b2', type: 'h2', content: 'Bridging the Digital Divide' },
        { id: 'b3', type: 'paragraph', content: 'By establishing logistics hubs in key regions, we can now deliver enterprise-grade hardware to even the most remote telecom installations within 72 hours.' }
      ]
    },
    {
      slug: "sustainable-construction-green-initiative",
      title: "Sustainable Construction: Greyland's Green Initiative",
      category: "Engineering",
      date: "Feb 05, 2026",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1503387762-592dea58ef21?q=80&w=1000&auto=format&fit=crop",
      excerpt: "Exploring our commitment to sustainable building practices through eco-friendly material sourcing and energy-efficient structural designs.",
      status: "PUBLISHED",
      contentBlocks: [
        { id: 'b1', type: 'paragraph', content: 'Sustainability is at the core of our Engineering division. We believe that the structures of tomorrow must be built with the environment in mind.' },
        { id: 'b2', type: 'h2', content: 'Energy-Efficient Design' },
        { id: 'b3', type: 'paragraph', content: 'Our latest office complex designs incorporate passive cooling and high-efficiency insulation, reducing operational energy needs by up to 30%.' }
      ]
    },
    {
      slug: "cybersecurity-trends-public-sector",
      title: "Cybersecurity Trends: Protecting Public Sector Data",
      category: "Technology",
      date: "Jan 30, 2026",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop",
      excerpt: "Key insights from our latest government-level security audits on how to defend against evolving ransomware threats in administrative networks.",
      status: "PUBLISHED",
      contentBlocks: [
        { id: 'b1', type: 'paragraph', content: 'Government data is a prime target for cyber adversaries. Our recent audits have highlighted the critical need for a defense-in-depth strategy.' },
        { id: 'b2', type: 'h2', content: 'The Rise of Ransomware' },
        { id: 'b3', type: 'paragraph', content: 'We have observed a significant increase in sophisticated ransomware attacks targeting public infrastructure. Our response includes zero-trust architecture and automated threat response.' }
      ]
    },
    {
      slug: "optimizing-asset-longevity-facility-support",
      title: "Optimizing Asset Longevity through Facility Support",
      category: "Procurement",
      date: "Jan 25, 2026",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop",
      excerpt: "The critical role of structured facility management in maintaining commercial complex performance and ensuring operational sustainability.",
      status: "PUBLISHED",
      contentBlocks: [
        { id: 'b1', type: 'paragraph', content: 'Building a structure is only the beginning. Proper facility management is what ensures that structural investments pay off over decades.' },
        { id: 'b2', type: 'h2', content: 'Predictive Maintenance' },
        { id: 'b3', type: 'paragraph', content: 'Using IoT sensors and data analytics, we move from reactive repairs to predictive maintenance, extending asset life by up to 40%.' }
      ]
    }
  ];

  for (const n of newsData) {
    await prisma.newsArticle.create({
      data: n
    });
  }
  console.log('✔ News Articles (Task 2) seeded successfully');

  // 6. Services (Populate as well for consistency)
  const servicesData = [
    { slug: "software-development", title: "Software Development", category: "TECHNOLOGY", icon: "FaCode", shortDescription: "Custom software solutions.", fullDescription: "Detailed description...", status: "PUBLISHED", features: { create: [{ title: "Custom", description: "Bespoke code.", icon: "FaCode" }] } },
    { slug: "erp-solutions", title: "ERP Solutions", category: "TECHNOLOGY", icon: "FaCogs", shortDescription: "Enterprise resource planning.", fullDescription: "Detailed description...", status: "PUBLISHED", features: { create: [{ title: "Integrated", description: "All in one.", icon: "FaCogs" }] } },
    { slug: "it-consultancy", title: "IT Consultancy", category: "TECHNOLOGY", icon: "FaProjectDiagram", shortDescription: "Strategic IT advice.", fullDescription: "Detailed description...", status: "PUBLISHED", features: { create: [{ title: "Strategic", description: "Planning ahead.", icon: "FaProjectDiagram" }] } },
  ];

  for (const s of servicesData) {
    const existing = await prisma.service.findUnique({ where: { slug: s.slug } });
    if (!existing) {
      await prisma.service.create({ data: s });
    }
  }
  console.log('✔ Basic Services seeded');

  console.log('✅ Full data population completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
