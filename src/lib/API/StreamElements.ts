import type { Loyalty } from "./Models/StreamElements";
import type { TurtleCode } from "./Models/Turtles";

export async function GetStreamElementsLoyalty(userId: string): Promise<Loyalty> {
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) throw new Error("API_URL is not defined in environment variables.");

    const response = await fetch(`${API_URL}/v1/users/${userId}/streamelements/loyalty`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('turteg-token') || ''}`
        }
    });

    let json = await response.json();

    if (!response.ok) {
        console.log(`API request failed: ${response.statusText}`);
        if (json.error) throw new Error(json.error);
        throw new Error("Failed to fetch StreamElements loyalty");
    }

    return json;
}

export async function GetStreamElementsCodes(userId: string): Promise<TurtleCode[]> {
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) throw new Error("API_URL is not defined in environment variables.");

    const response = await fetch(`${API_URL}/v1/users/${userId}/streamelements/codes`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('turteg-token') || ''}`
        }
    });
    if (!response.ok) {
        console.log(`API request failed: ${response.statusText}`);
        return [];
    }

    const responseData = await response.json();

    return responseData.codes;
}

export async function PostStreamElementsCode(userId: string, newCode: Partial<TurtleCode>): Promise<boolean> {
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) throw new Error("API_URL is not defined in environment variables.");

    const response = await fetch(`${API_URL}/v1/users/${userId}/streamelements/codes`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('turteg-token') || ''}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCode)
    });

    if (!response.ok) {
        console.log(`API request failed: ${response.statusText}`);
        let json = await response.json();
        if(json.error)
            throw new Error(json.error);
        return false;
    }

    return true;
}

export async function PutStreamElementsCode(userId: string, codeId: string, updatedData: Partial<TurtleCode>): Promise<boolean> {
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) throw new Error("API_URL is not defined in environment variables.");

    const response = await fetch(`${API_URL}/v1/users/${userId}/streamelements/codes/${codeId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('turteg-token') || ''}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
    });

    if (!response.ok) {
        console.log(`API request failed: ${response.statusText}`);
        return false;
    }

    return true;
}

export async function DeleteStreamElementsCode(userId: string, codeId: string): Promise<boolean> {
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) throw new Error("API_URL is not defined in environment variables.");

    const response = await fetch(`${API_URL}/v1/users/${userId}/streamelements/codes/${codeId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('turteg-token') || ''}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        console.log(`API request failed: ${response.statusText}`);
        return false;
    }

    return true;
}