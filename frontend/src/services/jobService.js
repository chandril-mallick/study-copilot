import axios from 'axios';

const API_URL = 'http://localhost:8000/api/student/jobs';

export const jobService = {
  // Get token from local storage
  getToken: () => localStorage.getItem('access_token'),

  // Get config with auth header
  getConfig: () => {
    const token = localStorage.getItem('access_token');
    return {
      headers: { Authorization: `Bearer ${token}` }
    };
  },

  // Fetch jobs with filters
  getJobs: async (filters = {}) => {
    try {
      const config = jobService.getConfig();
      const params = new URLSearchParams();
      
      if (filters.role) params.append('role', filters.role);
      if (filters.location) params.append('location', filters.location);
      if (filters.type) params.append('type', filters.type);
      
      const response = await axios.get(`${API_URL}/list?${params.toString()}`, config);
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || 'Failed to fetch jobs';
    }
  },

  // Trigger simulated scrape
  scrapeJobs: async (keywords) => {
    try {
      const config = jobService.getConfig();
      // Simulate scrape endpoint call
      const response = await axios.post(`${API_URL}/scrape?keywords=${encodeURIComponent(keywords)}`, {}, config);
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || 'Failed to scrape jobs';
    }
  }
};
