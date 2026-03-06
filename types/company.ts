/**
 * Company Information Interface
 */
export interface CompanyInfo {
    name: string;
    tagline: string;
    description: string;
    address: string;
    emails: string[];
    phones: string[];
    socials: {
        facebook?: string;
        twitter?: string;
        linkedin?: string;
        instagram?: string;
    };
    branding: {
        logo: string;
        favicon: string;
        primaryColor: string;
        secondaryColor: string;
    };
    metadata: {
        mission: string;
        vision: string;
        operatingHours: string;
    };
    location: {
        lat: number;
        lng: number;
        zoom: number;
    };
}
