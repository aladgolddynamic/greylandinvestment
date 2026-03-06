/**
 * Site Content Interface
 */
export interface SiteContent {
    homepage: {
        heroTitle: string;
        heroSubtitle: string;
        featuredNewsId: string;
    };
    about: {
        heroHeadline: string;
        heroSubtitle: string;
        narrative: string;
        mission: string;
        vision: string;
    };
}
