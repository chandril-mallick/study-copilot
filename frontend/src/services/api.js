// API Client Configuration
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          console.log("Attempting token refresh...");
          const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
            refresh_token: refreshToken
          });
          
          const { access_token, refresh_token: newRefreshToken } = response.data;
          console.log("Token refresh successful. New access token received.", access_token ? "Yes" : "No");
          
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', newRefreshToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          console.log("Retrying original request with new token");
          return api(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          // Refresh failed - logout
          localStorage.clear();
          window.location.href = '/';
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token - logout
        localStorage.clear();
        window.location.href = '/';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
