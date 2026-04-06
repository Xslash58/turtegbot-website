import type { IVRTwitchUser, ModVIPList } from "./Models/IVR";

export async function GetModVIPList(channel: string): Promise<ModVIPList | null> {
    const API_URL = import.meta.env.VITE_IVR_API_URL;
    if (!API_URL) throw new Error("IVR_API_URL is not defined in environment variables.");

    const response = await fetch(`${API_URL}/v2/twitch/modvip/${channel}?skipCache=true`);
    if (!response.ok) {
        console.log(`API request failed: ${response.statusText}`);
        return null;
    }

    return response.json();
}

export async function GetTwitchUsersBulk(logins: string[]): Promise<IVRTwitchUser[] | null> {
    const API_URL = import.meta.env.VITE_IVR_API_URL;
    if (!API_URL) throw new Error("IVR_API_URL is not defined in environment variables.");

    const response = await fetch(`${API_URL}/v2/twitch/user?login=${logins.join(",")}`);
    if (!response.ok) {
        console.log(`API request failed: ${response.statusText}`);
        return null;
    }

    return response.json();
}
    