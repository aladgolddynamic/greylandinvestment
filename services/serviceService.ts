import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { randomUUID } from 'crypto';

import { ServiceFeature, ServiceCategory, ServiceItem } from '@/types/service';

/**
 * ServiceService handles the CRUD operations and persistence for services using Supabase.
 */
class ServiceService {
    private mapToServiceItem(service: any, features: any[], illustrations: any[]): ServiceItem {
        return {
            id: service.id,
            title: service.title,
            slug: service.slug,
            shortDescription: service.shortDescription,
            fullDescription: service.fullDescription,
            category: service.category as ServiceCategory,
            icon: service.icon,
            features: (features || []).map((f: any) => ({
                id: f.id,
                title: f.title,
                description: f.description,
                icon: f.icon
            })),
            media: {
                banner: service.banner || '',
                illustrations: (illustrations || []).map((i: any) => i.url)
            },
            bullets: (features || []).map((f: any) => f.description),
            featured: service.featured,
            order: service.order,
            status: service.status as 'DRAFT' | 'PUBLISHED',
            createdAt: service.createdAt ? new Date(service.createdAt).toISOString() : new Date().toISOString(),
            updatedAt: service.updatedAt ? new Date(service.updatedAt).toISOString() : new Date().toISOString()
        };
    }

    private async fetchRelations(serviceId: string) {
        const [featRes, illRes] = await Promise.all([
            supabaseAdmin.from('ServiceFeature').select('*').eq('serviceId', serviceId),
            supabaseAdmin.from('ServiceIllustration').select('*').eq('serviceId', serviceId)
        ]);
        return { features: featRes.data || [], illustrations: illRes.data || [] };
    }

    async getServices(): Promise<ServiceItem[]> {
        try {
            const { data, error } = await supabaseAdmin.from('Service').select('*').order('order', { ascending: true });
            if (error) throw error;
            const results: ServiceItem[] = [];
            for (const svc of (data || [])) {
                const { features, illustrations } = await this.fetchRelations(svc.id);
                results.push(this.mapToServiceItem(svc, features, illustrations));
            }
            return results;
        } catch (err) {
            console.error('[ServiceService] Error in getServices:', err);
            return [];
        }
    }

    async getServiceById(id: string): Promise<ServiceItem | undefined> {
        try {
            const { data, error } = await supabaseAdmin.from('Service').select('*').eq('id', id).single();
            if (error) throw error;
            if (!data) return undefined;
            const { features, illustrations } = await this.fetchRelations(data.id);
            return this.mapToServiceItem(data, features, illustrations);
        } catch (err) {
            console.warn('[ServiceService] DB unavailable for getServiceById.', err);
            return undefined;
        }
    }

    async getServiceBySlug(slug: string): Promise<ServiceItem | undefined> {
        try {
            const { data, error } = await supabaseAdmin.from('Service').select('*').eq('slug', slug).single();
            if (error) throw error;
            if (!data) return undefined;
            const { features, illustrations } = await this.fetchRelations(data.id);
            return this.mapToServiceItem(data, features, illustrations);
        } catch (err) {
            console.warn('[ServiceService] DB unavailable for getServiceBySlug.', err);
            return undefined;
        }
    }

    async createService(data: ServiceItem): Promise<ServiceItem> {
        const { data: service, error } = await supabaseAdmin.from('Service').insert([{
            id: randomUUID(),
            title: data.title, slug: data.slug, shortDescription: data.shortDescription,
            fullDescription: data.fullDescription, category: data.category, icon: data.icon,
            featured: data.featured || false, order: data.order || 0, status: data.status,
            banner: data.media.banner
        }]).select().single();
        if (error) throw error;

        // Insert features
        if (data.features?.length) {
            await supabaseAdmin.from('ServiceFeature').insert(
                data.features.map((f: ServiceFeature) => ({ id: randomUUID(), serviceId: service.id, title: f.title, description: f.description, icon: f.icon }))
            );
        }
        // Insert illustrations
        if (data.media.illustrations?.length) {
            await supabaseAdmin.from('ServiceIllustration').insert(
                data.media.illustrations.map((url: string) => ({ id: randomUUID(), serviceId: service.id, url }))
            );
        }

        const { features, illustrations } = await this.fetchRelations(service.id);
        return this.mapToServiceItem(service, features, illustrations);
    }

    async updateService(id: string, data: Partial<ServiceItem>): Promise<ServiceItem> {
        const { features, bullets, media, id: _id, createdAt, updatedAt, ...rest } = data;
        const updateData: any = { ...rest };
        if (media) updateData.banner = media.banner;

        const { data: service, error } = await supabaseAdmin.from('Service').update(updateData).eq('id', id).select().single();
        if (error) throw error;

        if (media?.illustrations) {
            await supabaseAdmin.from('ServiceIllustration').delete().eq('serviceId', id);
            await supabaseAdmin.from('ServiceIllustration').insert(
                media.illustrations.map((url: string) => ({ serviceId: id, url }))
            );
        }

        if (features) {
            await supabaseAdmin.from('ServiceFeature').delete().eq('serviceId', id);
            await supabaseAdmin.from('ServiceFeature').insert(
                features.map((f: ServiceFeature) => ({ serviceId: id, title: f.title, description: f.description, icon: f.icon }))
            );
        }

        const rels = await this.fetchRelations(id);
        return this.mapToServiceItem(service, rels.features, rels.illustrations);
    }

    async deleteService(id: string): Promise<void> {
        // Delete related records first (cascade may handle this, but explicit is safer)
        await supabaseAdmin.from('ServiceFeature').delete().eq('serviceId', id);
        await supabaseAdmin.from('ServiceIllustration').delete().eq('serviceId', id);
        const { error } = await supabaseAdmin.from('Service').delete().eq('id', id);
        if (error) throw error;
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
