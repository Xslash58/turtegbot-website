export interface ModVIPList {
    mods: RoleUser[];
    vips: RoleUser[];
}

export interface RoleUser {
    id: string;
    login: string;
    displayName: string;
    grantedAt: string;
}

export interface IVRTwitchUser {
    banned: boolean;
    displayName: string;
    login: string;
    id: string;
    bio: string;
    followers: number;
    chatColor: string;
    logo: string;
    banner: string;
    createdAt: string;
    updatedAt: string;
    emotePrefix: string | null;
}

export interface FoundersList {
    founders: FounderUser[];
}

export interface FounderUser {
    isSubscribed: boolean;
    entitlementStart: string;
    id: string;
    login: string;
    displayName: string;
}