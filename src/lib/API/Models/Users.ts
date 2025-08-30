export interface TwitchUser {
    id: string;
    login: string;
    display_name: string;
    type: string;
    broadcaster_type: string;
    description: string;
    profile_image_url: string;
    offline_image_url: string;
    view_count: number;
    email?: string;
    created_at: Date;
}

export interface UserPage {
    user: User | null;
    myPowers: Record<string, number> | null;
}

export interface User {
    id: string;
    display_name: string;
    twitchLogin: string;
    kickLogin: string;
    twitchId: string;
    kickId: string;
    profile_image_url: string;
    roomIds: Record<string, string>;
    role: UserRole;
    flags: string[];
    streamElementsData: StreamElementsData;
}

export interface UserRole {
    name: string;
    power: number;
    color: string;
}

export interface UserConnections {
    connections: string[];
}

export interface StreamElementsData {
    pointsName: string | null;
}

export interface Reminder {
    id: number;
    username: string;
    content: string;
    author: string;
    channel: string;
    date: Date;
    isViewed: boolean;
    isInstant: boolean;
    platform: string;
    userId: number;
    roomId: number;
    authorId: number;
}

export interface Ticket {
    ID: number;
    username: string;
    userId: number;
    roomName: string;
    message: string;
    type: number;
    approved: boolean;
    denied: boolean;
    date: Date;
}

export interface SearchUser {
    ID: number;
    twitchUsername: string;
    kickUsername: string;
}

export interface Webhook {
    ID: number;
    webhookId: string;
    roomId: number;
    createdAt: Date;
}