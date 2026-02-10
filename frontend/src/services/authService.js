// Authentication Service
import api from './api';

export const authService = {
  /**
   * Login user
   */
  async login(email, password) {
    const response = await api.post('/api/auth/login', { email, password });
    const { access_token, refresh_token, user } = response.data;
    
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return user;
  },

  /**
   * Register new user
   */
  async register(email, password, name, role) {
    const response = await api.post('/api/auth/register', {
      email,
      password,
      name,
      role
    });
    const { access_token, refresh_token, user } = response.data;
    
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return user;
  },

  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  /**
   * Get current user from localStorage
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  },

  /**
   * Get current user info from backend
   */
  async getMe() {
    const response = await api.get('/api/auth/me');
    return response.data;
  }
};
