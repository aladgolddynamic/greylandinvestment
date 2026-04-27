import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { randomUUID } from 'crypto';
import {
    Subscriber,
    Campaign,
    SubscriberStatus,
    SubscriptionSource,
    CreateCampaignPayload,
    CampaignStatus
} from '@/types/newsletter';

class NewsletterService {
    private mapToSubscriber(dbSub: any): Subscriber {
        return {
            id: dbSub.id,
            email: dbSub.email,
            name: dbSub.name || undefined,
            source: dbSub.source as SubscriptionSource,
            status: dbSub.status as SubscriberStatus,
            dateSubscribed: dbSub.dateSubscribed ? new Date(dbSub.dateSubscribed).toISOString() : new Date().toISOString()
        };
    }

    private mapToCampaign(dbCamp: any): Campaign {
        return {
            id: dbCamp.id,
            title: dbCamp.title,
            subject: dbCamp.subject,
            content: dbCamp.content,
            featuredImage: dbCamp.featuredImage || undefined,
            status: dbCamp.status as CampaignStatus,
            sentAt: dbCamp.sentAt ? new Date(dbCamp.sentAt).toISOString() : undefined,
            recipientCount: dbCamp.recipientCount || 0,
            createdAt: dbCamp.createdAt ? new Date(dbCamp.createdAt).toISOString() : new Date().toISOString(),
            updatedAt: dbCamp.updatedAt ? new Date(dbCamp.updatedAt).toISOString() : new Date().toISOString()
        };
    }

    async getSubscribers(): Promise<Subscriber[]> {
        const { data, error } = await supabaseAdmin.from('Subscriber').select('*').order('dateSubscribed', { ascending: false });
        if (error) throw error;
        return (data || []).map(this.mapToSubscriber.bind(this));
    }

    async addSubscriber(email: string, name?: string, source: SubscriptionSource = 'MANUAL'): Promise<Subscriber> {
        const { data: sub, error } = await supabaseAdmin.from('Subscriber').upsert({ 
            id: randomUUID(),
            email: email.toLowerCase(), 
            name: name || null, 
            source, 
            status: 'SUBSCRIBED',
            dateSubscribed: new Date().toISOString()
        }, { onConflict: 'email' }).select().single();
        if (error) throw error;
        return this.mapToSubscriber(sub);
    }

    async removeSubscriber(id: string): Promise<void> {
        const { error } = await supabaseAdmin.from('Subscriber').delete().eq('id', id);
        if (error) throw error;
    }

    async updateSubscriberStatus(id: string, status: SubscriberStatus): Promise<Subscriber> {
        const { data: sub, error } = await supabaseAdmin.from('Subscriber').update({ status }).eq('id', id).select().single();
        if (error) throw error;
        return this.mapToSubscriber(sub);
    }

    async updateSubscriberEmail(id: string, email: string, name?: string): Promise<Subscriber> {
        const { data: sub, error } = await supabaseAdmin.from('Subscriber').update({ email, name: name || null }).eq('id', id).select().single();
        if (error) throw error;
        return this.mapToSubscriber(sub);
    }

    async exportCSV(): Promise<string> {
        const subs = await this.getSubscribers();
        const header = 'Email,Name,Source,Status,Date Subscribed';
        const rows = subs.map(s => `${s.email},${s.name || ''},${s.source},${s.status},${s.dateSubscribed}`);
        return [header, ...rows].join('\n');
    }

    async getCampaigns(): Promise<Campaign[]> {
        const { data, error } = await supabaseAdmin.from('Campaign').select('*').order('createdAt', { ascending: false });
        if (error) throw error;
        return (data || []).map(this.mapToCampaign.bind(this));
    }

    async createCampaign(payload: CreateCampaignPayload): Promise<Campaign> {
        const { data: camp, error } = await supabaseAdmin.from('Campaign').insert([{ 
            id: randomUUID(),
            ...payload, 
            status: 'DRAFT',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }]).select().single();
        if (error) throw error;
        return this.mapToCampaign(camp);
    }

    async updateCampaign(id: string, payload: Partial<CreateCampaignPayload>): Promise<Campaign> {
        const { data: camp, error } = await supabaseAdmin.from('Campaign').update({ ...payload, updatedAt: new Date().toISOString() }).eq('id', id).select().single();
        if (error) throw error;
        return this.mapToCampaign(camp);
    }

    async sendCampaign(id: string): Promise<Campaign> {
        const { count, error: countError } = await supabaseAdmin.from('Subscriber').select('*', { count: 'exact', head: true }).eq('status', 'SUBSCRIBED');
        if (countError) throw countError;
        const { data: camp, error } = await supabaseAdmin.from('Campaign').update({ status: 'SENT', sentAt: new Date().toISOString(), recipientCount: count || 0, updatedAt: new Date().toISOString() }).eq('id', id).select().single();
        if (error) throw error;
        return this.mapToCampaign(camp);
    }

    async duplicateCampaign(id: string): Promise<Campaign> {
        const { data: original, error } = await supabaseAdmin.from('Campaign').select('*').eq('id', id).single();
        if (error || !original) throw new Error('Campaign not found.');
        return this.createCampaign({ title: `${original.title} (Copy)`, subject: original.subject, content: original.content, featuredImage: original.featuredImage || undefined });
    }

    async deleteCampaign(id: string): Promise<void> {
        const { error } = await supabaseAdmin.from('Campaign').delete().eq('id', id);
        if (error) throw error;
    }
}

export const newsletterService = new NewsletterService();
