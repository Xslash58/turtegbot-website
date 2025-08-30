export async function ExchangeCodeForToken(code: string, scope: string, save: boolean): Promise<string> {
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) throw new Error("API_URL is not defined in environment variables.");

    const url = `${API_URL}/v1/auth/twitch?code=${encodeURIComponent(code)}&scope=${encodeURIComponent(scope)}&save=${encodeURIComponent(save)}`;
    const response = await fetch(url);
    
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);
    if (!data.token) throw new Error("Token not found in response.");
    return data.token;
}

export async function ExchangeKickCodeForToken(code: string, codeVerifier?: string): Promise<string> {
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) throw new Error("API_URL is not defined in environment variables.");
    const url = `${API_URL}/v1/auth/kick?code=${encodeURIComponent(code)}${codeVerifier ? `&code_verifier=${encodeURIComponent(codeVerifier)}` : ''}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);
    if (!data.token) throw new Error("Token not found in response.");
    return data.token;
}

export async function ExchangeStreamElementsCode(code: string, state: string): Promise<boolean> {
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) throw new Error("API_URL is not defined in environment variables.");

    const url = `${API_URL}/v1/auth/streamelements?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`;
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('turteg-token') || ''}`
        }
    });
    
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);
    
    return data.success;
}

export async function ExchangeSpotifyCode(code: string): Promise<boolean> {
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) throw new Error("API_URL is not defined in environment variables.");

    const url = `${API_URL}/v1/auth/spotify?code=${encodeURIComponent(code)}`;
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('turteg-token') || ''}`
        }
    });
    
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);

    return data.success;
}

export async function LinkKickAccount(code: string, codeVerifier?: string): Promise<boolean> {
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) throw new Error("API_URL is not defined in environment variables.");
    const url = `${API_URL}/v1/auth/kick/link?code=${encodeURIComponent(code)}${codeVerifier ? `&code_verifier=${encodeURIComponent(codeVerifier)}` : ''}`;
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

export async function LinkTwitchAccount(code: string): Promise<boolean> {
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) throw new Error("API_URL is not defined in environment variables.");
    const url = `${API_URL}/v1/auth/twitch/link?code=${encodeURIComponent(code)}`;
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('turteg-token') || ''}`
        }
    });
    
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);

    return data.success;
}

export async function Logout(): Promise<boolean> {
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) throw new Error("API_URL is not defined in environment variables.");
    const url = `${API_URL}/v1/auth/logout`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('turteg-token') || ''}`
        }
    });
    
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);

    localStorage.removeItem('turteg-token');
    return data.success;
}

export async function generatePKCE(): Promise<{
  codeVerifier: string;
  codeChallenge: string;
}> {
  const encoder = new TextEncoder();

  // Generate a random 32-byte code verifier and convert it to a hex string
  const codeVerifier = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('');

  // Hash the code verifier using SHA-256
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);

  // Convert the hash to base64url
  const base64Digest = btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return {
    codeVerifier,
    codeChallenge: base64Digest,
  };
}
