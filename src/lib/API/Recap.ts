import type { Recap, RoomRecap } from "./Models/Recap";

export async function GetUserRecap(userId: string): Promise<Recap | null> {
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) throw new Error("API_URL is not defined in environment variables.");
    const url = `${API_URL}/v1/recap/${userId}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('turteg-token') || ''}`
        }
    });
    if (!response.ok) {
        console.log(`API request failed: ${response.statusText}`);
        return null;
    }
    const data = await response.json();
    return data.recap;
}

export async function GetRoomRecap(roomId: string): Promise<RoomRecap | null> {
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) throw new Error("API_URL is not defined in environment variables.");
    const url = `${API_URL}/v1/recap/room/${roomId}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('turteg-token') || ''}`
        }
    });
    if (!response.ok) {
        console.log(`API request failed: ${response.statusText}`);
        return null;
    }
    const data = await response.json();
    return data.recap;
}