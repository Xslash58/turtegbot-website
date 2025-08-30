export interface RoomSettings {
    prefix: string;
    language: string;
}

export interface Language {
    name: string;
    aliases: string[];
    locale: string;
}

export interface ActivityLog {
    id: number;
    timestamp: Date;
    username: string;
    roomId: string;
    actionType: string;
    targetUsername: string;
    delta: number;
    platform: string;
    details: string;
}