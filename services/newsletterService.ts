import { prisma } from '@/lib/prisma';
import { Subscriber as DbSubscriber, Campaign as DbCampaign } from '@prisma/client';
import {
    Subscriber,
    Campaign,
    SubscriberStatus,
    SubscriptionSource,
    CreateCampaignPayload,
    CampaignStatus
} from '@/types/newsletter';

/**
 * NewsletterService handles the CRUD operations and persistence for subscribers and campaigns using Prisma.
 */
class NewsletterService {
    private mapToSubscriber(dbSub: DbSubscriber): Subscriber {
        return {
            id: dbSub.id,
            email: dbSub.email,
            name: dbSub.name || undefined,
            source: dbSub.source as SubscriptionSource,
            status: dbSub.status as SubscriberStatus,
            dateSubscribed: dbSub.dateSubscribed.toISOString()
        };
    }

    private mapToCampaign(dbCamp: DbCampaign): Campaign {
        return {
            id: dbCamp.id,
            title: dbCamp.title,
            subject: dbCamp.subject,
            content: dbCamp.content,
            featuredImage: dbCamp.featuredImage || undefined,
            status: dbCamp.status as CampaignStatus,
            sentAt: dbCamp.sentAt?.toISOString(),
            recipientCount: dbCamp.recipientCount || 0,
            createdAt: dbCamp.createdAt.toISOString(),
            updatedAt: dbCamp.updatedAt.toISOString()
        };
    }

    // ── Subscribers ─────────────────────────────────────────────────────────
    async getSubscribers(): Promise<Subscriber[]> {
        const subs = await prisma.subscriber.findMany({
            orderBy: { dateSubscribed: 'desc' }
        });
        return subs.map(this.mapToSubscriber.bind(this));
    }

    async addSubscriber(email: string, name?: string, source: SubscriptionSource = 'MANUAL'): Promise<Subscriber> {
        const sub = await prisma.subscriber.upsert({
            where: { email: email.toLowerCase() },
            update: { status: 'SUBSCRIBED', name: name || undefined },
            create: {
                email: email.toLowerCase(),
                name,
                source,
                status: 'SUBSCRIBED'
            }
        });
        return this.mapToSubscriber(sub);
    }

    async removeSubscriber(id: string): Promise<void> {
        await prisma.subscriber.delete({
            where: { id }
        });
    }

    async updateSubscriberStatus(id: string, status: SubscriberStatus): Promise<Subscriber> {
        const sub = await prisma.subscriber.update({
            where: { id },
            data: { status }
        });
        return this.mapToSubscriber(sub);
    }

    async updateSubscriberEmail(id: string, email: string, name?: string): Promise<Subscriber> {
        const sub = await prisma.subscriber.update({
            where: { id },
            data: { email, name: name || undefined }
        });
        return this.mapToSubscriber(sub);
    }

    async exportCSV(): Promise<string> {
        const subs = await this.getSubscribers();
        const header = 'Email,Name,Source,Status,Date Subscribed';
        const rows = subs.map(s =>
            `${s.email},${s.name || ''},${s.source},${s.status},${s.dateSubscribed}`
        );
        return [header, ...rows].join('\n');
    }

    // ── Campaigns ───────────────────────────────────────────────────────────
    async getCampaigns(): Promise<Campaign[]> {
        const camps = await prisma.campaign.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return camps.map(this.mapToCampaign.bind(this));
    }

    async createCampaign(payload: CreateCampaignPayload): Promise<Campaign> {
        const camp = await prisma.campaign.create({
            data: {
                ...payload,
                status: 'DRAFT'
            }
        });
        return this.mapToCampaign(camp);
    }

    async updateCampaign(id: string, payload: Partial<CreateCampaignPayload>): Promise<Campaign> {
        const camp = await prisma.campaign.update({
            where: { id },
            data: { ...payload, updatedAt: new Date() }
        });
        return this.mapToCampaign(camp);
    }

    async sendCampaign(id: string): Promise<Campaign> {
        const subsCount = await prisma.subscriber.count({ where: { status: 'SUBSCRIBED' } });
        const camp = await prisma.campaign.update({
            where: { id },
            data: {
                status: 'SENT',
                sentAt: new Date(),
                recipientCount: subsCount,
                updatedAt: new Date()
            }
        });
        return this.mapToCampaign(camp);
    }

    async duplicateCampaign(id: string): Promise<Campaign> {
        const original = await prisma.campaign.findUnique({ where: { id } });
        if (!original) throw new Error('Campaign not found.');
        return this.createCampaign({
            title: `${original.title} (Copy)`,
            subject: original.subject,
            content: original.content,
            featuredImage: original.featuredImage || undefined,
        });
    }

    async deleteCampaign(id: string): Promise<void> {
        await prisma.campaign.delete({
            where: { id }
        });
    }
}

export const newsletterService = new NewsletterService();
