export interface Loyalty {
    loyalty: LoyaltySettings;
    _id: string;
    updatedAt: Date;
    createdAt: Date;
    channel: string;
}

export interface LoyaltySettings {
    bonuses: Bonuses;
    name: string;
    enabled: boolean;
    amount: number;
    interval: number;
    subscriberMultiplier: number;
    ignored: string[];
}

export interface Bonuses {
    follow: number;
    tip: number;
    subscriber: number;
    cheer: number;
    raid: number;
}