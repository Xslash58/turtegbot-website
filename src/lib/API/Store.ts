export async function PostRedeemCode(code: string): Promise<{ type: string, amount: number }> {
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) throw new Error("API_URL is not defined in environment variables.");
    const url = `${API_URL}/v1/store/redeem/${code}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('turteg-token') || ''}`
        }
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error);
    if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);

    return { type: data.type, amount: data.amount };
}