/**
 * Newsletter Types
 */
export type SubscriberStatus = 'SUBSCRIBED' | 'UNSUBSCRIBED';
export type SubscriptionSource = 'FOOTER' | 'NEWS_PAGE' | 'MANUAL';

export interface Subscriber {
    id: string;
    email: string;
    name?: string;
    source: SubscriptionSource;
    status: SubscriberStatus;
    dateSubscribed: string;
}

export type CampaignStatus = 'DRAFT' | 'SENT';

export interface Campaign {
    id: string;
    title: string;
    subject: string;
    content: string;
    featuredImage?: string;
    status: CampaignStatus;
    sentAt?: string;
    recipientCount?: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCampaignPayload {
    title: string;
    subject: string;
    content: string;
    featuredImage?: string;
}
