import CryptoJS from 'crypto-js';

const STORAGE_KEY = (import.meta as any).env?.VITE_OFFLINE_STORAGE_KEY || 'atlas-offline-secure-key';

export const dataSecurity = {
    /**
     * Encrypt data before storing locally
     */
    encrypt: (data: any): string => {
        const stringData = typeof data === 'string' ? data : JSON.stringify(data);
        return CryptoJS.AES.encrypt(stringData, STORAGE_KEY).toString();
    },

    /**
     * Decrypt data after retrieving from local storage
     */
    decrypt: (encryptedData: string): any => {
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedData, STORAGE_KEY);
            const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

            try {
                return JSON.parse(decryptedString);
            } catch {
                return decryptedString;
            }
        } catch (e) {
            console.error('Data decryption failed', e);
            return null;
        }
    },

    /**
     * Securely store an item in local storage (encrypted)
     */
    setSecureItem: (key: string, value: any) => {
        const encrypted = dataSecurity.encrypt(value);
        localStorage.setItem(`secure_${key}`, encrypted);
    },

    /**
     * Retrieve an encrypted item from local storage
     */
    getSecureItem: (key: string): any => {
        const encrypted = localStorage.getItem(`secure_${key}`);
        if (!encrypted) return null;
        return dataSecurity.decrypt(encrypted);
    }
};
