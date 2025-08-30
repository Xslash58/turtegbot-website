import type { ActivityLog, Language, RoomSettings } from "./Models/Room";
import type { Webhook } from "./Models/Users";

export async function UpdateRoomSettings(id: string, settings: RoomSettings) {
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) throw new Error("API_URL is not defined in environment variables.");

    const response = await fetch(`${API_URL}/v1/room/${id}/settings`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('turteg-token') || ''}`
        },
        body: JSON.stringify(settings)
    });
    if (!response.ok) {
        console.log(`API request failed: ${response.statusText}`);
        return false;
    }

    return true;
}

export async function GetRoomSettings(id: string): Promise<RoomSettings | null> {
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) throw new Error("API_URL is not defined in environment variables.");

    const response = await fetch(`${API_URL}/v1/room/${id}/settings`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('turteg-token') || ''}`
        }
    });
    if (!response.ok) {
        console.log(`API request failed: ${response.statusText}`);
        return null;
    }

    return await response.json();
}

export async function GetRoomPowers(id: string): Promise<Record<string, number> | null> {
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) throw new Error("API_URL is not defined in environment variables.");

    const response = await fetch(`${API_URL}/v1/room/${id}/powers`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('turteg-token') || ''}`
        }
    });
    if (!response.ok) {
        console.log(`API request failed: ${response.statusText}`);
        return null;
    }

    return (await response.json()).powers;
}

export async function GetRecentActivityLogs(roomId: string): Promise<ActivityLog[] | null> {
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) throw new Error("API_URL is not defined in environment variables.");

    const response = await fetch(`${API_URL}/v1/room/${roomId}/activity`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('turteg-token') || ''}`
        }
    });
    if (!response.ok) {
        console.log(`API request failed: ${response.statusText}`);
        return null;
    }

    return (await response.json()).logs;
}

export async function GetAvailableLanguages(): Promise<Language[] | null> {
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) throw new Error("API_URL is not defined in environment variables.");

    const response = await fetch(`${API_URL}/v1/room/languages`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('turteg-token') || ''}`
        }
    });
    if (!response.ok) {
        console.log(`API request failed: ${response.statusText}`);
        return null;
    }

    return await response.json();
}

export async function GetWebhooks(roomId: string): Promise<Webhook[]> {
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) throw new Error("API_URL is not defined in environment variables.");

    const response = await fetch(`${API_URL}/v1/room/${roomId}/webhooks`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('turteg-token') || ''}`
        }
    });
    if (!response.ok) {
        console.log(`API request failed: ${response.statusText}`);
        return [];
    }

    return (await response.json()).webhooks;
}

export async function DeleteWebhook(roomId: string, webhookId: string): Promise<boolean> {
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) throw new Error("API_URL is not defined in environment variables.");
    const url = `${API_URL}/v1/room/${roomId}/webhooks/${webhookId}`;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('turteg-token') || ''}`
        }
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error);
    if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);

    return data.success;
}