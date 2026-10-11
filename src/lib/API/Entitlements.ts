import type { Entitlement, EntitlementGraphResponse } from './Models/Entitlements';
import type { FFZBadge } from './Models/FFZ';

export async function GetEntitlementGraph(userId: string): Promise<EntitlementGraphResponse> {
	const API_URL = import.meta.env.VITE_API_URL;
	if (!API_URL) throw new Error('API_URL is not defined in environment variables.');
	const url = `${API_URL}/v1/entitlements/graph/${userId}`;
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('turteg-token') || ''}`
		}
	});

	const data = await response.json();
	if (data.error) throw new Error(data.error);
	if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);

	return data as EntitlementGraphResponse;
}

export async function GetMyPermissions(): Promise<string[]> {
	const API_URL = import.meta.env.VITE_API_URL;
	if (!API_URL) throw new Error('API_URL is not defined in environment variables.');
	const url = `${API_URL}/v1/entitlements/me/permissions`;
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('turteg-token') || ''}`
		}
	});

	const data = await response.json();
	if (data.error) throw new Error(data.error);
	if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);

	return data.permissions as string[];
}

export async function GrantEntitlement(userId: string, entitlementId: string): Promise<boolean> {
	const API_URL = import.meta.env.VITE_API_URL;
	if (!API_URL) throw new Error('API_URL is not defined in environment variables.');
	const url = `${API_URL}/v1/entitlements/user/${userId}`;
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('turteg-token') || ''}`
		},
		body: JSON.stringify({ entitlementId })
	});

	const data = await response.json();
	if (data.error) throw new Error(data.error);
	if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);

	return true;
}

export async function RevokeEntitlement(userId: string, entitlementId: string): Promise<boolean> {
	const API_URL = import.meta.env.VITE_API_URL;
	if (!API_URL) throw new Error('API_URL is not defined in environment variables.');
	const url = `${API_URL}/v1/entitlements/user/${userId}/${entitlementId}`;
	const response = await fetch(url, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('turteg-token') || ''}`
		}
	});

	const data = await response.json();
	if (data.error) throw new Error(data.error);
	if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);

	return true;
}

export async function GetEntitlementsCatalog(): Promise<Entitlement[]> {
	const API_URL = import.meta.env.VITE_API_URL;
	if (!API_URL) throw new Error('API_URL is not defined in environment variables.');
	const url = `${API_URL}/v1/entitlements/catalog`;
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('turteg-token') || ''}`
		}
	});

	const data = await response.json();
	if (data.error) throw new Error(data.error);
	if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);

	return data.catalog as Entitlement[];
}

export async function GetUserBadges(userId: string): Promise<FFZBadge[]> {
	const API_URL = import.meta.env.VITE_API_URL;
	if (!API_URL) throw new Error('API_URL is not defined in environment variables.');
	const url = `${API_URL}/v1/entitlements/${userId}/badges`;
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('turteg-token') || ''}`
		}
	});

	const data = await response.json();
	if (data.error) throw new Error(data.error);
	if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);

	return data.badges as FFZBadge[];
}

export async function EquipBadge(userId: string, badgeId: string | null): Promise<boolean> {
	const API_URL = import.meta.env.VITE_API_URL;
	if (!API_URL) throw new Error('API_URL is not defined in environment variables.');
	const url = `${API_URL}/v1/entitlements/${userId}/badges`;
	const response = await fetch(url, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('turteg-token') || ''}`
		},
		body: JSON.stringify({ badgeId })
	});

	const data = await response.json();
	if (data.error) throw new Error(data.error);
	if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);

	return true;
}