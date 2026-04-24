import { prisma } from '@/lib/prisma';
import { Service as DbService, ServiceFeature as DbFeature } from '@prisma/client';

import { ServiceFeature, ServiceCategory, ServiceItem } from '@/types/service';

/**
 * ServiceService handles the CRUD operations and persistence for services using Prisma.
 */
class ServiceService {
    private mapToServiceItem(service: DbService & { features: DbFeature[], illustrations: { url: string }[] }): ServiceItem {
        return {
            id: service.id,
            title: service.title,
            slug: service.slug,
            shortDescription: service.shortDescription,
            fullDescription: service.fullDescription,
            category: service.category as ServiceCategory,
            icon: service.icon,
            features: service.features.map((f: any) => ({
                id: f.id,
                title: f.title,
                description: f.description,
                icon: f.icon
            })),
            media: {
                banner: service.banner || '',
                illustrations: service.illustrations.map(i => i.url)
            },
            bullets: service.features.map(f => f.description),
            featured: service.featured,
            order: service.order,
            status: service.status as 'DRAFT' | 'PUBLISHED',
            createdAt: service.createdAt.toISOString(),
            updatedAt: service.updatedAt.toISOString()
        };
    }

    async getServices(): Promise<ServiceItem[]> {
        try {
            const services = await prisma.service.findMany({
                include: { features: true, illustrations: true },
                orderBy: { order: 'asc' }
            });
            return services.map(this.mapToServiceItem);
        } catch (err) {
            console.warn('[ServiceService] DB unavailable for getServices.', err);
            return [];
        }
    }

    async getServiceById(id: string): Promise<ServiceItem | undefined> {
        try {
            const service = await prisma.service.findUnique({
                where: { id },
                include: { features: true, illustrations: true }
            });
            return service ? this.mapToServiceItem(service) : undefined;
        } catch (err) {
            console.warn('[ServiceService] DB unavailable for getServiceById.', err);
            return undefined;
        }
    }

    async getServiceBySlug(slug: string): Promise<ServiceItem | undefined> {
        try {
            const service = await prisma.service.findUnique({
                where: { slug },
                include: { features: true, illustrations: true }
            });
            return service ? this.mapToServiceItem(service) : undefined;
        } catch (err) {
            console.warn('[ServiceService] DB unavailable for getServiceBySlug.', err);
            return undefined;
        }
    }

    async createService(data: ServiceItem): Promise<ServiceItem> {
        const service = await prisma.service.create({
            data: {
                title: data.title,
                slug: data.slug,
                shortDescription: data.shortDescription,
                fullDescription: data.fullDescription,
                category: data.category,
                icon: data.icon,
                featured: data.featured || false,
                order: data.order || 0,
                status: data.status,
                banner: data.media.banner,
                illustrations: {
                    create: (data.media.illustrations || []).map(url => ({ url }))
                },
                features: {
                    create: data.features.map((f: ServiceFeature) => ({
                        title: f.title,
                        description: f.description,
                        icon: f.icon
                    }))
                }
            },
            include: { features: true, illustrations: true }
        });
        return this.mapToServiceItem(service);
    }

    async updateService(id: string, data: Partial<ServiceItem>): Promise<ServiceItem> {
        // Explicitly exclude fields that are NOT in the Prisma schema for the 'Service' model
        // features is handled separately, bullets/media are UI/legacy fields
        // id, createdAt, updatedAt should not be in the data payload
        const { features, bullets, media, id: _id, createdAt, updatedAt, ...rest } = data;
        const updateData: any = { ...rest };

        if (media) {
            updateData.banner = media.banner;
            if (media.illustrations) {
                // Simplistic illustrations update: delete all and recreate
                await prisma.serviceIllustration.deleteMany({ where: { serviceId: id } });
                updateData.illustrations = {
                    create: media.illustrations.map(url => ({ url }))
                };
            }
        }

        if (features) {
            // Simplistic feature update: delete all and recreate
            await prisma.serviceFeature.deleteMany({ where: { serviceId: id } });
            updateData.features = {
                create: features.map((f: ServiceFeature) => ({
                    title: f.title,
                    description: f.description,
                    icon: f.icon
                }))
            };
        }

        const service = await prisma.service.update({
            where: { id },
            data: updateData,
            include: { features: true, illustrations: true }
        });
        return this.mapToServiceItem(service);
    }

    async deleteService(id: string): Promise<void> {
        await prisma.service.delete({
            where: { id }
        });
    }
}

export const serviceService = new ServiceService();

/**
 * ServiceCategoryService remains unchanged
 */
class ServiceCategoryService {
    getCategories(): { id: ServiceCategory; label: string; theme: string }[] {
        return [
            { id: 'TECHNOLOGY', label: 'Technology & Digital', theme: 'bg-blue-500' },
            { id: 'AUDIT & PROTECTION', label: 'Audit & Protection', theme: 'bg-green-500' },
            { id: 'ENGINEERING', label: 'Engineering & Execution', theme: 'bg-orange-500' },
            { id: 'PROCUREMENT', label: 'Procurement & Support', theme: 'bg-purple-500' },
        ];
    }
}

export const serviceCategoryService = new ServiceCategoryService();

/**
 * ServiceStyleService remains unchanged
 */
class ServiceStyleService {
    getStyleSchema() {
        return {
            typography: {
                title: 'text-4xl md:text-5xl font-black text-primary-dark uppercase tracking-tighter',
                subtitle: 'text-sm font-black text-primary-orange uppercase tracking-[.3em]',
                body: 'text-base font-medium text-gray-500 leading-relaxed',
            },
            featureGrid: {
                container: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8',
                card: 'bg-white rounded-3xl p-8 border border-gray-100 shadow-xl',
                icon: 'w-14 h-14 rounded-2xl bg-orange-50 text-primary-orange flex items-center justify-center text-2xl',
            }
        };
    }

    getIconList() {
        return [
            'FaCode', 'FaCogs', 'FaProjectDiagram', 'FaShieldAlt', 'FaChartBar', 'FaNetworkWired',
            'FaBuilding', 'FaHardHat', 'FaTools', 'FaTruckLoading', 'FaDesktop', 'FaBoxOpen',
            'FaWarehouse', 'FaClipboardCheck', 'FaChartPie', 'FaUserShield', 'FaSearchPlus',
            'FaFileAlt', 'FaLock', 'FaTasks', 'FaGraduationCap', 'FaCheckCircle'
        ];
    }
}

export const serviceStyleService = new ServiceStyleService();
