import { servicesData, ServiceItem } from '@/constants/servicesData';

/**
 * SiteService handles service-specific operations.
 * Backend-ready abstraction for dynamic updates.
 */
class SiteService {
    private SERVICES: ServiceItem[] = [];

    constructor() {
        this.SERVICES = [...servicesData];
    }

    /**
     * Get all services
     */
    async getServices(): Promise<ServiceItem[]> {
        await new Promise(resolve => setTimeout(resolve, 500));
        return [...this.SERVICES];
    }

    /**
     * Get services by category
     */
    async getServicesByCategory(category: ServiceItem['category']): Promise<ServiceItem[]> {
        return this.SERVICES.filter(service => service.category === category);
    }

    /**
     * Create new service (Mock)
     */
    async createService(data: ServiceItem): Promise<ServiceItem> {
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.SERVICES.push(data);
        return data;
    }

    /**
     * Update existing service (Mock)
     */
    async updateService(id: string, data: Partial<ServiceItem>): Promise<ServiceItem> {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const index = this.SERVICES.findIndex(service => service.id === id);
        if (index !== -1) {
            this.SERVICES[index] = { ...this.SERVICES[index], ...data };
            return this.SERVICES[index];
        }
        throw new Error('Service not found.');
    }

    /**
     * Delete service (Mock)
     */
    async deleteService(id: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.SERVICES = this.SERVICES.filter(service => service.id !== id);
    }
}

export const siteService = new SiteService();
