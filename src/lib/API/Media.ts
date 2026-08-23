import type { MediaRequest, MediaSettings } from './Models/Media';

export async function GetMediaQueue(roomId: string): Promise<MediaRequest[] | null> {
	const API_URL = import.meta.env.VITE_API_URL;
	if (!API_URL) throw new Error('API_URL is not defined in environment variables.');

	const response = await fetch(`${API_URL}/v1/room/${roomId}/media/queue`, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('turteg-token') || ''}`
		}
	});
	if (!response.ok) {
		console.log(`API request failed: ${response.statusText}`);
		return null;
	}

	const data = await response.json();
	return data.requests;
}

export async function GetMediaHistory(roomId: string, page: number): Promise<MediaRequest[] | null> {
	const API_URL = import.meta.env.VITE_API_URL;
	if (!API_URL) throw new Error('API_URL is not defined in environment variables.');

	const response = await fetch(`${API_URL}/v1/room/${roomId}/media/history?page=${page}`, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('turteg-token') || ''}`
		}
	});
	if (!response.ok) {
		console.log(`API request failed: ${response.statusText}`);
		return null;
	}

	const data = await response.json();
	return data.requests;
}

export async function RequestHistoryMedia(roomId: string, mediaId: string): Promise<boolean> {
	const API_URL = import.meta.env.VITE_API_URL;
	if (!API_URL) throw new Error('API_URL is not defined in environment variables.');

	const formData = new FormData();
	formData.append('historyMediaId', mediaId);

	const response = await fetch(`${API_URL}/v1/room/${roomId}/media/request/history`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${localStorage.getItem('turteg-token') || ''}`
		},
		body: formData
	});
	if (!response.ok) {
		console.log(`API request failed: ${response.statusText}`);
		return false;
	}

	return true;
}

export async function SkipMedia(roomId: string, mediaId: string): Promise<boolean> {
	const API_URL = import.meta.env.VITE_API_URL;
	if (!API_URL) throw new Error('API_URL is not defined in environment variables.');

	const response = await fetch(`${API_URL}/v1/room/${roomId}/media/skip?mediaId=${mediaId}`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${localStorage.getItem('turteg-token') || ''}`
		},
	});
	if (!response.ok) {
		console.log(`API request failed: ${response.statusText}`);
		return false;
	}

	return true;
}

export async function PostMediaSettings(roomId: string, mediaSettings: MediaSettings): Promise<boolean> {
	const API_URL = import.meta.env.VITE_API_URL;
	if (!API_URL) throw new Error('API_URL is not defined in environment variables.');

	const response = await fetch(`${API_URL}/v1/room/${roomId}/media/settings`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('turteg-token') || ''}`
		},
		body: JSON.stringify(mediaSettings)
	});
	if (!response.ok) {
		console.log(`API request failed: ${response.statusText}`);
		return false;
	}

	return true;
}

export async function GetMediaSettings(roomId: string): Promise<MediaSettings | null> {
	const API_URL = import.meta.env.VITE_API_URL;
	if (!API_URL) throw new Error('API_URL is not defined in environment variables.');

	const response = await fetch(`${API_URL}/v1/room/${roomId}/media/settings`, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('turteg-token') || ''}`
		}
	});
	if (!response.ok) {
		console.log(`API request failed: ${response.statusText}`);
		return null;
	}

	const mediaSettings = await response.json();
	return mediaSettings.settings;
}
