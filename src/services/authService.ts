import CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const SECURE_KEY = (import.meta as any).env?.VITE_AUTH_ENCRYPTION_KEY || 'atlas-secure-default-key-2024';
const TOKEN_KEY = 'atlas_auth_token';

export const authService = {
    /**
     * Encrypt and store token
     */
    setToken: (token: string) => {
        const encrypted = CryptoJS.AES.encrypt(token, SECURE_KEY).toString();
        Cookies.set(TOKEN_KEY, encrypted, {
            secure: true,
            sameSite: 'strict',
            expires: 7 // 7 days
        });
    },

    /**
     * Retrieve and decrypt token
     */
    getToken: (): string | null => {
        const encrypted = Cookies.get(TOKEN_KEY);
        if (!encrypted) return null;
        try {
            const bytes = CryptoJS.AES.decrypt(encrypted, SECURE_KEY);
            const decrypted = bytes.toString(CryptoJS.enc.Utf8);
            return decrypted || null;
        } catch (e) {
            console.error('Failed to decrypt token:', e);
            return null;
        }
    },

    /**
     * Remove token
     */
    removeToken: () => {
        Cookies.remove(TOKEN_KEY);
    },

    /**
     * Decodes the token to get payload
     */
    getDecodedToken: (token: string): any => {
        try {
            return jwtDecode(token);
        } catch (e) {
            return null;
        }
    },

    /**
     * Basic validation of current session
     */
    isAuthenticated: (): boolean => {
        const token = authService.getToken();
        if (!token) return false;

        const decoded: any = authService.getDecodedToken(token);
        if (!decoded || !decoded.exp) return false;

        // Check if expired
        const now = Math.floor(Date.now() / 1000);
        return decoded.exp > now;
    },

    /**
     * Mock login for demo purposes
     */
    login: async (credentials: { id: string, password?: string }) => {
        // In a real app, this would be an axios call
        // const response = await axios.post('/api/auth/login', credentials);
        // const { token, user } = response.data;

        // For now, we simulate a JWT set with a mock payload
        // Note: This is just for front-end demo persistence
        const mockPayload = {
            user: {
                id: credentials.id,
                firstName: 'Jean-Claude',
                lastName: 'Dupont',
                email: `${credentials.id}@atlas.com`,
                role: 'ADMIN',
                status: 'ACTIVE',
                phone: '+237000000000',
                createdAt: new Date().toISOString()
            },
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 24h
            iat: Math.floor(Date.now() / 1000)
        };

        // We can't sign JWT on front-end without exposing secret, but for mock:
        // Ensure the payload is base64url encoded for jwt-decode compatibility
        const base64Payload = btoa(JSON.stringify(mockPayload)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        const mockToken = `mock_header.${base64Payload}.mock_signature`;

        authService.setToken(mockToken);
        return { token: mockToken, user: { id: credentials.id, role: 'ADMIN' } };
    }
};
