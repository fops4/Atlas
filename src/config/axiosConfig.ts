import axios from 'axios';
import { authService } from '../services/authService';

const axiosInstance = axios.create({
    baseURL: (import.meta as any).env?.VITE_API_BASE_URL || '/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

/**
 * Request Interceptor
 */
axiosInstance.interceptors.request.use(
    (config) => {
        const token = authService.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Add security headers
        config.headers['X-Request-ID'] = crypto.randomUUID();
        config.headers['X-Timestamp'] = new Date().toISOString();

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response Interceptor
 */
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Detect 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt refresh
                // const { data } = await axios.post('/api/auth/refresh', {
                //   refreshToken: authService.getRefreshToken()
                // });
                // authService.setToken(data.token);
                // originalRequest.headers.Authorization = `Bearer ${data.token}`;
                // return axiosInstance(originalRequest);

                console.warn('Authentication expired, redirecting to login');
                authService.removeToken();
                window.location.href = '/login';
            } catch (refreshError) {
                authService.removeToken();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // Security Logging
        if (error.response?.status === 403) {
            console.error('Security Alert: Access Forbidden', {
                url: error.config.url,
                timestamp: new Date().toISOString()
            });
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
