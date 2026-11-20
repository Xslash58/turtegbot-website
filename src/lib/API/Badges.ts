import type { Badge } from '$lib/API/Models/Badges';

export async function GetBadges(): Promise<Badge[] | null> {
	const API_URL = import.meta.env.VITE_API_URL;
	if (!API_URL) throw new Error('API_URL is not defined in environment variables.');
	const url = `${API_URL}/v1/ffz/badges`;
	const response = await fetch(url, {
		method: 'GET'
	});
	if (!response.ok) {
		console.log(`API request failed: ${response.statusText}`);
		return null;
	}
	const data = await response.json();
	return data.badges;
}
