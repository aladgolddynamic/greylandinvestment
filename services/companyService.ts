import { prisma } from '@/lib/prisma';

import { CompanyInfo } from '@/types/company';

/**
 * CompanyService handles site-wide corporate metadata and branding using Prisma.
 */
class CompanyService {
    private DEFAULT_DATA: CompanyInfo = {
        name: 'Greyland Investment Ltd',
        tagline: 'Innovative Technical Solutions & Infrastructure',
        description: 'Greyland Investment Ltd is a premier multisectoral firm providing cutting-edge solutions across Engineering, Technology, and Infrastructure.',
        address: 'Suite 302, Engineering Plaza, Airport Road, Lugbe, Abuja, Nigeria',
        emails: ['info@greylandinvestment.com', 'support@greylandinvestment.com'],
        phones: ['+234 (0) 803 123 4567', '+234 (0) 901 987 6543'],
        socials: {
            facebook: 'https://facebook.com/greyland',
            twitter: 'https://twitter.com/greyland',
            linkedin: 'https://linkedin.com/company/greyland',
            instagram: 'https://instagram.com/greyland'
        },
        branding: {
            logo: '/logo.png',
            favicon: '/logo.png',
            primaryColor: '#F28C28',
            secondaryColor: '#0F1C2E',
        },
        metadata: {
            mission: 'To build the foundation of Nigeria’s infrastructure through disciplined engineering and technological innovation.',
            vision: 'To be the most trusted partner for large-scale digital and physical infrastructure transformation in Africa.',
            operatingHours: 'Mon - Fri: 8:00 AM - 5:00 PM',
        },
        location: {
            lat: 8.9588288,
            lng: 7.3544168,
            zoom: 14,
        }
    };

    /**
     * Get all company information from Prisma
     */
    async getInfo(): Promise<CompanyInfo> {
        const info = await prisma.companyInfo.findUnique({
            where: { id: 'singleton' }
        });

        if (!info) return this.DEFAULT_DATA;

        return {
            name: info.name,
            tagline: info.tagline,
            description: info.description,
            address: info.address,
            emails: [info.email], // Simplified for now since schema has single email
            phones: [info.phone], // Simplified
            socials: info.socialLinks as any,
            branding: this.DEFAULT_DATA.branding, // Placeholder if branding not in schema
            metadata: {
                mission: this.DEFAULT_DATA.metadata.mission,
                vision: this.DEFAULT_DATA.metadata.vision,
                operatingHours: this.DEFAULT_DATA.metadata.operatingHours,
            },
            location: this.DEFAULT_DATA.location
        };
    }

    /**
     * Update company information in Prisma
     */
    async updateInfo(data: CompanyInfo): Promise<CompanyInfo> {
        await prisma.companyInfo.upsert({
            where: { id: 'singleton' },
            update: {
                name: data.name,
                tagline: data.tagline,
                description: data.description,
                address: data.address,
                email: data.emails[0] || '',
                phone: data.phones[0] || '',
                socialLinks: data.socials as any,
            },
            create: {
                id: 'singleton',
                name: data.name,
                tagline: data.tagline,
                description: data.description,
                address: data.address,
                email: data.emails[0] || '',
                phone: data.phones[0] || '',
                socialLinks: data.socials as any,
            }
        });
        return data;
    }

    /**
     * Get specific branding assets
     */
    async getBranding() {
        const info = await this.getInfo();
        return info.branding;
    }
}

export const companyService = new CompanyService();
