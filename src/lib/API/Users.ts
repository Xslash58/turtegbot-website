import type { Reminder, SearchUser, Ticket, User, UserConnections, UserPage } from "./Models/Users";

export async function GetMe(): Promise<User | null> {
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) throw new Error("API_URL is not defined in environment variables.");

    const response = await fetch(`${API_URL}/v1/users/me`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('turteg-token') || ''}`
        }
    });
    if (!response.ok) {
        localStorage.removeItem('turteg-token');
        console.log(`API request failed: ${response.statusText}`);
        return null;
    }
        

    return response.json();
}

export async function GetUserPage(id:string): Promise<UserPage | null> {
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) throw new Error("API_URL is not defined in environment variables.");

    const response = await fetch(`${API_URL}/v1/users/${id}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('turteg-token') || ''}`
        }
    });
    if (!response.ok) {
        console.log(`API request failed: ${response.statusText}`);
        return null;
    }

    return response.json();   
}

export async function GetUserConnections(id: string): Promise<UserConnections | null> {
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) throw new Error("API_URL is not defined in environment variables.");

    const response = await fetch(`${API_URL}/v1/users/${id}/connections`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('turteg-token') || ''}`
        }
    });
    if (!response.ok) {
        console.log(`API request failed: ${response.statusText}`);
        return null;
    }

    return response.json();
}

export async function DeleteUserConnection(id: string, connection: string): Promise<boolean> {
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) throw new Error("API_URL is not defined in environment variables.");

    const response = await fetch(`${API_URL}/v1/users/${id}/connections/${connection}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('turteg-token') || ''}`
        }
    });
    if (!response.ok) {
        console.log(`API request failed: ${response.statusText}`);
        return false;
    }

    return true;
}

export async function GetReminders(id: string): Promise<Reminder[]> {
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) throw new Error("API_URL is not defined in environment variables.");

    const response = await fetch(`${API_URL}/v1/users/${id}/reminders`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('turteg-token') || ''}`
        }
    });

    let json = await response.json();
    
    if (!response.ok) {
        console.log(`API request failed: ${response.statusText}`);
        if(json.error) throw new Error(json.error);
        return [];
    }

    return json.reminders;
}

export async function DeleteReminder(id: string, reminderId: number): Promise<boolean> {
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) throw new Error("API_URL is not defined in environment variables.");

    const response = await fetch(`${API_URL}/v1/users/${id}/reminders/${reminderId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('turteg-token') || ''}`
        }
    });
    if (!response.ok) {
        console.log(`API request failed: ${response.statusText}`);
        return false;
    }

    return true;
}

export async function GetTickets(id: string): Promise<Ticket[]> {
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) throw new Error("API_URL is not defined in environment variables.");

    const response = await fetch(`${API_URL}/v1/users/${id}/tickets`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('turteg-token') || ''}`
        }
    });

    let json = await response.json();
    
    if (!response.ok) {
        console.log(`API request failed: ${response.statusText}`);
        if(json.error) throw new Error(json.error);
        return [];
    }

    return json.tickets;
}

export async function DeleteTicket(id: string, ticketId: number): Promise<boolean> {
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) throw new Error("API_URL is not defined in environment variables.");

    const response = await fetch(`${API_URL}/v1/users/${id}/tickets/${ticketId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('turteg-token') || ''}`
        }
    });
    if (!response.ok) {
        console.log(`API request failed: ${response.statusText}`);
        return false;
    }

    return true;
}

export async function SearchUsers(username: string): Promise<SearchUser[]> {
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) throw new Error("API_URL is not defined in environment variables.");

    const response = await fetch(`${API_URL}/v1/users/search?username=${encodeURIComponent(username)}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('turteg-token') || ''}`
        }
    });
    if (!response.ok) {
        console.log(`API request failed: ${response.statusText}`);
        return [];
    }

    return (await response.json()).users;
}