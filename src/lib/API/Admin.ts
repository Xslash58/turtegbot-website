import type { TurtleCode, TurtleData } from "./Models/Turtles";
import type { Reminder, Ticket, User } from "./Models/Users";

export async function GetTickets(showAll: boolean = false): Promise<Ticket[]> {
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) throw new Error("API_URL is not defined in environment variables.");
    const url = `${API_URL}/v1/admin/tickets?showAll=${showAll}`;
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('turteg-token') || ''}`
        }
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error);
    if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);

    return data.tickets;
}

export async function PatchTicket(ticketId: number, approved: boolean = false, denied: boolean = false): Promise<boolean> {
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) throw new Error("API_URL is not defined in environment variables.");
    const url = `${API_URL}/v1/admin/tickets/${ticketId}`;
    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('turteg-token') || ''}`
        },
        body: JSON.stringify({
            approved: approved,
            denied: denied
        })
    });
    console.log(JSON.stringify({
            approved: approved,
            denied: denied
        }));
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);

    return data.success;
}

export async function DeleteTicket(ticketId: number): Promise<boolean> {
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) throw new Error("API_URL is not defined in environment variables.");
    const url = `${API_URL}/v1/admin/tickets/${ticketId}`;
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

export async function GetReminders(searchContent?: string | null, searchUserId?: number | null): Promise<Reminder[]> {
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) throw new Error("API_URL is not defined in environment variables.");

    const params = new URLSearchParams();
    if (searchContent) params.append('searchContent', searchContent);
    if (searchUserId) params.append('searchUserId', searchUserId.toString());

    const url = `${API_URL}/v1/admin/reminders${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('turteg-token') || ''}`
        }
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error);
    if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);

    return data.reminders;
}

export async function DeleteReminder(reminderId: number): Promise<boolean> {
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) throw new Error("API_URL is not defined in environment variables.");
    const url = `${API_URL}/v1/admin/reminders/${reminderId}`;
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

export async function PatchReminder(reminderId: number, isViewed: boolean): Promise<boolean> {
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) throw new Error("API_URL is not defined in environment variables.");
    const url = `${API_URL}/v1/admin/reminders/${reminderId}`;
    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('turteg-token') || ''}`
        },
        body: JSON.stringify({
            isViewed: isViewed
        })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error);
    if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);

    return data.success;
}

export async function GetTurtles(): Promise<TurtleData[]> {
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) throw new Error("API_URL is not defined in environment variables.");

    const url = `${API_URL}/v1/admin/turtles`;
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('turteg-token') || ''}`
        }
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error);
    if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);

    return data.turtles;
}

export async function GetCodes(): Promise<TurtleCode[]> {
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) throw new Error("API_URL is not defined in environment variables.");

    const url = `${API_URL}/v1/admin/codes`;
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('turteg-token') || ''}`
        }
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error);
    if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);

    return data.codes;
}

export async function PostCode(newCode: Partial<TurtleCode>): Promise<boolean> {
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) throw new Error("API_URL is not defined in environment variables.");

    const url = `${API_URL}/v1/admin/codes`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('turteg-token') || ''}`
        },
        body: JSON.stringify(newCode)
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error);
    if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);

    return data.success;
}

export async function DeleteCode(codeId: string): Promise<boolean> {
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) throw new Error("API_URL is not defined in environment variables.");

    const url = `${API_URL}/v1/admin/codes/${codeId}`;
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

export async function PatchUser(userId: string, userData: Partial<User>): Promise<boolean> {
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) throw new Error("API_URL is not defined in environment variables.");

    const url = `${API_URL}/v1/admin/users/${userId}`;
    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('turteg-token') || ''}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error);
    if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);

    return data.success;
}

export async function PostReload(module: string): Promise<boolean> {
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) throw new Error("API_URL is not defined in environment variables.");

    const url = `${API_URL}/v1/admin/reload?module=${module}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('turteg-token') || ''}`
        }
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error);
    if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);

    return data.success;
}

export async function PostScript(script: string): Promise<boolean> {
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) throw new Error("API_URL is not defined in environment variables.");

    const url = `${API_URL}/v1/admin/script/${script}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('turteg-token') || ''}`
        }
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error);
    if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);

    return data.success;
}